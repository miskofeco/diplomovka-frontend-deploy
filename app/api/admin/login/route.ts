import { NextRequest, NextResponse } from "next/server"

import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_COOKIE_VALUE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  isAdminTokenConfigured,
  matchesAdminToken,
} from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  if (!isAdminTokenConfigured()) {
    return NextResponse.json(
      {
        error:
          "PROCESSING_ADMIN_TOKEN is not configured on frontend. Admin login is disabled.",
      },
      { status: 503 }
    )
  }

  let payload: { token?: string } = {}
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
  }

  const providedToken = (payload.token || "").trim()
  if (!matchesAdminToken(providedToken)) {
    return NextResponse.json({ error: "Invalid admin token." }, { status: 401 })
  }

  const response = NextResponse.json({ authenticated: true })
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: ADMIN_SESSION_COOKIE_VALUE,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: "/",
  })
  return response
}

