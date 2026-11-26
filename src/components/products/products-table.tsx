import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatVnd, type Product } from "@/lib/product-schema"

type ProductsTableProps = {
  products: Product[]
  onEdit: (product: Product) => void
}

export function ProductsTable({ products, onEdit }: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatVnd(product.price)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(product)}
                aria-label={`Edit ${product.name}`}
              >
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
