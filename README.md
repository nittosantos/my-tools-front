# 🛠️ Marketplace de Aluguel de Ferramentas - Frontend

Frontend desenvolvido em React + TypeScript para o sistema de marketplace de aluguel de ferramentas.

## 🚀 Stack Tecnológica

- **React 18** + **TypeScript**
- **Vite** - Build tool e dev server
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes UI
- **TanStack Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado e cache
- **Axios** - Cliente HTTP
- **react-hook-form** + **zod** - Validação de formulários
- **Mock Service Worker (MSW)** - Mock do backend em desenvolvimento
- **date-fns** - Manipulação de datas

## 📋 Funcionalidades

### ✅ Autenticação
- Login com validação de formulário
- Proteção de rotas privadas
- Logout automático em caso de token inválido (401)
- Context API para gerenciamento de estado do usuário

### 🏠 Páginas Públicas
- **Home** (`/`) - Listagem de todas as ferramentas disponíveis
- **Detalhes da Ferramenta** (`/tools/:id`) - Visualização completa com foto, descrição, categoria e preço
- **Login** (`/login`) - Formulário de autenticação

### 🛒 Checkout
- **Criar Aluguel** (`/tools/:id/rent`) - Seleção de datas, cálculo automático do total e confirmação

### 📊 Dashboard (Área Protegida)
- **Minhas Ferramentas** (`/dashboard/my-tools`) - CRUD completo:
  - Listar ferramentas do usuário
  - Criar nova ferramenta com upload de imagem
  - Editar ferramenta existente
  - Deletar ferramenta (com confirmação)
  
- **Meus Aluguéis** (`/dashboard/my-rentals`) - Visualização dos aluguéis criados pelo usuário

- **Aluguéis Recebidos** (`/dashboard/received-rentals`) - Gerenciar solicitações:
  - Aprovar aluguéis
  - Rejeitar aluguéis

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ e npm

### Passos

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd my_tools_front
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 🧪 Mock Service Worker (MSW)

O projeto utiliza MSW para mockar o backend durante o desenvolvimento. O MSW está configurado para:
- Interceptar todas as requisições HTTP
- Retornar dados mockados realistas
- Simular comportamentos do backend (sucesso, erro, etc.)

**Nota:** O MSW só funciona em modo de desenvolvimento. Em produção, as requisições serão feitas para o backend real.

### Dados Mockados Disponíveis

- **Usuários:**
  - `joao_silva` / qualquer senha
  - `maria_santos` / qualquer senha
  - `pedro_oliveira` / qualquer senha

- **Ferramentas:** 5 ferramentas pré-cadastradas em diferentes categorias e localizações

- **Aluguéis:** Alguns aluguéis de exemplo para testes

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/            # Componentes shadcn/ui
│   ├── Header.tsx     # Cabeçalho global
│   ├── LoadingSpinner.tsx
│   ├── ErrorDisplay.tsx
│   ├── ImageUpload.tsx
│   └── CreateToolDialog.tsx
├── contexts/          # Contexts React
│   └── AuthContext.tsx
├── hooks/             # Custom hooks (TanStack Query)
│   ├── useAuth.ts
│   ├── useLogin.ts
│   ├── useTools.ts
│   ├── useRentals.ts
│   └── ...
├── lib/               # Utilitários e configurações
│   ├── api.ts         # Cliente Axios
│   ├── query-client.ts
│   ├── router.tsx     # Configuração do TanStack Router
│   ├── schemas.ts     # Schemas Zod
│   └── utils.ts       # Funções utilitárias
├── mocks/             # MSW
│   ├── browser.ts
│   ├── handlers.ts
│   └── fixtures.ts
├── routes/            # Rotas do TanStack Router
│   ├── __root.tsx
│   ├── index.tsx      # Home
│   ├── login.tsx
│   ├── tools.$toolId.tsx
│   ├── tools.$toolId.rent.tsx
│   └── dashboard.*.tsx
├── types/             # Tipos TypeScript globais
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 Componentes UI

O projeto utiliza componentes do [shadcn/ui](https://ui.shadcn.com/), incluindo:
- Button, Input, Label, Card
- Dialog, Form, Select
- Skeleton, Badge, Alert
- Sonner (Toast)

## 🔐 Autenticação

A autenticação funciona da seguinte forma:
1. Usuário faz login via `POST /auth/login/`
2. Token é salvo no `localStorage`
3. Token é automaticamente adicionado em todas as requisições via interceptor do Axios
4. Em caso de resposta 401, o usuário é automaticamente deslogado e redirecionado para `/login`

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o ESLint

## 🐛 Troubleshooting

### MSW não está interceptando requisições
- Verifique se o arquivo `public/mockServiceWorker.js` existe
- Certifique-se de que está em modo de desenvolvimento
- Limpe o cache do navegador

### Erro de importação de componentes
- Verifique se todos os componentes shadcn/ui foram instalados
- Execute `npx shadcn-ui@latest add <componente>` se necessário

## 📄 Licença

Este é um projeto acadêmico desenvolvido para a FATEC.

## 👥 Desenvolvido por

[Seu nome/equipe]

---

**Status:** ✅ MVP Completo e Funcional
