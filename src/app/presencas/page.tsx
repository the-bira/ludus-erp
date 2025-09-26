"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, CheckCircle, XCircle, Clock, User, Save } from "lucide-react";
import { Turma, Pessoa, Presenca } from "@/lib/schemas";

export default function PresencasPage() {
  const [user, setUser] = useState<{
    nome: string;
    email: string;
    tipo: "admin" | "professor";
  } | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTurma, setSelectedTurma] = useState<string>("");
  const [selectedData, setSelectedData] = useState<string>("");
  const [observacoes, setObservacoes] = useState<Record<string, string>>({});
  const [presencaStatus, setPresencaStatus] = useState<Record<string, boolean>>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    // Verificar se usuário está logado
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      // TODO: Implementar chamadas reais para as server actions
      // Por enquanto, simular dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTurmas: Turma[] = [
        {
          id: "1",
          nome: "Turma Sub-13",
          diasSemana: ["Segunda-feira", "Quarta-feira"],
          pessoasIds: ["1", "3"],
          timestamps: {
            createdAt: "2025-01-01T10:00:00Z",
            updatedAt: "2025-01-01T10:00:00Z",
          },
        },
        {
          id: "2",
          nome: "Turma Sub-15",
          diasSemana: ["Terça-feira", "Quinta-feira"],
          pessoasIds: ["2"],
          timestamps: {
            createdAt: "2025-01-02T10:00:00Z",
            updatedAt: "2025-01-02T10:00:00Z",
          },
        },
      ];

      const mockPessoas: Pessoa[] = [
        {
          id: "1",
          nome: "João Silva",
          dataNascimento: "2010-05-14",
          identidade: "123456789",
          fotoUrl: "",
          matricula: "A7B9C3D",
          status: "ativo",
          timestamps: {
            createdAt: "2025-01-01T10:00:00Z",
            updatedAt: "2025-01-01T10:00:00Z",
          },
        },
        {
          id: "2",
          nome: "Maria Santos",
          dataNascimento: "2009-08-22",
          identidade: "987654321",
          fotoUrl: "",
          matricula: "B8C4D2E",
          status: "trancado",
          timestamps: {
            createdAt: "2025-01-02T10:00:00Z",
            updatedAt: "2025-01-15T10:00:00Z",
          },
        },
        {
          id: "3",
          nome: "Pedro Costa",
          dataNascimento: "2011-03-10",
          identidade: "456789123",
          fotoUrl: "",
          matricula: "C9D5E3F",
          status: "ativo",
          timestamps: {
            createdAt: "2025-01-03T10:00:00Z",
            updatedAt: "2025-01-03T10:00:00Z",
          },
        },
      ];

      const mockPresencas: Presenca[] = [
        {
          id: "1",
          turmaId: "1",
          pessoaId: "1",
          data: "2025-01-20",
          presente: true,
          observacoes: "Bom desempenho",
          timestamps: {
            createdAt: "2025-01-20T10:00:00Z",
            updatedAt: "2025-01-20T10:00:00Z",
          },
        },
      ];

      setTurmas(mockTurmas);
      setPessoas(mockPessoas);
      setPresencas(mockPresencas);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTurmaChange = (turmaId: string) => {
    setSelectedTurma(turmaId);
    setPresencaStatus({});
    setObservacoes({});
  };

  const handleDataChange = (data: string) => {
    setSelectedData(data);
    loadPresencasForDate(data);
  };

  const loadPresencasForDate = async (data: string) => {
    if (!selectedTurma || !data) return;

    try {
      // TODO: Implementar chamada real para getPresencasByTurmaAndDataAction
      const presencasExistentes = presencas.filter(
        (p) => p.turmaId === selectedTurma && p.data === data
      );

      // Inicializar status de presença baseado nos dados existentes
      const statusInicial: Record<string, boolean> = {};
      const observacoesInicial: Record<string, string> = {};

      presencasExistentes.forEach((presenca) => {
        statusInicial[presenca.pessoaId] = presenca.presente;
        if (presenca.observacoes) {
          observacoesInicial[presenca.pessoaId] = presenca.observacoes;
        }
      });

      setPresencaStatus(statusInicial);
      setObservacoes(observacoesInicial);
    } catch (error) {
      console.error("Erro ao carregar presenças:", error);
    }
  };

  const handlePresencaChange = (pessoaId: string, presente: boolean) => {
    setPresencaStatus((prev) => ({
      ...prev,
      [pessoaId]: presente,
    }));
  };

  const handleObservacaoChange = (pessoaId: string, observacao: string) => {
    setObservacoes((prev) => ({
      ...prev,
      [pessoaId]: observacao,
    }));
  };

  const handleSavePresencas = async () => {
    if (!selectedTurma || !selectedData) return;

    try {
      // TODO: Implementar chamada real para registrarPresencaAction
      const turma = turmas.find((t) => t.id === selectedTurma);
      if (!turma) return;

      const alunosTurma = pessoas.filter((p) =>
        turma.pessoasIds.includes(p.id)
      );

      for (const aluno of alunosTurma) {
        const presente = presencaStatus[aluno.id] || false;
        const observacao = observacoes[aluno.id] || "";

        // Verificar se já existe presença registrada
        const presencaExistente = presencas.find(
          (p) =>
            p.turmaId === selectedTurma &&
            p.pessoaId === aluno.id &&
            p.data === selectedData
        );

        if (presencaExistente) {
          // Atualizar presença existente
          setPresencas((prev) =>
            prev.map((p) =>
              p.id === presencaExistente.id
                ? {
                    ...p,
                    presente,
                    observacoes: observacao,
                    timestamps: {
                      ...p.timestamps,
                      updatedAt: new Date().toISOString(),
                    },
                  }
                : p
            )
          );
        } else {
          // Criar nova presença
          const novaPresenca: Presenca = {
            id: Date.now().toString() + Math.random().toString(36).substring(2),
            turmaId: selectedTurma,
            pessoaId: aluno.id,
            data: selectedData,
            presente,
            observacoes: observacao,
            timestamps: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          };

          setPresencas((prev) => [...prev, novaPresenca]);
        }
      }

      alert("Presenças salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar presenças:", error);
      alert("Erro ao salvar presenças");
    }
  };

  const getAlunosTurma = () => {
    if (!selectedTurma) return [];
    const turma = turmas.find((t) => t.id === selectedTurma);
    if (!turma) return [];
    return pessoas.filter((p) => turma.pessoasIds.includes(p.id));
  };

  const getPresencaStats = () => {
    const alunos = getAlunosTurma();
    const total = alunos.length;
    const presentes = alunos.filter((aluno) => presencaStatus[aluno.id]).length;
    const ausentes = total - presentes;

    return { total, presentes, ausentes };
  };

  const stats = getPresencaStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-ludus-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ludus-primary mx-auto"></div>
          <p className="mt-4 text-ludus-text">Carregando presenças...</p>
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
          <h1 className="text-3xl font-bold text-ludus-text">Presenças</h1>
          <p className="text-muted-foreground">
            Registrar presenças dos alunos
          </p>
        </div>

        {/* Seleção de Turma e Data */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Turma e Data</CardTitle>
            <CardDescription>
              Escolha a turma e a data para registrar as presenças
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="turma">Turma</Label>
                <Select value={selectedTurma} onValueChange={handleTurmaChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {turmas.map((turma) => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.nome} - {turma.diasSemana.join(", ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={selectedData}
                  onChange={(e) => handleDataChange(e.target.value)}
                  disabled={!selectedTurma}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        {selectedTurma && selectedData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Alunos
                </CardTitle>
                <Users className="h-4 w-4 text-ludus-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ludus-primary">
                  {stats.total}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Presentes</CardTitle>
                <CheckCircle className="h-4 w-4 text-ludus-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ludus-success">
                  {stats.presentes}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ausentes</CardTitle>
                <XCircle className="h-4 w-4 text-ludus-danger" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ludus-danger">
                  {stats.ausentes}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Alunos */}
        {selectedTurma && selectedData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Lista de Presenças</CardTitle>
                  <CardDescription>
                    Marque as presenças e adicione observações
                  </CardDescription>
                </div>
                <Button
                  onClick={handleSavePresencas}
                  className="bg-ludus-primary hover:bg-ludus-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Presenças
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getAlunosTurma().map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="w-10 h-10 bg-ludus-primary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="font-medium">{aluno.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        Matrícula: {aluno.matricula}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`presente-${aluno.id}`}
                        checked={presencaStatus[aluno.id] || false}
                        onCheckedChange={(checked) =>
                          handlePresencaChange(aluno.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`presente-${aluno.id}`}
                        className="text-sm"
                      >
                        Presente
                      </Label>
                    </div>

                    <div className="flex-1">
                      <Textarea
                        placeholder="Observações (opcional)"
                        value={observacoes[aluno.id] || ""}
                        onChange={(e) =>
                          handleObservacaoChange(aluno.id, e.target.value)
                        }
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                ))}

                {getAlunosTurma().length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Nenhum aluno encontrado nesta turma
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico de Presenças */}
        {selectedTurma && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Presenças</CardTitle>
              <CardDescription>
                Últimas presenças registradas para esta turma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {presencas
                  .filter((p) => p.turmaId === selectedTurma)
                  .sort(
                    (a, b) =>
                      new Date(b.data).getTime() - new Date(a.data).getTime()
                  )
                  .slice(0, 10)
                  .map((presenca) => {
                    const aluno = pessoas.find(
                      (p) => p.id === presenca.pessoaId
                    );
                    return (
                      <div
                        key={presenca.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-ludus-primary rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {aluno?.nome || "Aluno não encontrado"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(presenca.data).toLocaleDateString(
                                "pt-BR"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {presenca.presente ? (
                            <Badge className="bg-ludus-success text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Presente
                            </Badge>
                          ) : (
                            <Badge className="bg-ludus-danger text-white">
                              <XCircle className="h-3 w-3 mr-1" />
                              Ausente
                            </Badge>
                          )}
                          {presenca.observacoes && (
                            <div className="text-sm text-muted-foreground max-w-xs truncate">
                              {presenca.observacoes}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {presencas.filter((p) => p.turmaId === selectedTurma).length ===
                  0 && (
                  <div className="text-center py-4">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Nenhuma presença registrada
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
