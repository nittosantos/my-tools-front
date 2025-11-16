# 📋 Plano de Implementação - Marketplace de Aluguel de Ferramentas

## 🎯 Objetivo
Implementar o frontend completo seguindo o checklist, usando Mock Service Worker (MSW) para mockar o backend durante o desenvolvimento.

---

## 📦 FASE 1: Fundação e Configuração Base
**Duração estimada:** ~30 minutos  
**Prioridade:** CRÍTICA

### 1.1 Setup Inicial
- [x] Projeto já criado com Vite + React + TS
- [x] Limpar arquivos iniciais não utilizados (`App.css`, logos)
- [x] Configurar variáveis de ambiente:
  - [x] Criar `.env.local` com `VITE_API_URL=http://127.0.0.1:8000/api`
  - [x] Adicionar `.env.local` ao `.gitignore`
  - [x] Usar `import.meta.env.VITE_API_URL` no código

### 1.2 Instalação de Dependências Core
```bash
# HTTP Client
npm install axios

# TanStack Query
npm install @tanstack/react-query

# TanStack Router
npm install @tanstack/react-router @tanstack/router-devtools

# Validação
npm install react-hook-form zod @hookform/resolvers

# Mock Service Worker
npm install -D msw

# Utilitários
npm install date-fns
```

### 1.3 Tailwind CSS
- [x] Instalar: `npm install -D tailwindcss @tailwindcss/vite`
- [x] Configurar plugin do Vite (`@tailwindcss/vite`)
- [x] Configurar `src/index.css` com `@import "tailwindcss"` e `@theme inline`
- [x] Configurar `components.json` com `config: ""` para Tailwind v4

### 1.4 shadcn/ui
- [x] Rodar: `npx shadcn-ui@latest init`
- [x] Instalar componentes essenciais:
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

## 🏗️ FASE 2: Estrutura Base e Tipos
**Duração estimada:** ~20 minutos  
**Prioridade:** ALTA

### 2.1 Estrutura de Pastas
```
src/
├── api/           # Cliente HTTP e interceptors
├── components/    # Componentes reutilizáveis
├── contexts/      # Contexts (AuthContext)
├── hooks/         # Custom hooks (useAuth, useLogin, etc.)
├── lib/           # Utilitários e configurações
├── mocks/         # MSW handlers e fixtures
├── pages/         # Páginas/rotas
├── routes/        # Configuração do TanStack Router
├── types/         # Tipos TypeScript globais
└── utils/         # Funções utilitárias
```

### 2.2 Tipos TypeScript Globais
- [x] Criar `src/types/index.ts` com:
  - [x] `User` (id, username, email)
  - [x] `Tool` (id, title, description, category, price_per_day, image_url, owner, available)
  - [x] `Rental` (id, tool, renter, start_date, end_date, total_price, status)
  - [x] `Category` (enum ou union type)
  - [x] `RentalStatus` (enum: pending, approved, rejected, completed)

---

## 🔌 FASE 3: Cliente HTTP e MSW
**Duração estimada:** ~45 minutos  
**Prioridade:** CRÍTICA

### 3.1 Configuração do Cliente Axios
- [x] Criar `src/lib/api.ts`:
  - [x] Instância do axios com `baseURL` do `.env`
  - [x] Interceptor de request (adicionar token)
  - [x] Interceptor de response (tratar 401, logout automático)

### 3.2 Mock Service Worker Setup
- [x] Criar `src/mocks/handlers.ts` com handlers para:
  - [x] `POST /auth/login/` → retorna token + dados do usuário
  - [x] `GET /auth/me/` → retorna dados do usuário atual
  - [x] `GET /tools/` → lista de ferramentas
  - [x] `GET /tools/:id/` → detalhes de uma ferramenta
  - [x] `GET /tools/my/` → ferramentas do usuário logado
  - [x] `POST /tools/` → criar ferramenta
  - [x] `PATCH /tools/:id/` → editar ferramenta
  - [x] `DELETE /tools/:id/` → deletar ferramenta
  - [x] `GET /rentals/my/` → aluguéis do usuário
  - [x] `GET /rentals/received/` → aluguéis recebidos
  - [x] `POST /rentals/` → criar aluguel
  - [x] `PATCH /rentals/:id/approve/` → aprovar aluguel
  - [x] `PATCH /rentals/:id/reject/` → rejeitar aluguel

- [x] Criar `src/mocks/browser.ts` para inicializar MSW no browser
- [x] Criar `src/mocks/fixtures.ts` com dados mockados (usuários, ferramentas, aluguéis)
- [x] Configurar MSW em `src/main.tsx` (só em desenvolvimento)
- [x] Gerar `mockServiceWorker.js` em `public/`

