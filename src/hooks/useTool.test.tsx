import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTool } from './useTool'
import * as api from '@/lib/api'

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
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

describe('useTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve buscar ferramenta por id', async () => {
    const mockTool = {
      id: 1,
      title: 'Furadeira',
      description: 'Furadeira potente',
      category: 'ferramentas_eletricas' as const,
      price_per_day: 50,
      available: true,
      owner: 1,
    }

    vi.mocked(api.default.get).mockResolvedValue({ data: mockTool })

    const { result } = renderHook(() => useTool(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockTool)
    expect(api.default.get).toHaveBeenCalledWith('/tools/1/')
  })

  it('não deve buscar quando id é 0', () => {
    const { result } = renderHook(() => useTool(0), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(false)
    expect(api.default.get).not.toHaveBeenCalled()
  })
})

