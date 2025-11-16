import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { ImageUpload } from './ImageUpload'

describe('ImageUpload', () => {
  beforeEach(() => {
    // Limpar URLs criadas
    URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    URL.revokeObjectURL = vi.fn()
  })

  it('deve renderizar botão de selecionar quando não há imagem', () => {
    const onChange = vi.fn()
    render(<ImageUpload value={null} onChange={onChange} />)

    expect(screen.getByText('Selecionar imagem')).toBeInTheDocument()
    expect(screen.getByText(/PNG, JPG ou WEBP até 5MB/)).toBeInTheDocument()
  })

  it('deve mostrar preview quando há imagem', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const onChange = vi.fn()
    render(<ImageUpload value={file} onChange={onChange} />)

    const img = screen.getByAltText('Preview')
    expect(img).toBeInTheDocument()
    // O botão não tem aria-label, então vamos buscar pelo tipo e posição
    const buttons = screen.getAllByRole('button')
    const removeButton = buttons.find(btn => btn.type === 'button' && btn.className.includes('destructive'))
    expect(removeButton).toBeInTheDocument()
  })

  it('deve chamar onChange ao selecionar arquivo válido', async () => {
    const onChange = vi.fn()
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

    render(<ImageUpload value={null} onChange={onChange} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    // Simular mudança de arquivo diretamente
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    input.files = dataTransfer.files
    
    // Criar evento com target correto usando Object.defineProperty
    await act(async () => {
      const event = new Event('change', { bubbles: true })
      Object.defineProperty(event, 'target', {
        writable: false,
        value: input,
      })
      input.dispatchEvent(event)
    })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(file)
    })
  })

  it('deve mostrar erro para formato inválido', async () => {
    const onChange = vi.fn()
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

    render(<ImageUpload value={null} onChange={onChange} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    // Simular mudança de arquivo diretamente
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    input.files = dataTransfer.files
    
    // Criar evento com target correto usando Object.defineProperty
    await act(async () => {
      const event = new Event('change', { bubbles: true })
      Object.defineProperty(event, 'target', {
        writable: false,
        value: input,
      })
      input.dispatchEvent(event)
    })

    await waitFor(() => {
      expect(screen.getByText(/Formato inválido/)).toBeInTheDocument()
    }, { timeout: 2000 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('deve mostrar erro para arquivo muito grande', async () => {
    const onChange = vi.fn()
    // Criar arquivo de 6MB (maior que o limite de 5MB)
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    })

    render(<ImageUpload value={null} onChange={onChange} maxSizeMB={5} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    // Simular mudança de arquivo diretamente
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(largeFile)
    input.files = dataTransfer.files
    
    // Criar evento com target correto usando Object.defineProperty
    await act(async () => {
      const event = new Event('change', { bubbles: true })
      Object.defineProperty(event, 'target', {
        writable: false,
        value: input,
      })
      input.dispatchEvent(event)
    })

    await waitFor(() => {
      expect(screen.getByText(/Arquivo muito grande/)).toBeInTheDocument()
    }, { timeout: 2000 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('deve remover imagem ao clicar no botão remover', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

    render(<ImageUpload value={file} onChange={onChange} />)

    // Buscar o botão de remover (botão destructive)
    const buttons = screen.getAllByRole('button')
    const removeButton = buttons.find(btn => btn.type === 'button' && btn.className.includes('destructive'))
    expect(removeButton).toBeInTheDocument()
    
    if (removeButton) {
      await user.click(removeButton)
      expect(onChange).toHaveBeenCalledWith(null)
    }
  })

  it('deve retornar early quando não há arquivo selecionado', async () => {
    const onChange = vi.fn()
    render(<ImageUpload value={null} onChange={onChange} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    // Simular evento sem arquivo (linha 30: if (!file) return)
    await act(async () => {
      const event = new Event('change', { bubbles: true })
      Object.defineProperty(event, 'target', {
        writable: false,
        value: { ...input, files: null },
      })
      input.dispatchEvent(event)
    })

    // onChange não deve ser chamado quando não há arquivo
    expect(onChange).not.toHaveBeenCalled()
  })
})

