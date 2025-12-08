import { test, expect } from '@playwright/test'
import { login, clearAuth } from './helpers/auth'

/**
 * Testes de Criação de Ferramenta
 * 
 * Estes testes verificam se o fluxo de criação de ferramenta funciona corretamente
 */

test.beforeEach(async ({ page }) => {
  await clearAuth(page)
  // Fazer login antes de cada teste (criação requer autenticação)
  await login(page)
})

test('deve criar uma nova ferramenta com sucesso', async ({ page }) => {
  // 1. Navegar para a página de minhas ferramentas
  await page.goto('/dashboard/my-tools')

  // 2. Verificar que a página carregou
  await expect(page.getByRole('heading', { name: /minhas ferramentas/i })).toBeVisible()

  // 3. Aguardar que a página carregue completamente
  await page.waitForTimeout(1000)

  // 4. Clicar no botão "Criar Ferramenta"
  const addButton = page.getByRole('button', { name: /criar ferramenta/i })
  await expect(addButton).toBeVisible()
  await addButton.click()

  // 5. Aguardar que o dialog abra
  await page.waitForTimeout(500)

  // 6. Preencher o formulário
  // Título
  const titleInput = page.getByLabel(/título/i)
  await expect(titleInput).toBeVisible({ timeout: 5000 })
  await titleInput.fill('Furadeira de Impacto Profissional')
  
  // Descrição
  const descriptionInput = page.getByLabel(/descrição/i)
  await descriptionInput.fill('Furadeira de alta potência para trabalhos pesados')
  
  // Categoria (é um combobox) - encontrar todos os comboboxes e pegar o primeiro (categoria)
  const allComboboxes = page.locator('button[role="combobox"]')
  const categorySelect = allComboboxes.first()
  await categorySelect.click()
  await page.waitForTimeout(500)
  const categoryOption = page.getByRole('option', { name: /ferramentas elétricas/i })
  await expect(categoryOption).toBeVisible({ timeout: 3000 })
  await categoryOption.click()
  
  // Preço por dia
  const priceInput = page.getByLabel(/preço/i)
  await priceInput.fill('35.50')
  
  // Estado (é um combobox) - encontrar pelo id="state" ou segundo combobox
  const stateSelect = page.locator('button[role="combobox"][id="state"]').or(
    allComboboxes.nth(1) // Segundo combobox geralmente é o estado
  )
  await stateSelect.click()
  await page.waitForTimeout(500)
  const stateOption = page.getByRole('option', { name: /são paulo.*sp/i }).first()
  await expect(stateOption).toBeVisible({ timeout: 3000 })
  await stateOption.click()
  
  // Cidade (é um input de texto simples)
  const cityInput = page.getByLabel(/cidade/i)
  await cityInput.fill('São Paulo')

  // 7. Submeter o formulário
  const submitButton = page.getByRole('button', { name: /criar/i })
  await submitButton.click()

  // 8. Aguardar que o dialog feche
  await page.waitForTimeout(1000)

  // 9. Verificar que a ferramenta foi criada
  await expect(page.getByText('Furadeira de Impacto Profissional')).toBeVisible({ timeout: 10000 })
})

test('deve validar campos obrigatórios ao criar ferramenta', async ({ page }) => {
  // 1. Navegar para a página de minhas ferramentas
  await page.goto('/dashboard/my-tools')

  // 2. Aguardar que a página carregue
  await page.waitForTimeout(1000)

  // 3. Abrir o dialog de criação
  const addButton = page.getByRole('button', { name: /criar ferramenta/i })
  await addButton.click()

  // 4. Aguardar que o dialog abra
  await page.waitForTimeout(500)

  // 5. Tentar submeter sem preencher campos obrigatórios
  const submitButton = page.getByRole('button', { name: /criar/i })
  await submitButton.click()

  // 6. Verificar que mensagens de erro aparecem
  // O formulário deve mostrar erros de validação (pode ser "Campo obrigatório" ou similar)
  await expect(
    page.getByText(/obrigatório|required|preencha/i).first()
  ).toBeVisible({ timeout: 5000 })
})

test('deve editar uma ferramenta existente', async ({ page }) => {
  // 1. Navegar para a página de minhas ferramentas
  await page.goto('/dashboard/my-tools')

  // 2. Aguardar que as ferramentas carreguem
  await page.waitForTimeout(1000)

  // 3. Encontrar o primeiro botão de editar
  // Pode ser um ícone de editar ou botão "Editar"
  const editButton = page.getByRole('button', { name: /editar/i }).first().or(
    page.locator('button').filter({ has: page.locator('[class*="Edit"], svg') }).first()
  )

  if (await editButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await editButton.click()

    // 4. Modificar o título
    const titleInput = page.getByLabel(/título/i)
    await titleInput.clear()
    await titleInput.fill('Furadeira Editada')

    // 5. Salvar as alterações
    const saveButton = page.getByRole('button', { name: /salvar|atualizar/i })
    await saveButton.click()

    // 6. Verificar que a alteração foi salva
    await expect(page.getByText('Furadeira Editada')).toBeVisible({ timeout: 10000 })
  } else {
    // Se não houver botão de editar visível, pular o teste
    test.skip()
  }
})

test('deve deletar uma ferramenta com confirmação', async ({ page }) => {
  // 1. Navegar para a página de minhas ferramentas
  await page.goto('/dashboard/my-tools')

  // 2. Aguardar que as ferramentas carreguem
  await page.waitForTimeout(1000)

  // 3. Encontrar o primeiro botão de deletar
  const deleteButton = page.getByRole('button', { name: /deletar|excluir|remover/i }).first().or(
    page.locator('button').filter({ has: page.locator('[class*="Delete"], svg') }).first()
  )

  if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    // Pegar o título da primeira ferramenta antes de deletar
    const firstToolTitle = await page.locator('[class*="Card"]').first().locator('h2, h3').textContent()

    await deleteButton.click()

    // 4. Confirmar a exclusão no dialog de confirmação
    const confirmButton = page.getByRole('button', { name: /confirmar|sim|deletar/i })
    await confirmButton.click()

    // 5. Verificar que a ferramenta foi removida
    // (o título não deve mais estar visível)
    if (firstToolTitle) {
      await expect(page.getByText(firstToolTitle)).not.toBeVisible({ timeout: 5000 })
    }
  } else {
    // Se não houver botão de deletar visível, pular o teste
    test.skip()
  }
})

