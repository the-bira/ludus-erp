"use server";

import {
  getReceitasMesAtualAction,
  getTotalReceitasByStatusAction,
} from "./receitas";
import { getCustosMesAtualAction } from "./custos";
import { getPessoasByStatusAction } from "./pessoas";
import { getReceitasByStatusAction } from "./receitas";
import { DashboardStats, Inadimplente, Pessoa, Custo } from "@/lib/schemas";

// Buscar estatísticas do dashboard
export async function getDashboardStatsAction() {
  try {
    // Receitas do mês atual
    const receitasMes = await getReceitasMesAtualAction();
    if (!receitasMes.success) throw new Error("Erro ao buscar receitas do mês");

    // Custos do mês atual
    const custosMes = await getCustosMesAtualAction();
    if (!custosMes.success) throw new Error("Erro ao buscar custos do mês");

    // Pessoas por status
    const [ativos, trancados] = await Promise.all([
      getPessoasByStatusAction("ativo"),
      getPessoasByStatusAction("trancado"),
    ]);

    // Receitas pagas e pendentes
    const [receitasPagas, receitasPendentes] = await Promise.all([
      getTotalReceitasByStatusAction("pago"),
      getTotalReceitasByStatusAction("pendente"),
    ]);

    // Calcular totais
    const entradasMes =
      receitasPagas.success && typeof receitasPagas.data === "number"
        ? receitasPagas.data
        : 0;
    const custosMesTotal =
      custosMes.success && custosMes.data
        ? custosMes.data.reduce(
            (sum: number, custo: Custo) => sum + custo.valor,
            0
          )
        : 0;
    const lucroLiquido = Number(entradasMes || 0) - custosMesTotal;

    // Novos alunos (criados no mês atual)
    const now = new Date();
    const primeiroDiaMes = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();
    const novosAlunos =
      ativos.success && ativos.data
        ? ativos.data.filter(
            (pessoa: Pessoa) => pessoa.timestamps.createdAt >= primeiroDiaMes
          ).length
        : 0;

    const stats: DashboardStats = {
      entradasMes,
      custosMes: custosMesTotal,
      lucroLiquido,
      novosAlunos,
      alunosTrancados:
        trancados.success && trancados.data ? trancados.data.length : 0,
      inadimplentes:
        receitasPendentes.success && Array.isArray(receitasPendentes.data)
          ? receitasPendentes.data.length
          : 0,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    return {
      success: false,
      error: "Erro ao buscar estatísticas do dashboard",
    };
  }
}

// Buscar lista de inadimplentes
export async function getInadimplentesAction() {
  try {
    const receitasPendentes = await getReceitasByStatusAction("pendente");
    if (!receitasPendentes.success) {
      return { success: false, error: "Erro ao buscar receitas pendentes" };
    }

    // Agrupar por pessoa e calcular valores
    const inadimplentesMap = new Map<string, Inadimplente>();

    for (const receita of receitasPendentes.data || []) {
      const pessoaId = receita.pessoaId;

      if (!inadimplentesMap.has(pessoaId)) {
        inadimplentesMap.set(pessoaId, {
          pessoaId,
          nome: "", // Será preenchido depois
          matricula: "",
          valorDevido: 0,
          diasAtraso: 0,
          ultimaMensalidade: receita.dataVencimento,
        });
      }

      const inadimplente = inadimplentesMap.get(pessoaId)!;
      inadimplente.valorDevido += receita.valor - (receita.valorDesconto || 0);

      // Calcular dias de atraso
      const dataVencimento = new Date(receita.dataVencimento);
      const hoje = new Date();
      const diasAtraso = Math.max(
        0,
        Math.floor(
          (hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      if (diasAtraso > inadimplente.diasAtraso) {
        inadimplente.diasAtraso = diasAtraso;
      }
    }

    // Buscar dados das pessoas
    const { getPessoaByIdAction } = await import("./pessoas");
    const inadimplentes: Inadimplente[] = [];

    for (const [pessoaId, inadimplente] of inadimplentesMap) {
      const pessoaResult = await getPessoaByIdAction(pessoaId);
      if (pessoaResult.success && pessoaResult.data) {
        inadimplente.nome = pessoaResult.data.nome;
        inadimplente.matricula = pessoaResult.data.matricula;
        inadimplentes.push(inadimplente);
      }
    }

    // Ordenar por valor devido (maior primeiro)
    inadimplentes.sort((a, b) => b.valorDevido - a.valorDevido);

    return { success: true, data: inadimplentes };
  } catch (error) {
    console.error("Erro ao buscar inadimplentes:", error);
    return { success: false, error: "Erro ao buscar inadimplentes" };
  }
}

// Buscar alunos que trancaram no mês
export async function getAlunosTrancadosMesAction() {
  try {
    const trancados = await getPessoasByStatusAction("trancado");
    if (!trancados.success) {
      return { success: false, error: "Erro ao buscar alunos trancados" };
    }

    // Filtrar apenas os que trancaram no mês atual
    const now = new Date();
    const primeiroDiaMes = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();

    const alunosTrancadosMes =
      trancados.data?.filter(
        (pessoa: Pessoa) => pessoa.timestamps.updatedAt >= primeiroDiaMes
      ) || [];

    return { success: true, data: alunosTrancadosMes };
  } catch (error) {
    console.error("Erro ao buscar alunos trancados do mês:", error);
    return { success: false, error: "Erro ao buscar alunos trancados do mês" };
  }
}

// Buscar novos alunos do mês
export async function getNovosAlunosMesAction() {
  try {
    const ativos = await getPessoasByStatusAction("ativo");
    if (!ativos.success) {
      return { success: false, error: "Erro ao buscar alunos ativos" };
    }

    // Filtrar apenas os que foram criados no mês atual
    const now = new Date();
    const primeiroDiaMes = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();

    const novosAlunos =
      ativos.data?.filter(
        (pessoa: Pessoa) => pessoa.timestamps.createdAt >= primeiroDiaMes
      ) || [];

    return { success: true, data: novosAlunos };
  } catch (error) {
    console.error("Erro ao buscar novos alunos do mês:", error);
    return { success: false, error: "Erro ao buscar novos alunos do mês" };
  }
}
