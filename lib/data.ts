import { buildApiUrl } from "@/lib/api-url"
import { createSlug } from "@/lib/utils"
import { Article, FactCheckResults, SummaryAnnotations } from "./types"

const FRONTEND_FETCH_TIMEOUT_MS = 15000
let hasLoggedArticlesFetchError = false
let hasLoggedArticleDetailsFetchError = false

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = FRONTEND_FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

function parseMaybeJson<T>(value: unknown): T | null {
  if (value === null || value === undefined) {
    return null
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }
  if (typeof value === "object") {
    return value as T
  }
  return null
}

function normalizeArticle(article: any): Article {
  return {
    id: article.id || "",
    title: article.title || "Untitled",
    slug: article.slug || createSlug(article.title || "untitled"),
    top_image: article.top_image || "",
    intro: article.intro || "",
    summary: article.summary || "",
    content: article.content || article.summary || "",
    url: Array.isArray(article.url) ? article.url : [article.url || ""],
    category: article.category || "uncategorized",
    tags: Array.isArray(article.tags) ? article.tags : article.tags ? [article.tags] : [],
    scraped_at: article.scraped_at || new Date().toISOString(),
    fact_check_results: parseMaybeJson<FactCheckResults>(article.fact_check_results),
    summary_annotations: parseMaybeJson<SummaryAnnotations>(article.summary_annotations),
  }
}

function ensureServerApiUrl(url: string): boolean {
  if (typeof window === "undefined" && url.startsWith("/")) {
    console.error("API base URL is not configured for server-side fetching.")
    return false
  }
  return true
}

export async function getArticles(limit?: number, offset?: number): Promise<Article[]> {
  try {
    let url = buildApiUrl("/api/articles")
    if (!ensureServerApiUrl(url)) {
      return []
    }

    const search = new URLSearchParams()
    if (limit !== undefined) {
      search.set("limit", String(limit))
    }
    if (offset !== undefined) {
      search.set("offset", String(offset))
    }
    const query = search.toString()
    if (query) {
      url += `?${query}`
    }

    const response = await fetchWithTimeout(url, {
      next: {
        revalidate: 300,
        tags: ["articles"],
      },
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("API error while fetching articles:", response.status)
      return []
    }

    const articles = await response.json()
    if (!Array.isArray(articles)) {
      return []
    }

    return articles.map(normalizeArticle)
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      if (!hasLoggedArticlesFetchError) {
        hasLoggedArticlesFetchError = true
        console.error("Fetching articles timed out")
      }
      return []
    }
    if (!hasLoggedArticlesFetchError) {
      hasLoggedArticlesFetchError = true
      console.error("Failed to fetch articles:", error)
    }
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const detailsUrl = buildApiUrl(`/api/articles/${encodeURIComponent(slug)}/details`)
    if (!ensureServerApiUrl(detailsUrl)) {
      return null
    }

    const response = await fetchWithTimeout(detailsUrl, {
      next: {
        revalidate: 300,
        tags: ["articles", `article:${slug}`],
      },
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status !== 404) {
        console.error("API error while fetching article details:", response.status)
      }
      return null
    }

    const article = await response.json()
    return normalizeArticle({ ...article, slug })
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      if (!hasLoggedArticleDetailsFetchError) {
        hasLoggedArticleDetailsFetchError = true
        console.error("Fetching article details timed out")
      }
      return null
    }
    if (!hasLoggedArticleDetailsFetchError) {
      hasLoggedArticleDetailsFetchError = true
      console.error("Failed to fetch article by slug:", error)
    }
    return null
  }
}
