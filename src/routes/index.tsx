import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { useTools } from "@/hooks/useTools"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { CategoryFilter } from "@/components/CategoryFilter"
import { LocationFilter } from "@/components/LocationFilter"
import { SearchAndSortCard } from "@/components/SearchAndSortCard"
import { ToolsPagination } from "@/components/ToolsPagination"
import type { Category } from "@/types"

const categoryLabels: Record<Category, string> = {
  construcao: "Construção",
  jardinagem: "Jardinagem",
  cozinha: "Cozinha",
  oficina_mecanica: "Oficina Mecânica",
  limpeza: "Limpeza",
  eletrica: "Elétrica",
  hidraulica: "Hidráulica",
  pintura: "Pintura",
  ferramentas_manuais: "Ferramentas Manuais",
  ferramentas_eletricas: "Ferramentas Elétricas",
  automotiva: "Automotiva",
  eventos: "Eventos",
  mudanca: "Mudança",
  outros: "Outros",
}

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [ordering, setOrdering] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  
  const { data: tools, isLoading, error, refetch, pagination } = useTools({
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    state: selectedState || undefined,
    cities: selectedCities.length > 0 ? selectedCities : undefined,
    search: searchQuery || undefined,
    ordering: ordering || undefined,
    page: currentPage,
  })

  // Resetar para página 1 quando filtros mudarem
  const handleCategoriesChange = (categories: Category[]) => {
    setSelectedCategories(categories)
    setCurrentPage(1)
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setCurrentPage(1)
  }

  const handleCitiesChange = (cities: string[]) => {
    setSelectedCities(cities)
    setCurrentPage(1)
  }

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    setCurrentPage(1)
  }

  const handleOrderingChange = (ordering: string) => {
    setOrdering(ordering)
    setCurrentPage(1)
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Ferramentas Disponíveis</h1>
      
      <div className="space-y-6 mb-8">
        <div className="text-sm text-muted-foreground text-right">
          {error ? null : isLoading ? (
            <Skeleton className="h-4 w-48 ml-auto" />
          ) : pagination ? (
            <span>
              Mostrando {tools?.length || 0} de {pagination.count} ferramenta{pagination.count !== 1 ? "s" : ""}
              {pagination.totalPages > 1 && ` (Página ${pagination.currentPage} de ${pagination.totalPages})`}
            </span>
          ) : tools && tools.length > 0 ? (
            <span>{tools.length} ferramenta{tools.length !== 1 ? "s" : ""} encontrada{tools.length !== 1 ? "s" : ""}</span>
          ) : (
            <span>Nenhuma ferramenta encontrada</span>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-1 space-y-4">
            <SearchAndSortCard
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
              orderingValue={ordering}
              onOrderingChange={handleOrderingChange}
            />
            <CategoryFilter
              selectedCategories={selectedCategories}
              onCategoriesChange={handleCategoriesChange}
            />
            <LocationFilter
              selectedState={selectedState}
              selectedCities={selectedCities}
              onStateChange={handleStateChange}
              onCitiesChange={handleCitiesChange}
            />
          </div>
          
          <div className="lg:col-span-3">
            {error ? (
              <ErrorDisplay onRetry={() => refetch()} />
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : tools && tools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <Card key={tool.id} className="flex flex-col">
                    {tool.image_url && (
                      <img
                        src={tool.image_url}
                        alt={tool.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                        <Badge variant={tool.available ? "default" : "secondary"}>
                          {tool.available ? "Disponível" : "Indisponível"}
                        </Badge>
                      </div>
                      <CardDescription>
                        {categoryLabels[tool.category]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {tool.description}
                      </p>
                      {tool.city && tool.state && (
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs">
                            📍 {tool.city} / {tool.state}
                          </Badge>
                        </div>
                      )}
                      <p className="text-lg font-semibold mt-4">
                        R$ {tool.price_per_day.toFixed(2)}/dia
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        to="/tools/$toolId"
                        params={{ toolId: tool.id.toString() }}
                        className="w-full"
                      >
                        <Button className="w-full" disabled={!tool.available}>
                          Ver Detalhes
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="max-w-md mx-auto">
                  {(selectedCategories.length > 0 || selectedState || selectedCities.length > 0 || searchQuery) ? (
                    <>
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-muted p-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Nenhuma ferramenta encontrada</h3>
                      <p className="text-muted-foreground mb-4">
                        Não encontramos ferramentas que correspondam aos filtros selecionados. Tente ajustar os filtros ou limpar a busca.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCategories([])
                          setSelectedState("")
                          setSelectedCities([])
                          setSearchQuery("")
                          setOrdering("")
                        }}
                      >
                        Limpar Filtros
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-muted p-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 010-3.586l4.94-4.94a2.548 2.548 0 013.586 0l5.653 4.655a2.548 2.548 0 010 3.586l-4.94 4.94a2.548 2.548 0 01-3.586 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Nenhuma ferramenta disponível</h3>
                      <p className="text-muted-foreground">
                        Ainda não há ferramentas cadastradas no sistema. Volte em breve para ver novidades!
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <ToolsPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  hasNext={pagination.hasNext}
                  hasPrevious={pagination.hasPrevious}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

