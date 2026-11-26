import * as React from "react"

import {
  ProductFormDialog,
  type DialogState,
} from "@/components/products/product-form-dialog"
import { ProductsTable } from "@/components/products/products-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProducts } from "@/hooks/use-products"

export function ProductsPage() {
  const { products, status, error, reload, create, update } = useProducts()
  const [search, setSearch] = React.useState("")
  const [dialog, setDialog] = React.useState<DialogState>({ mode: "closed" })

  const query = search.trim().toLowerCase()
  const filtered = query
    ? products.filter((p) => p.name.toLowerCase().includes(query))
    : products

  const closeDialog = React.useCallback(() => setDialog({ mode: "closed" }), [])

  let content: React.ReactNode
  if (status === "loading") {
    content = <p role="status" className="py-8 text-center text-muted-foreground">Loading products…</p>
  } else if (status === "error") {
    content = (
      <div role="alert" className="flex flex-col items-center gap-3 py-8">
        <p className="text-destructive">
          {error ?? "Failed to load products."}
        </p>
        <Button variant="outline" onClick={() => void reload()}>
          Retry
        </Button>
      </div>
    )
  } else if (products.length === 0) {
    content = (
      <div className="flex flex-col items-center gap-3 py-8">
        <p className="text-muted-foreground">No products yet.</p>
        <Button onClick={() => setDialog({ mode: "create" })}>
          Add your first product
        </Button>
      </div>
    )
  } else if (filtered.length === 0) {
    content = (
      <p className="py-8 text-center text-muted-foreground">
        No products found
      </p>
    )
  } else {
    content = (
      <ProductsTable
        products={filtered}
        onEdit={(product) => setDialog({ mode: "edit", product })}
      />
    )
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Products</h1>
        <Button onClick={() => setDialog({ mode: "create" })}>
          Add product
        </Button>
      </div>
      <Input
        type="search"
        placeholder="Search by name"
        aria-label="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {content}
      <ProductFormDialog
        state={dialog}
        onClose={closeDialog}
        onCreate={create}
        onUpdate={update}
      />
    </div>
  )
}
