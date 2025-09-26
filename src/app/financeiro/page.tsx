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
import {
  Plus,
  Search,
  DollarSign,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Receipt,
} from "lucide-react";
import { Receita, Pessoa } from "@/lib/schemas";

export default function FinanceiroPage() {
  const [user, setUser] = useState<{
    nome: string;
    email: string;
    tipo: "admin" | "professor";
  } | null>(null);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();

  // Formulário de criação
  const [formData, setFormData] = useState({
    pessoaId: "",
    tipo: "mensalidade" as "matricula" | "mensalidade" | "uniforme" | "outro",
    valor: "",
    dataVencimento: "",
    referencia: "",
    descricao: "",
    valorDesconto: "",
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

      const mockReceitas: Receita[] = [
        {
          id: "1",
          pessoaId: "1",
          tipo: "mensalidade",
          valor: 200.0,
          status: "pago",
          dataVencimento: "2025-01-15",
          dataPagamento: "2025-01-10",
          referencia: "2025-01",
          descricao: "Mensalidade Janeiro/2025",
          valorDesconto: 0,
          timestamps: {
            createdAt: "2025-01-01T10:00:00Z",
            updatedAt: "2025-01-10T10:00:00Z",
          },
        },
        {
          id: "2",
          pessoaId: "2",
          tipo: "mensalidade",
          valor: 200.0,
          status: "pendente",
          dataVencimento: "2025-01-15",
          referencia: "2025-01",
          descricao: "Mensalidade Janeiro/2025",
          valorDesconto: 0,
          timestamps: {
            createdAt: "2025-01-01T10:00:00Z",
            updatedAt: "2025-01-01T10:00:00Z",
          },
        },
        {
          id: "3",
          pessoaId: "1",
          tipo: "matricula",
          valor: 150.0,
          status: "pago",
          dataVencimento: "2025-01-01",
          dataPagamento: "2025-01-01",
          referencia: "2025-01",
          descricao: "Taxa de Matrícula",
          valorDesconto: 0,
          timestamps: {
            createdAt: "2025-01-01T10:00:00Z",
            updatedAt: "2025-01-01T10:00:00Z",
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
      ];

      setReceitas(mockReceitas);
      setPessoas(mockPessoas);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReceita = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implementar chamada real para createReceitaAction
      const novaReceita: Receita = {
        id: Date.now().toString(),
        pessoaId: formData.pessoaId,
        tipo: formData.tipo,
        valor: parseFloat(formData.valor),
        status: "pendente",
        dataVencimento: formData.dataVencimento,
        referencia: formData.referencia,
        descricao: formData.descricao,
        valorDesconto: parseFloat(formData.valorDesconto) || 0,
        timestamps: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      setReceitas((prev) => [novaReceita, ...prev]);
      setIsCreateDialogOpen(false);
      setFormData({
        pessoaId: "",
        tipo: "mensalidade",
        valor: "",
        dataVencimento: "",
        referencia: "",
        descricao: "",
        valorDesconto: "",
      });
    } catch (error) {
      console.error("Erro ao criar receita:", error);
    }
  };

  const handleMarcarComoPago = async (receitaId: string) => {
    try {
      // TODO: Implementar chamada real para marcarReceitaComoPagaAction
      setReceitas((prev) =>
        prev.map((receita) =>
          receita.id === receitaId
            ? {
                ...receita,
                status: "pago" as const,
                dataPagamento: new Date().toISOString(),
                timestamps: {
                  ...receita.timestamps,
                  updatedAt: new Date().toISOString(),
                },
              }
            : receita
        )
      );
    } catch (error) {
      console.error("Erro ao marcar como pago:", error);
    }
  };

  const getPessoaById = (pessoaId: string) => {
    return pessoas.find((p) => p.id === pessoaId);
  };

  const filteredReceitas = receitas.filter((receita) => {
    const pessoa = getPessoaById(receita.pessoaId);
    const matchesSearch =
      pessoa?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receita.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || receita.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pago":
        return <Badge className="bg-ludus-success text-white">Pago</Badge>;
      case "pendente":
        return <Badge className="bg-ludus-danger text-white">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "matricula":
        return <Badge variant="outline">Matrícula</Badge>;
      case "mensalidade":
        return <Badge variant="outline">Mensalidade</Badge>;
      case "uniforme":
        return <Badge variant="outline">Uniforme</Badge>;
      case "outro":
        return <Badge variant="outline">Outro</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const totalPago = receitas
    .filter((r) => r.status === "pago")
    .reduce((sum, r) => sum + (r.valor - (r.valorDesconto || 0)), 0);

  const totalPendente = receitas
    .filter((r) => r.status === "pendente")
    .reduce((sum, r) => sum + (r.valor - (r.valorDesconto || 0)), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-ludus-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ludus-primary mx-auto"></div>
          <p className="mt-4 text-ludus-text">Carregando financeiro...</p>
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
            <h1 className="text-3xl font-bold text-ludus-text">Financeiro</h1>
            <p className="text-muted-foreground">
              Gerenciar receitas e pagamentos
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-ludus-primary hover:bg-ludus-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Receita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nova Receita</DialogTitle>
                <DialogDescription>
                  Cadastre uma nova receita no sistema.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateReceita} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pessoaId">Aluno *</Label>
                  <Select
                    value={formData.pessoaId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, pessoaId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {pessoas
                        .filter((p) => p.status === "ativo")
                        .map((pessoa) => (
                          <SelectItem key={pessoa.id} value={pessoa.id}>
                            {pessoa.nome} - {pessoa.matricula}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Receita *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        tipo: value as
                          | "matricula"
                          | "mensalidade"
                          | "uniforme"
                          | "outro",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matricula">Matrícula</SelectItem>
                      <SelectItem value="mensalidade">Mensalidade</SelectItem>
                      <SelectItem value="uniforme">Uniforme</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor">Valor *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        valor: e.target.value,
                      }))
                    }
                    placeholder="0,00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
                  <Input
                    id="dataVencimento"
                    type="date"
                    value={formData.dataVencimento}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dataVencimento: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referencia">Referência (Mês/Ano) *</Label>
                  <Input
                    id="referencia"
                    value={formData.referencia}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        referencia: e.target.value,
                      }))
                    }
                    placeholder="2025-01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                    placeholder="Ex: Mensalidade Janeiro/2025"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorDesconto">Desconto (opcional)</Label>
                  <Input
                    id="valorDesconto"
                    type="number"
                    step="0.01"
                    value={formData.valorDesconto}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        valorDesconto: e.target.value,
                      }))
                    }
                    placeholder="0,00"
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
                    Registrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
              <CheckCircle className="h-4 w-4 text-ludus-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ludus-success">
                R${" "}
                {totalPago.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pendente
              </CardTitle>
              <Clock className="h-4 w-4 text-ludus-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ludus-danger">
                R${" "}
                {totalPendente.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
              <DollarSign className="h-4 w-4 text-ludus-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ludus-primary">
                R${" "}
                {(totalPago + totalPendente).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por aluno ou descrição..."
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
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Receitas */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Receitas</CardTitle>
            <CardDescription>
              {filteredReceitas.length} receita(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceitas.map((receita) => {
                  const pessoa = getPessoaById(receita.pessoaId);
                  const valorFinal =
                    receita.valor - (receita.valorDesconto || 0);

                  return (
                    <TableRow key={receita.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-ludus-primary rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {pessoa?.nome || "Aluno não encontrado"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {pessoa?.matricula || "N/A"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTipoBadge(receita.tipo)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{receita.descricao}</div>
                          <div className="text-sm text-muted-foreground">
                            Ref: {receita.referencia}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            R${" "}
                            {valorFinal.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          {(receita.valorDesconto || 0) > 0 && (
                            <div className="text-sm text-muted-foreground">
                              Desconto: R${" "}
                              {(receita.valorDesconto || 0).toLocaleString(
                                "pt-BR",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(
                              receita.dataVencimento
                            ).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(receita.status)}</TableCell>
                      <TableCell className="text-right">
                        {receita.status === "pendente" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarcarComoPago(receita.id)}
                            className="text-ludus-success hover:text-ludus-success"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Marcar Pago
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredReceitas.length === 0 && (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma receita encontrada
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
