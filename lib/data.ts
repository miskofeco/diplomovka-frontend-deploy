import { Article, FactCheckResults, SummaryAnnotations } from './types'
import { createSlug } from "@/lib/utils"
import { buildApiUrl } from "@/lib/api-url"

const FRONTEND_FETCH_TIMEOUT_MS = 15000

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
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }
  if (typeof value === 'object') {
    return value as T
  }
  return null
}

export async function getArticles(limit?: number, offset?: number): Promise<Article[]> {
  try {
    let url = buildApiUrl("/api/articles")
    if (typeof window === "undefined" && url.startsWith("/")) {
      console.error("API base URL is not configured for server-side fetching.")
      return []
    }
    
    // Add pagination parameters if provided
    if (limit !== undefined || offset !== undefined) {
      url += '?';
      if (limit !== undefined) url += `limit=${limit}`;
      if (limit !== undefined && offset !== undefined) url += '&';
      if (offset !== undefined) url += `offset=${offset}`;
    }
    
    console.log('Fetching articles from:', url);
    
    const res = await fetchWithTimeout(url, {
      next: { 
        revalidate: 300, // Revalidácia každých 5 minút
        tags: ['articles']
      },
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!res.ok) {
      console.error('API Error:', res.status, await res.text());
      return [];
    }
    
    const articles = await res.json()
    
    if (!Array.isArray(articles)) {
      console.error('Unexpected API response:', articles);
      return [];
    }

    return articles.map((article: any) => ({
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
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error('Failed to fetch articles: request timed out')
      return []
    }
    console.error('Failed to fetch articles:', error)
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // First try to get from the articles list
    const articles = await getArticles()
    const foundArticle = articles.find(article => article.slug === slug)
    
    if (foundArticle) {
      console.log('Found article with ID:', foundArticle.id)
      return foundArticle
    }
    
    // If not found, try the details endpoint
    const detailsUrl = buildApiUrl(`/api/articles/${slug}/details`)
    if (typeof window === "undefined" && detailsUrl.startsWith("/")) {
      console.error("API base URL is not configured for server-side fetching.")
      return null
    }

    const response = await fetchWithTimeout(detailsUrl)
    if (response.ok) {
      const article = await response.json()
      console.log('Found article via details endpoint with ID:', article.id)
      
      // Transform to match Article interface
      return {
        id: article.id || '',
        title: article.title || 'Untitled',
        slug: slug,
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
      }
    }
    
    console.warn('Article not found for slug:', slug)
    return null
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error('Failed to fetch article by slug: request timed out')
      return null
    }
    console.error('Failed to fetch article by slug:', error)
    return null
  }
}
