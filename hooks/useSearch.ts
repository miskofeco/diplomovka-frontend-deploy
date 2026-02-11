import { useState, useCallback } from 'react'
import { Article, FactCheckResults, SummaryAnnotations } from '@/lib/types'
import { buildApiUrl } from "@/lib/api-url"

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

export function useSearch() {
  const [results, setResults] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${buildApiUrl("/api/articles/search")}?q=${encodeURIComponent(query)}`
      )
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      
      // Transform the data to match your Article type
      const articles: Article[] = data.map((article: any) => ({
        id: article.id || '',
        title: article.title || 'Untitled',
        slug: createSlug(article.title || 'untitled'),
        top_image: article.top_image || null,
        intro: article.intro || '',
        summary: article.summary || '',
        content: article.content || article.summary || '',
        url: Array.isArray(article.url) ? article.url : [article.url || ''],
        category: article.category || 'uncategorized',
        tags: Array.isArray(article.tags) ? article.tags : article.tags ? [article.tags] : [],
        scraped_at: article.scraped_at || new Date().toISOString(),
        fact_check_results: parseMaybeJson<FactCheckResults>(article.fact_check_results),
        summary_annotations: parseMaybeJson<SummaryAnnotations>(article.summary_annotations)
      }))

      setResults(articles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return {
    results,
    isLoading,
    error,
    search,
    clearResults
  }
}

// Helper function (you might already have this)
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
