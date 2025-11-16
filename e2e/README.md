# 🎭 Testes E2E - Guia Rápido

## O que foi configurado?

1. ✅ **Playwright instalado** - Ferramenta para testes E2E
2. ✅ **Configuração criada** - `playwright.config.ts`
3. ✅ **Scripts adicionados** - Comandos para rodar testes
4. ✅ **Exemplos criados** - Testes básicos de autenticação

## Como começar?

### Passo 1: Instalar dependências

```bash
cd my_tools_front
npm install
npx playwright install
```

O comando `npx playwright install` baixa os navegadores (Chrome, Firefox, etc) que o Playwright usa.

### Passo 2: Rodar o servidor de desenvolvimento

**IMPORTANTE**: Os testes E2E precisam do servidor rodando!

```bash
# Em um terminal, rode:
npm run dev
```

Deixe esse terminal aberto. O servidor deve estar em `http://localhost:5173`.

### Passo 3: Rodar os testes

Em **outro terminal**:

```bash
# Modo normal (sem abrir navegador - mais rápido)
npm run test:e2e

# Com navegador visível (útil para ver o que está acontecendo)
npm run test:e2e:headed

# Interface gráfica (MUITO útil para debug!)
npm run test:e2e:ui
```

## Estrutura de Arquivos

```
e2e/
  ├── README.md              # Este arquivo
  ├── GUIA_TESTES_E2E.md     # Guia completo e detalhado
  ├── example.spec.ts        # Exemplos básicos
  ├── auth.spec.ts           # Testes de login/logout
  └── helpers/
      └── auth.ts            # Funções auxiliares (login, logout)
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run test:e2e` | Roda todos os testes (modo headless) |
| `npm run test:e2e:headed` | Roda com navegador visível |
| `npm run test:e2e:ui` | Abre interface gráfica para rodar/debugar testes |
| `npm run test:e2e:report` | Abre relatório HTML dos últimos testes |

## Próximos Testes a Criar

1. ✅ Autenticação (login/logout) - **JÁ CRIADO**
2. ⏭️ CRUD de Ferramentas (criar, editar, deletar)
3. ⏭️ Fluxo de Aluguel (selecionar ferramenta → alugar)
4. ⏭️ Aprovação de Aluguéis (owner aprovar/rejeitar)

## Dicas

- Use `npm run test:e2e:ui` para aprender - é muito visual!
- Se um teste falhar, veja screenshots em `test-results/`
- Leia `GUIA_TESTES_E2E.md` para entender melhor como funciona

