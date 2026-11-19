export type ProductStatus = "active" | "draft" | "out_of_stock"

export type Product = {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  status: ProductStatus
}

const STATUSES: ProductStatus[] = ["active", "draft", "out_of_stock"]

const PRODUCTS: Product[] = Array.from({ length: 45 }, (_, i) => {
  const n = i + 1
  const status = STATUSES[i % STATUSES.length]
  return {
    id: String(n),
    name: `Product ${n}`,
    sku: `SKU-${String(n).padStart(4, "0")}`,
    price: 50_000 + n * 25_000,
    stock: status === "out_of_stock" ? 0 : (n * 7) % 100,
    status,
  }
})

export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return PRODUCTS
}

export async function productsLoader() {
  return { products: await getProducts() }
}