### 3.3 TanStack Query Setup
- [x] Criar `src/lib/query-client.ts` com QueryClient configurado
- [x] Envolver app com `<QueryClientProvider>` em `main.tsx`

---

## 🧭 FASE 4: Roteamento e Autenticação
**Duração estimada:** ~1 hora  
**Prioridade:** CRÍTICA

### 4.1 TanStack Router
- [x] Criar estrutura de rotas em `src/routes/`:
  - [x] `__root.tsx` (layout base com Header)
  - [x] `index.tsx` (Home)
  - [x] `login.tsx`
  - [x] `tools.$toolId.tsx` (detalhes)
  - [x] `tools.$toolId.rent.tsx` (checkout)
  - [x] `dashboard.tsx` (layout protegido)
  - [x] `dashboard.my-tools.tsx`
  - [x] `dashboard.my-rentals.tsx`
  - [x] `dashboard.received-rentals.tsx`

- [x] Configurar roteamento protegido (verificar token no `beforeLoad`)
- [x] Criar componente Header com navegação (`Header.tsx`)
- [x] Configurar plugin do TanStack Router no Vite

### 4.2 Context de Autenticação
- [x] Criar `src/contexts/AuthContext.tsx`:
  - [x] Estado do usuário logado
  - [x] Funções: `login`, `logout`, `isAuthenticated`
  - [x] Persistir no localStorage

- [x] Criar hook `useAuth()` para usar o contexto

---

## 🎣 FASE 5: Hooks de API
**Duração estimada:** ~1 hora  
**Prioridade:** ALTA

### 5.1 Hooks de Autenticação
- [x] `useLogin` - mutation para login
- [x] `useMe` - query para buscar dados do usuário

### 5.2 Hooks de Ferramentas
- [x] `useTools` - query para listar ferramentas
- [x] `useTool` - query para buscar ferramenta por ID
- [x] `useMyTools` - query para ferramentas do usuário
- [x] `useCreateTool` - mutation para criar
- [x] `useUpdateTool` - mutation para editar
- [x] `useDeleteTool` - mutation para deletar

### 5.3 Hooks de Aluguéis
- [x] `useMyRentals` - query para aluguéis do usuário
- [x] `useReceivedRentals` - query para aluguéis recebidos
- [x] `useCreateRental` - mutation para criar aluguel
- [x] `useApproveRental` - mutation para aprovar
- [x] `useRejectRental` - mutation para rejeitar

---

## 🎨 FASE 6: Componentes Reutilizáveis
**Duração estimada:** ~30 minutos  
**Prioridade:** MÉDIA

### 6.1 Componentes de UI
- [x] `LoadingSpinner` - spinner de loading
- [x] `Skeleton` - skeleton para cards/listas (shadcn/ui)
- [x] `ErrorDisplay` - exibição de erros amigável
- [x] `ImageUpload` - componente de upload com preview
- [x] `CreateToolDialog` - dialog para criar/editar ferramentas
- [x] Usar `input type="date"` para seleção de datas

---

## 📄 FASE 7: Páginas Públicas
**Duração estimada:** ~2 horas  
**Prioridade:** ALTA

### 7.1 Home (`/`)
- [x] Listar ferramentas com cards do shadcn/ui
- [x] Estados de loading (skeleton)
- [x] Tratamento de erro (`ErrorDisplay`)
- [x] Link para detalhes de cada ferramenta

### 7.2 Detalhes da Ferramenta (`/tools/:id`)
- [x] Buscar e exibir dados da ferramenta
- [x] Exibir foto, título, descrição, categoria, preço
- [x] Badge de disponibilidade
- [x] Botão "Alugar" (redireciona para checkout)
- [x] Estados de loading e erro
- [x] Link para voltar à lista

### 7.3 Login (`/login`)
- [x] Formulário com react-hook-form + zod
- [x] Validação de campos
- [x] Integração com `useLogin`
- [x] Toast de sucesso/erro
- [x] Loading durante requisição
- [x] Redirecionamento após login bem-sucedido

---

## 🛒 FASE 8: Checkout (Core do Sistema)
**Duração estimada:** ~1.5 horas  
**Prioridade:** ALTÍSSIMA

### 8.1 Página de Checkout (`/tools/:id/rent`)
- [x] Buscar dados da ferramenta
- [x] Formulário com date picker:
  - [x] Data início (`input type="date"`)
  - [x] Data fim (`input type="date"`)
- [x] Validações (zod):
  - [x] Data fim > data início
  - [x] Não permitir datas passadas
