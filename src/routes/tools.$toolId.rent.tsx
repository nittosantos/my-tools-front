import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { differenceInDays } from "date-fns"
import { useTool } from "@/hooks/useTool"
import { useCreateRental } from "@/hooks/useCreateRental"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { createRentalSchema, type CreateRentalFormData } from "@/lib/schemas"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/tools/$toolId/rent")({
  component: CheckoutPage,
})

function CheckoutPage() {
  const { toolId } = Route.useParams()
  const navigate = useNavigate()
  const id = parseInt(toolId)
  const { data: tool, isLoading: toolLoading, error: toolError, refetch } = useTool(id)
  const { mutate: createRental, isPending } = useCreateRental()
  const [calculatedTotal, setCalculatedTotal] = useState<number | null>(null)

  const form = useForm<CreateRentalFormData>({
    resolver: zodResolver(createRentalSchema),
    defaultValues: {
      tool_id: id,
      start_date: "",
      end_date: "",
    },
  })

  const startDate = form.watch("start_date")
  const endDate = form.watch("end_date")

  // Calcular total quando as datas mudarem
  useEffect(() => {
    if (startDate && endDate && tool) {
      try {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const days = differenceInDays(end, start) + 1
        const total = days * tool.price_per_day
        setCalculatedTotal(total)
      } catch {
        setCalculatedTotal(null)
      }
    } else {
      setCalculatedTotal(null)
    }
  }, [startDate, endDate, tool])

  const onSubmit = (data: CreateRentalFormData) => {
    createRental(data)
  }

  if (toolLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (toolError || !tool) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorDisplay onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/tools/$toolId" params={{ toolId: tool.id.toString() }} className="text-primary hover:underline mb-4 inline-block">
        ← Voltar para detalhes
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Alugar: {tool.title}</CardTitle>
          <CardDescription>
            Preço por dia: R$ {tool.price_per_day.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={startDate || new Date().toISOString().split("T")[0]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {calculatedTotal !== null && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Dias:</span>
                    <span className="font-semibold">
                      {startDate && endDate
                        ? differenceInDays(new Date(endDate), new Date(startDate)) + 1
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">R$ {calculatedTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isPending || !tool.available}>
                {isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Aluguel"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

