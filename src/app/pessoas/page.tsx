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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, User, Eye } from "lucide-react";
import { Pessoa } from "@/lib/schemas";

export default function PessoasPage() {
  const [user, setUser] = useState<{
    nome: string;
    email: string;
    tipo: "admin" | "professor";
  } | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();

  // Formulário de criação
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    identidade: "",
    foto: null as File | null,
  });

  useEffect(() => {
    // Verificar se usuário está logado
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    loadPessoas();
  }, [router]);

  const loadPessoas = async () => {
    try {
      // TODO: Implementar chamada real para getPessoasAction
      // Por enquanto, simular dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

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

      setPessoas(mockPessoas);
    } catch (error) {
      console.error("Erro ao carregar pessoas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implementar chamada real para createPessoaAction
      console.log("Criando pessoa:", formData);

      // Simular criação
      const novaPessoa: Pessoa = {
        id: Date.now().toString(),
        nome: formData.nome,
        dataNascimento: formData.dataNascimento,
        identidade: formData.identidade,
        fotoUrl: "",
        matricula:
          "NEW" + Math.random().toString(36).substring(2, 7).toUpperCase(),
        status: "ativo",
        timestamps: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      setPessoas((prev) => [novaPessoa, ...prev]);
      setIsCreateDialogOpen(false);
      setFormData({ nome: "", dataNascimento: "", identidade: "", foto: null });
    } catch (error) {
      console.error("Erro ao criar pessoa:", error);
    }
  };

  const handleStatusChange = async (
    pessoaId: string,
    novoStatus: "ativo" | "trancado" | "inativo"
  ) => {
    try {
      // TODO: Implementar chamada real para updatePessoaAction
      setPessoas((prev) =>
        prev.map((pessoa) =>
          pessoa.id === pessoaId
            ? {
                ...pessoa,
                status: novoStatus,
                timestamps: {
                  ...pessoa.timestamps,
                  updatedAt: new Date().toISOString(),
                },
              }
            : pessoa
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const filteredPessoas = pessoas.filter((pessoa) => {
    const matchesSearch =
      pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pessoa.matricula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || pessoa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-ludus-success text-white">Ativo</Badge>;
      case "trancado":
        return <Badge className="bg-ludus-danger text-white">Trancado</Badge>;
      case "inativo":
        return <Badge variant="secondary">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ludus-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ludus-primary mx-auto"></div>
          <p className="mt-4 text-ludus-text">Carregando pessoas...</p>
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
            <h1 className="text-3xl font-bold text-ludus-text">Pessoas</h1>
            <p className="text-muted-foreground">
              Gerenciar cadastro de alunos
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-ludus-primary hover:bg-ludus-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Pessoa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Pessoa</DialogTitle>
                <DialogDescription>
                  Preencha os dados da nova pessoa no sistema.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePessoa} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nome: e.target.value }))
                    }
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dataNascimento: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identidade">Identidade (RG)</Label>
                  <Input
                    id="identidade"
                    value={formData.identidade}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        identidade: e.target.value,
                      }))
                    }
                    placeholder="Digite o número da identidade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foto">Foto</Label>
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        foto: e.target.files?.[0] || null,
                      }))
                    }
                  />
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
                    Cadastrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome ou matrícula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="trancado">Trancado</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Pessoas */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pessoas</CardTitle>
            <CardDescription>
              {filteredPessoas.length} pessoa(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Data Nascimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPessoas.map((pessoa) => (
                  <TableRow key={pessoa.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-ludus-primary rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{pessoa.nome}</div>
                          {pessoa.identidade && (
                            <div className="text-sm text-muted-foreground">
                              RG: {pessoa.identidade}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {pessoa.matricula}
                      </code>
                    </TableCell>
                    <TableCell>
                      {new Date(pessoa.dataNascimento).toLocaleDateString(
                        "pt-BR"
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(pessoa.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Select
                          value={pessoa.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              pessoa.id,
                              value as "ativo" | "trancado" | "inativo"
                            )
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="trancado">Trancar</SelectItem>
                            <SelectItem value="inativo">Inativar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPessoas.length === 0 && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma pessoa encontrada
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
