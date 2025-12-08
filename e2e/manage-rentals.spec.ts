import { test, expect } from '@playwright/test'
import { login, clearAuth } from './helpers/auth'

/**
 * Testes de Gerenciamento de Aluguéis Recebidos
 * 
 * Estes testes verificam se o fluxo de aprovação/rejeição de aluguéis funciona corretamente
 */

test.beforeEach(async ({ page }) => {
  await clearAuth(page)
  // Fazer login como joao_silva (que tem ferramentas)
  await login(page, 'joao_silva')
})

test('deve aprovar um aluguel pendente', async ({ page }) => {
  // 1. Navegar para a página de aluguéis recebidos
  await page.goto('/dashboard/received-rentals')

  // 2. Verificar que a página carregou
  await expect(page.getByRole('heading', { name: /aluguéis recebidos/i })).toBeVisible({ timeout: 5000 })

  // 3. Aguardar que os aluguéis carreguem
  await page.waitForTimeout(2000)

  // 4. Encontrar o primeiro botão "Aprovar" de um aluguel pendente
  const approveButton = page.getByRole('button', { name: /aprovar/i }).first()

  if (await approveButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await approveButton.click()

    // 5. Aguardar que a ação seja processada
    await page.waitForTimeout(1000)

    // 6. Verificar que o aluguel foi aprovado
    // Pode mostrar toast de sucesso ou atualizar o status no badge
    // Usar .first() para evitar strict mode violation
    await expect(
      page.getByText(/aprovado|sucesso/i).first().or(
        page.locator('[class*="Badge"]').filter({ hasText: /aprovado/i }).first()
      )
    ).toBeVisible({ timeout: 5000 })
  } else {
    // Se não houver aluguéis pendentes, pular o teste
    test.skip()
  }
})

test('deve rejeitar um aluguel pendente', async ({ page }) => {
  // 1. Navegar para a página de aluguéis recebidos
  await page.goto('/dashboard/received-rentals')

  // 2. Verificar que a página carregou
  await expect(page.getByRole('heading', { name: /aluguéis recebidos/i })).toBeVisible({ timeout: 5000 })

  // 3. Aguardar que os aluguéis carreguem
  await page.waitForTimeout(2000)

  // 4. Encontrar o primeiro botão "Rejeitar" de um aluguel pendente
  const rejectButton = page.getByRole('button', { name: /rejeitar/i }).first()

  if (await rejectButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await rejectButton.click()

    // 5. Confirmar a rejeição se houver dialog de confirmação
    await page.waitForTimeout(500)
    const confirmButton = page.getByRole('button', { name: /confirmar|sim/i })
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click()
    }

    // 6. Aguardar que a ação seja processada
    await page.waitForTimeout(1000)

    // 7. Verificar que o aluguel foi rejeitado
    // Usar .first() para evitar strict mode violation
    await expect(
      page.getByText(/rejeitado|sucesso/i).first().or(
        page.locator('[class*="Badge"]').filter({ hasText: /rejeitado/i }).first()
      )
    ).toBeVisible({ timeout: 5000 })
  } else {
    // Se não houver aluguéis pendentes, pular o teste
    test.skip()
  }
})

test('deve visualizar lista de meus aluguéis', async ({ page }) => {
  // 1. Navegar para a página de meus aluguéis
  await page.goto('/dashboard/my-rentals')

  // 2. Verificar que a página carregou
  await expect(page.getByRole('heading', { name: /meus aluguéis/i })).toBeVisible({ timeout: 5000 })

  // 3. Verificar se há tabs e selecionar a tab "Aluguéis que Fiz" (tab padrão)
  const myRentalsTab = page.getByRole('button', { name: /aluguéis que fiz/i })
  if (await myRentalsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
    // Verificar se já está selecionada (variant="default")
    const isSelected = await myRentalsTab.evaluate((el) => {
      return el.getAttribute('data-state') === 'active' || el.classList.contains('bg-primary')
    }).catch(() => false)
    
    if (!isSelected) {
      await myRentalsTab.click()
    }
  }

  // 4. Aguardar que os aluguéis carreguem
  await page.waitForTimeout(2000)

  // 5. Verificar que a página está renderizada corretamente
  await page.waitForTimeout(1000)
  
  // Verificar elementos básicos da página
  const hasHeading = await page.getByRole('heading', { name: /meus aluguéis/i }).isVisible({ timeout: 3000 }).catch(() => false)
  const hasTabs = await page.getByRole('button', { name: /aluguéis que fiz/i }).isVisible({ timeout: 2000 }).catch(() => false)
  
  // Verificar se há aluguéis ou mensagem de nenhum aluguel
  const cards = page.locator('[class*="Card"]')
  const cardCount = await cards.count()
  const hasRentals = cardCount > 0
  const hasNoRentalsMessage = await page.getByText(/nenhum aluguel realizado|nenhuma solicitação recebida/i).isVisible({ timeout: 2000 }).catch(() => false)
  
  // A página deve estar funcionando se tem heading, tabs E (aluguéis OU mensagem de nenhum)
  expect(hasHeading && hasTabs && (hasRentals || hasNoRentalsMessage)).toBeTruthy()
})

test('deve visualizar detalhes de um aluguel', async ({ page }) => {
  // 1. Navegar para a página de meus aluguéis
  await page.goto('/dashboard/my-rentals')

  // 2. Verificar se há tabs e selecionar a tab "Aluguéis que Fiz"
  const myRentalsTab = page.getByRole('button', { name: /aluguéis que fiz/i })
  if (await myRentalsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
    const isSelected = await myRentalsTab.evaluate((el) => {
      return el.getAttribute('data-state') === 'active' || el.classList.contains('bg-primary')
    }).catch(() => false)
    
    if (!isSelected) {
      await myRentalsTab.click()
    }
  }

  // 3. Aguardar que os aluguéis carreguem
  await page.waitForTimeout(2000)

  // 4. Verificar se há aluguéis na página
  const firstRental = page.locator('[class*="Card"]').first()
  
  if (await firstRental.isVisible({ timeout: 5000 }).catch(() => false)) {
    // 5. Verificar que os detalhes estão visíveis no card
    // (título da ferramenta, datas, preço, status)
    await expect(
      firstRental.getByText(/ferramenta|data|preço|status|pendente|aprovado|rejeitado/i).first()
    ).toBeVisible({ timeout: 3000 })
  } else {
    // Se não houver aluguéis, pular o teste
    test.skip()
  }
})

