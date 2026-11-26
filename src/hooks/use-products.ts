import * as React from "react"

import type { Product, ProductInput } from "@/lib/product-schema"
import {
  createProduct,
  listProducts,
  updateProduct,
} from "@/lib/products-api"

type Status = "loading" | "error" | "success"

function sortByName(products: Product[]) {
  return [...products].sort((a, b) => a.name.localeCompare(b.name))
}

export function useProducts() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [status, setStatus] = React.useState<Status>("loading")
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    try {
      const data = await listProducts()
      setProducts(sortByName(data))
      setError(null)
      setStatus("success")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products.")
      setStatus("error")
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const reload = React.useCallback(() => {
    setStatus("loading")
    return load()
  }, [load])

  const create = React.useCallback(async (input: ProductInput) => {
    const product = await createProduct(input)
    setProducts((current) => sortByName([...current, product]))
    return product
  }, [])

  const update = React.useCallback(
    async (id: string, input: ProductInput) => {
      const product = await updateProduct(id, input)
      setProducts((current) =>
        sortByName(current.map((p) => (p.id === id ? product : p)))
      )
      return product
    },
    []
  )

  return { products, status, error, reload, create, update }
}
