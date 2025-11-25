import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/query-client'

// Inicializar MSW em desenvolvimento ou se habilitado via variável de ambiente
async function enableMocking() {
  // Usar MSW em desenvolvimento OU se a variável VITE_USE_MSW estiver definida
  // Isso permite usar MSW em produção para demos (ex: Vercel)
  const shouldUseMSW = 
    import.meta.env.MODE === 'development' || 
    import.meta.env.VITE_USE_MSW === 'true'
  
  if (!shouldUseMSW) {
    return
  }

  const { worker } = await import('./mocks/browser')
  
  return worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
    // 'warn' mostra avisos no console se uma requisição não for interceptada
    // Isso ajuda a identificar se alguma rota está faltando no MSW
    onUnhandledRequest: 'warn',
  }).then(() => {
    console.log('✅ MSW iniciado com sucesso - usando mocks ao invés do backend real')
  }).catch((error) => {
    console.error('❌ MSW failed to start:', error)
    console.warn('Verifique se o arquivo public/mockServiceWorker.js existe')
    // Continuar mesmo se MSW falhar - não é crítico para desenvolvimento
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
})
