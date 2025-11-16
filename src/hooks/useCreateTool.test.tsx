import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCreateTool } from './useCreateTool'
import * as api from '@/lib/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCreateTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar ferramenta com sucesso', async () => {
    const mockTool = {
      id: 1,
      title: 'Nova Furadeira',
      description: 'Descrição',
      category: 'ferramentas_eletricas' as const,
      price_per_day: 100,
      available: true,
      owner: 1,
    }

    vi.mocked(api.default.post).mockResolvedValue({ data: mockTool })

    const { result } = renderHook(() => useCreateTool(), {
      wrapper: createWrapper(),
    })

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    result.current.mutate({
      title: 'Nova Furadeira',
      description: 'Descrição',
      category: 'ferramentas_eletricas',
      price_per_day: 100,
      image: file,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(api.default.post).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith('Ferramenta criada com sucesso!')
  })

  it('deve mostrar erro ao falhar criação', async () => {
    vi.mocked(api.default.post).mockRejectedValue({
      response: { data: { detail: 'Erro ao criar' } },
    })

    const { result } = renderHook(() => useCreateTool(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      title: 'Test',
      description: 'Test',
      category: 'outros',
      price_per_day: 10,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Erro ao criar')
  })
})

