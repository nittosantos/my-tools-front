import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions, act } from '@testing-library/react'
import type { ReactElement } from 'react'

// Criar QueryClient para testes (com configurações de teste)
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

// Wrapper customizado para renderizar componentes com providers necessários
function AllTheProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Função de render customizada que inclui providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

// Re-exportar tudo
export * from '@testing-library/react'
export { customRender as render, act }

