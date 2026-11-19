import { useLoaderData, useNavigation, useSearchParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductsLoadingRows } from "./loading"
import type { productsLoader, ProductStatus } from "./data"

const STATUS_LABEL: Record<ProductStatus, string> = {
  active: "Active",
  draft: "Draft",
  out_of_stock: "Out of stock",
}

const STATUS_VARIANT: Record<
  ProductStatus,
  "default" | "secondary" | "destructive"
> = {
  active: "default",
  draft: "secondary",
  out_of_stock: "destructive",
}

const priceFormat = new Intl.NumberFormat("vi-VN")

export function ProductsPage() {
  const { products } = useLoaderData<Awaited<ReturnType<typeof productsLoader>>>()
  const navigation = useNavigation()
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get("q") ?? ""

  const needle = q.trim().toLowerCase()
  const filtered = needle
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.sku.toLowerCase().includes(needle)
      )
    : products

  const isLoading = navigation.state === "loading"

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Products</CardTitle>
        <Input
          type="search"
          aria-label="Search products"
          placeholder="Search by name or SKU"
          value={q}
          className="sm:max-w-xs"
          onChange={(e) => {
            const value = e.target.value
            setSearchParams(value ? { q: value } : {}, { replace: true })
          }}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <ProductsLoadingRows />
          ) : (
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.sku}
                    </TableCell>
                    <TableCell className="text-right">
                      {priceFormat.format(p.price)}
                    </TableCell>
                    <TableCell className="text-right">{p.stock}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[p.status]}>
                        {STATUS_LABEL[p.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}

export default ProductsPage
