import { createFileRoute, Link } from "@tanstack/react-router"
import { useMyRentals } from "@/hooks/useMyRentals"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { RentalStatus } from "@/types"

const statusLabels: Record<RentalStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  finished: "Finalizado",
}

const statusVariants: Record<RentalStatus, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
  finished: "default",
}

export const Route = createFileRoute("/dashboard/my-rentals")({
  component: MyRentalsPage,
})

function MyRentalsPage() {
  const { data: rentals, isLoading, error, refetch } = useMyRentals()

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Meus Aluguéis</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Meus Aluguéis</h2>
        <ErrorDisplay onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Meus Aluguéis</h2>

      {rentals && rentals.length > 0 ? (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <Card key={rental.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {rental.tool_details?.title || `Ferramenta #${rental.tool}`}
                    </CardTitle>
                    <CardDescription>
                      {rental.tool_details?.category && (
                        <span className="capitalize">{rental.tool_details.category}</span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={statusVariants[rental.status]}>
                    {statusLabels[rental.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Período</p>
                    <p className="font-semibold">
                      {format(new Date(rental.start_date), "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(new Date(rental.end_date), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold text-lg">
                      R$ {rental.total_price.toFixed(2)}
                    </p>
                  </div>
                  {rental.tool_details && (
                    <div>
                      <Link
                        to="/tools/$toolId"
                        params={{ toolId: rental.tool_details.id.toString() }}
                        className="text-primary hover:underline"
                      >
                        Ver ferramenta →
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
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
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum aluguel realizado</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não realizou nenhum aluguel. Explore as ferramentas disponíveis e encontre o que precisa!
            </p>
            <Link to="/">
              <Button variant="outline" size="lg">
                Explorar Ferramentas
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

