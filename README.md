# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Routes

- `/` redirects to `/products`
- `/products` lists products with name search and an Add/Edit dialog

Product data is an in-memory mock (`src/lib/products-api.ts`) and resets on
reload. Prices are whole VND. In dev, run
`__productsApi.setForceFailure(true)` in the browser console to make the next
API call fail.
