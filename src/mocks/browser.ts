import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"

// Configurar MSW para o browser
export const worker = setupWorker(...handlers)

