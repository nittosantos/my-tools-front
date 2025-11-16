import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface SearchAndSortCardProps {
  searchValue: string
  onSearchChange: (value: string) => void
  orderingValue: string
  onOrderingChange: (value: string) => void
}

// Helper para converter string vazia em undefined para o Select
const toSelectValue = (value: string): string | undefined => {
  return value || undefined
}

const orderingOptions = [
  { value: "created_at", label: "Mais recentes" },
  { value: "-created_at", label: "Mais antigas" },
  { value: "price_per_day", label: "Preço Crescente" },
  { value: "-price_per_day", label: "Preço Decrescente" },
]

export function SearchAndSortCard({
  searchValue,
  onSearchChange,
  orderingValue,
  onOrderingChange,
}: SearchAndSortCardProps) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue)

  // Sincronizar estado local quando searchValue mudar externamente
  useEffect(() => {
    setLocalSearchValue(searchValue)
  }, [searchValue])

  const handleSearch = () => {
    onSearchChange(localSearchValue)
  }

  const handleClear = () => {
    setLocalSearchValue("")
    onSearchChange("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Buscar e Ordenar</CardTitle>
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Apagar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Buscar ferramentas (ex: furadeira)..."
            value={localSearchValue}
            onChange={(e) => setLocalSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleSearch}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Buscar</span>
          </Button>
        </div>
        <Select value={toSelectValue(orderingValue)} onValueChange={onOrderingChange}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por..." />
          </SelectTrigger>
          <SelectContent>
            {orderingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

