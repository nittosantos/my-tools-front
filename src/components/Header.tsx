import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, Wrench, FileText, Inbox } from "lucide-react"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Não mostrar botão "Entrar" na página de login
  const isLoginPage = location.pathname === '/login'

  // Função para gerar iniciais do usuário
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  // Função para obter nome de exibição
  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user?.username || "Usuário"
  }

  const handleLogout = () => {
    logout()
    navigate({ to: "/" })
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            🧰 Aluguel de Ferramentas
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <ThemeToggle />
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 gap-2 px-2 hover:bg-accent"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={undefined} alt={getDisplayName()} />
                      <AvatarFallback className="text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block text-sm font-medium">
                      {getDisplayName()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/my-tools"
                      className="flex items-center"
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      <span>Minhas Ferramentas</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/my-rentals"
                      className="flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Meus Aluguéis</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/received-rentals"
                      className="flex items-center"
                    >
                      <Inbox className="mr-2 h-4 w-4" />
                      <span>Aluguéis Recebidos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ) : (
              // Só mostrar botão "Entrar" se NÃO estiver na página de login
              !isLoginPage && (
                <>
                  <ThemeToggle />
                  <Link to="/login">
                    <Button>Entrar</Button>
                  </Link>
                </>
              )
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

