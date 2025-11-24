// Simular delay de rede
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Base URL da API
export const API_BASE = "http://127.0.0.1:8000";
