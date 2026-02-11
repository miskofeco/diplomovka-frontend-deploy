import { NextRequest } from "next/server"

import { proxyBackendRequest } from "@/lib/backend-proxy"

type RouteContext = {
  params: { articleId: string }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(
    request,
    `/api/articles/${encodeURIComponent(context.params.articleId)}/similar`
  )
}

