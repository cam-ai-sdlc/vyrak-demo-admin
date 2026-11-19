import { NavLink, Outlet } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <nav className="flex items-center gap-2">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              cn(buttonVariants({ variant: isActive ? "secondary" : "ghost" }))
            }
          >
            Products
          </NavLink>
        </nav>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </header>
      <main className="min-w-0 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default App
