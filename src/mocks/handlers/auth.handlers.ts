import { http, HttpResponse } from "msw";
import type { LoginCredentials, LoginResponse } from "@/types";
import { mockUsers, mockToken, findUserByUsername } from "../fixtures";
import { delay, API_BASE } from "../utils/constants";

export const authHandlers = [
  // POST /auth/login/
  http.post(`${API_BASE}/api/auth/login/`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as LoginCredentials;

    const user = findUserByUsername(body.username);

    // Simular validação de senha (qualquer senha funciona no mock)
    if (!user || !body.password) {
      return HttpResponse.json(
        { detail: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const response: LoginResponse = {
      access: mockToken,
      refresh: "mock-refresh-token-12345",
      user,
    };

    return HttpResponse.json(response);
  }),

  // POST /auth/refresh/
  http.post(`${API_BASE}/api/auth/refresh/`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { refresh: string };

    // Simular validação de refresh token (qualquer token funciona no mock)
    if (!body.refresh) {
      return HttpResponse.json({ detail: "Token inválido" }, { status: 401 });
    }

    // Retornar novo access token
    return HttpResponse.json({
      access: `mock-jwt-token-${Date.now()}`,
    });
  }),

  // GET /auth/me/
  http.get(`${API_BASE}/api/auth/me/`, async ({ request }) => {
    await delay(300);
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ detail: "Não autenticado" }, { status: 401 });
    }

    // Retornar primeiro usuário como mock (em produção viria do token)
    return HttpResponse.json(mockUsers[0]);
  }),
];
