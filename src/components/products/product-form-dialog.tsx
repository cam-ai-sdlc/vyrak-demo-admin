import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  validateProduct,
  type Product,
  type ProductFormErrors,
  type ProductFormValues,
  type ProductInput,
} from "@/lib/product-schema"

export type DialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; product: Product }

type ProductFormDialogProps = {
  state: DialogState
  onClose: () => void
  onCreate: (input: ProductInput) => Promise<unknown>
  onUpdate: (id: string, input: ProductInput) => Promise<unknown>
}

export function ProductFormDialog({
  state,
  onClose,
  onCreate,
  onUpdate,
}: ProductFormDialogProps) {
  const [saving, setSaving] = React.useState(false)

  return (
    <Dialog
      open={state.mode !== "closed"}
      onOpenChange={(open) => {
        // Block dismissal while a save is in flight.
        if (!open && !saving) onClose()
      }}
    >
      <DialogContent>
        {state.mode !== "closed" && (
          <ProductForm
            // Remount per mode/product so values never go stale.
            key={state.mode === "edit" ? `edit-${state.product.id}` : "create"}
            state={state}
            saving={saving}
            setSaving={setSaving}
            onClose={onClose}
            onCreate={onCreate}
            onUpdate={onUpdate}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

type ProductFormProps = Omit<ProductFormDialogProps, "state"> & {
  state: Exclude<DialogState, { mode: "closed" }>
  saving: boolean
  setSaving: (saving: boolean) => void
}

function ProductForm({
  state,
  saving,
  setSaving,
  onClose,
  onCreate,
  onUpdate,
}: ProductFormProps) {
  const [values, setValues] = React.useState<ProductFormValues>(() =>
    state.mode === "edit"
      ? {
          name: state.product.name,
          price: String(state.product.price),
          stock: String(state.product.stock),
        }
      : { name: "", price: "", stock: "" }
  )
  const [errors, setErrors] = React.useState<ProductFormErrors>({})
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const setField = (field: keyof ProductFormValues, value: string) =>
    setValues((current) => ({ ...current, [field]: value }))

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (saving) return
    const result = validateProduct(values)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    setErrors({})
    setSubmitError(null)
    setSaving(true)
    try {
      if (state.mode === "edit") {
        await onUpdate(state.product.id, result.value)
      } else {
        await onCreate(result.value)
      }
      toast.success(
        state.mode === "edit" ? "Product updated." : "Product created."
      )
      setSaving(false)
      onClose()
    } catch (e) {
      setSaving(false)
      setSubmitError(
        e instanceof Error ? e.message : "Failed to save the product."
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <DialogHeader>
        <DialogTitle>
          {state.mode === "edit" ? "Edit product" : "Add product"}
        </DialogTitle>
      </DialogHeader>

      <Field id="product-name" label="Name" error={errors.name}>
        <Input
          id="product-name"
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          aria-invalid={!!errors.name}
          autoFocus
        />
      </Field>
      <Field id="product-price" label="Price (VND)" error={errors.price}>
        <Input
          id="product-price"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={values.price}
          onChange={(e) => setField("price", e.target.value)}
          aria-invalid={!!errors.price}
        />
      </Field>
      <Field id="product-stock" label="Stock" error={errors.stock}>
        <Input
          id="product-stock"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={values.stock}
          onChange={(e) => setField("stock", e.target.value)}
          aria-invalid={!!errors.stock}
        />
      </Field>

      {submitError && (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
