# 🚀 Deploy na Vercel com MSW

Este guia explica como fazer deploy do frontend na Vercel **usando MSW** para que funcione sem backend.

## 📋 Pré-requisitos

- Conta na Vercel (gratuita)
- Projeto no GitHub/GitLab/Bitbucket

## 🔧 Passo a Passo

### 1. Preparar o Projeto

Certifique-se de que o arquivo `public/mockServiceWorker.js` existe. Se não existir:

```bash
npx msw init public/ --save
```

### 2. Fazer Deploy na Vercel

#### Opção A: Via Interface Web

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe seu repositório
4. Configure o projeto:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Adicione a variável de ambiente:**
   - Vá em "Settings" → "Environment Variables"
   - Adicione:
     - **Name:** `VITE_USE_MSW`
     - **Value:** `true`
     - **Environment:** Production (e Preview se quiser)

6. Clique em "Deploy"

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Fazer deploy
vercel

# Adicionar variável de ambiente
vercel env add VITE_USE_MSW
# Quando perguntar o valor, digite: true
# Quando perguntar os ambientes, selecione: Production, Preview
```

### 3. Verificar se Funcionou

Após o deploy:

1. Acesse a URL fornecida pela Vercel
2. Abra o Console do Navegador (F12)
3. Você deve ver:
   ```
   ✅ MSW iniciado com sucesso - usando mocks ao invés do backend real
   ```

4. Teste fazer login:
   - Usuário: `joao_silva`
   - Senha: qualquer coisa

## ⚠️ Importante

- **Isso é apenas para demos/avaliação.** Em produção real, use um backend.
- O MSW funciona via Service Worker, então pode levar alguns segundos para inicializar.
- Se o MSW não iniciar, verifique:
  - Se a variável `VITE_USE_MSW=true` está configurada
  - Se o arquivo `public/mockServiceWorker.js` está no repositório
  - Console do navegador para erros

## 🔄 Atualizar Deploy

Sempre que fizer push para a branch principal, a Vercel fará deploy automático.

Para forçar um novo deploy:

```bash
vercel --prod
```

## 🐛 Troubleshooting

### MSW não inicia em produção

1. Verifique se `VITE_USE_MSW=true` está configurado na Vercel
2. Verifique se `public/mockServiceWorker.js` existe no repositório
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Verifique o console do navegador para erros

### Build falha

1. Verifique se todos os testes passam: `npm run build`
2. Verifique se não há erros de TypeScript: `npm run build`
3. Verifique os logs de build na Vercel

### Requisições não são interceptadas

1. Verifique se o MSW iniciou (console do navegador)
2. Verifique se a URL da requisição bate com os handlers em `src/mocks/handlers/`
3. Verifique se o Service Worker está registrado (DevTools → Application → Service Workers)

