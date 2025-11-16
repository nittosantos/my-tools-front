import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { CreateToolDialog } from './CreateToolDialog'
import * as useCreateTool from '@/hooks/useCreateTool'
import * as useUpdateTool from '@/hooks/useUpdateTool'

// Mock dos hooks
vi.mock('@/hooks/useCreateTool', () => ({
  useCreateTool: vi.fn(),
}))

vi.mock('@/hooks/useUpdateTool', () => ({
  useUpdateTool: vi.fn(),
}))

describe('CreateToolDialog', () => {
  const mockCreateTool = vi.fn()
  const mockUpdateTool = vi.fn()
  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateTool.useCreateTool).mockReturnValue({
      mutate: mockCreateTool,
      isPending: false,
    } as any)
    vi.mocked(useUpdateTool.useUpdateTool).mockReturnValue({
      mutate: mockUpdateTool,
      isPending: false,
    } as any)
  })

  it('deve renderizar dialog de criação quando tool não é fornecido', () => {
    render(
      <CreateToolDialog open={true} onOpenChange={mockOnOpenChange} />
    )

    expect(screen.getByText('Criar Nova Ferramenta')).toBeInTheDocument()
    expect(screen.getByText(/Preencha os dados da ferramenta/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar' })).toBeInTheDocument()
  })

  it('deve renderizar dialog de edição quando tool é fornecido', () => {
    const tool = {
      id: 1,
      title: 'Furadeira',
      description: 'Furadeira potente',
      category: 'ferramentas_eletricas' as const,
      price_per_day: 50,
      image_url: 'http://example.com/image.jpg',
      available: true,
      owner: 1,
    }

    render(
      <CreateToolDialog open={true} onOpenChange={mockOnOpenChange} tool={tool} />
    )

    expect(screen.getByText('Editar Ferramenta')).toBeInTheDocument()
    expect(screen.getByText(/Atualize as informações/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('deve preencher formulário com dados da tool em modo edição', () => {
    const tool = {
      id: 1,
      title: 'Furadeira',
      description: 'Furadeira potente',
      category: 'ferramentas_eletricas' as const,
      price_per_day: 50,
      image_url: 'http://example.com/image.jpg',
      available: true,
      owner: 1,
    }

    render(
      <CreateToolDialog open={true} onOpenChange={mockOnOpenChange} tool={tool} />
    )

    const titleInput = screen.getByLabelText('Título') as HTMLInputElement
    expect(titleInput.value).toBe('Furadeira')
  })

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup()
    render(
      <CreateToolDialog open={true} onOpenChange={mockOnOpenChange} />
    )

    const submitButton = screen.getByRole('button', { name: 'Criar' })
    await user.click(submitButton)

    // Formulário deve mostrar erros de validação
    await waitFor(() => {
      expect(mockCreateTool).not.toHaveBeenCalled()
    })
  })

  it('deve permitir preencher campos do formulário de criação', async () => {
    const user = userEvent.setup()
    render(
      <CreateToolDialog open={true} onOpenChange={mockOnOpenChange} />
    )

    await user.type(screen.getByLabelText('Título'), 'Nova Furadeira')
    await user.type(screen.getByLabelText('Descrição'), 'Descrição da furadeira com mais de 10 caracteres')
    
    const priceInput = screen.getByLabelText('Preço por Dia (R$)') as HTMLInputElement
    await user.clear(priceInput)
    await user.type(priceInput, '50')

    // Verificar se os valores foram preenchidos
    await waitFor(() => {
      expect(screen.getByDisplayValue('Nova Furadeira')).toBeInTheDocument()
      // Verificar o valor do input diretamente, pois pode ser formatado diferente
      expect(priceInput.value).toBeTruthy()
    })
    
    // Verificar se o botão de submit existe
    expect(screen.getByRole('button', { name: 'Criar' })).toBeInTheDocument()
  })

  it('deve permitir editar campos do formulário em modo edição', async () => {
    const user = userEvent.setup()
    const tool = {
      id: 1,
      title: 'Furadeira',
      description: 'Furadeira potente para uso profissional',
      category: 'ferramentas_eletricas' as const,
      price_per_day: 50,
      image_url: 'http://example.com/image.jpg',
      available: true,
      owner: 1,
    }

    render(
      <CreateToolDialog open={true} onOpenChange={mockOnOpenChange} tool={tool} />
    )

    // Aguardar o formulário ser preenchido com os dados da tool
    await waitFor(() => {
      expect(screen.getByDisplayValue('Furadeira')).toBeInTheDocument()
    })

    const titleInput = screen.getByLabelText('Título')
    await user.clear(titleInput)
    await user.type(titleInput, 'Furadeira Atualizada')

    // Verificar se o valor foi atualizado
    await waitFor(() => {
      expect(screen.getByDisplayValue('Furadeira Atualizada')).toBeInTheDocument()
    })

    // Verificar se o botão de submit existe
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('deve fechar dialog ao clicar em cancelar', async () => {
    const user = userEvent.setup()
    render(
      <CreateToolDialog open={true} onOpenChange={mockOnOpenChange} />
    )

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
    await user.click(cancelButton)

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('deve mostrar loading quando está criando', () => {
    vi.mocked(useCreateTool.useCreateTool).mockReturnValue({
      mutate: mockCreateTool,
      isPending: true,
    } as any)

    render(
      <CreateToolDialog open={true} onOpenChange={mockOnOpenChange} />
    )

    expect(screen.getByText('Criando...')).toBeInTheDocument()
  })

  it('deve mostrar loading quando está atualizando', () => {
    const tool = {
      id: 1,
      title: 'Furadeira',
      description: 'Furadeira potente',
      category: 'ferramentas_eletricas' as const,
      price_per_day: 50,
      image_url: 'http://example.com/image.jpg',
      available: true,
      owner: 1,
    }

    vi.mocked(useUpdateTool.useUpdateTool).mockReturnValue({
      mutate: mockUpdateTool,
      isPending: true,
    } as any)

    render(
      <CreateToolDialog open={true} onOpenChange={mockOnOpenChange} tool={tool} />
    )

    expect(screen.getByText('Salvando...')).toBeInTheDocument()
  })
})

