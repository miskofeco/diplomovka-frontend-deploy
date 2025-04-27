import { Article } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export async function getArticles(): Promise<Article[]> {
  try {
    console.log('Fetching articles from:', `${API_BASE}/api/articles`);
    
    const res = await fetch(`${API_BASE}/api/articles`, {
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
      tags: article.tags || [],
      scraped_at: article.scraped_at || new Date().toISOString()
    }))
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles()
  return articles.find(article => article.slug === slug) || null
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
    || 'untitled'
}
