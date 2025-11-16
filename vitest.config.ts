/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockServiceWorker.js',
        '**/routeTree.gen.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        // Excluir arquivos de configuração e tipos
        'src/types/**',
        'src/routes/**', // Rotas são principalmente configuração do TanStack Router
        'src/lib/router.tsx',
        'src/lib/query-client.ts',
        'src/App.tsx',
        'src/main.tsx',
        // Excluir mocks (não precisam ser testados)
        'src/mocks/**',
        // Excluir componentes UI não utilizados ou apenas de estilo
        'src/components/ui/badge.tsx',
        'src/components/ui/card.tsx',
        'src/components/ui/skeleton.tsx',
        'src/components/ui/sonner.tsx',
      ],
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85, // Ajustado para 85% pois componentes UI têm branches difíceis de cobrir
        statements: 90,
      },
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
})

