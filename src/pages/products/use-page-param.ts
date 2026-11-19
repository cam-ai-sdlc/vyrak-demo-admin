import { useCallback, useEffect, useState } from "react"

function readPage(): number {
  const raw = new URLSearchParams(window.location.search).get("page")
  const n = Number(raw)
  return Number.isInteger(n) && n >= 1 ? n : 1
}

/** Current page stored in `?page=N`; syncs with Back/Forward. */
export function usePageParam() {
  const [page, setPageState] = useState(readPage)

  useEffect(() => {
    const onPop = () => setPageState(readPage())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  const setPage = useCallback((next: number, replace = false) => {
    const url = new URL(window.location.href)
    url.searchParams.set("page", String(next))
    if (replace) window.history.replaceState(null, "", url)
    else window.history.pushState(null, "", url)
    setPageState(next)
  }, [])

  return [page, setPage] as const
}
