import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUpdateTool } from './useUpdateTool'
import * as api from '@/lib/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'

vi.mock('@/lib/api', () => ({
  default: {
    patch: vi.fn(),
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

describe('useUpdateTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve atualizar ferramenta com sucesso', async () => {
    const mockTool = {
      id: 1,
      title: 'Furadeira Atualizada',
      description: 'Descrição atualizada',
      category: 'ferramentas_eletricas' as const,
      price_per_day: 150,
      available: true,
      owner: 1,
    }

    vi.mocked(api.default.patch).mockResolvedValue({ data: mockTool })

    const { result } = renderHook(() => useUpdateTool(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      id: 1,
      title: 'Furadeira Atualizada',
      description: 'Descrição atualizada',
      category: 'ferramentas_eletricas',
      price_per_day: 150,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(api.default.patch).toHaveBeenCalledWith('/tools/1/', {
      title: 'Furadeira Atualizada',
      description: 'Descrição atualizada',
      category: 'ferramentas_eletricas',
      price_per_day: 150,
    })
    expect(toast.success).toHaveBeenCalledWith('Ferramenta atualizada com sucesso!')
  })

  it('deve mostrar erro ao falhar atualização', async () => {
    vi.mocked(api.default.patch).mockRejectedValue({
      response: { data: { detail: 'Erro ao atualizar' } },
    })

    const { result } = renderHook(() => useUpdateTool(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      id: 1,
      title: 'Test',
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar')
  })
})

