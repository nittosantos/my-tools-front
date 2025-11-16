import { createFileRoute, Link, useNavigate, Outlet, useLocation } from "@tanstack/react-router"
import { useTool } from "@/hooks/useTool"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorDisplay } from "@/components/ErrorDisplay"
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

export const Route = createFileRoute("/tools/$toolId")({
  component: ToolDetailsPage,
})

function ToolDetailsPage() {
  const { toolId } = Route.useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const id = parseInt(toolId)
  const { data: tool, isLoading, error, refetch } = useTool(id)
  
  // Se estiver na rota de rent (/tools/$toolId/rent), renderizar apenas o Outlet (checkout)
  const isRentRoute = location.pathname.includes('/rent')

  // Se estiver na rota de rent, renderizar apenas o Outlet (componente de checkout)
  if (isRentRoute) {
    return <Outlet />
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-96 w-full mb-6" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorDisplay onRetry={() => refetch()} />
      </div>
    )
  }

  const handleRent = () => {
    if (!isAuthenticated) {
      navigate({ to: "/login" })
      return
    }
    navigate({ to: "/tools/$toolId/rent", params: { toolId: tool.id.toString() } })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="text-primary hover:underline mb-4 inline-block">
        ← Voltar para lista
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {tool.image_url ? (
            <img
              src={tool.image_url}
              alt={tool.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Sem imagem</span>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-3xl">{tool.title}</CardTitle>
              <Badge variant={tool.available ? "default" : "secondary"}>
                {tool.available ? "Disponível" : "Indisponível"}
              </Badge>
            </div>
            <CardDescription>
              {categoryLabels[tool.category]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Preço</h3>
              <p className="text-2xl font-bold text-primary">
                R$ {tool.price_per_day.toFixed(2)}/dia
              </p>
            </div>

            {tool.owner_username && (
              <div>
                <h3 className="font-semibold mb-2">Proprietário</h3>
                <p className="text-muted-foreground">{tool.owner_username}</p>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleRent}
              disabled={!tool.available}
            >
              {isAuthenticated ? "Alugar Agora" : "Faça login para alugar"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

