import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDeleteTool } from './useDeleteTool'
import * as api from '@/lib/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'

vi.mock('@/lib/api', () => ({
  default: {
    delete: vi.fn(),
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

describe('useDeleteTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve deletar ferramenta com sucesso', async () => {
    vi.mocked(api.default.delete).mockResolvedValue({ data: {} })

    const { result } = renderHook(() => useDeleteTool(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(1)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(api.default.delete).toHaveBeenCalledWith('/tools/1/')
    expect(toast.success).toHaveBeenCalledWith('Ferramenta deletada com sucesso!')
  })

  it('deve mostrar erro ao falhar deleção', async () => {
    vi.mocked(api.default.delete).mockRejectedValue({
      response: { data: { detail: 'Erro ao deletar' } },
    })

    const { result } = renderHook(() => useDeleteTool(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(1)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Erro ao deletar')
  })
})

