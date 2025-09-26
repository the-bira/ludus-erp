"use server";

import { db, generateId, getCurrentTimestamp } from "@/lib/firebase";
import { CreateReceitaData, Receita } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

// Interface para documentos do Firestore
interface FirestoreDoc {
  id: string;
  data(): Record<string, unknown>;
}

// Criar nova receita
export async function createReceitaAction(data: CreateReceitaData) {
  try {
    const id = generateId();
    const now = getCurrentTimestamp();

    const receita: Receita = {
      id,
      pessoaId: data.pessoaId,
      tipo: data.tipo,
      valor: data.valor,
      status: "pendente",
      dataVencimento: data.dataVencimento,
      dataPagamento: undefined,
      referencia: data.referencia,
      descricao: data.descricao,
      valorDesconto: data.valorDesconto || 0,
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
    };

    await db.collection("receitas").doc(id).set(receita);

    revalidatePath("/financeiro");
    revalidatePath("/dashboard");
    return { success: true, data: receita };
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    return { success: false, error: "Erro ao criar receita" };
  }
}

// Buscar todas as receitas
export async function getReceitasAction() {
  try {
    const snapshot = await db
      .collection("receitas")
      .orderBy("timestamps.createdAt", "desc")
      .get();
    const receitas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Receita)
    );
    return { success: true, data: receitas };
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return { success: false, error: "Erro ao buscar receitas" };
  }
}

// Buscar receitas por pessoa
export async function getReceitasByPessoaAction(pessoaId: string) {
  try {
    const snapshot = await db
      .collection("receitas")
      .where("pessoaId", "==", pessoaId)
      .orderBy("timestamps.createdAt", "desc")
      .get();

    const receitas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Receita)
    );
    return { success: true, data: receitas };
  } catch (error) {
    console.error("Erro ao buscar receitas por pessoa:", error);
    return { success: false, error: "Erro ao buscar receitas por pessoa" };
  }
}

// Buscar receitas por status
export async function getReceitasByStatusAction(status: "pago" | "pendente") {
  try {
    const snapshot = await db
      .collection("receitas")
      .where("status", "==", status)
      .orderBy("timestamps.createdAt", "desc")
      .get();

    const receitas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Receita)
    );
    return { success: true, data: receitas };
  } catch (error) {
    console.error("Erro ao buscar receitas por status:", error);
    return { success: false, error: "Erro ao buscar receitas por status" };
  }
}

// Marcar receita como paga
export async function marcarReceitaComoPagaAction(id: string) {
  try {
    const now = getCurrentTimestamp();

    await db.collection("receitas").doc(id).update({
      status: "pago",
      dataPagamento: now,
      "timestamps.updatedAt": now,
    });

    revalidatePath("/financeiro");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao marcar receita como paga:", error);
    return { success: false, error: "Erro ao marcar receita como paga" };
  }
}

// Buscar receitas por período
export async function getReceitasByPeriodoAction(
  dataInicio: string,
  dataFim: string
) {
  try {
    const snapshot = await db
      .collection("receitas")
      .where("dataVencimento", ">=", dataInicio)
      .where("dataVencimento", "<=", dataFim)
      .orderBy("dataVencimento", "desc")
      .get();

    const receitas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Receita)
    );
    return { success: true, data: receitas };
  } catch (error) {
    console.error("Erro ao buscar receitas por período:", error);
    return { success: false, error: "Erro ao buscar receitas por período" };
  }
}

// Buscar receitas do mês atual
export async function getReceitasMesAtualAction() {
  try {
    const now = new Date();
    const primeiroDia = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const ultimoDia = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    return await getReceitasByPeriodoAction(primeiroDia, ultimoDia);
  } catch (error) {
    console.error("Erro ao buscar receitas do mês atual:", error);
    return { success: false, error: "Erro ao buscar receitas do mês atual" };
  }
}

// Calcular total de receitas por status
export async function getTotalReceitasByStatusAction(
  status: "pago" | "pendente"
) {
  try {
    const result = await getReceitasByStatusAction(status);
    if (!result.success) return result;

    const total = (result.data || []).reduce(
      (sum: number, receita: Receita) => {
        const valorFinal = receita.valor - (receita.valorDesconto || 0);
        return sum + valorFinal;
      },
      0
    );

    return { success: true, data: total };
  } catch (error) {
    console.error("Erro ao calcular total de receitas:", error);
    return { success: false, error: "Erro ao calcular total de receitas" };
  }
}
