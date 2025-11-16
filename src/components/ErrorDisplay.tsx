import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorDisplayProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorDisplay({
  title = "Erro ao carregar dados",
  message = "Ocorreu um erro ao carregar os dados. Tente novamente.",
  onRetry,
}: ErrorDisplayProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