- [x] Cálculo automático:
  - [x] Calcular dias: `differenceInDays(end, start) + 1` (date-fns)
  - [x] Calcular total: `days * price_per_day`
- [x] Exibir resumo antes de confirmar
- [x] Botão "Confirmar Aluguel"
- [x] Integração com `useCreateRental`
- [x] Toast de sucesso/erro
- [x] Redirecionamento após sucesso

---

## 🏠 FASE 9: Dashboard - Minhas Ferramentas
**Duração estimada:** ~2 horas  
**Prioridade:** ALTA

### 9.1 Listagem
- [x] Listar ferramentas do usuário
- [x] Card para cada ferramenta com:
  - [x] Informações básicas
  - [x] Botão "Editar"
  - [x] Botão "Deletar" (com confirmação em Dialog)
- [x] Estados de loading e erro

### 9.2 Criar Ferramenta
- [x] Botão "Criar ferramenta"
- [x] Modal/Dialog (`CreateToolDialog`) com formulário:
  - [x] Título (obrigatório)
  - [x] Descrição (obrigatório)
  - [x] Categoria (select com todas as opções)
  - [x] Preço por dia (número positivo)
  - [x] Upload de imagem (`ImageUpload`):
    - [x] Preview antes de enviar
    - [x] Validação de tipo (jpg, png, webp)
    - [x] Validação de tamanho (máx 5MB)
- [x] Validação com zod
- [x] Integração com `useCreateTool`
- [x] Toast de sucesso/erro
- [x] Fechar modal e atualizar lista após sucesso

### 9.3 Editar Ferramenta
- [x] Modal/Dialog pré-preenchido (`CreateToolDialog` em modo edição)
- [x] Mesmo formulário de criação
- [x] Integração com `useUpdateTool`
- [x] Toast de sucesso/erro

### 9.4 Deletar Ferramenta
- [x] Dialog de confirmação
- [x] Integração com `useDeleteTool`
- [x] Toast de sucesso/erro
- [x] Atualizar lista após deletar

---

## 📦 FASE 10: Dashboard - Meus Aluguéis
**Duração estimada:** ~1 hora  
**Prioridade:** ALTA

### 10.1 Listagem
- [x] Listar aluguéis do usuário (`/rentals/my/`)
- [x] Card para cada aluguel com:
  - [x] Nome da ferramenta
  - [x] Período (data início e fim formatadas com date-fns)
  - [x] Total price
  - [x] Status (badge colorido)
- [x] Estados de loading e erro

---

## 📥 FASE 11: Dashboard - Aluguéis Recebidos
**Duração estimada:** ~1 hora  
**Prioridade:** ALTA

### 11.1 Listagem
- [x] Listar aluguéis recebidos (`/rentals/received/`)
- [x] Card para cada aluguel com informações
- [x] Botões de ação:
  - [x] "Aprovar" (verde)
  - [x] "Rejeitar" (vermelho)
- [x] Integração com `useApproveRental` e `useRejectRental`
- [x] Toast de sucesso/erro
- [x] Atualizar lista após ação
- [x] Estados de loading e erro
- [x] Mostrar informações do locatário

---

## 🎯 FASE 12: Validações e Schemas
**Duração estimada:** ~30 minutos  
**Prioridade:** ALTA

### 12.1 Schemas Zod
- [x] Criar `src/lib/schemas.ts` com:
  - [x] `loginSchema`
  - [x] `createToolSchema`
  - [x] `updateToolSchema`
  - [x] `createRentalSchema`

### 12.2 Integração
- [x] Usar schemas em todos os formulários
- [x] Mensagens de erro amigáveis (FormMessage)
- [x] Validação em tempo real (react-hook-form)

---

## 🔔 FASE 13: Toasts e Feedback Visual
**Duração estimada:** ~20 minutos  
**Prioridade:** ALTA

### 13.1 Configuração
- [x] Configurar Toaster do shadcn/ui (Sonner) em `__root.tsx`

### 13.2 Implementação
- [x] Adicionar toasts em todas as ações:
  - [x] Login (sucesso/erro)
  - [x] CRUD de ferramentas (sucesso/erro)
  - [x] CRUD de aluguéis (sucesso/erro)
  - [x] Aprovar/rejeitar aluguéis (sucesso/erro)

---

## 🎨 FASE 14: Polimento e Ajustes Finais
**Duração estimada:** ~1 hora  
**Prioridade:** MÉDIA

### 14.1 Estados de Loading
- [x] Implementar skeleton/spinner em todas as telas
- [x] Loading durante mutations

