import { NavLink, Outlet } from "react-router-dom"
import { cn } from "cn"

import { Toaster } from "@/components/ui/sonner"

export function App() {
  return (
    <div className="min-h-svh">
      <header className="border-b px-6 py-3">
        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              cn(
                "font-medium hover:text-foreground",
                isActive ? "text-foreground" : "text-muted-foreground"
              )
            }
          >
            Products
          </NavLink>
        </nav>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}

export default App
