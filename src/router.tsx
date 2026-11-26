import { createBrowserRouter, Navigate } from "react-router-dom"

import App from "@/App"
import { ProductsPage } from "@/pages/products/products-page"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: "products", element: <ProductsPage /> },
    ],
  },
])
