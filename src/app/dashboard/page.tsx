"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  Users,
  UserPlus,
  UserMinus,
  AlertTriangle,
  Receipt,
  GraduationCap,
} from "lucide-react";
import { DashboardStats, Inadimplente } from "@/lib/schemas";

export default function DashboardPage() {
  const [user, setUser] = useState<{
    nome: string;
    email: string;
    tipo: "admin" | "professor";
  } | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inadimplentes, setInadimplentes] = useState<Inadimplente[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário está logado
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      // TODO: Implementar chamadas reais para as server actions
      // Por enquanto, simular dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        entradasMes: 12500.0,
        custosMes: 8500.0,
        lucroLiquido: 4000.0,
        novosAlunos: 8,
        alunosTrancados: 2,
        inadimplentes: 5,
      });

      setInadimplentes([
        {
          pessoaId: "1",
          nome: "João Silva",
          matricula: "A7B9C3D",
          valorDevido: 200.0,
          diasAtraso: 15,
          ultimaMensalidade: "2025-01-15",
        },
        {
          pessoaId: "2",
          nome: "Maria Santos",
          matricula: "B8C4D2E",
          valorDevido: 150.0,
          diasAtraso: 8,
          ultimaMensalidade: "2025-01-22",
        },
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ludus-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ludus-primary mx-auto"></div>
          <p className="mt-4 text-ludus-text">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold text-ludus-text">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema Ludus</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Entradas do Mês */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Entradas do Mês
              </CardTitle>
              <DollarSign className="h-4 w-4 text-ludus-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ludus-success">
                R${" "}
                {stats?.entradasMes.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Receitas pagas este mês
              </p>
            </CardContent>
          </Card>

          {/* Custos do Mês */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Custos do Mês
              </CardTitle>
              <Receipt className="h-4 w-4 text-ludus-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ludus-danger">
                R${" "}
                {stats?.custosMes.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Despesas este mês</p>
            </CardContent>
          </Card>

          {/* Lucro Líquido */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lucro Líquido
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-ludus-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ludus-primary">
                R${" "}
                {stats?.lucroLiquido.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Resultado do mês</p>
            </CardContent>
          </Card>

          {/* Novos Alunos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Novos Alunos
              </CardTitle>
              <UserPlus className="h-4 w-4 text-ludus-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ludus-accent">
                {stats?.novosAlunos}
              </div>
              <p className="text-xs text-muted-foreground">
                Matriculados este mês
              </p>
            </CardContent>
          </Card>

          {/* Alunos Trancados */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alunos Trancados
              </CardTitle>
              <UserMinus className="h-4 w-4 text-ludus-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ludus-danger">
                {stats?.alunosTrancados}
              </div>
              <p className="text-xs text-muted-foreground">
                Trancaram este mês
              </p>
            </CardContent>
          </Card>

          {/* Inadimplentes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inadimplentes
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-ludus-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ludus-danger">
                {stats?.inadimplentes}
              </div>
              <p className="text-xs text-muted-foreground">
                Com pagamentos em atraso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Listas Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inadimplentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-ludus-danger" />
                <span>Inadimplentes</span>
              </CardTitle>
              <CardDescription>Alunos com pagamentos em atraso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inadimplentes.map((inadimplente) => (
                  <div
                    key={inadimplente.pessoaId}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-ludus-text">
                        {inadimplente.nome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Matrícula: {inadimplente.matricula}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {inadimplente.diasAtraso} dias de atraso
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-ludus-danger">
                        R${" "}
                        {inadimplente.valorDevido.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <Badge variant="destructive" className="text-xs">
                        {inadimplente.diasAtraso} dias
                      </Badge>
                    </div>
                  </div>
                ))}
                {inadimplentes.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum inadimplente encontrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesso rápido às principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  asChild
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <a href="/pessoas">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Cadastrar Pessoa</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <a href="/turmas">
                    <GraduationCap className="h-6 w-6" />
                    <span className="text-sm">Nova Turma</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <a href="/financeiro">
                    <DollarSign className="h-6 w-6" />
                    <span className="text-sm">Nova Receita</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <a href="/custos">
                    <Receipt className="h-6 w-6" />
                    <span className="text-sm">Novo Custo</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
