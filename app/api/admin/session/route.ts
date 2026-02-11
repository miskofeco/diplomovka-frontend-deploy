import { NextRequest, NextResponse } from "next/server"

import {
  ADMIN_SESSION_COOKIE_NAME,
  isAdminSessionValue,
  isAdminTokenConfigured,
} from "@/lib/admin-auth"

export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  const authenticated = isAdminTokenConfigured() && isAdminSessionValue(cookieValue)

  return NextResponse.json({ authenticated })
}

