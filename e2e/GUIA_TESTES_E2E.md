# 📚 Guia de Testes E2E com Playwright

## O que são Testes E2E?

**E2E = End-to-End (Ponta a Ponta)**

Testes E2E simulam um **usuário real** usando sua aplicação. Eles:
- Abrem um navegador real (Chrome, Firefox, Safari)
- Clicam em botões, preenchem formulários, navegam entre páginas
- Verificam se tudo funciona como esperado

### Diferença entre Testes Unitários e E2E

| Testes Unitários (Vitest) | Testes E2E (Playwright) |
|---------------------------|-------------------------|
| Testam **partes isoladas** (componentes, funções) | Testam **fluxos completos** (usuário usando o app) |
| Rápidos (milissegundos) | Mais lentos (segundos) |
| Não precisam de navegador | Precisam de navegador real |
| Exemplo: "O botão chama a função X?" | Exemplo: "O usuário consegue fazer login e criar uma ferramenta?" |

## Como Funciona o Playwright?

### 1. Estrutura de um Teste

```typescript
import { test, expect } from '@playwright/test'

test('nome do teste', async ({ page }) => {
  // page = representa o navegador
  
  // 1. Navegar para uma página
  await page.goto('/login')
  
  // 2. Interagir com elementos
  await page.fill('input[name="username"]', 'joao')
  await page.click('button:has-text("Entrar")')
  
  // 3. Verificar resultados
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText('Bem-vindo')).toBeVisible()
})
```

### 2. Principais Comandos

#### Navegação
- `page.goto('/url')` - Ir para uma página
- `page.goBack()` - Voltar
- `page.reload()` - Recarregar

#### Encontrar Elementos
- `page.getByText('Texto')` - Por texto visível
- `page.getByRole('button', { name: 'Entrar' })` - Por role (button, link, etc)
- `page.locator('css-selector')` - Por seletor CSS
- `page.getByLabel('Usuário')` - Por label de formulário

#### Interações
- `page.click('seletor')` - Clicar
- `page.fill('seletor', 'texto')` - Preencher input
- `page.selectOption('seletor', 'valor')` - Selecionar em dropdown
- `page.check('checkbox')` - Marcar checkbox

#### Verificações (Assertions)
- `expect(page).toHaveURL('/url')` - Verificar URL
- `expect(element).toBeVisible()` - Verificar se está visível
- `expect(element).toHaveText('texto')` - Verificar texto
- `expect(element).toBeEnabled()` - Verificar se está habilitado

### 3. Aguardar Elementos

O Playwright **automaticamente espera** elementos aparecerem, mas às vezes você precisa esperar explicitamente:

```typescript
// Esperar elemento aparecer
await page.waitForSelector('seletor')

// Esperar navegação
await page.waitForURL('/dashboard')

// Esperar texto aparecer
await page.waitForSelector('text=Bem-vindo')
```

## Como Rodar os Testes?

### 1. Instalar Playwright (primeira vez)

```bash
npm install
npx playwright install
```

Isso instala os navegadores (Chrome, Firefox, etc) que o Playwright usa.

### 2. Rodar Testes

```bash
# Rodar todos os testes (modo headless - sem abrir navegador)
npm run test:e2e

# Rodar com navegador visível (útil para ver o que está acontecendo)
npm run test:e2e:headed

# Rodar com interface gráfica (muito útil para debug!)
npm run test:e2e:ui

# Ver relatório HTML dos últimos testes
npm run test:e2e:report
```

### 3. Antes de Rodar

⚠️ **IMPORTANTE**: Você precisa ter o servidor de desenvolvimento rodando!

```bash
# Terminal 1: Rodar o frontend
npm run dev

# Terminal 2: Rodar os testes
npm run test:e2e
```

## Estrutura de Arquivos

```
e2e/
  ├── example.spec.ts          # Exemplo básico
  ├── auth.spec.ts             # Testes de autenticação
  ├── tools.spec.ts            # Testes de CRUD de ferramentas
  ├── rentals.spec.ts          # Testes de aluguéis
  └── helpers/
      └── auth.ts              # Funções auxiliares (ex: login)
```

## Dicas Importantes

### 1. Testes Devem Ser Independentes
Cada teste deve poder rodar sozinho. Não dependa de outros testes.

### 2. Limpar Estado Entre Testes
Use `beforeEach` para limpar localStorage, cookies, etc:

```typescript
test.beforeEach(async ({ page }) => {
  // Limpar localStorage antes de cada teste
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})
```

### 3. Usar Helpers
Crie funções auxiliares para ações repetidas:

```typescript
// helpers/auth.ts
export async function login(page, username = 'joao', password = 'senha123') {
  await page.goto('/login')
  await page.fill('input[name="username"]', username)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard')
}
```

### 4. Debugging
Se um teste falhar:
- Use `npm run test:e2e:ui` para ver o que aconteceu
- Use `page.pause()` no código para pausar e inspecionar
- Veja screenshots em `test-results/`

## Próximos Passos

1. ✅ Instalar Playwright
2. ✅ Configurar `playwright.config.ts`
3. ⏭️ Criar testes básicos (login, navegação)
4. ⏭️ Criar testes de CRUD (ferramentas)
5. ⏭️ Criar testes de fluxos completos (aluguel)

