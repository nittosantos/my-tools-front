import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Limpar após cada teste
afterEach(() => {
  cleanup()
})

// MSW será iniciado apenas se necessário nos testes que precisarem
// Para testes unitários de componentes, geralmente não precisamos do MSW
// Ele será usado apenas em testes de hooks que fazem requisições HTTP

