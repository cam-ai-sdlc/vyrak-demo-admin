import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-3 py-12">
      <h1 className="text-2xl font-medium">Page not found</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link to="/products" className={buttonVariants({ variant: "outline" })}>
        Go to products
      </Link>
    </div>
  )
}

export default NotFoundPage
