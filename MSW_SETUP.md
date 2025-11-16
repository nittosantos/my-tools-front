# 🔧 Configuração do MSW (Mock Service Worker)

## Status Atual

✅ **MSW está configurado e pronto para uso!**

O frontend está configurado para usar **apenas mocks** (não precisa do backend rodando).

## Como Funciona

1. **MSW intercepta todas as requisições HTTP** feitas pelo frontend
2. **Retorna dados mockados** ao invés de chamar o backend real
3. **Funciona apenas em desenvolvimento** (modo `development`)

## Verificar se MSW está Funcionando

### 1. Abra o Console do Navegador

Quando o app iniciar, você deve ver:
```
✅ MSW iniciado com sucesso - usando mocks ao invés do backend real
```

### 2. Verifique a Aba Network

- As requisições devem aparecer como **interceptadas pelo MSW**
- Não devem aparecer erros 404 ou tentativas de conectar ao backend real

### 3. Se o MSW não iniciar

Se você ver:
```
❌ MSW failed to start
```

**Solução:**
1. Verifique se o arquivo `public/mockServiceWorker.js` existe
2. Se não existir, gere novamente:
   ```bash
   npx msw init public/ --save
   ```
3. Recarregue a página (Ctrl+R ou F5)

## Endpoints Mockados

Todos os endpoints da API estão mockados:

- ✅ `POST /api/auth/login/` - Login
- ✅ `GET /api/auth/me/` - Dados do usuário
- ✅ `GET /api/tools/` - Lista de ferramentas
- ✅ `GET /api/tools/my/` - Minhas ferramentas
- ✅ `GET /api/tools/:id/` - Detalhes de uma ferramenta
- ✅ `POST /api/tools/` - Criar ferramenta
- ✅ `PATCH /api/tools/:id/` - Atualizar ferramenta
- ✅ `DELETE /api/tools/:id/` - Deletar ferramenta
- ✅ `GET /api/rentals/` - Lista de aluguéis
- ✅ `GET /api/rentals/my/` - Meus aluguéis
- ✅ `GET /api/rentals/received/` - Aluguéis recebidos
- ✅ `POST /api/rentals/` - Criar aluguel
- ✅ `PATCH /api/rentals/:id/approve/` - Aprovar aluguel
- ✅ `PATCH /api/rentals/:id/reject/` - Rejeitar aluguel

## Dados Mockados

Os dados mockados estão em `src/mocks/fixtures.ts`:
- **Usuários**: `mockUsers` (testuser, owner, etc)
- **Ferramentas**: `mockTools` (várias ferramentas de exemplo)
- **Aluguéis**: `mockRentals` (aluguéis de exemplo)

## Desabilitar MSW (usar backend real)

Se você quiser usar o backend real ao invés dos mocks:

1. **Opção 1**: Comentar a inicialização do MSW em `src/main.tsx`
2. **Opção 2**: Criar arquivo `.env.local`:
   ```
   VITE_API_URL=http://127.0.0.1:8000/api
   ```
   E garantir que o backend esteja rodando.

## Troubleshooting

### Erro 404 em requisições

**Causa**: MSW não está interceptando a requisição

**Solução**:
1. Verifique se o MSW iniciou (console do navegador)
2. Verifique se o handler existe em `src/mocks/handlers.ts`
3. Verifique se a URL da requisição bate exatamente com o handler

### MSW não inicia

**Causa**: Service Worker não está registrado

**Solução**:
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Recarregue a página com Ctrl+Shift+R (hard reload)
3. Verifique se `public/mockServiceWorker.js` existe

### Requisições ainda vão para o backend

**Causa**: MSW não está interceptando ou está configurado para `bypass`

**Solução**:
1. Verifique `src/main.tsx` - `onUnhandledRequest` deve ser `'warn'` ou `'error'`
2. Verifique se está em modo `development` (não `production`)

