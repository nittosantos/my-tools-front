import { createRouter, RouterProvider } from "@tanstack/react-router"
import { routeTree } from "../routeTree.gen"

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export function Router() {
  return <RouterProvider router={router} />
}

