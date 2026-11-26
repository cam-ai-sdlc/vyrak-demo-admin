export type Product = {
  id: string
  name: string
  /** Whole number of VND (no minor unit). */
  price: number
  stock: number
}

export type ProductInput = Omit<Product, "id">

export type ProductFormValues = {
  name: string
  price: string
  stock: string
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>

export const NAME_MAX_LENGTH = 100

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

export function formatVnd(value: number) {
  return vndFormatter.format(value)
}

/**
 * Validates raw form strings. The price rule (non-negative whole VND) lives
 * here only, pending PM confirmation of the PRD's "2 decimals" wording.
 */
export function validateProduct(
  raw: ProductFormValues
):
  | { ok: true; value: ProductInput }
  | { ok: false; errors: ProductFormErrors } {
  const errors: ProductFormErrors = {}

  const name = raw.name.trim()
  if (!name) {
    errors.name = "Name is required."
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `Name must be at most ${NAME_MAX_LENGTH} characters.`
  }

  const priceText = raw.price.trim()
  const price = Number(priceText)
  if (!priceText) {
    errors.price = "Price is required."
  } else if (!Number.isFinite(price) || price < 0) {
    errors.price = "Price must be a number of 0 or more."
  } else if (!Number.isInteger(price)) {
    errors.price = "Price must be a whole number of VND."
  }

  const stockText = raw.stock.trim()
  const stock = Number(stockText)
  if (!stockText) {
    errors.stock = "Stock is required."
  } else if (!Number.isFinite(stock) || !Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a whole number of 0 or more."
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }
  return { ok: true, value: { name, price, stock } }
}
