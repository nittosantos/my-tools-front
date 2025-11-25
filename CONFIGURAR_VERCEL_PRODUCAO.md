# 🔧 Configurar Vercel para Produção (Backend Real)

Este guia explica como remover o MSW e conectar o frontend ao backend real no Railway.

## 🎯 Objetivo

- ❌ Remover MSW (mocks)
- ✅ Conectar ao backend real no Railway: `https://web-production-34a3a.up.railway.app/api`

---

## 📋 Passo a Passo na Vercel

### 1. Acessar Configurações do Projeto

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique no seu projeto: **my-tools-front**
3. Vá em **Settings** (Configurações)
4. Clique em **Environment Variables** (Variáveis de Ambiente)

### 2. Remover MSW

1. Procure pela variável `VITE_USE_MSW`
2. Se existir, **DELETE** ela (ou altere o valor para `false`)
3. Isso fará com que o MSW não seja iniciado em produção

### 3. Adicionar URL do Backend

1. Clique em **Add New** (Adicionar Nova)
2. Configure:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://web-production-34a3a.up.railway.app/api`
   - **Environment**: Selecione todas:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development (opcional, mas recomendado)
3. Clique em **Save** (Salvar)

### 4. Fazer Redeploy

Após adicionar/remover variáveis, você precisa fazer um novo deploy:

**Opção A: Via Interface**
1. Vá em **Deployments**
2. Clique nos **3 pontinhos** (⋯) do último deploy
3. Clique em **Redeploy**

**Opção B: Via Git**
1. Faça qualquer commit pequeno (ex: atualizar README)
2. Faça push para o GitHub
3. A Vercel fará deploy automático

---

## ✅ Verificação

Após o redeploy:

1. Acesse: https://my-tools-front.vercel.app
2. Abra o **Console do Navegador** (F12)
3. **NÃO** deve aparecer: `✅ MSW iniciado com sucesso`
4. Faça uma requisição (ex: tentar fazer login)
5. Na aba **Network**, verifique se as requisições estão indo para:
   ```
   https://web-production-34a3a.up.railway.app/api/...
   ```
   (e não mais para `127.0.0.1:8000`)

---

## 🐛 Troubleshooting

### MSW ainda está ativo

**Sintoma:** Console mostra `✅ MSW iniciado com sucesso`

**Solução:**
1. Verifique se `VITE_USE_MSW` foi realmente removida
2. Faça um **hard refresh** no navegador (Ctrl+Shift+R)
3. Limpe o cache do Service Worker:
   - DevTools → Application → Service Workers → Unregister

### Erro de CORS

**Sintoma:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solução:**
1. No Railway, adicione a variável `CORS_ALLOWED_ORIGINS`
2. Valor: `https://my-tools-front.vercel.app` (sem barra no final)
3. Reinicie o serviço no Railway

### Erro 404 nas requisições

**Sintoma:** Requisições retornam 404

**Solução:**
1. Verifique se `VITE_API_URL` está correta na Vercel
2. Certifique-se de que termina com `/api` (não `/api/`)
3. Verifique se o backend está rodando no Railway

### Variáveis não estão sendo aplicadas

**Sintoma:** Ainda usa valores antigos

**Solução:**
1. Faça um novo deploy (não basta salvar as variáveis)
2. Aguarde o build terminar completamente
3. Limpe o cache do navegador

---

## 📝 Resumo das Variáveis na Vercel

### ✅ Deve ter:
```
VITE_API_URL = https://web-production-34a3a.up.railway.app/api
```

### ❌ NÃO deve ter:
```
VITE_USE_MSW = true  (ou qualquer valor)
```

---

## 🔗 Links Úteis

- **Frontend:** https://my-tools-front.vercel.app
- **Backend API:** https://web-production-34a3a.up.railway.app/api
- **Swagger Docs:** https://web-production-34a3a.up.railway.app/api/docs/
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Railway Dashboard:** https://railway.app

---

**Pronto! Seu frontend agora está conectado ao backend real! 🚀**

