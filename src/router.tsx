import { createBrowserRouter, Navigate } from "react-router-dom"

import App from "./App.tsx"
import NotFoundPage from "./pages/not-found.tsx"
import { productsLoader } from "./pages/products/data.ts"
import ProductsPage from "./pages/products/products-page.tsx"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: "products", element: <ProductsPage />, loader: productsLoader },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
