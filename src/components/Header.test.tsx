import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'
import * as AuthContext from '@/contexts/AuthContext'

// Mock do AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

// Mock do TanStack Router Link, useLocation e useNavigate
const mockUseLocation = vi.fn(() => ({
  pathname: '/',
}))

const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    Link: ({ to, children, className, ...props }: any) => (
      <a href={to} className={className} {...props}>
        {children}
      </a>
    ),
    useLocation: () => mockUseLocation(),
    useNavigate: () => mockNavigate,
  }
})

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Resetar mockUseLocation para padrão
    mockUseLocation.mockReturnValue({ pathname: '/' })
  })

  it('deve mostrar botão "Entrar" quando não autenticado e não estiver na página de login', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' })
    
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    render(<Header />)

    expect(screen.getByText('Entrar')).toBeInTheDocument()
    expect(screen.queryByText('Minhas Ferramentas')).not.toBeInTheDocument()
  })

  it('deve mostrar links do dashboard quando autenticado', async () => {
    const user = userEvent.setup()
    
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, username: 'testuser', email: 'test@example.com' },
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    render(<Header />)

    // O nome do usuário deve estar visível
    expect(screen.getByText('testuser')).toBeInTheDocument()
    
    // Abrir o dropdown clicando no botão que contém o avatar
    // O botão contém o texto "testuser", então podemos encontrá-lo assim
    const avatarButton = screen.getByText('testuser').closest('button')
    if (avatarButton) {
      await user.click(avatarButton)
    }

    // Agora os links devem estar visíveis
    expect(screen.getByText('Minhas Ferramentas')).toBeInTheDocument()
    expect(screen.getByText('Meus Aluguéis')).toBeInTheDocument()
    expect(screen.getByText('Aluguéis Recebidos')).toBeInTheDocument()
    expect(screen.getByText('Sair')).toBeInTheDocument()
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument()
  })

  it('não deve mostrar botão "Entrar" na página de login', () => {
    mockUseLocation.mockReturnValue({ pathname: '/login' })

    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })

    render(<Header />)

    expect(screen.queryByText('Entrar')).not.toBeInTheDocument()
  })
})

