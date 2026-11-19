export type Product = {
  id: number
  name: string
  price: number // VND
  quantity: number
}

const NAMES = [
  "Áo thun cotton",
  "Quần jean slim",
  "Giày sneaker",
  "Balo laptop",
  "Tai nghe Bluetooth",
  "Chuột không dây",
  "Bàn phím cơ",
  "Màn hình 24 inch",
  "Sạc dự phòng",
  "Bình giữ nhiệt",
  "Đèn bàn LED",
  "Ổ cứng SSD 512GB",
  "Loa mini",
  "Ốp lưng điện thoại",
  "Sổ tay bìa da",
]

const PRODUCTS: Product[] = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `${NAMES[i % NAMES.length]} #${i + 1}`,
  price: (((i * 7919) % 190) + 10) * 10_000,
  quantity: (i * 37) % 200,
}))

export async function fetchProducts({
  page,
  pageSize,
}: {
  page: number
  pageSize: number
}): Promise<{ items: Product[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const start = (page - 1) * pageSize
  return {
    items: PRODUCTS.slice(start, start + pageSize),
    total: PRODUCTS.length,
  }
}
