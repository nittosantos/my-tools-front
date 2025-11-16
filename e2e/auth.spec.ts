import { test, expect } from '@playwright/test'
import { login, clearAuth } from './helpers/auth'

/**
 * Testes de Autenticação
 * 
 * Estes testes verificam se o fluxo de login/logout funciona corretamente
 */

// Antes de cada teste, limpar o estado de autenticação
test.beforeEach(async ({ page }) => {
  await clearAuth(page)
})

test('deve fazer login com sucesso', async ({ page }) => {
  // 1. Ir para a página de login
  await page.goto('/login')

  // 2. Verificar se a página carregou corretamente
  await expect(page.getByText('Login')).toBeVisible()
  await expect(page.getByLabel('Usuário')).toBeVisible()
  await expect(page.getByLabel('Senha')).toBeVisible()

  // 3. Fazer login usando o helper (sem passar parâmetros = usa 'joao_silva' padrão)
  await login(page)

  // 4. Verificar se foi redirecionado para o dashboard
  await expect(page).toHaveURL(/\/dashboard/)
  
  // 5. Verificar se elementos do dashboard aparecem
  // Usar getByRole para ser mais específico e evitar múltiplos elementos
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Minhas Ferramentas' })).toBeVisible()
})

test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
  await page.goto('/login')

  // Tentar fazer login com credenciais inválidas
  await page.getByLabel('Usuário').fill('usuario_inexistente')
  await page.getByLabel('Senha').fill('senha_errada')
  await page.locator('button[type="submit"]').click()

  // Verificar que NÃO foi redirecionado (permanece na página de login)
  // Isso prova que o login falhou - comportamento principal do teste
  await expect(page).toHaveURL(/\/login/, { timeout: 3000 })
  
  // Verificar que aparece mensagem de erro (toast)
  // O Sonner renderiza toasts na região "Notifications"
  // Aguardar que o toast apareça - se não aparecer, o teste deve falhar
  const notificationsRegion = page.getByRole('region', { name: /notifications/i })
  await expect(
    notificationsRegion.getByText(/credenciais inválidas/i)
  ).toBeVisible({ timeout: 5000 })
})

test('deve fazer logout corretamente', async ({ page }) => {
  // 1. Fazer login primeiro
  await login(page)

  // 2. Verificar que está logado (dashboard visível)
  await expect(page).toHaveURL(/\/dashboard/)

  // 3. Fazer logout
  const logoutButton = page.getByRole('button', { name: /sair|logout/i })
  await expect(logoutButton).toBeVisible()
  await logoutButton.click()

  // 4. Aguardar que o logout processe - verificar que o botão "Entrar" aparece no header
  // Isso indica que o logout foi bem-sucedido (estado mudou)
  await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible({ timeout: 3000 })

  // 5. Verificar que não está mais autenticado
  // Tentar acessar dashboard deve redirecionar para login
  await page.goto('/dashboard/my-tools')
  await expect(page).toHaveURL(/\/login/)
})

test('deve redirecionar para login quando não autenticado', async ({ page }) => {
  // Limpar autenticação
  await clearAuth(page)

  // Tentar acessar uma rota protegida
  await page.goto('/dashboard/my-tools')

  // Deve redirecionar para login
  await expect(page).toHaveURL(/\/login/)
})

