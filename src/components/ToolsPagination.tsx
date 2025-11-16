import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface ToolsPaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  onPageChange: (page: number) => void
}

export function ToolsPagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: ToolsPaginationProps) {
  // Se não houver paginação, não renderizar nada
  if (totalPages <= 1) {
    return null
  }

  // Gerar números de página para exibir
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Mostrar todas as páginas se houver poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    // Sempre mostrar primeira página
    pages.push(1)

    // Calcular páginas ao redor da atual
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    // Ajustar se estiver muito perto do início
    if (currentPage <= 3) {
      start = 2
      end = Math.min(4, totalPages - 1)
    }

    // Ajustar se estiver muito perto do fim
    if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - 3)
      end = totalPages - 1
    }

    // Adicionar ellipsis antes se necessário
    if (start > 2) {
      pages.push("ellipsis")
    }

    // Adicionar páginas ao redor da atual
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Adicionar ellipsis depois se necessário
    if (end < totalPages - 1) {
      pages.push("ellipsis")
    }

    // Sempre mostrar última página
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <div className="w-full py-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (!isFirstPage) {
                  onPageChange(1)
                }
              }}
              className={isFirstPage ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (hasPrevious && currentPage > 1) {
                  onPageChange(currentPage - 1)
                }
              }}
              className={!hasPrevious ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(page)
                  }}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (hasNext && currentPage < totalPages) {
                  onPageChange(currentPage + 1)
                }
              }}
              className={!hasNext ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLast
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (!isLastPage) {
                  onPageChange(totalPages)
                }
              }}
              className={isLastPage ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

