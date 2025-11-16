import { Page } from '@playwright/test'

/**
 * Helper para fazer login no sistema
 * 
 * Esta função simula um usuário fazendo login:
 * 1. Vai para a página de login
 * 2. Preenche username e password
 * 3. Clica no botão de submit
 * 4. Espera redirecionar para o dashboard
 * 
 * @param page - A página do Playwright
 * @param username - Nome de usuário (padrão: 'testuser')
 * @param password - Senha (padrão: 'password123')
 */
export async function login(
  page: Page,
  username: string = 'joao_silva', // Usar usuário válido dos mocks (não 'testuser')
  password: string = 'password123'
) {
  // 1. Navegar para a página de login
  await page.goto('/login')

  // 2. Preencher o formulário
  // getByLabel busca pelo label do campo (mais confiável que seletor CSS)
  await page.getByLabel('Usuário').fill(username)
  await page.getByLabel('Senha').fill(password)

  // 3. Clicar no botão de submit do formulário e aguardar navegação
  // Usar Promise.all para aguardar tanto o clique quanto a navegação
  await Promise.all([
    page.waitForURL('/dashboard/**', { timeout: 10000 }), // Aguardar navegação
    page.locator('button[type="submit"]').click(), // Clicar no botão
  ])
}

/**
 * Helper para fazer logout
 */
export async function logout(page: Page) {
  // Procurar pelo botão de logout (pode estar no header)
  // Vamos procurar por um botão com texto "Sair" ou link com "logout"
  const logoutButton = page.getByRole('button', { name: /sair|logout/i })
  
  if (await logoutButton.isVisible()) {
    await logoutButton.click()
    // Esperar redirecionar para home ou login
    await page.waitForURL(/\/(login|$)/, { timeout: 3000 })
  }
}

/**
 * Helper para limpar estado de autenticação
 * Útil para garantir que cada teste comece "limpo"
 */
export async function clearAuth(page: Page) {
  // Limpar localStorage (onde o token fica salvo)
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.clear()
  })
}

