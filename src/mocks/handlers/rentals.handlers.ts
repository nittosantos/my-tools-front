import { http, HttpResponse } from "msw";
import type { Rental, CreateRentalData } from "@/types";
import {
  mockRentals,
  findToolById,
  findRentalsByRenter,
  findRentalsByOwner,
} from "../fixtures";
import { delay, API_BASE } from "../utils/constants";

export const rentalsHandlers = [
  // GET /rentals/my/
  http.get(`${API_BASE}/api/rentals/my/`, async ({ request }) => {
    await delay(400);
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ detail: "Não autenticado" }, { status: 401 });
    }

    // Retornar aluguéis do primeiro usuário
    const rentals = findRentalsByRenter(1);
    return HttpResponse.json(rentals);
  }),

  // GET /rentals/received/
  http.get(`${API_BASE}/api/rentals/received/`, async ({ request }) => {
    await delay(400);
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ detail: "Não autenticado" }, { status: 401 });
    }

    // Retornar aluguéis recebidos (ferramentas do primeiro usuário)
    const rentals = findRentalsByOwner(1);
    return HttpResponse.json(rentals);
  }),

  // POST /rentals/
  http.post(`${API_BASE}/api/rentals/`, async ({ request }) => {
    await delay(500);
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ detail: "Não autenticado" }, { status: 401 });
    }

    const body = (await request.json()) as CreateRentalData;
    const tool = findToolById(body.tool_id);

    if (!tool) {
      return HttpResponse.json(
        { detail: "Ferramenta não encontrada" },
        { status: 404 }
      );
    }

    // Calcular dias e preço total
    const startDate = new Date(body.start_date);
    const endDate = new Date(body.end_date);
    const days =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    const price = typeof tool.price_per_day === 'string' ? parseFloat(tool.price_per_day) : tool.price_per_day
    const totalPrice = days * price;

    const newRental: Rental = {
      id: mockRentals.length + 1,
      tool: body.tool_id,
      tool_details: tool,
      renter: 1, // Mock: sempre o primeiro usuário
      renter_username: "joao_silva",
      start_date: body.start_date,
      end_date: body.end_date,
      total_price: totalPrice,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Bloquear ferramenta ao criar aluguel
    tool.available = false;

    mockRentals.push(newRental);
    return HttpResponse.json(newRental, { status: 201 });
  }),

  // PATCH /rentals/:id/approve/
  http.patch(`${API_BASE}/api/rentals/:id/approve/`, async ({ params }) => {
    await delay(400);
    const id = parseInt(params.id as string);
    const rentalIndex = mockRentals.findIndex((r) => r.id === id);

    if (rentalIndex === -1) {
      return HttpResponse.json(
        { detail: "Aluguel não encontrado" },
        { status: 404 }
      );
    }

    mockRentals[rentalIndex] = {
      ...mockRentals[rentalIndex],
      status: "approved",
      updated_at: new Date().toISOString(),
    };

    // Manter ferramenta bloqueada ao aprovar
    const tool = findToolById(mockRentals[rentalIndex].tool);
    if (tool) {
      tool.available = false;
    }

    return HttpResponse.json(mockRentals[rentalIndex]);
  }),

  // PATCH /rentals/:id/reject/
  http.patch(`${API_BASE}/api/rentals/:id/reject/`, async ({ params }) => {
    await delay(400);
    const id = parseInt(params.id as string);
    const rentalIndex = mockRentals.findIndex((r) => r.id === id);

    if (rentalIndex === -1) {
      return HttpResponse.json(
        { detail: "Aluguel não encontrado" },
        { status: 404 }
      );
    }

    mockRentals[rentalIndex] = {
      ...mockRentals[rentalIndex],
      status: "rejected",
      updated_at: new Date().toISOString(),
    };

    // Liberar ferramenta ao rejeitar
    const tool = findToolById(mockRentals[rentalIndex].tool);
    if (tool) {
      tool.available = true;
    }

    return HttpResponse.json(mockRentals[rentalIndex]);
  }),

  // PATCH /rentals/:id/finish/
  http.patch(`${API_BASE}/api/rentals/:id/finish/`, async ({ params }) => {
    await delay(400);
    const id = parseInt(params.id as string);
    const rentalIndex = mockRentals.findIndex((r) => r.id === id);

    if (rentalIndex === -1) {
      return HttpResponse.json(
        { detail: "Aluguel não encontrado" },
        { status: 404 }
      );
    }

    const rental = mockRentals[rentalIndex];

    // Apenas aluguéis aprovados podem ser finalizados
    if (rental.status !== "approved") {
      return HttpResponse.json(
        { detail: "Apenas aluguéis aprovados podem ser finalizados." },
        { status: 400 }
      );
    }

    mockRentals[rentalIndex] = {
      ...rental,
      status: "finished",
      updated_at: new Date().toISOString(),
    };

    // Liberar ferramenta ao finalizar
    const tool = findToolById(rental.tool);
    if (tool) {
      tool.available = true;
    }

    return HttpResponse.json(mockRentals[rentalIndex]);
  }),
];
