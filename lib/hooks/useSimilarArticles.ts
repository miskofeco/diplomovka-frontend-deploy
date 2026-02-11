import { useState, useEffect } from 'react'
import { Article, FactCheckResults, SummaryAnnotations } from '@/lib/types'

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

export function useSimilarArticles(articleId: string | null) {
  const [similarArticles, setSimilarArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('useSimilarArticles called with articleId:', articleId)
    
    if (!articleId) {
      console.log('No articleId provided, clearing similar articles')
      setSimilarArticles([])
      return
    }

    const fetchSimilarArticles = async () => {
      console.log('Starting to fetch similar articles for ID:', articleId)
      setIsLoading(true)
      setError(null)

      try {
        const url = `${API_BASE}/api/articles/${articleId}/similar`
        console.log('Fetching from URL:', url)
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch similar articles`)
        }

        const data = await response.json()
        console.log('Received similar articles data:', data)
        
        // Transform the data to match Article interface
        const transformedArticles: Article[] = data.map((article: any, index: number) => ({
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
        }))

        console.log('Transformed articles:', transformedArticles.length)
        setSimilarArticles(transformedArticles)
      } catch (err) {
        console.error('Error fetching similar articles:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch similar articles')
        setSimilarArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSimilarArticles()
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
