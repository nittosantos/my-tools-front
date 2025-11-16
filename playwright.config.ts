import { defineConfig, devices } from '@playwright/test'

/**
 * Configuração do Playwright para testes E2E
 * 
 * O Playwright vai:
 * 1. Abrir um navegador real
 * 2. Navegar para a URL base (http://localhost:5173)
 * 3. Executar ações como um usuário real (clicar, digitar, etc)
 * 4. Verificar se os resultados estão corretos
 */
export default defineConfig({
  // Diretório onde ficam os testes E2E
  testDir: './e2e',
  
  // Timeout para cada teste (30 segundos)
  timeout: 30 * 1000,
  
  // Se um teste falhar, quantos outros tentar rodar em paralelo
  fullyParallel: true,
  
  // Não rodar testes em paralelo se não estiver em CI
  forbidOnly: !!process.env.CI,
  
  // Tentar novamente testes que falharam (útil para testes flaky)
  retries: process.env.CI ? 2 : 0,
  
  // Quantos workers (navegadores) rodar em paralelo
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter: onde mostrar os resultados
  reporter: [
    ['html'], // Gera relatório HTML bonito
    ['list'], // Mostra no terminal
  ],
  
  // Configurações compartilhadas para todos os testes
  use: {
    // URL base da aplicação (onde o Vite roda)
    baseURL: 'http://localhost:5173',
    
    // Coletar trace quando um teste falha (para debug)
    trace: 'on-first-retry',
    
    // Tirar screenshot quando falhar
    screenshot: 'only-on-failure',
    
    // Gravar vídeo quando falhar
    video: 'retain-on-failure',
  },

  // Configurar projetos (diferentes navegadores)
  projects: [
    {
      name: 'chromium', // Chrome/Edge
      use: { ...devices['Desktop Chrome'] },
    },
    // Você pode adicionar mais navegadores depois:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit', // Safari
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Servidor de desenvolvimento (opcional - pode rodar manualmente)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  // },
})

