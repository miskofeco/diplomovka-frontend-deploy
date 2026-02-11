import { useState, useCallback } from 'react'
import { Article } from '@/lib/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

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

  const search = useCallback(async (query: string, isAdvanced: boolean = false) => {
    if (!query || query.trim().length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams({
        q: query,
        advanced: isAdvanced.toString()
      })

      const response = await fetch(`${API_BASE}/api/articles/search?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      
      interface RawSearchResult {
        id?: string;
        title?: string;
        top_image?: string | null;
        intro?: string;
        summary?: string;
        content?: string;
        url?: string | string[];
        category?: string;
        tags?: string | string[];
        scraped_at?: string;
        match_score?: number;
        fact_check_results?: any;
        summary_annotations?: any;
      }

      const articles: Article[] = (data as RawSearchResult[])
        .map((article: RawSearchResult, index: number) => ({
          id: article.id || `search-result-${index}`,
          title: article.title || 'Untitled',
          slug: createSlug(article.title || `untitled-${index}`),
          top_image: article.top_image || '',
          intro: article.intro || '',
          summary: article.summary || '',
          content: article.content || article.summary || '',
          url: Array.isArray(article.url) ? article.url : [article.url || ''],
          category: article.category || 'uncategorized',
          tags: Array.isArray(article.tags) ? article.tags : article.tags ? [article.tags] : [],
          scraped_at: article.scraped_at || new Date().toISOString(),
          fact_check_results: parseMaybeJson(article.fact_check_results),
          summary_annotations: parseMaybeJson(article.summary_annotations)
        }))
        .filter((article: Article, index: number, self: Article[]) => 
          index === self.findIndex((a: Article) => a.title === article.title)
        )

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

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
