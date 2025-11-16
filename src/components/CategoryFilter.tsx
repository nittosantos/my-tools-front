import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
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

interface CategoryFilterProps {
  selectedCategories: Category[]
  onCategoriesChange: (categories: Category[]) => void
}

export function CategoryFilter({ selectedCategories, onCategoriesChange }: CategoryFilterProps) {
  const allCategories = Object.keys(categoryLabels) as Category[]

  const handleCategoryToggle = (category: Category) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  const handleClearFilters = () => {
    onCategoriesChange([])
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtrar por Categoria</CardTitle>
          {selectedCategories.length > 0 && (
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
      <CardContent>
        <div className="space-y-3">
          {allCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label
                htmlFor={category}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {categoryLabels[category]}
              </Label>
            </div>
          ))}
        </div>
        {selectedCategories.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Categorias selecionadas:</p>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {categoryLabels[category]}
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

