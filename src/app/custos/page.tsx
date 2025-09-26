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
  Edit,
  Trash2,
  Receipt,
  DollarSign,
  Calendar,
  TrendingDown,
} from "lucide-react";
import { Custo } from "@/lib/schemas";
import { getCustosAction, createCustoAction, updateCustoAction, deleteCustoAction } from "@/lib/actions/custos";

export default function CustosPage() {
  const [user, setUser] = useState<{
    nome: string;
    email: string;
    tipo: "admin" | "professor";
  } | null>(null);
  const [custos, setCustos] = useState<Custo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCusto, setSelectedCusto] = useState<Custo | null>(null);
  const router = useRouter();

  // Formulário de criação/edição
  const [formData, setFormData] = useState({
    tipo: "geral" as
      | "pagamento_professor"
      | "uniforme"
      | "geral"
      | "aluguel_quadra",
    descricao: "",
    valor: "",
    data: "",
  });

  useEffect(() => {
    // Verificar se usuário está logado
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    loadCustos();
  }, [router]);

  const loadCustos = async () => {
    try {
      const result = await getCustosAction();
      if (result.success) {
        setCustos(result.data);
      } else {
        console.error("Erro ao carregar custos:", result.error);
        // Fallback para dados mock em caso de erro
        setCustos([]);
      }
    } catch (error) {
      console.error("Erro ao carregar custos:", error);
      setCustos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCusto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implementar chamada real para createCustoAction
      const novoCusto: Custo = {
        id: Date.now().toString(),
        tipo: formData.tipo,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        data: formData.data,
        timestamps: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      setCustos((prev) => [novoCusto, ...prev]);
      setIsCreateDialogOpen(false);
      setFormData({
        tipo: "geral",
        descricao: "",
        valor: "",
        data: "",
      });
    } catch (error) {
      console.error("Erro ao criar custo:", error);
    }
  };

  const handleEditCusto = (custo: Custo) => {
    setSelectedCusto(custo);
    setFormData({
      tipo: custo.tipo,
      descricao: custo.descricao,
      valor: custo.valor.toString(),
      data: custo.data,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCusto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCusto) return;

    try {
      // TODO: Implementar chamada real para updateCustoAction
      setCustos((prev) =>
        prev.map((custo) =>
          custo.id === selectedCusto.id
            ? {
                ...custo,
                tipo: formData.tipo,
                descricao: formData.descricao,
                valor: parseFloat(formData.valor),
                data: formData.data,
                timestamps: {
                  ...custo.timestamps,
                  updatedAt: new Date().toISOString(),
                },
              }
            : custo
        )
      );

      setIsEditDialogOpen(false);
      setSelectedCusto(null);
      setFormData({
        tipo: "geral",
        descricao: "",
        valor: "",
        data: "",
      });
    } catch (error) {
      console.error("Erro ao atualizar custo:", error);
    }
  };

  const handleDeleteCusto = async (custoId: string) => {
    try {
      // TODO: Implementar chamada real para deleteCustoAction
      setCustos((prev) => prev.filter((custo) => custo.id !== custoId));
    } catch (error) {
      console.error("Erro ao deletar custo:", error);
    }
  };

  const filteredCustos = custos.filter((custo) => {
    const matchesSearch = custo.descricao
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "todos" || custo.tipo === tipoFilter;
    return matchesSearch && matchesTipo;
  });

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "pagamento_professor":
        return <Badge className="bg-ludus-primary text-white">Professor</Badge>;
      case "aluguel_quadra":
        return <Badge className="bg-ludus-secondary text-white">Aluguel</Badge>;
      case "uniforme":
        return <Badge className="bg-ludus-accent text-white">Uniforme</Badge>;
      case "geral":
        return <Badge variant="outline">Geral</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const totalCustos = custos.reduce((sum, custo) => sum + custo.valor, 0);

  const custosPorTipo = custos.reduce((acc, custo) => {
    acc[custo.tipo] = (acc[custo.tipo] || 0) + custo.valor;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen bg-ludus-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ludus-primary mx-auto"></div>
          <p className="mt-4 text-ludus-text">Carregando custos...</p>
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
            <h1 className="text-3xl font-bold text-ludus-text">Custos</h1>
            <p className="text-muted-foreground">
              Gerenciar despesas da escola
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-ludus-primary hover:bg-ludus-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Custo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Novo Custo</DialogTitle>
                <DialogDescription>
                  Cadastre uma nova despesa no sistema.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCusto} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Custo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        tipo: value as
                          | "pagamento_professor"
                          | "uniforme"
                          | "geral"
                          | "aluguel_quadra",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagamento_professor">
                        Pagamento Professor
                      </SelectItem>
                      <SelectItem value="aluguel_quadra">
                        Aluguel Quadra
                      </SelectItem>
                      <SelectItem value="uniforme">Uniforme</SelectItem>
                      <SelectItem value="geral">Geral</SelectItem>
                    </SelectContent>
                  </Select>
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
                    placeholder="Ex: Pagamento professor Ana - Janeiro"
                    required
                  />
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
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, data: e.target.value }))
                    }
                    required
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

        {/* Resumo de Custos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
              <TrendingDown className="h-4 w-4 text-ludus-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ludus-danger">
                R${" "}
                {totalCustos.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </CardContent>
          </Card>

          {Object.entries(custosPorTipo).map(([tipo, valor]) => (
            <Card key={tipo}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {tipo === "pagamento_professor"
                    ? "Professores"
                    : tipo === "aluguel_quadra"
                    ? "Aluguel"
                    : tipo === "uniforme"
                    ? "Uniformes"
                    : "Geral"}
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R${" "}
                  {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pagamento_professor">Professor</SelectItem>
                  <SelectItem value="aluguel_quadra">Aluguel</SelectItem>
                  <SelectItem value="uniforme">Uniforme</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Custos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Custos</CardTitle>
            <CardDescription>
              {filteredCustos.length} custo(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustos.map((custo) => (
                  <TableRow key={custo.id}>
                    <TableCell>{getTipoBadge(custo.tipo)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{custo.descricao}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-ludus-danger">
                        R${" "}
                        {custo.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(custo.data).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCusto(custo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCusto(custo.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredCustos.length === 0 && (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum custo encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Custo</DialogTitle>
              <DialogDescription>Atualize os dados do custo.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateCusto} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tipo">Tipo de Custo *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      tipo: value as
                        | "pagamento_professor"
                        | "uniforme"
                        | "geral"
                        | "aluguel_quadra",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pagamento_professor">
                      Pagamento Professor
                    </SelectItem>
                    <SelectItem value="aluguel_quadra">
                      Aluguel Quadra
                    </SelectItem>
                    <SelectItem value="uniforme">Uniforme</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-descricao">Descrição *</Label>
                <Input
                  id="edit-descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }
                  placeholder="Ex: Pagamento professor Ana - Janeiro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-valor">Valor *</Label>
                <Input
                  id="edit-valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, valor: e.target.value }))
                  }
                  placeholder="0,00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-data">Data *</Label>
                <Input
                  id="edit-data"
                  type="date"
                  value={formData.data}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, data: e.target.value }))
                  }
                  required
                />
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
