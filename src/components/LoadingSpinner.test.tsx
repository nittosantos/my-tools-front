import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('deve renderizar spinner', () => {
    render(<LoadingSpinner />)
    // O Loader2 do lucide-react renderiza um SVG
    const spinner = document.querySelector('svg')
    expect(spinner).toBeInTheDocument()
  })

  it('deve aplicar tamanho sm', () => {
    render(<LoadingSpinner size="sm" />)
    const spinner = document.querySelector('svg')
    expect(spinner).toHaveClass('h-4', 'w-4')
  })

  it('deve aplicar tamanho md por padrão', () => {
    render(<LoadingSpinner />)
    const spinner = document.querySelector('svg')
    expect(spinner).toHaveClass('h-8', 'w-8')
  })

  it('deve aplicar tamanho lg', () => {
    render(<LoadingSpinner size="lg" />)
    const spinner = document.querySelector('svg')
    expect(spinner).toHaveClass('h-12', 'w-12')
  })
})

