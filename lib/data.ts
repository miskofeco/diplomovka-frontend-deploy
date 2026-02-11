import { Article } from './types'
import { createSlug } from "@/lib/utils"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

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
    let url = `${API_BASE}/api/articles`;
    
    // Add pagination parameters if provided
    if (limit !== undefined || offset !== undefined) {
      url += '?';
      if (limit !== undefined) url += `limit=${limit}`;
      if (limit !== undefined && offset !== undefined) url += '&';
      if (offset !== undefined) url += `offset=${offset}`;
    }
    
    console.log('Fetching articles from:', url);
    
    const res = await fetch(url, {
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
      fact_check_results: parseMaybeJson(article.fact_check_results),
      summary_annotations: parseMaybeJson(article.summary_annotations)
    }))
  } catch (error) {
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
    const response = await fetch(`${API_BASE}/api/articles/${slug}/details`)
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
        fact_check_results: parseMaybeJson(article.fact_check_results),
        summary_annotations: parseMaybeJson(article.summary_annotations)
      }
    }
    
    console.warn('Article not found for slug:', slug)
    return null
  } catch (error) {
    console.error('Failed to fetch article by slug:', error)
    return null
  }
}
