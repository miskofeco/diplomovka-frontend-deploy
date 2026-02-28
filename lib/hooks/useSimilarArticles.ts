import { useState, useEffect } from 'react'
import { Article, FactCheckResults, SummaryAnnotations } from '@/lib/types'
import { buildApiUrl } from "@/lib/api-url"

const similarArticlesCache = new Map<string, Article[]>()
const similarArticlesInFlight = new Map<string, Promise<Article[]>>()

function parseMaybeJson<T>(value: unknown): T | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }
  if (typeof value === 'object') return value as T
  return null
}

async function fetchSimilarArticlesById(articleId: string): Promise<Article[]> {
  const existingRequest = similarArticlesInFlight.get(articleId)
  if (existingRequest) {
    return existingRequest
  }

  const request = (async () => {
    const url = buildApiUrl(`/api/articles/${articleId}/similar`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch similar articles`)
    }

    const data = await response.json()

    return data.map((article: any, index: number) => ({
      id: article.id || `similar-${index}`,
      title: article.title || 'Untitled',
      slug: createSlug(article.title || `untitled-${index}`),
      top_image: article.top_image || '',
      intro: article.intro || '',
      summary: article.summary || '',
      content: article.summary || '',
      url: Array.isArray(article.url) ? article.url : [article.url || ''],
      category: article.category || 'uncategorized',
      tags: Array.isArray(article.tags) ? article.tags : article.tags ? [article.tags] : [],
      scraped_at: article.scraped_at || new Date().toISOString(),
      fact_check_results: parseMaybeJson<FactCheckResults>(article.fact_check_results),
      summary_annotations: parseMaybeJson<SummaryAnnotations>(article.summary_annotations)
    })) as Article[]
  })()

  similarArticlesInFlight.set(articleId, request)

  try {
    const articles = await request
    similarArticlesCache.set(articleId, articles)
    return articles
  } finally {
    similarArticlesInFlight.delete(articleId)
  }
}

export function useSimilarArticles(articleId: string | null) {
  const [similarArticles, setSimilarArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    if (!articleId) {
      setSimilarArticles([])
      setError(null)
      setIsLoading(false)
      return
    }

    const cachedArticles = similarArticlesCache.get(articleId)
    if (cachedArticles) {
      setSimilarArticles(cachedArticles)
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
    setError(null)

    fetchSimilarArticlesById(articleId)
      .then((articles) => {
        if (isCancelled) {
          return
        }
        setSimilarArticles(articles)
        setError(null)
      })
      .catch((err) => {
        if (isCancelled) {
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to fetch similar articles')
        if (!cachedArticles) {
          setSimilarArticles([])
        }
      })
      .finally(() => {
        if (isCancelled) {
          return
        }
        setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [articleId])

  return { similarArticles, isLoading, error }
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
