import { NextResponse } from "next/server"

import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/admin-auth"

export async function POST() {
  const response = NextResponse.json({ authenticated: false })
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
  return response
}

