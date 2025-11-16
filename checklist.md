# 🧱 Checklist do Frontend – Marketplace de Aluguel

Stack confirmada:

- React + Vite (TypeScript)
- Tailwind CSS
- shadcn/ui
- Axios
- TanStack Query
- TanStack Router
- Autenticação via LocalStorage

Este documento descreve tudo que falta implementar no frontend para o MVP.

---

# ✅ 1. Setup Inicial do Projeto

- [x] Criar projeto com Vite + React + TS
- [x] Testar `npm run dev` para garantir que está tudo funcionando
- [x] Limpar arquivos iniciais que não serão usados (`App.css`, logos, etc.)
- [x] Configurar variáveis de ambiente:
  - [x] Criar `.env.local` com `VITE_API_URL=http://127.0.0.1:8000/api`
  - [x] Adicionar `.env.local` ao `.gitignore`
  - [x] Usar `import.meta.env.VITE_API_URL` no código

---

# 🎨 2. Estilização Base (Tailwind + shadcn/ui)

## Tailwind CSS
- [x] Instalar Tailwind CSS v4 (`npm install -D tailwindcss @tailwindcss/vite`)
- [x] Configurar plugin do Vite (`@tailwindcss/vite`)
- [x] Configurar `src/index.css` com `@import "tailwindcss"` e `@theme inline`
- [x] Configurar `components.json` com `config: ""` para Tailwind v4

