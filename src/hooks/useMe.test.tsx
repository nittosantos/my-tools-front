import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMe } from './useMe'
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

describe('useMe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve buscar dados do usuário atual', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    }

    vi.mocked(api.default.get).mockResolvedValue({ data: mockUser })

    const { result } = renderHook(() => useMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockUser)
    expect(api.default.get).toHaveBeenCalledWith('/auth/me/')
  })

  it('deve lidar com erro ao buscar dados do usuário', async () => {
    vi.mocked(api.default.get).mockRejectedValue(new Error('Unauthorized'))

    const { result } = renderHook(() => useMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})

