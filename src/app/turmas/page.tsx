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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  GraduationCap,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { Turma, Pessoa } from "@/lib/schemas";

const DIAS_SEMANA = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

export default function TurmasPage() {
  const [user, setUser] = useState<{
    nome: string;
    email: string;
    tipo: "admin" | "professor";
  } | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const router = useRouter();

  // Formulário de criação/edição
  const [formData, setFormData] = useState({
    nome: "",
    diasSemana: [] as string[],
  });

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

      setTurmas(mockTurmas);
      setPessoas(mockPessoas);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implementar chamada real para createTurmaAction
      const novaTurma: Turma = {
        id: Date.now().toString(),
        nome: formData.nome,
        diasSemana: formData.diasSemana,
        pessoasIds: [],
        timestamps: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      setTurmas((prev) => [novaTurma, ...prev]);
      setIsCreateDialogOpen(false);
      setFormData({ nome: "", diasSemana: [] });
    } catch (error) {
      console.error("Erro ao criar turma:", error);
    }
  };

  const handleEditTurma = (turma: Turma) => {
    setSelectedTurma(turma);
    setFormData({
      nome: turma.nome,
      diasSemana: turma.diasSemana,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTurma) return;

    try {
      // TODO: Implementar chamada real para updateTurmaAction
      setTurmas((prev) =>
        prev.map((turma) =>
          turma.id === selectedTurma.id
            ? {
                ...turma,
                nome: formData.nome,
                diasSemana: formData.diasSemana,
                timestamps: {
                  ...turma.timestamps,
                  updatedAt: new Date().toISOString(),
                },
              }
            : turma
        )
      );

      setIsEditDialogOpen(false);
      setSelectedTurma(null);
      setFormData({ nome: "", diasSemana: [] });
    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
    }
  };

  const handleAddPessoaToTurma = async (turmaId: string, pessoaId: string) => {
    try {
      // TODO: Implementar chamada real para addPessoaToTurmaAction
      setTurmas((prev) =>
        prev.map((turma) =>
          turma.id === turmaId
            ? {
                ...turma,
                pessoasIds: [...turma.pessoasIds, pessoaId],
                timestamps: {
                  ...turma.timestamps,
                  updatedAt: new Date().toISOString(),
                },
              }
            : turma
        )
      );
    } catch (error) {
      console.error("Erro ao adicionar pessoa à turma:", error);
    }
  };

  const handleRemovePessoaFromTurma = async (
    turmaId: string,
    pessoaId: string
  ) => {
    try {
      // TODO: Implementar chamada real para removePessoaFromTurmaAction
      setTurmas((prev) =>
        prev.map((turma) =>
          turma.id === turmaId
            ? {
                ...turma,
                pessoasIds: turma.pessoasIds.filter((id) => id !== pessoaId),
                timestamps: {
                  ...turma.timestamps,
                  updatedAt: new Date().toISOString(),
                },
              }
            : turma
        )
      );
    } catch (error) {
      console.error("Erro ao remover pessoa da turma:", error);
    }
  };

  const getPessoasInTurma = (turma: Turma) => {
    return pessoas.filter((pessoa) => turma.pessoasIds.includes(pessoa.id));
  };

  const getPessoasNotInTurma = (turma: Turma) => {
    return pessoas.filter(
      (pessoa) =>
        !turma.pessoasIds.includes(pessoa.id) && pessoa.status === "ativo"
    );
  };

  const filteredTurmas = turmas.filter((turma) =>
    turma.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-ludus-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ludus-primary mx-auto"></div>
          <p className="mt-4 text-ludus-text">Carregando turmas...</p>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-ludus-text">Turmas</h1>
            <p className="text-muted-foreground">Gerenciar turmas e alunos</p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-ludus-primary hover:bg-ludus-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Turma</DialogTitle>
                <DialogDescription>
                  Preencha os dados da nova turma.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTurma} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Turma *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nome: e.target.value }))
                    }
                    placeholder="Ex: Turma Sub-13"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dias da Semana *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DIAS_SEMANA.map((dia) => (
                      <div key={dia} className="flex items-center space-x-2">
                        <Checkbox
                          id={dia}
                          checked={formData.diasSemana.includes(dia)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({
                                ...prev,
                                diasSemana: [...prev.diasSemana, dia],
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                diasSemana: prev.diasSemana.filter(
                                  (d) => d !== dia
                                ),
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={dia} className="text-sm">
                          {dia}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-ludus-primary hover:bg-ludus-primary/90"
                  >
                    Criar Turma
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome da turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Turmas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTurmas.map((turma) => {
            const pessoasInTurma = getPessoasInTurma(turma);
            const pessoasNotInTurma = getPessoasNotInTurma(turma);

            return (
              <Card key={turma.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5 text-ludus-primary" />
                        <span>{turma.nome}</span>
                      </CardTitle>
                      <CardDescription>
                        {turma.diasSemana.join(", ")}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTurma(turma)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Alunos na Turma */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">
                          Alunos na Turma ({pessoasInTurma.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {pessoasInTurma.map((pessoa) => (
                          <div
                            key={pessoa.id}
                            className="flex items-center justify-between p-2 bg-muted rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-sm">
                                {pessoa.nome}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Matrícula: {pessoa.matricula}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemovePessoaFromTurma(turma.id, pessoa.id)
                              }
                              className="text-destructive hover:text-destructive"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {pessoasInTurma.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            Nenhum aluno nesta turma
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Adicionar Alunos */}
                    {pessoasNotInTurma.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">
                          Adicionar Alunos
                        </h4>
                        <div className="space-y-2">
                          {pessoasNotInTurma.slice(0, 3).map((pessoa) => (
                            <div
                              key={pessoa.id}
                              className="flex items-center justify-between p-2 border rounded-lg"
                            >
                              <div>
                                <div className="font-medium text-sm">
                                  {pessoa.nome}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Matrícula: {pessoa.matricula}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleAddPessoaToTurma(turma.id, pessoa.id)
                                }
                                className="text-ludus-success hover:text-ludus-success"
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {pessoasNotInTurma.length > 3 && (
                            <p className="text-xs text-muted-foreground text-center">
                              +{pessoasNotInTurma.length - 3} outros alunos
                              disponíveis
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTurmas.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma turma encontrada</p>
            </CardContent>
          </Card>
        )}

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Turma</DialogTitle>
              <DialogDescription>Atualize os dados da turma.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateTurma} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome da Turma *</Label>
                <Input
                  id="edit-nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  placeholder="Ex: Turma Sub-13"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Dias da Semana *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DIAS_SEMANA.map((dia) => (
                    <div key={dia} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${dia}`}
                        checked={formData.diasSemana.includes(dia)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData((prev) => ({
                              ...prev,
                              diasSemana: [...prev.diasSemana, dia],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              diasSemana: prev.diasSemana.filter(
                                (d) => d !== dia
                              ),
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`edit-${dia}`} className="text-sm">
                        {dia}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-ludus-primary hover:bg-ludus-primary/90"
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
