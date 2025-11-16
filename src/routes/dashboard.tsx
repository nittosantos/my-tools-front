import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context, location }) => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Outlet />
    </div>
  )
}