### 14.2 Tratamento de Erros
- [x] Mensagens de erro amigáveis (`ErrorDisplay`)
- [x] Tratamento de erros HTTP (400, 403, 404, 500)
- [x] Fallback quando não há dados

### 14.3 UX/UI
- [x] Ajustar espaçamentos e cores (shadcn/ui)
- [x] Responsividade básica
- [x] Confirmações para ações destrutivas (Dialog de confirmação)

---

## ✅ FASE 15: Testes e Validação Final
**Duração estimada:** ~30 minutos  
**Prioridade:** ALTA

### 15.1 Checklist de Validação
- [x] Login funcionando
- [x] Autenticação protegendo rotas
- [x] Interceptor tratando 401
- [x] Home listando ferramentas
- [x] Detalhes da ferramenta funcionando
- [x] Checkout criando aluguel
- [x] CRUD completo de ferramentas
- [x] Aprovar/rejeitar aluguéis
- [x] Toasts em todas as ações
- [x] Loading states funcionando
- [x] Erros sendo tratados
- [x] MSW configurado e funcionando

### 15.2 Ajustes Finais
- [x] Corrigir bugs encontrados
- [x] Melhorar mensagens de erro
- [x] Ajustar estilos se necessário

---

## 📊 Resumo das Fases

| Fase | Descrição | Prioridade | Tempo Estimado |
|------|-----------|------------|----------------|
| 1 | Fundação e Configuração | CRÍTICA | ~30min |
| 2 | Estrutura Base e Tipos | ALTA | ~20min |
| 3 | Cliente HTTP e MSW | CRÍTICA | ~45min |
| 4 | Roteamento e Autenticação | CRÍTICA | ~1h |
| 5 | Hooks de API | ALTA | ~1h |
| 6 | Componentes Reutilizáveis | MÉDIA | ~30min |
| 7 | Páginas Públicas | ALTA | ~2h |
| 8 | Checkout | ALTÍSSIMA | ~1.5h |
| 9 | Dashboard - Minhas Ferramentas | ALTA | ~2h |
| 10 | Dashboard - Meus Aluguéis | ALTA | ~1h |
| 11 | Dashboard - Aluguéis Recebidos | ALTA | ~1h |
| 12 | Validações e Schemas | ALTA | ~30min |
| 13 | Toasts e Feedback | ALTA | ~20min |
| 14 | Polimento | MÉDIA | ~1h |
| 15 | Testes e Validação | ALTA | ~30min |

**Tempo Total Estimado:** ~12-14 horas

---

## 🚀 Ordem de Execução Recomendada

1. **Fases 1-3** (Fundação) → Base sólida
2. **Fase 4** (Roteamento/Auth) → Estrutura de navegação
3. **Fase 5** (Hooks) → Lógica de dados
4. **Fase 6** (Componentes) → Reutilização
5. **Fases 7-8** (Páginas públicas + Checkout) → Core do sistema
6. **Fases 9-11** (Dashboards) → Funcionalidades completas
7. **Fases 12-13** (Validação + Toasts) → UX
8. **Fases 14-15** (Polimento + Testes) → Finalização

---

## 📝 Notas Importantes

- **MSW**: Será usado apenas em desenvolvimento. Em produção, remover ou desabilitar.
- **Variáveis de Ambiente**: Criar `.env.example` para documentação.
- **Tipos**: Manter tipos sincronizados com o que o backend retornará.
- **Validação**: Usar zod em todos os formulários para consistência.
- **Loading States**: Sempre mostrar feedback visual durante requisições.
- **Erros**: Tratar todos os casos de erro de forma amigável.

---

## 🎉 Status: IMPLEMENTAÇÃO CONCLUÍDA!

Todas as 15 fases foram implementadas com sucesso. O MVP está completo e funcional!

### ✅ Resumo do que foi implementado:
- ✅ Setup completo com Tailwind CSS v4 e shadcn/ui
- ✅ MSW configurado para mockar o backend
- ✅ TanStack Router com rotas protegidas
- ✅ Autenticação completa com AuthContext
- ✅ Todos os hooks de API implementados
- ✅ Todas as páginas e componentes criados
- ✅ Validação de formulários com zod
- ✅ Toasts de feedback em todas as ações
- ✅ Estados de loading e erro em todas as telas
- ✅ CRUD completo de ferramentas e aluguéis

### 🚀 Próximos Passos (Opcional):
- [ ] Adicionar filtros/busca na Home (pós-MVP)
- [ ] Implementar registro de usuário (se backend permitir)
- [ ] Adicionar Prettier para formatação de código
- [ ] Testes automatizados (opcional)

