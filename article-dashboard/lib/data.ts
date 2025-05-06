import { Article } from './types'
import { createSlug } from "@/lib/utils"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

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
      next: { revalidate: 60 },
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
      scraped_at: article.scraped_at || new Date().toISOString()
    }))
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const articles = await getArticles()
    const article = articles.find(article => createSlug(article.title) === slug)
    return article || null
  } catch (error) {
    console.error('Failed to fetch article by slug:', error)
    return null
  }
}


