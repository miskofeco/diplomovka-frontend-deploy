import { NextRequest, NextResponse } from "next/server"

import { getBackendApiUrl } from "@/lib/admin-auth"

const BACKEND_PROXY_TIMEOUT_MS = Number(
  process.env.BACKEND_PROXY_TIMEOUT_MS || "15000"
)

function parseBackendPayload(rawText: string): unknown {
  if (!rawText) {
    return {}
  }

  try {
    return JSON.parse(rawText)
  } catch {
    return { error: "Invalid JSON response from backend.", raw: rawText.slice(0, 500) }
  }
}

export async function proxyBackendRequest(
  request: NextRequest,
  backendPath: string
): Promise<NextResponse> {
  const backendBase = getBackendApiUrl()
  if (!backendBase) {
    return NextResponse.json(
      {
        error:
          "Backend API URL is not configured. Set BACKEND_API_URL (or NEXT_PUBLIC_API_URL).",
      },
      { status: 503 }
    )
  }

  const incomingUrl = new URL(request.url)
  const targetUrl = `${backendBase}${backendPath}${incomingUrl.search}`

  const headers: Record<string, string> = {
    Accept: "application/json",
  }
  const contentType = request.headers.get("content-type")
  if (contentType) {
    headers["Content-Type"] = contentType
  }

  const method = request.method.toUpperCase()
  const body =
    method === "GET" || method === "HEAD" ? undefined : await request.text()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_PROXY_TIMEOUT_MS)

    const backendResponse = await fetch(targetUrl, {
      method,
      headers,
      cache: "no-store",
      signal: controller.signal,
      body: body && body.length > 0 ? body : undefined,
    }).finally(() => clearTimeout(timeoutId))

    const rawText = await backendResponse.text()
    const parsedPayload = parseBackendPayload(rawText)
    return NextResponse.json(parsedPayload, { status: backendResponse.status })
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          error: "Backend request timed out.",
          details: `No response within ${BACKEND_PROXY_TIMEOUT_MS}ms.`,
        },
        { status: 504 }
      )
    }

    return NextResponse.json(
      {
        error: "Failed to contact backend.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    )
  }
}
