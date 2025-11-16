import { Router } from "./lib/router"
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}

export default App
