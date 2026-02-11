import { NextRequest } from "next/server"

import { proxyBackendRequest } from "@/lib/backend-proxy"

export async function POST(request: NextRequest) {
  return proxyBackendRequest(request, "/api/url-orientations")
}