## shadcn/ui
- [x] Instalar CLI e configurar `components.json`
- [x] Instalar dependências (lucide-react, class-variance-authority, @radix-ui/*)
- [x] Gerar componentes essenciais:
  - [x] button
  - [x] input
  - [x] label
  - [x] card
  - [x] textarea
  - [x] form
  - [x] dialog
  - [x] alert
  - [x] select
  - [x] skeleton
  - [x] badge
  - [x] sonner (toast)

---

# 🧭 3. Navegação com TanStack Router

- [x] Instalar `@tanstack/react-router` e `@tanstack/router-devtools`
- [x] Instalar plugin `@tanstack/router-plugin`
- [x] Criar rotas em `src/routes/`:
  - [x] `/` – Home (`index.tsx`)
  - [x] `/login` (`login.tsx`)
  - [x] `/tools/:id` (`tools.$toolId.tsx`)
  - [x] `/tools/:id/rent` (`tools.$toolId.rent.tsx`)
  - [x] `/dashboard` (`dashboard.tsx` - roteamento protegido)
  - [x] `/dashboard/my-tools` (`dashboard.my-tools.tsx`)
  - [x] `/dashboard/my-rentals` (`dashboard.my-rentals.tsx`)
  - [x] `/dashboard/received-rentals` (`dashboard.received-rentals.tsx`)
- [x] Criar layout base (`__root.tsx`):
  - [x] Header com navegação (`Header.tsx`)
  - [x] `<Outlet />`
  - [x] Toaster configurado
- [x] Criar ProtectedRoute:
  - [x] Se não houver token → redirecionar para `/login`
  - [x] Se houver → renderizar dashboard

---

# 🔐 4. Autenticação no Frontend (DECISÃO FINAL)

Autenticação fará uso de LocalStorage.

**Ao fazer login:**
- [x] Enviar `POST /auth/login/`
- [x] Salvar token no localStorage
- [x] Buscar `/auth/me/` para obter dados do usuário
- [x] Salvar usuário num AuthContext (`AuthContext.tsx`)
- [x] Hook `useAuth()` criado
- [x] Redirecionar para `/dashboard/my-tools`

**Layout protegido:**
- [x] Em rotas privadas, verificar token no `beforeLoad` do TanStack Router
- [x] Redirecionamento automático para `/login` se não autenticado

**Logout:**
- [x] Remover token do LocalStorage
- [x] Limpar estado global (AuthContext)
- [x] Redirecionar para `/login`

---

# 🔌 5. Cliente HTTP e TanStack Query

## Axios
- [x] Criar `src/lib/api.ts` com:
  ```ts
  axios.create({ baseURL: import.meta.env.VITE_API_URL })
  ```
- [x] Interceptor de request:
  ```ts
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  ```
- [x] Interceptor de response (⭐ ALTÍSSIMA IMPORTÂNCIA):
  ```ts
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
      return Promise.reject(error)
    }
  )
  ```

## Query Client
- [x] Instalar `@tanstack/react-query`
- [x] Criar QueryClient (`src/lib/query-client.ts`)
- [x] Envolver app com `<QueryClientProvider>` em `main.tsx`

## Hooks de API
- [x] Criar `src/hooks/`:
  - [x] `useAuth` (re-export do contexto)
  - [x] `useLogin`
  - [x] `useMe`
  - [x] `useTools`
  - [x] `useTool` (buscar ferramenta por ID)
  - [x] `useMyTools`
  - [x] `useCreateTool`
  - [x] `useUpdateTool` (editar ferramenta)
  - [x] `useDeleteTool` (deletar ferramenta)
  - [x] `useMyRentals`
  - [x] `useReceivedRentals`
  - [x] `useCreateRental` (⭐ ALTÍSSIMA - core do sistema)
  - [x] `useApproveRental`
  - [x] `useRejectRental`

---

# 🧰 6. Telas do MVP

## 🏠 Home (`/`)
- [x] Mostrar lista de ferramentas usando:
  - [x] `GET /tools/`
  - [x] Cards do shadcn/ui
- [x] Estados de loading (skeleton)
- [x] Tratamento de erro amigável (`ErrorDisplay`)
- [x] Link para página de detalhes de cada ferramenta

## 🔍 Detalhes da Ferramenta (`/tools/:id`) ⭐ ALTA IMPORTÂNCIA
- [x] Buscar ferramenta por ID (`GET /tools/:id/`)
- [x] Exibir informações:
  - [x] Foto da ferramenta
  - [x] Título
  - [x] Descrição completa
  - [x] Categoria (com labels traduzidos)
  - [x] Preço por dia
  - [x] Disponibilidade (badge colorido)
- [x] Botão "Alugar" (redireciona para `/tools/:id/rent`)
- [x] Estados de loading e erro
- [x] Link para voltar à lista

## 🔐 Login (`/login`)
- [x] Formulário com validação (react-hook-form + zod):
  - [x] Input (username) com validação
  - [x] Input (password) com validação
  - [x] Button (entrar)
- [x] Erro se senha ou usuário inválidos
- [x] Toast de sucesso ao fazer login
- [x] Toast de erro ao falhar login
- [x] Estados de loading durante requisição
- [x] Card com design moderno

## 📝 Registro de Usuário (`/register`) ⚠️ OPCIONAL
- [ ] Verificar se backend tem endpoint de registro (`POST /auth/register/`)
- [ ] Se sim, criar tela de registro:
  - [ ] Formulário com validação
  - [ ] Campos: username, email, password, confirm_password
  - [ ] Toast de sucesso/erro

## 🧑‍🔧 Dashboard – Minhas Ferramentas
- [x] `GET /tools/my/` implementado
- [x] Card para cada ferramenta com:
  - [x] Informações básicas
  - [x] Botão "Editar"
  - [x] Botão "Deletar" (com confirmação em Dialog)
- [x] Botão "Criar ferramenta"
- [x] Modal (`CreateToolDialog`) com validação:
  - [x] título (obrigatório)
  - [x] descrição (obrigatório)
  - [x] categoria (select com todas as opções)
  - [x] preço por dia (obrigatório, número positivo)
  - [x] upload de imagem:
    - [x] Preview da imagem antes de enviar (`ImageUpload`)
    - [x] Validação de tipo (jpg, png, webp)
    - [x] Validação de tamanho (máximo 5MB)
    - [x] Tratamento de erro de upload
- [x] Toast de sucesso ao criar ferramenta
- [x] Toast de sucesso ao editar ferramenta
- [x] Toast de sucesso ao deletar ferramenta
- [x] Estados de loading (skeleton)

## 📦 Dashboard – Meus Alugueis
- [x] Listar `/rentals/my/`
- [x] Mostrar:
  - [x] nome da ferramenta
  - [x] período (data início e fim formatadas com date-fns)
  - [x] total_price
  - [x] status (com badge colorido)
- [x] Estados de loading (skeleton)
- [x] Tratamento de erro (`ErrorDisplay`)

## 📥 Dashboard – Aluguéis Recebidos
- [x] Listar `/rentals/received/`
- [x] Botões:
  - [x] Aprovar (`PATCH /rentals/:id/approve/`)
  - [x] Rejeitar (`PATCH /rentals/:id/reject/`)
- [x] Toast de sucesso ao aprovar
- [x] Toast de sucesso ao rejeitar
- [x] Estados de loading
- [x] Tratamento de erro
- [x] Mostrar informações do locatário

## 🛒 Checkout / Criar Aluguel ⭐ ALTÍSSIMA IMPORTÂNCIA (Core do Sistema)
- [x] Rota `/tools/:id/rent` implementada
- [x] Formulário com validação (react-hook-form + zod):
  - [x] Seleção de data início (input type="date")
  - [x] Seleção de data fim (input type="date")
  - [x] Validação: data fim > data início
  - [x] Validação: não permitir datas passadas
- [x] Cálculo automático do total:
  - [x] Calcular dias: `differenceInDays(end, start) + 1` (date-fns)
  - [x] Calcular total: `dias * preço_por_dia`
  - [x] Exibir resumo antes de confirmar
- [x] Botão "Confirmar Aluguel"
- [x] Enviar `POST /rentals/` com:
  - [x] tool_id
  - [x] start_date
  - [x] end_date
- [x] Toast de sucesso ao criar aluguel
- [x] Toast de erro se falhar
- [x] Redirecionar para `/dashboard/my-rentals` após sucesso
- [x] Estados de loading

---

# 🎯 7. Validação de Formulários

- [x] Instalar `react-hook-form` e `zod`
- [x] Criar schemas de validação com zod (`src/lib/schemas.ts`):
  - [x] Schema de login (`loginSchema`)
  - [x] Schema de criação de ferramenta (`createToolSchema`)
  - [x] Schema de atualização de ferramenta (`updateToolSchema`)
  - [x] Schema de criação de aluguel (`createRentalSchema`)
- [x] Integrar com componentes do shadcn/ui (Form, FormField, etc.)
- [x] Mensagens de erro amigáveis (FormMessage)

---

# 🎨 8. Estados de Loading e Erro

- [x] Criar componente de loading spinner (`LoadingSpinner.tsx`)
- [x] Criar componente de skeleton loading (`Skeleton` do shadcn/ui)
- [x] Criar componente de erro amigável (`ErrorDisplay.tsx`)
- [x] Implementar em todas as telas:
  - [x] Home (skeleton + ErrorDisplay)
  - [x] Detalhes da ferramenta (skeleton + ErrorDisplay)
  - [x] Dashboard - Minhas Ferramentas (skeleton + ErrorDisplay)
  - [x] Dashboard - Meus Aluguéis (skeleton + ErrorDisplay)
  - [x] Dashboard - Aluguéis Recebidos (skeleton + ErrorDisplay)
  - [x] Checkout (skeleton + ErrorDisplay)
- [x] Tratamento de erros HTTP:
  - [x] 400 - Bad Request (validação - via zod)
  - [x] 401 - Unauthorized (tratado no interceptor + redirecionamento)
  - [x] 403 - Forbidden (ErrorDisplay genérico)
  - [x] 404 - Not Found (ErrorDisplay genérico)
  - [x] 500 - Server Error (ErrorDisplay genérico)

---

# 🔔 9. Feedback Visual (Toasts) ⭐ ALTA IMPORTÂNCIA

- [x] Configurar toast do shadcn/ui (Sonner)
- [x] Toaster adicionado no `__root.tsx`
- [x] Implementar toasts em todas as ações:
  - [x] Login bem-sucedido (`useLogin`)
  - [x] Erro ao fazer login (`useLogin`)
  - [x] Ferramenta criada com sucesso (`useCreateTool`)
  - [x] Ferramenta editada com sucesso (`useUpdateTool`)
  - [x] Ferramenta deletada com sucesso (`useDeleteTool`)
  - [x] Erro ao criar/editar/deletar ferramenta (hooks)
  - [x] Aluguel criado com sucesso (`useCreateRental`)
  - [x] Erro ao criar aluguel (`useCreateRental`)
  - [x] Aluguel aprovado com sucesso (`useApproveRental`)
  - [x] Aluguel rejeitado com sucesso (`useRejectRental`)
  - [x] Erro ao aprovar/rejeitar aluguel (hooks)

---

# 🧪 10. Extras (opcional)

- [x] ESLint configurado
- [x] Tipos globais (Tool, Rental, User, Category, RentalStatus) em `src/types/`
- [ ] Prettier (opcional)
- [ ] Filtros/busca na Home (pós-MVP):
  - [ ] Busca por nome
  - [ ] Filtro por categoria
  - [ ] Ordenação (preço, data)

---

# 🎉 MVP PRONTO! ✅

- [x] Login funcionando com validação
- [x] Autenticação protegendo rotas
- [x] Interceptor de resposta tratando 401 (logout automático)
- [x] Variáveis de ambiente configuradas
- [x] Home lista ferramentas com loading/erro
- [x] Página de detalhes da ferramenta funcionando
- [x] Checkout/criação de aluguel funcionando (⭐ CORE)
- [x] Dashboard acessível só com token
- [x] CRUD completo de ferramenta funcionando (criar, editar, deletar)
- [x] CRUD de aluguel funcionando (criar, aprovar, rejeitar)
- [x] Upload de imagem com preview e validação
- [x] Validação de formulários em todas as telas
- [x] Estados de loading e erro em todas as telas
- [x] Toasts de feedback em todas as ações
- [x] UI completa com shadcn/ui
- [x] TanStack Router funcionando
- [x] TanStack Query fazendo cache das requisições
- [x] MSW configurado e funcionando (mock do backend)
