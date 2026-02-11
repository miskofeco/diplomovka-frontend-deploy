const DEV_BACKEND_API_URL = "http://localhost:5001"

function normalizeBaseUrl(value: string | undefined): string {
  return (value || "").trim().replace(/\/+$/, "")
}

export function getApiBaseUrl(): string {
  const publicBase = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL)
  if (publicBase) {
    return publicBase
  }

  if (typeof window === "undefined") {
    const serverBase = normalizeBaseUrl(process.env.BACKEND_API_URL)
    if (serverBase) {
      return serverBase
    }

    const vercelUrl = process.env.VERCEL_URL
    if (vercelUrl) {
      return normalizeBaseUrl(`https://${vercelUrl}`)
    }

    if (process.env.NODE_ENV !== "production") {
      return DEV_BACKEND_API_URL
    }
  }

  return ""
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const base = getApiBaseUrl()
  return base ? `${base}${normalizedPath}` : normalizedPath
}

