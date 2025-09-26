// Schemas para o Firestore - Sistema Ludus
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface Pessoa {
  id: string;
  nome: string;
  dataNascimento: string;
  identidade?: string;
  fotoUrl?: string;
  matricula: string; // 7 caracteres gerados automaticamente
  status: "ativo" | "trancado" | "inativo";
  timestamps: Timestamps;
}

export interface Turma {
  id: string;
  nome: string;
  diasSemana: string[]; // ['Segunda', 'Quarta', 'Sexta']
  pessoasIds: string[]; // Referências para pessoas
  timestamps: Timestamps;
}

export interface Receita {
  id: string;
  pessoaId: string; // Referência para pessoa
  tipo: "matricula" | "mensalidade" | "uniforme" | "outro";
  valor: number;
  status: "pago" | "pendente";
  dataVencimento: string;
  dataPagamento?: string; // null se não pago
  referencia: string; // mês de referência (ex: "2025-10")
  descricao: string;
  valorDesconto?: number; // desconto aplicado
  timestamps: Timestamps;
}

export interface Custo {
  id: string;
  tipo: "pagamento_professor" | "uniforme" | "geral" | "aluguel_quadra";
  descricao: string;
  valor: number;
  data: string;
  timestamps: Timestamps;
}

export interface Usuario {
  id: string; // UID do Firebase Auth
  nome: string;
  email: string;
  tipo: "admin" | "professor";
  timestamps: Timestamps;
}

export interface Presenca {
  id: string;
  turmaId: string;
  pessoaId: string;
  data: string;
  presente: boolean;
  observacoes?: string;
  timestamps: Timestamps;
}

// Tipos para formulários
export interface CreatePessoaData {
  nome: string;
  dataNascimento: string;
  identidade?: string;
  foto?: File;
}

export interface UpdatePessoaData extends Partial<CreatePessoaData> {
  status?: "ativo" | "trancado" | "inativo";
}

export interface CreateTurmaData {
  nome: string;
  diasSemana: string[];
  pessoasIds: string[];
}

export interface CreateReceitaData {
  pessoaId: string;
  tipo: "matricula" | "mensalidade" | "uniforme" | "outro";
  valor: number;
  dataVencimento: string;
  referencia: string;
  descricao: string;
  valorDesconto?: number;
}

export interface CreateCustoData {
  tipo: "pagamento_professor" | "uniforme" | "geral" | "aluguel_quadra";
  descricao: string;
  valor: number;
  data: string;
}

export interface CreatePresencaData {
  turmaId: string;
  pessoaId: string;
  data: string;
  presente: boolean;
  observacoes?: string;
}

// Tipos para dashboard
export interface DashboardStats {
  entradasMes: number;
  custosMes: number;
  lucroLiquido: number;
  novosAlunos: number;
  alunosTrancados: number;
  inadimplentes: number;
}

export interface Inadimplente {
  pessoaId: string;
  nome: string;
  matricula: string;
  valorDevido: number;
  diasAtraso: number;
  ultimaMensalidade: string;
}
