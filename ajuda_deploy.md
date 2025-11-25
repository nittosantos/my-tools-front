# 🎨 Guia de Configuração do Frontend para Produção

Este guia explica como conectar seu frontend à API em produção no Railway.

## 📍 URL da API em Produção

```
https://web-production-34a3a.up.railway.app/api
```

## 🔧 Passo a Passo

### 1. Configurar CORS no Railway (Backend)

No dashboard do Railway, vá em **Variables** e adicione:

**Variável:** `CORS_ALLOWED_ORIGINS`  
**Valor:** URL do seu frontend em produção

**Exemplos:**
- Se seu frontend está no Vercel: `https://seu-projeto.vercel.app`
- Se está no Netlify: `https://seu-projeto.netlify.app`
- Se tem múltiplas URLs: `https://app1.com,https://app2.com` (separadas por vírgula)

⚠️ **Importante:** 
- Use `https://` (não `http://`)
- Não adicione barra no final (`/`)
- Se tiver múltiplas URLs, separe por vírgula SEM espaços

### 2. Atualizar URL da API no Frontend

#### Opção A: Variável de Ambiente (.env)

Crie ou atualize o arquivo `.env` no seu frontend:

**Desenvolvimento (.env.local):**
```env
VITE_API_URL=http://127.0.0.1:8000/api
# ou
VITE_API_URL=http://localhost:8000/api
```

**Produção (.env.production):**
```env
VITE_API_URL=https://web-production-34a3a.up.railway.app/api
```

**No código (exemplo com Vite/React):**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
```

#### Opção B: Arquivo de Configuração

Crie um arquivo `config.js` ou `api.js`:

```javascript
// config.js
const config = {
  development: {
    API_URL: 'http://127.0.0.1:8000/api'
  },
  production: {
    API_URL: 'https://web-production-34a3a.up.railway.app/api'
  }
};

const env = import.meta.env.MODE || 'development';
export const API_URL = config[env].API_URL;
```

#### Opção C: Hardcoded (não recomendado, mas funciona)

```javascript
const API_URL = 'https://web-production-34a3a.up.railway.app/api';
```

### 3. Atualizar Requisições HTTP

Certifique-se de que todas as requisições usam a variável de ambiente:

**Antes (hardcoded):**
```javascript
fetch('http://127.0.0.1:8000/api/tools/')
```

**Depois (usando variável):**
```javascript
fetch(`${API_URL}/tools/`)
```

### 4. Autenticação JWT

O frontend deve enviar o token JWT no header `Authorization`:

```javascript
// Exemplo de requisição autenticada
fetch(`${API_URL}/tools/`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})
```

### 5. Endpoints Principais

- **Registro:** `POST ${API_URL}/auth/register/`
- **Login:** `POST ${API_URL}/auth/login/`
- **Refresh Token:** `POST ${API_URL}/auth/refresh/`
- **Me (Dados do usuário):** `GET ${API_URL}/auth/me/`
- **Listar Ferramentas:** `GET ${API_URL}/tools/`
- **Criar Ferramenta:** `POST ${API_URL}/tools/`
- **Listar Aluguéis:** `GET ${API_URL}/rentals/`
- **Criar Aluguel:** `POST ${API_URL}/rentals/`

## ✅ Checklist

- [ ] Variável `CORS_ALLOWED_ORIGINS` configurada no Railway com a URL do frontend
- [ ] URL da API atualizada no frontend para produção
- [ ] Todas as requisições usando a variável de ambiente
- [ ] Headers de autenticação configurados corretamente
- [ ] Testado registro e login
- [ ] Testado requisições autenticadas

## 🐛 Troubleshooting

### Erro de CORS

**Sintoma:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solução:**
1. Verifique se `CORS_ALLOWED_ORIGINS` está configurado no Railway
2. Certifique-se de que a URL está EXATAMENTE igual (com/sem `https://`, com/sem barra final)
3. Reinicie o serviço no Railway após adicionar a variável

### Erro 401 Unauthorized

**Sintoma:** Requisições retornam 401

**Solução:**
1. Verifique se o token JWT está sendo enviado no header `Authorization`
2. Formato correto: `Authorization: Bearer <token>`
3. Verifique se o token não expirou (12h de validade)

### Erro 404 Not Found

**Sintoma:** Endpoint não encontrado

**Solução:**
1. Verifique se a URL está correta: `https://web-production-34a3a.up.railway.app/api/...`
2. Certifique-se de que está usando `/api/` antes do endpoint
3. Verifique se o endpoint existe no Swagger: `https://web-production-34a3a.up.railway.app/api/docs/`

## 📚 Documentação da API

Acesse a documentação interativa:
- **Swagger:** https://web-production-34a3a.up.railway.app/api/docs/
- **ReDoc:** https://web-production-34a3a.up.railway.app/api/redoc/

## 🔗 Links Úteis

- **API Base:** https://web-production-34a3a.up.railway.app/api
- **Swagger Docs:** https://web-production-34a3a.up.railway.app/api/docs/
- **Railway Dashboard:** https://railway.app

