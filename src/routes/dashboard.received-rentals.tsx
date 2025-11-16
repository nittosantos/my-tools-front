import { createFileRoute, Link } from "@tanstack/react-router"
import { useReceivedRentals } from "@/hooks/useReceivedRentals"
import { useApproveRental } from "@/hooks/useApproveRental"
import { useRejectRental } from "@/hooks/useRejectRental"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Check, X } from "lucide-react"
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

export const Route = createFileRoute("/dashboard/received-rentals")({
  component: ReceivedRentalsPage,
})

function ReceivedRentalsPage() {
  const { data: rentals, isLoading, error, refetch } = useReceivedRentals()
  const { mutate: approveRental, isPending: isApproving } = useApproveRental()
  const { mutate: rejectRental, isPending: isRejecting } = useRejectRental()

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Aluguéis Recebidos</h2>
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
        <h2 className="text-2xl font-semibold mb-6">Aluguéis Recebidos</h2>
        <ErrorDisplay onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Aluguéis Recebidos</h2>

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
                      Alugado por: {rental.renter_username || `Usuário #${rental.renter}`}
                    </CardDescription>
                  </div>
                  <Badge variant={statusVariants[rental.status]}>
                    {statusLabels[rental.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

                {rental.status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="default"
                      onClick={() => approveRental(rental.id)}
                      disabled={isApproving || isRejecting}
                      className="flex-1"
                    >
                      {isApproving ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Aprovando...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Aprovar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => rejectRental(rental.id)}
                      disabled={isApproving || isRejecting}
                      className="flex-1"
                    >
                      {isRejecting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Rejeitando...
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Rejeitar
                        </>
                      )}
                    </Button>
                  </div>
                )}
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
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h5.25c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação recebida</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não recebeu solicitações de aluguel para suas ferramentas. Quando alguém solicitar o aluguel de uma de suas ferramentas, ela aparecerá aqui.
            </p>
            <Link to="/dashboard/my-tools">
              <Button variant="outline" size="lg">
                Ver Minhas Ferramentas
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

