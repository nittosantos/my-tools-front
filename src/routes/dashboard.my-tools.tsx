import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useMyTools } from "@/hooks/useMyTools"
import { useDeleteTool } from "@/hooks/useDeleteTool"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
import { Pencil, Trash2, Plus } from "lucide-react"
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
  
  const { data: tools, isLoading, error, refetch } = useMyTools()
  const { mutate: deleteTool, isPending: isDeleting } = useDeleteTool()

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

      {tools && tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="flex flex-col">
              {tool.image_url && (
                <img
                  src={tool.image_url}
                  alt={tool.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
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
                    R$ {tool.price_per_day.toFixed(2)}/dia
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

