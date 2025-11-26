import { http, HttpResponse } from "msw";
import type { Tool, CreateToolData } from "@/types";
import { mockTools, findToolById } from "../fixtures";
import { delay, API_BASE } from "../utils/constants";

export const toolsHandlers = [
  // GET /tools/ - Suporta filtros por categoria, estado, cidade, busca, ordenação e paginação
  // MSW v2 automaticamente captura query params, então usar URL simples
  http.get(`${API_BASE}/api/tools/`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const categories = url.searchParams.getAll("category");
    const state = url.searchParams.get("state");
    const cities = url.searchParams.getAll("city");
    const search = url.searchParams.get("search");
    const ordering = url.searchParams.get("ordering");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = 9; // 9 itens por página (3 linhas x 3 colunas no grid)

    let filteredTools = [...mockTools];

    // Filtro por categoria
    if (categories.length > 0) {
      filteredTools = filteredTools.filter((tool) =>
        categories.includes(tool.category)
      );
    }

    // Filtro por estado
    if (state) {
      const stateUpper = state.trim().toUpperCase();
      filteredTools = filteredTools.filter((tool) => {
        if (!tool.state) return false;
        const toolState = tool.state.trim().toUpperCase();
        return toolState === stateUpper;
      });
    }

    // Filtro por cidades (busca parcial, case-insensitive, múltiplas cidades)
    if (cities.length > 0) {
      filteredTools = filteredTools.filter((tool) => {
        if (!tool.city) return false;
        return cities.some((city) => {
          if (!city) return false;
          return tool.city?.toLowerCase().includes(city.toLowerCase().trim());
        });
      });
    }

    // Busca por texto (case-insensitive, busca em título e descrição)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTools = filteredTools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower)
      );
    }

    // Ordenação
    if (ordering) {
      filteredTools.sort((a, b) => {
        switch (ordering) {
          case "created_at": // Mais recentes (maior data primeiro)
            return (
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
            );
          case "-created_at": // Mais antigas (menor data primeiro)
            return (
              new Date(a.created_at || 0).getTime() -
              new Date(b.created_at || 0).getTime()
            );
          case "price_per_day": // Preço crescente
            const priceA = typeof a.price_per_day === 'string' ? parseFloat(a.price_per_day) : a.price_per_day
            const priceB = typeof b.price_per_day === 'string' ? parseFloat(b.price_per_day) : b.price_per_day
            return priceA - priceB;
          case "-price_per_day": // Preço decrescente
            const priceA2 = typeof a.price_per_day === 'string' ? parseFloat(a.price_per_day) : a.price_per_day
            const priceB2 = typeof b.price_per_day === 'string' ? parseFloat(b.price_per_day) : b.price_per_day
            return priceB2 - priceA2;
          default:
            return 0;
        }
      });
    }

    // Paginação
    const totalCount = filteredTools.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTools = filteredTools.slice(startIndex, endIndex);

    // Construir URLs de next/previous
    const buildPageUrl = (pageNum: number) => {
      const params = new URLSearchParams();
      categories.forEach((cat) => params.append("category", cat));
      if (state) params.append("state", state);
      cities.forEach((city) => params.append("city", city));
      if (search) params.append("search", search);
      if (ordering) params.append("ordering", ordering);
      params.append("page", pageNum.toString());
      return `${url.origin}${url.pathname}?${params.toString()}`;
    };

    // Sempre retornar formato paginado (DRF sempre retorna assim quando paginação está habilitada)
    return HttpResponse.json({
      count: totalCount,
      next: page < totalPages ? buildPageUrl(page + 1) : null,
      previous: page > 1 ? buildPageUrl(page - 1) : null,
      results: paginatedTools,
    });
  }),

  // GET /tools/my/ - DEVE VIR ANTES de /tools/:id/ para não conflitar
  // IMPORTANTE: Esta rota específica deve vir ANTES da rota dinâmica /tools/:id/
  http.get(`${API_BASE}/api/tools/my/`, async ({ request }) => {
    await delay(400);
    const authHeader = request.headers.get("Authorization");

    // Aceitar qualquer token Bearer no mock (qualquer string que comece com "Bearer ")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ detail: "Não autenticado" }, { status: 401 });
    }

    // Retornar ferramentas do primeiro usuário (ID 1)
    const myTools = mockTools.filter((t) => t.owner === 1);
    return HttpResponse.json(myTools);
  }),

  // GET /tools/:id/ - DEVE VIR DEPOIS de rotas específicas como /tools/my/
  http.get(`${API_BASE}/api/tools/:id/`, async ({ params }) => {
    await delay(300);

    // Verificar se é uma palavra especial (não numérica) como "my"
    const idParam = params.id as string;
    if (idParam === "my" || isNaN(parseInt(idParam))) {
      // Se não for numérico, retornar 404 (pode ser uma rota específica que não existe)
      return HttpResponse.json(
        { detail: "Ferramenta não encontrada" },
        { status: 404 }
      );
    }

    const id = parseInt(idParam);
    const tool = findToolById(id);

    if (!tool) {
      return HttpResponse.json(
        { detail: "Ferramenta não encontrada" },
        { status: 404 }
      );
    }

    return HttpResponse.json(tool);
  }),

  // POST /tools/
  http.post(`${API_BASE}/api/tools/`, async ({ request }) => {
    await delay(500);
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ detail: "Não autenticado" }, { status: 401 });
    }

    const formData = await request.formData();
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      price_per_day: parseFloat(formData.get("price_per_day") as string),
      image: formData.get("image") as File | null,
    };

    const newTool: Tool = {
      id: mockTools.length + 1,
      title: data.title,
      description: data.description,
      category: data.category as Tool["category"],
      price_per_day: data.price_per_day,
      image_url: data.image
        ? URL.createObjectURL(data.image)
        : "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
      available: true,
      owner: 1, // Mock: sempre o primeiro usuário
      owner_username: "joao_silva",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockTools.push(newTool);
    return HttpResponse.json(newTool, { status: 201 });
  }),

  // PATCH /tools/:id/
  http.patch(`${API_BASE}/api/tools/:id/`, async ({ params, request }) => {
    await delay(400);
    const id = parseInt(params.id as string);
    const toolIndex = mockTools.findIndex((t) => t.id === id);

    if (toolIndex === -1) {
      return HttpResponse.json(
        { detail: "Ferramenta não encontrada" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as Partial<CreateToolData>;
    const updatedTool = {
      ...mockTools[toolIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    mockTools[toolIndex] = updatedTool;
    return HttpResponse.json(updatedTool);
  }),

  // DELETE /tools/:id/
  http.delete(`${API_BASE}/api/tools/:id/`, async ({ params }) => {
    await delay(300);
    const id = parseInt(params.id as string);
    const toolIndex = mockTools.findIndex((t) => t.id === id);

    if (toolIndex === -1) {
      return HttpResponse.json(
        { detail: "Ferramenta não encontrada" },
        { status: 404 }
      );
    }

    mockTools.splice(toolIndex, 1);
    return HttpResponse.json({}, { status: 204 });
  }),
];
