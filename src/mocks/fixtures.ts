import type { User, Tool, Rental, Category, RentalStatus } from "@/types"

// Usuários mockados
export const mockUsers: User[] = [
  {
    id: 1,
    username: "joao_silva",
    email: "joao@example.com",
    first_name: "João",
    last_name: "Silva",
  },
  {
    id: 2,
    username: "maria_santos",
    email: "maria@example.com",
    first_name: "Maria",
    last_name: "Santos",
  },
  {
    id: 3,
    username: "pedro_oliveira",
    email: "pedro@example.com",
    first_name: "Pedro",
    last_name: "Oliveira",
  },
]

// Arrays para gerar ferramentas variadas
const categories: Category[] = [
  "construcao",
  "jardinagem",
  "cozinha",
  "oficina_mecanica",
  "limpeza",
  "eletrica",
  "hidraulica",
  "pintura",
  "ferramentas_manuais",
  "ferramentas_eletricas",
  "automotiva",
  "eventos",
  "mudanca",
  "outros",
]

const states = ["SP", "RJ", "MG", "PR", "RS", "SC", "BA", "GO", "PE", "CE"]
const citiesByState: Record<string, string[]> = {
  SP: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba"],
  RJ: ["Rio de Janeiro", "Niterói", "Campos dos Goytacazes", "Petrópolis"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "Chapecó"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis"],
  PE: ["Recife", "Jaboatão dos Guararapes", "Olinda"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte"],
}

const toolTitles = [
  // Construção
  "Furadeira de Impacto", "Serra Tico-Tico", "Parafusadeira", "Lixadeira", "Martelo Demolidor",
  "Betoneira", "Vibrador de Concreto", "Nível Laser", "Trena Laser", "Plaina Elétrica",
  // Jardinagem
  "Cortador de Grama", "Roçadeira", "Tesoura de Podar", "Regador", "Mangueira",
  "Pulverizador", "Aparador de Cerca Viva", "Soprador de Folhas", "Aerador de Solo", "Enxada",
  // Cozinha
  "Batedeira", "Liquidificador", "Processador", "Mixer", "Frigideira",
  "Panela de Pressão", "Churrasqueira Portátil", "Faqueiro", "Jogo de Panelas", "Espremedor",
  // Oficina Mecânica
  "Chave de Torque", "Macaco Hidráulico", "Compressor", "Soldadora", "Esmerilhadeira",
  "Chave de Roda", "Elevador Hidráulico", "Multímetro", "Osciloscópio", "Ferramentas de Precisão",
  // Limpeza
  "Aspirador de Pó", "Lavadora de Alta Pressão", "Vassoura Elétrica", "Mop", "Balde",
  "Escada", "Rodinho", "Pá", "Rodo", "Kit de Limpeza",
  // Elétrica
  "Multímetro Digital", "Detector de Tensão", "Alicate Amperímetro", "Crimpador", "Testador de Continuidade",
  "Fonte de Alimentação", "Osciloscópio Digital", "Gerador", "Inversor", "Estabilizador",
  // Hidráulica
  "Chave de Cano", "Alicate Hidráulico", "Sifão", "Desentupidor", "Fita Veda Rosca",
  "Cortador de PVC", "Soldador de Tubos", "Pressurizador", "Bomba D'água", "Medidor de Pressão",
  // Pintura
  "Rolo de Pintura", "Pincel", "Compressor de Ar", "Pistola de Pintura", "Lixa",
  "Espátula", "Massa Corrida", "Tinta", "Verniz", "Kit de Pintura",
  // Ferramentas Manuais
  "Martelo", "Chave de Fenda", "Alicate", "Chave Inglesa", "Serra Manual",
  "Formão", "Goiva", "Plaina Manual", "Nível", "Esquadro",
  // Ferramentas Elétricas
  "Furadeira", "Parafusadeira", "Lixadeira Orbital", "Serra Circular", "Tupia",
  "Martelete", "Esmeril", "Serra de Mesa", "Torno", "Fresadora",
  // Automotiva
  "Macaco", "Chave de Roda", "Compressor Portátil", "Multímetro Automotivo", "Scanner OBD",
  "Bateria Portátil", "Carregador de Bateria", "Kit de Emergência", "Cabo de Chupeta", "Extintor",
  // Eventos
  "Mesa", "Cadeira", "Tenda", "Som", "Iluminação",
  "Gerador", "Freezer", "Fogão", "Churrasqueira", "Kit Completo",
  // Mudança
  "Carrinho de Mão", "Empilhadeira Manual", "Rolo de Embalagem", "Plástico Bolha", "Caixa",
  "Cinta", "Corda", "Móvel com Rodas", "Elevador Manual", "Kit de Mudança",
  // Outros
  "Ferramenta Multiuso", "Kit Completo", "Equipamento Profissional", "Acessório", "Suporte",
]

const descriptions = [
  "Equipamento profissional de alta qualidade.",
  "Ideal para uso doméstico e profissional.",
  "Perfeito para trabalhos pesados.",
  "Ferramenta essencial para qualquer projeto.",
  "Design ergonômico e fácil de usar.",
  "Alta durabilidade e resistência.",
  "Inclui acessórios e manual de instruções.",
  "Garantia de qualidade e satisfação.",
  "Produto testado e aprovado.",
  "Excelente custo-benefício.",
]

// Função para gerar ferramentas mockadas
function generateMockTools(): Tool[] {
  const tools: Tool[] = []
  let id = 1

  // Manter as 5 ferramentas originais
  const originalTools: Tool[] = [
    {
      id: id++,
      title: "Furadeira Elétrica Profissional",
      description: "Furadeira elétrica de alta potência, ideal para trabalhos em madeira, concreto e metal. Inclui kit de brocas.",
      category: "ferramentas_eletricas",
      price_per_day: 25.0,
      image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
      available: true,
      state: "SP",
      city: "São Paulo",
      owner: 1,
      owner_username: "joao_silva",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: id++,
      title: "Serra Circular",
      description: "Serra circular portátil com lâmina de 7.25 polegadas. Perfeita para cortes precisos em madeira.",
      category: "ferramentas_eletricas",
      price_per_day: 30.0,
      image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
      available: true,
      state: "RJ",
      city: "Rio de Janeiro",
      owner: 2,
      owner_username: "maria_santos",
      created_at: "2024-01-16T14:30:00Z",
      updated_at: "2024-01-16T14:30:00Z",
    },
    {
      id: id++,
      title: "Kit de Chaves de Fenda",
      description: "Kit completo com 20 peças de chaves de fenda em vários tamanhos. Ideal para reparos domésticos.",
      category: "ferramentas_manuais",
      price_per_day: 10.0,
      image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
      available: true,
      state: "SP",
      city: "São Paulo",
      owner: 1,
      owner_username: "joao_silva",
      created_at: "2024-01-10T09:00:00Z",
      updated_at: "2024-01-10T09:00:00Z",
    },
    {
      id: id++,
      title: "Cortador de Grama Elétrico",
      description: "Cortador de grama elétrico leve e fácil de usar. Ideal para jardins pequenos e médios.",
      category: "jardinagem",
      price_per_day: 35.0,
      image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
      available: false,
      state: "MG",
      city: "Belo Horizonte",
      owner: 2,
      owner_username: "maria_santos",
      created_at: "2024-01-12T11:00:00Z",
      updated_at: "2024-01-12T11:00:00Z",
    },
    {
      id: id++,
      title: "Betoneira Portátil",
      description: "Betoneira elétrica de 70 litros. Perfeita para pequenas obras e reformas.",
      category: "construcao",
      price_per_day: 50.0,
      image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
      available: true,
      state: "PR",
      city: "Curitiba",
      owner: 3,
      owner_username: "pedro_oliveira",
      created_at: "2024-01-18T08:00:00Z",
      updated_at: "2024-01-18T08:00:00Z",
    },
  ]

  tools.push(...originalTools)

  // Gerar 145 ferramentas adicionais (totalizando 150)
  for (let i = 0; i < 145; i++) {
    const state = states[i % states.length]
    const cities = citiesByState[state]
    const city = cities[i % cities.length]
    const category = categories[i % categories.length]
    const titleIndex = i % toolTitles.length
    const descIndex = i % descriptions.length
    const ownerId = (i % 3) + 1
    const ownerUsernames = ["joao_silva", "maria_santos", "pedro_oliveira"]
    
    // Preço variado entre R$ 10 e R$ 100
    const price = 10 + (i % 91)
    
    // Disponibilidade variada (80% disponível)
    const available = i % 5 !== 0

    tools.push({
      id: id++,
      title: `${toolTitles[titleIndex]} ${i > 0 ? `#${Math.floor(i / toolTitles.length) + 1}` : ""}`.trim(),
      description: `${descriptions[descIndex]} ${toolTitles[titleIndex].toLowerCase()}.`,
      category: category,
      price_per_day: price,
      image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
      available: available,
      state: state,
      city: city,
      owner: ownerId,
      owner_username: ownerUsernames[ownerId - 1],
      created_at: new Date(2024, 0, 1 + (i % 365)).toISOString(),
      updated_at: new Date(2024, 0, 1 + (i % 365)).toISOString(),
    })
  }

  return tools
}

// Ferramentas mockadas (150 ferramentas)
export const mockTools: Tool[] = generateMockTools()

// Aluguéis mockados
export const mockRentals: Rental[] = [
  {
    id: 1,
    tool: 1,
    tool_details: mockTools[0],
    renter: 2,
    renter_username: "maria_santos",
    start_date: "2024-11-20",
    end_date: "2024-11-22",
    total_price: 50.0,
    status: "approved",
    created_at: "2024-11-15T10:00:00Z",
    updated_at: "2024-11-15T10:30:00Z",
  },
  {
    id: 2,
    tool: 3,
    tool_details: mockTools[2],
    renter: 3,
    renter_username: "pedro_oliveira",
    start_date: "2024-11-25",
    end_date: "2024-11-27",
    total_price: 20.0,
    status: "pending",
    created_at: "2024-11-18T14:00:00Z",
    updated_at: "2024-11-18T14:00:00Z",
  },
]

// Token mockado (simula JWT)
export const mockToken = "mock-jwt-token-12345"

// Helper para encontrar usuário por username
export const findUserByUsername = (username: string): User | undefined => {
  return mockUsers.find((u) => u.username === username)
}

// Helper para encontrar ferramenta por ID
export const findToolById = (id: number): Tool | undefined => {
  return mockTools.find((t) => t.id === id)
}

// Helper para encontrar aluguéis do usuário
export const findRentalsByRenter = (renterId: number): Rental[] => {
  return mockRentals.filter((r) => r.renter === renterId)
}

// Helper para encontrar aluguéis recebidos (ferramentas do usuário)
export const findRentalsByOwner = (ownerId: number): Rental[] => {
  return mockRentals.filter((r) => {
    const tool = findToolById(r.tool)
    return tool?.owner === ownerId
  })
}
