import { test, expect } from '@playwright/test'

/**
 * Este é um arquivo de exemplo para você entender como funciona
 * 
 * Estrutura básica:
 * - test('nome do teste', async ({ page }) => { ... })
 * - page = representa o navegador
 * - expect = assertions (verificações)
 */

test('exemplo: página inicial deve carregar', async ({ page }) => {
  // 1. Navegar para a página
  await page.goto('/')

  // 2. Verificar se algum elemento está na página
  // Aqui você pode procurar por texto, seletor CSS, etc
  await expect(page.getByText('Aluguel de Ferramentas')).toBeVisible()
})

test('exemplo: deve ter botão de login', async ({ page }) => {
  await page.goto('/')

  // Procurar por um botão com o texto "Entrar"
  const loginButton = page.getByRole('button', { name: 'Entrar' })
  
  // Verificar se o botão está visível
  await expect(loginButton).toBeVisible()
  
  // Verificar se o botão está habilitado
  await expect(loginButton).toBeEnabled()
})

