# 🚀 Guia Completo de Deploy - Produção

Este guia explica como fazer deploy completo do sistema My Tools em produção usando:
- **Frontend (React)**: Vercel
- **Backend (Django)**: Render
- **Banco de Dados (PostgreSQL)**: Render

## 📋 Pré-requisitos

- Conta no [Render](https://render.com) (gratuita)
- Conta no [Vercel](https://vercel.com) (gratuita)
- Projeto backend Django no GitHub/GitLab/Bitbucket
- Projeto frontend React no GitHub/GitLab/Bitbucket

---

## 🔵 PARTE 1: Deploy do Backend (Django) no Render

### 1.1 Criar Banco de Dados PostgreSQL

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `my-tools-db` (ou o nome que preferir)
   - **Database**: `mytools` (ou o nome que preferir)
   - **User**: Será gerado automaticamente
   - **Region**: Escolha a mais próxima (ex: `Oregon (US West)`)
   - **PostgreSQL Version**: `16` (ou a mais recente)
   - **Plan**: **Free**
4. Clique em **"Create Database"**
5. **Anote as informações de conexão** que aparecerão:
   - `Internal Database URL`
   - `External Database URL` (para desenvolvimento local se precisar)

### 1.2 Preparar o Backend Django

No seu projeto Django, você precisa ter:

#### Arquivo `requirements.txt`:
```txt
Django>=4.2.0
djangorestframework
django-cors-headers
psycopg2-binary
gunicorn
python-decouple
whitenoise
```

#### Arquivo `Procfile` (na raiz do projeto):
```
web: gunicorn my_tools_backend.wsgi:application --bind 0.0.0.0:$PORT
```
*(Substitua `my_tools_backend` pelo nome do seu projeto Django)*

#### Arquivo `runtime.txt` (na raiz do projeto):
```
python-3.11.0
```
*(Use a versão do Python que você está usando)*

#### Configurações no `settings.py`:

```python
import os
from decouple import config

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='your-secret-key-here')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = [
    'my-tools-backend.onrender.com',  # Substitua pelo seu domínio Render
    'localhost',
    '127.0.0.1',
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Ou use a URL completa do banco (mais simples):
# DATABASES = {
#     'default': dj_database_url.config(
#         default=config('DATABASE_URL'),
#         conn_max_age=600
#     )
# }

# CORS - Permitir requisições do frontend
CORS_ALLOWED_ORIGINS = [
    "https://my-tools-front.vercel.app",  # Substitua pelo seu domínio Vercel
    "http://localhost:5173",  # Para desenvolvimento local
]

# Ou permitir todos (apenas para desenvolvimento/demo):
# CORS_ALLOW_ALL_ORIGINS = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files (se usar upload de imagens)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### 1.3 Criar Serviço Web no Render

1. No Render Dashboard, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub/GitLab
3. Configure o serviço:
   - **Name**: `my-tools-backend`
   - **Region**: Mesma do banco de dados
   - **Branch**: `main` (ou sua branch principal)
   - **Root Directory**: Deixe vazio (ou o caminho se seu Django estiver em subpasta)
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command**: 
     ```bash
     gunicorn my_tools_backend.wsgi:application --bind 0.0.0.0:$PORT
     ```
     *(Substitua `my_tools_backend` pelo nome do seu projeto)*

4. **Adicione as variáveis de ambiente** (Environment Variables):
   
   Clique em **"Advanced"** → **"Add Environment Variable"** e adicione:

   ```
   SECRET_KEY=sua-chave-secreta-super-segura-aqui
   DEBUG=False
   DATABASE_URL=<Cole aqui a Internal Database URL do passo 1.1>
   ```
   
   **OU** se preferir variáveis separadas:
   ```
   SECRET_KEY=sua-chave-secreta-super-segura-aqui
   DEBUG=False
   DB_NAME=mytools
   DB_USER=<user do banco>
   DB_PASSWORD=<password do banco>
   DB_HOST=<host do banco>
   DB_PORT=5432
   ```

   **Importante**: Use a **Internal Database URL** (não a External), pois o serviço web e o banco estão na mesma rede interna do Render.

5. Clique em **"Create Web Service"**

### 1.4 Executar Migrações

Após o primeiro deploy, você precisa executar as migrações:

1. No Render Dashboard, vá para seu serviço web
2. Clique na aba **"Shell"**
3. Execute:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

### 1.5 Verificar se Funcionou

1. Aguarde o deploy terminar (pode levar alguns minutos)
2. Acesse: `https://my-tools-backend.onrender.com/api/` (ou a URL que o Render forneceu)
3. Você deve ver a resposta da API ou uma página de erro do Django (mas não 404)

**Anote a URL do backend** - você precisará dela para configurar o frontend!

---

## 🟢 PARTE 2: Deploy do Frontend (React) na Vercel

### 2.1 Configurar Variáveis de Ambiente

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá para seu projeto → **Settings** → **Environment Variables**
3. Adicione:

   ```
   VITE_API_URL=https://my-tools-backend.onrender.com/api
   ```
   
   *(Substitua pela URL real do seu backend no Render)*

   **Importante**: 
   - Selecione **Production**, **Preview** e **Development**
   - **NÃO** adicione `VITE_USE_MSW=true` (queremos usar o backend real agora)

### 2.2 Fazer Deploy

Se já está conectado ao GitHub:
1. Faça push de qualquer mudança
2. A Vercel fará deploy automático

Se ainda não conectou:
1. Clique em **"Add New Project"**
2. Importe seu repositório
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Clique em **"Deploy"**

### 2.3 Criar arquivo `vercel.json` (Opcional mas Recomendado)

Crie um arquivo `vercel.json` na raiz do projeto frontend:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Isso resolve o problema de 404 em rotas diretas (como `/dashboard/received-rentals`).

### 2.4 Verificar se Funcionou

1. Aguarde o deploy terminar
2. Acesse a URL fornecida pela Vercel
3. Teste fazer login e navegar pela aplicação
4. Abra o Console do Navegador (F12) e verifique se as requisições estão indo para o backend do Render (não mais para `127.0.0.1:8000`)

---

## 🔧 PARTE 3: Ajustes Finais

### 3.1 Configurar CORS no Backend

Se ainda não configurou, adicione no `settings.py` do Django:

```python
INSTALLED_APPS = [
    # ... outros apps
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Deve estar no topo
    'django.middleware.security.SecurityMiddleware',
    # ... outros middlewares
]

# Permitir requisições do frontend
CORS_ALLOWED_ORIGINS = [
    "https://my-tools-front.vercel.app",  # URL do seu frontend na Vercel
    "http://localhost:5173",  # Para desenvolvimento local
]

# Se precisar permitir credenciais (cookies, auth headers)
CORS_ALLOW_CREDENTIALS = True
```

### 3.2 Verificar URLs da API

No frontend, verifique se todas as chamadas de API estão usando a variável `VITE_API_URL`:

```typescript
// src/lib/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  // ...
})
```

### 3.3 Testar Tudo

1. **Frontend**: Acesse a URL da Vercel
2. **Login**: Teste fazer login
3. **Ferramentas**: Teste listar, criar, editar, deletar
4. **Aluguéis**: Teste criar, aprovar, rejeitar
5. **Console**: Verifique se não há erros de CORS ou conexão

---

## 🐛 Troubleshooting

### Erro 404 no Backend

- Verifique se a URL está correta
- Verifique se o serviço web está rodando no Render
- Verifique os logs no Render Dashboard

### Erro de CORS

- Verifique se `CORS_ALLOWED_ORIGINS` inclui a URL do frontend
- Verifique se `corsheaders` está instalado e no `MIDDLEWARE`
- Verifique se a URL do frontend está exatamente correta (com/sem trailing slash)

### Erro de Conexão com Banco

- Verifique se está usando a **Internal Database URL** (não External)
- Verifique se as variáveis de ambiente estão corretas
- Verifique os logs do serviço web no Render

### Frontend não conecta ao Backend

- Verifique se `VITE_API_URL` está configurada na Vercel
- Verifique se o valor está correto (com `/api` no final se necessário)
- Faça um novo deploy após adicionar a variável

### Rotas diretas dão 404 no Frontend

- Crie o arquivo `vercel.json` com as regras de rewrite
- Faça um novo deploy

---

## 📊 Monitoramento

### Render Dashboard
- Veja logs em tempo real
- Veja uso de recursos
- Veja status do serviço

### Vercel Dashboard
- Veja analytics de visitas
- Veja logs de build
- Veja performance

---

## 💰 Custos

**Total: R$ 0,00** (100% gratuito)

- ✅ Vercel: Plano gratuito ilimitado
- ✅ Render: 750h/mês grátis (suficiente para projeto acadêmico)
- ✅ PostgreSQL: 1GB grátis (suficiente para projeto acadêmico)

**Limitações:**
- Backend pode "dormir" após 15min de inatividade (cold start de ~30s)
- Banco pode "dormir" após 90 dias sem uso
- Para projeto acadêmico/demo: **perfeito!**

---

## ✅ Checklist Final

- [ ] Backend Django deployado no Render
- [ ] Banco PostgreSQL criado no Render
- [ ] Migrações executadas
- [ ] Superuser criado
- [ ] CORS configurado
- [ ] Frontend deployado na Vercel
- [ ] `VITE_API_URL` configurada na Vercel
- [ ] `vercel.json` criado (para rotas)
- [ ] Testado login
- [ ] Testado CRUD de ferramentas
- [ ] Testado aluguéis
- [ ] Sem erros no console

---

**Pronto! Seu sistema está 100% em produção! 🎉**

