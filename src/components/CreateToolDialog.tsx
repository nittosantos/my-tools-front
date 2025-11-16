import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { ImageUpload } from "@/components/ImageUpload"
import { useCreateTool } from "@/hooks/useCreateTool"
import { useUpdateTool } from "@/hooks/useUpdateTool"
import { createToolSchema, type CreateToolFormData, type UpdateToolFormData } from "@/lib/schemas"
import type { Tool, Category } from "@/types"

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

interface CreateToolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tool?: Tool // Se fornecido, será modo edição
}

export function CreateToolDialog({ open, onOpenChange, tool }: CreateToolDialogProps) {
  const { mutate: createTool, isPending: isCreating } = useCreateTool()
  const { mutate: updateTool, isPending: isUpdating } = useUpdateTool()
  const isPending = isCreating || isUpdating
  const isEditMode = !!tool

  const form = useForm<CreateToolFormData>({
    resolver: zodResolver(createToolSchema),
    defaultValues: tool
      ? {
          title: tool.title,
          description: tool.description,
          category: tool.category,
          price_per_day: tool.price_per_day,
        state: tool.state || "",
        city: tool.city || "",
          image: tool.image_url || undefined,
        }
      : {
          title: "",
          description: "",
          category: "outros",
          price_per_day: 0,
        state: "",
        city: "",
        },
  })

  const onSubmit = (data: CreateToolFormData) => {
    if (isEditMode && tool) {
      const updateData: UpdateToolFormData = {
        id: tool.id,
        ...data,
      }
      updateTool(updateData, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    } else {
      createTool(data, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Ferramenta" : "Criar Nova Ferramenta"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize as informações da ferramenta"
              : "Preencha os dados da ferramenta que deseja disponibilizar para aluguel"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Furadeira Elétrica" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a ferramenta..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço por Dia (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado (UF)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BRAZILIAN_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label} ({state.value})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(file) => field.onChange(file || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEditMode ? "Salvando..." : "Criando..."}
                  </>
                ) : (
                  isEditMode ? "Salvar" : "Criar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

