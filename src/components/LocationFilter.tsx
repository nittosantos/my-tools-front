import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
]

interface LocationFilterProps {
  selectedState: string
  selectedCities: string[]
  onStateChange: (state: string) => void
  onCitiesChange: (cities: string[]) => void
}

// Helper para converter string vazia em undefined para o Select
const toSelectValue = (value: string): string | undefined => {
  return value || undefined
}

export function LocationFilter({
  selectedState,
  selectedCities,
  onStateChange,
  onCitiesChange,
}: LocationFilterProps) {
  const [localCityValue, setLocalCityValue] = useState("")

  const handleAddCity = () => {
    try {
      const city = localCityValue.trim()
      if (city && city.length > 0) {
        // Verificar se a cidade já existe (case-insensitive)
        const cityExists = selectedCities.some(
          (existingCity) => existingCity.toLowerCase() === city.toLowerCase()
        )
        if (!cityExists) {
          onCitiesChange([...selectedCities, city])
          setLocalCityValue("")
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar cidade:", error)
    }
  }

  const handleRemoveCity = (cityToRemove: string) => {
    onCitiesChange(selectedCities.filter((city) => city !== cityToRemove))
  }

  const handleClearFilters = () => {
    onStateChange("")
    onCitiesChange([])
    setLocalCityValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddCity()
    }
  }

  const hasFilters = selectedState || selectedCities.length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtrar por Localização</CardTitle>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="state">Estado (UF)</Label>
          <Select value={toSelectValue(selectedState)} onValueChange={onStateChange}>
            <SelectTrigger id="state">
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent>
              {BRAZILIAN_STATES.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label} ({state.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <div className="flex gap-2">
            <Input
              id="city"
              placeholder="Digite o nome da cidade"
              value={localCityValue}
              onChange={(e) => setLocalCityValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddCity}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Adicionar cidade</span>
            </Button>
          </div>
        </div>

        {hasFilters && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Filtros ativos:</p>
            <div className="flex flex-wrap gap-2">
              {selectedState && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => onStateChange("")}
                >
                  {BRAZILIAN_STATES.find((s) => s.value === selectedState)?.label || selectedState}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {selectedCities.map((city) => (
                <Badge
                  key={city}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveCity(city)}
                >
                  {city}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

