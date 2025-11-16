import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateRental } from './useCreateRental'
import * as api from '@/lib/api'
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

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(({ to }: { to: string }) => {}),
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

describe('useCreateRental', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar aluguel com sucesso', async () => {
    const mockRental = {
      id: 1,
      tool: 1,
      renter: 1,
      start_date: '2024-01-01',
      end_date: '2024-01-05',
      total_price: 200,
      status: 'pending' as const,
    }

    vi.mocked(api.default.post).mockResolvedValue({ data: mockRental })

    const { result } = renderHook(() => useCreateRental(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      tool_id: 1,
      start_date: '2024-01-01',
      end_date: '2024-01-05',
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(api.default.post).toHaveBeenCalledWith('/rentals/', {
      tool_id: 1,
      start_date: '2024-01-01',
      end_date: '2024-01-05',
    })
    expect(toast.success).toHaveBeenCalledWith('Aluguel criado com sucesso!')
  })

  it('deve mostrar erro ao falhar criação', async () => {
    vi.mocked(api.default.post).mockRejectedValue({
      response: { data: { detail: 'Erro ao criar' } },
    })

    const { result } = renderHook(() => useCreateRental(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      tool_id: 1,
      start_date: '2024-01-01',
      end_date: '2024-01-05',
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Erro ao criar')
  })
})

