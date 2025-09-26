# 🏆 Ludus - Sistema de Gestão Escolar

Sistema mini-ERP para escola de futsal Ludus, desenvolvido com **Next.js 15**, **Firebase** e **shadcn/ui**.

## 🎯 Visão Geral

O Ludus é um sistema completo de gestão escolar focado em escolas de futsal, oferecendo:

- **Gestão de Alunos**: Cadastro completo com fotos e matrículas automáticas
- **Organização de Turmas**: Controle de turmas por dias da semana
- **Sistema Financeiro**: Controle de receitas (mensalidades, matrículas) e custos
- **Presenças**: Sistema de chamada para professores
- **Dashboard**: Visão geral com métricas e relatórios

## 🚀 Tecnologias

- **Frontend**: Next.js 15 com App Router
- **Backend**: Server Actions (sem API routes)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage
- **UI**: shadcn/ui + Tailwind CSS
- **Deploy**: Firebase Hosting

## 🎨 Paleta de Cores

Sistema baseado na identidade visual da Ludus:

- **Primária**: `#C62828` (Vermelho clássico)
- **Secundária**: `#1B2A49` (Azul escuro)
- **Destaque**: `#3B82F6` (Azul claro)
- **Atenção**: `#E11D48` (Inadimplência)
- **Sucesso**: `#10B981` (Pagamentos)

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação
│   ├── dashboard/          # Dashboard principal
│   ├── pessoas/            # Cadastro de alunos
│   ├── turmas/             # Gestão de turmas
│   ├── financeiro/         # Sistema financeiro
│   ├── custos/             # Controle de custos
│   ├── presencas/          # Chamada de presença
│   └── login/              # Autenticação
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Componentes shadcn/ui
│   ├── header.tsx          # Cabeçalho com logo
│   ├── sidebar.tsx         # Menu lateral
│   └── layout.tsx          # Layout principal
├── lib/                    # Utilitários e configurações
│   ├── schemas.ts          # Tipos TypeScript
│   ├── firebase.ts         # Configuração Firebase
│   └── actions/            # Server Actions
│       ├── pessoas.ts      # CRUD de pessoas
│       ├── turmas.ts       # CRUD de turmas
│       ├── receitas.ts     # CRUD de receitas
│       ├── custos.ts       # CRUD de custos
│       ├── presencas.ts    # CRUD de presenças
│       └── dashboard.ts    # Métricas e relatórios
└── hooks/                  # Hooks customizados
```

## 🗄️ Estrutura do Banco (Firestore)

### Coleções

1. **`pessoas`** - Cadastro de alunos
   - `nome`, `dataNascimento`, `identidade`, `fotoUrl`
   - `matricula` (7 caracteres gerados)
   - `status` (ativo/trancado/inativo)

2. **`turmas`** - Organização por turma
   - `nome`, `diasSemana[]`, `pessoasIds[]`

3. **`receitas`** - Controle financeiro
   - `pessoaId`, `tipo`, `valor`, `status`
   - `dataVencimento`, `dataPagamento`, `referencia`

4. **`custos`** - Despesas da escola
   - `tipo`, `descricao`, `valor`, `data`

5. **`usuarios`** - Controle de acesso
   - `nome`, `email`, `tipo` (admin/professor)

6. **`presencas`** - Chamada de presença
   - `turmaId`, `pessoaId`, `data`, `presente`, `observacoes`

## 🔧 Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Firestore, Authentication e Storage
3. Gere uma chave de serviço (Service Account)
4. Copie `env.example` para `.env.local` e configure:

```env
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=seu-client-email
FIREBASE_PRIVATE_KEY=sua-private-key
FIREBASE_STORAGE_BUCKET=seu-storage-bucket
```

### 3. Executar o Projeto

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 👥 Funcionalidades

### 🔐 Autenticação
- Login com email/senha
- Controle de acesso (Admin/Professor)
- Redirecionamento automático

### 👨‍🎓 Gestão de Alunos
- Cadastro completo com foto
- Matrícula automática (7 caracteres)
- Controle de status (ativo/trancado/inativo)
- Busca e filtros

### 🏫 Organização de Turmas
- Criação de turmas por dias da semana
- Adição/remoção de alunos
- Visualização de turmas

### 💰 Sistema Financeiro
- **Receitas**: Mensalidades, matrículas, uniformes
- **Custos**: Professores, aluguel, materiais
- **Controle**: Pagamentos, inadimplência
- **Relatórios**: Entradas, saídas, lucro

### 📋 Presenças
- Chamada por turma e data
- Observações por aluno
- Histórico de presenças
- Estatísticas de frequência

### 📊 Dashboard
- Métricas em tempo real
- Lista de inadimplentes
- Novos alunos do mês
- Resumo financeiro

## 🎯 Próximos Passos

### Implementações Pendentes

1. **Firebase Auth Real**
   - Substituir autenticação simulada
   - Implementar login/logout real

2. **Upload de Fotos**
   - Integração com Firebase Storage
   - Redimensionamento automático

3. **Relatórios Avançados**
   - Gráficos de receitas/custos
   - Exportação para PDF/Excel
   - Filtros por período

4. **Notificações**
   - Lembretes de vencimento
   - Alertas de inadimplência
   - Notificações push

5. **Mobile**
   - PWA (Progressive Web App)
   - App nativo com React Native

## 🚀 Deploy

### Firebase Hosting

```bash
# Build do projeto
npm run build

# Deploy
firebase deploy
```

### Variáveis de Ambiente

Configure as variáveis no Firebase Hosting:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_STORAGE_BUCKET`

## 📝 Licença

Este projeto foi desenvolvido para a escola de futsal Ludus.

---

**Ludus** - *pelo prazer de jogar* ⚽
