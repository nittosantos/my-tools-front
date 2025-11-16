import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  className?: string
  maxSizeMB?: number
  acceptedFormats?: string[]
}

export function ImageUpload({
  value,
  onChange,
  className,
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp"],
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    value instanceof File ? URL.createObjectURL(value) : value || null
  )
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
    if (!acceptedFormats.includes(file.type)) {
      setError(`Formato inválido. Use: ${acceptedFormats.join(", ")}`)
      return
    }

    // Validar tamanho
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSizeMB) {
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`)
      return
    }

    setError(null)
    setPreview(URL.createObjectURL(file))
    onChange(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-md p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Selecionar imagem
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            PNG, JPG ou WEBP até {maxSizeMB}MB
          </p>
        </div>
      )}
      <Input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

