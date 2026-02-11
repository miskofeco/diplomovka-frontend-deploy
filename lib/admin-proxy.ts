import { NextRequest, NextResponse } from "next/server"

import {
  ADMIN_SESSION_COOKIE_NAME,
  getBackendApiUrl,
  getProcessingAdminToken,
  isAdminSessionValue,
} from "@/lib/admin-auth"

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

async function readRequestBody(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    const body = await request.json()
    return typeof body === "object" && body !== null ? body : {}
  } catch {
    return {}
  }
}

export function ensureAdminSession(request: NextRequest): NextResponse | null {
  const isAuthenticated = isAdminSessionValue(
    request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  )

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!getProcessingAdminToken()) {
    return NextResponse.json(
      {
        error:
          "PROCESSING_ADMIN_TOKEN is not configured on frontend. Admin processing proxy is disabled.",
      },
      { status: 503 }
    )
  }

  return null
}

export async function proxyAdminPost(
  request: NextRequest,
  backendPath: string
): Promise<NextResponse> {
  const authResponse = ensureAdminSession(request)
  if (authResponse) {
    return authResponse
  }

  const payload = await readRequestBody(request)
  const backendBaseUrl = getBackendApiUrl()
  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        error:
          "Backend API URL is not configured. Set BACKEND_API_URL (or NEXT_PUBLIC_API_URL).",
      },
      { status: 503 }
    )
  }

  const backendUrl = `${backendBaseUrl}${backendPath}`
  const adminToken = getProcessingAdminToken()

  try {
    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Processing-Token": adminToken,
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    })

    const rawText = await backendResponse.text()
    const parsedPayload = parseBackendPayload(rawText)
    return NextResponse.json(parsedPayload, { status: backendResponse.status })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to contact backend.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    )
  }
}
