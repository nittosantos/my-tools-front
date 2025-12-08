import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { useMyRentals } from "@/hooks/useMyRentals"
import { useReceivedRentals } from "@/hooks/useReceivedRentals"
import { useFinishRental } from "@/hooks/useFinishRental"
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
import { CheckCircle2, Check, X } from "lucide-react"
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
  const [activeTab, setActiveTab] = useState<"my" | "received">("my")
  const { data: myRentals, isLoading: isLoadingMy, error: errorMy, refetch: refetchMy } = useMyRentals()
  const { data: receivedRentals, isLoading: isLoadingReceived, error: errorReceived, refetch: refetchReceived } = useReceivedRentals()
  const { mutate: finishRental, isPending: isFinishing } = useFinishRental()
  const { mutate: approveRental, isPending: isApproving } = useApproveRental()
  const { mutate: rejectRental, isPending: isRejecting } = useRejectRental()

  const rentals = activeTab === "my" ? myRentals : receivedRentals
  const isLoading = activeTab === "my" ? isLoadingMy : isLoadingReceived
  const error = activeTab === "my" ? errorMy : errorReceived
  const refetch = activeTab === "my" ? refetchMy : refetchReceived

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Meus Aluguéis</h2>
      </div>

      {/* Abas */}
      <div className="flex gap-2 mb-6 border-b">
        <Button
          variant={activeTab === "my" ? "default" : "ghost"}
          onClick={() => setActiveTab("my")}
          className="rounded-b-none"
        >
          Aluguéis que Fiz
        </Button>
        <Button
          variant={activeTab === "received" ? "default" : "ghost"}
          onClick={() => setActiveTab("received")}
          className="rounded-b-none"
        >
          Aluguéis Recebidos
        </Button>
      </div>

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
                      {activeTab === "my" ? (
                        rental.tool_details?.category && (
                          <span className="capitalize">{rental.tool_details.category}</span>
                        )
                      ) : (
                        <>Alugado por: {rental.renter_username || `Usuário #${rental.renter}`}</>
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

                {/* Ações para aluguéis que fiz */}
                {activeTab === "my" && rental.status === "approved" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="default"
                      onClick={() => finishRental(rental.id)}
                      disabled={isFinishing}
                      className="flex-1"
                    >
                      {isFinishing ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Finalizando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Finalizar Aluguel
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Ações para aluguéis recebidos */}
                {activeTab === "received" && rental.status === "pending" && (
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

                {activeTab === "received" && rental.status === "approved" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="default"
                      onClick={() => finishRental(rental.id)}
                      disabled={isFinishing}
                      className="flex-1"
                    >
                      {isFinishing ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Finalizando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Finalizar Aluguel
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
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {activeTab === "my" ? "Nenhum aluguel realizado" : "Nenhuma solicitação recebida"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === "my" 
                ? "Você ainda não realizou nenhum aluguel. Explore as ferramentas disponíveis e encontre o que precisa!"
                : "Você ainda não recebeu solicitações de aluguel para suas ferramentas. Quando alguém solicitar o aluguel de uma de suas ferramentas, ela aparecerá aqui."}
            </p>
            <Link to={activeTab === "my" ? "/" : "/dashboard/my-tools"}>
              <Button variant="outline" size="lg">
                {activeTab === "my" ? "Explorar Ferramentas" : "Ver Minhas Ferramentas"}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

