import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchProducts, type Product } from "./data"
import { usePageParam } from "./use-page-param"

const PAGE_SIZE = 10
const priceFormat = new Intl.NumberFormat("vi-VN")

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; items: Product[]; total: number }

export function ProductsPage() {
  const [page, setPage] = usePageParam()
  const [state, setState] = useState<State>({ status: "loading" })
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ status: "loading" })
    fetchProducts({ page, pageSize: PAGE_SIZE })
      .then(({ items, total }) => {
        if (cancelled) return
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
        if (page > totalPages) {
          setPage(totalPages, true) // clamp out-of-range page
          return
        }
        setState({ status: "success", items, total })
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" })
      })
    return () => {
      cancelled = true
    }
  }, [page, retry, setPage])

  const total = state.status === "success" ? state.total : 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <h1 className="text-xl font-medium">Products</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price (₫)</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.status === "loading" && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          )}
          {state.status === "error" && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                <span className="text-destructive">Failed to load products. </span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setRetry((r) => r + 1)}
                >
                  Retry
                </Button>
              </TableCell>
            </TableRow>
          )}
          {state.status === "success" && state.items.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No products
              </TableCell>
            </TableRow>
          )}
          {state.status === "success" &&
            state.items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {priceFormat.format(p.price)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {p.quantity}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Page {page} / {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={state.status !== "success" || page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  )
}
