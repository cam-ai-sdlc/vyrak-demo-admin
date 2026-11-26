import type { Product, ProductInput } from "@/lib/product-schema"

// In-memory mock; swap for a real HTTP client later (ADR-0002).
const DELAY_MS = 400

let store: Product[] = [
  { id: "1", name: "Cà phê rang xay", price: 150000, stock: 42 },
  { id: "2", name: "Trà ô long", price: 95000, stock: 18 },
  { id: "3", name: "Bình giữ nhiệt", price: 320000, stock: 7 },
  { id: "4", name: "Ly sứ", price: 60000, stock: 120 },
]
let nextId = 5
let failNext = false

/** For manual testing: make the next API call reject. */
export function setForceFailure(value: boolean) {
  failNext = value
}

if (import.meta.env.DEV && typeof window !== "undefined") {
  ;(window as unknown as { __productsApi: unknown }).__productsApi = {
    setForceFailure,
  }
}

async function simulate<T>(run: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
  if (failNext) {
    failNext = false
    throw new Error("Simulated request failure.")
  }
  return run()
}

export function listProducts(): Promise<Product[]> {
  return simulate(() => store.map((p) => ({ ...p })))
}

export function createProduct(input: ProductInput): Promise<Product> {
  return simulate(() => {
    const product: Product = { id: String(nextId++), ...input }
    store = [...store, product]
    return { ...product }
  })
}

export function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product> {
  return simulate(() => {
    const existing = store.find((p) => p.id === id)
    if (!existing) {
      throw new Error("Product not found.")
    }
    const product: Product = { id, ...input }
    store = store.map((p) => (p.id === id ? product : p))
    return { ...product }
  })
}
