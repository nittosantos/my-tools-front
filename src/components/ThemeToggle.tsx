import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar hidratação mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-10 w-10" disabled>
        <Sun className="h-5 w-5" />
        <span className="sr-only">Carregando tema</span>
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Alternar para tema claro" : "Alternar para tema escuro"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-all" />
      ) : (
        <Moon className="h-5 w-5 transition-all" />
      )}
      <span className="sr-only">
        {isDark ? "Alternar para tema claro" : "Alternar para tema escuro"}
      </span>
    </Button>
  )
}

