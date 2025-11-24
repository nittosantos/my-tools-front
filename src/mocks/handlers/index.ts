// Combinar todos os handlers mantendo a ordem correta
// IMPORTANTE: Rotas específicas (como /tools/my/) devem vir ANTES de rotas dinâmicas (como /tools/:id/)
import { authHandlers } from "./auth.handlers";
import { toolsHandlers } from "./tools.handlers";
import { rentalsHandlers } from "./rentals.handlers";

export const handlers = [...authHandlers, ...toolsHandlers, ...rentalsHandlers];
