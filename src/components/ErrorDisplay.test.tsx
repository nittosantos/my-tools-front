import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { ErrorDisplay } from './ErrorDisplay'

describe('ErrorDisplay', () => {
  it('deve renderizar com título e mensagem padrão', () => {
    render(<ErrorDisplay />)
    
    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument()
    expect(screen.getByText(/Ocorreu um erro ao carregar os dados/)).toBeInTheDocument()
  })

  it('deve renderizar com título e mensagem customizados', () => {
    render(
      <ErrorDisplay
        title="Erro customizado"
        message="Mensagem customizada"
      />
    )
    
    expect(screen.getByText('Erro customizado')).toBeInTheDocument()
    expect(screen.getByText('Mensagem customizada')).toBeInTheDocument()
  })

  it('deve mostrar botão de retry quando onRetry é fornecido', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    
    render(<ErrorDisplay onRetry={onRetry} />)
    
    const retryButton = screen.getByText('Tentar novamente')
    expect(retryButton).toBeInTheDocument()
    
    await user.click(retryButton)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('não deve mostrar botão de retry quando onRetry não é fornecido', () => {
    render(<ErrorDisplay />)
    
    expect(screen.queryByText('Tentar novamente')).not.toBeInTheDocument()
  })
})

