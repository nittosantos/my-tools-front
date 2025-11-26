import { createFileRoute } from "@tanstack/react-router"
import { useState, useMemo } from "react"
import { useMyTools } from "@/hooks/useMyTools"
import { useDeleteTool } from "@/hooks/useDeleteTool"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { CreateToolDialog } from "@/components/CreateToolDialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Plus, Search, X } from "lucide-react"
import type { Tool, Category } from "@/types"

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

export const Route = createFileRoute("/dashboard/my-tools")({
  component: MyToolsPage,
})

function MyToolsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editTool, setEditTool] = useState<Tool | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])

  const { data: tools, isLoading, error, refetch } = useMyTools()
  const { mutate: deleteTool, isPending: isDeleting } = useDeleteTool()

  // Filtrar ferramentas no frontend
  const filteredTools = useMemo(() => {
    // Garantir que tools sempre seja um array antes de usar .filter()
    if (!tools || !Array.isArray(tools)) return []

    return tools.filter((tool) => {
      // Filtro por nome (busca no título e descrição)
      const matchesSearch =
        !searchQuery ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Filtro por categoria
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(tool.category)

      return matchesSearch && matchesCategory
    })
  }, [tools, searchQuery, selectedCategories])

  const handleEdit = (tool: Tool) => {
    setEditTool(tool)
    setCreateDialogOpen(true)
  }

  const handleDeleteClick = (tool: Tool) => {
    setToolToDelete(tool)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (toolToDelete) {
      deleteTool(toolToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setToolToDelete(null)
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Minhas Ferramentas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Minhas Ferramentas</h2>
        </div>
        <ErrorDisplay onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Minhas Ferramentas</h2>
        <Button onClick={() => {
          setEditTool(null)
          setCreateDialogOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Ferramenta
        </Button>
      </div>

      {/* Filtros - Layout Compacto */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Busca por Nome */}
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar por Nome</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Digite o nome da ferramenta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Filtro de Categorias - Compacto */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Filtrar por Categoria</label>
                {selectedCategories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategories([])}
                    className="h-7 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryLabels).map(([value, label]) => {
                  const category = value as Category
                  const isSelected = selectedCategories.includes(category)
                  return (
                    <Button
                      key={category}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCategories(selectedCategories.filter((c) => c !== category))
                        } else {
                          setSelectedCategories([...selectedCategories, category])
                        }
                      }}
                      className="h-8 text-xs"
                    >
                      {label}
                    </Button>
                  )
                })}
              </div>
              {selectedCategories.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    {selectedCategories.length} categoria{selectedCategories.length !== 1 ? "s" : ""} selecionada{selectedCategories.length !== 1 ? "s" : ""}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== category))}
                      >
                        {categoryLabels[category]}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contador de resultados */}
          {tools && tools.length > 0 && (
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredTools.length === tools.length ? (
                <span>Mostrando todas as {tools.length} ferramenta{tools.length !== 1 ? "s" : ""}</span>
              ) : (
                <span>
                  Mostrando {filteredTools.length} de {tools.length} ferramenta{tools.length !== 1 ? "s" : ""}
                  {(searchQuery || selectedCategories.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategories([])
                      }}
                      className="ml-2 h-6 text-xs"
                    >
                      Limpar filtros
                    </Button>
                  )}
                </span>
              )}
            </div>
          )}

                {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
            <Card key={tool.id} className="flex flex-col">
              {tool.image_url && (
                <div className="w-full h-48 rounded-t-lg bg-muted overflow-hidden flex items-center justify-center">
                  <img
                    src={tool.image_url}
                    alt={tool.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    style={{
                      objectFit: 'contain',
                      objectPosition: 'center',
                      display: 'block'
                    }}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                <CardDescription>
                  {categoryLabels[tool.category]}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {tool.description}
                </p>
                {tool.city && tool.state && (
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs">
                      📍 {tool.city} / {tool.state}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">
                    R$ {formatPrice(tool.price_per_day)}/dia
                  </p>
                  <Badge variant={tool.available ? "default" : "secondary"}>
                    {tool.available ? "Disponível" : "Indisponível"}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(tool)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteClick(tool)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar
                </Button>
              </CardFooter>
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
                    d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 010-3.586l4.94-4.94a2.548 2.548 0 013.586 0l5.653 4.655a2.548 2.548 0 010 3.586l-4.94 4.94a2.548 2.548 0 01-3.586 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma ferramenta cadastrada</h3>
            <p className="text-muted-foreground mb-6">
              Comece a alugar suas ferramentas! Cadastre sua primeira ferramenta e comece a ganhar dinheiro.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Ferramenta
            </Button>
          </div>
        </div>
      )}

      <CreateToolDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open)
          if (!open) setEditTool(null)
        }}
        tool={editTool || undefined}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar a ferramenta "{toolToDelete?.title}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setToolToDelete(null)
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
