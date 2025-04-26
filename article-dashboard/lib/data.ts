import type { Article } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001"

export async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${API_BASE}/api/articles`)
  if (!res.ok) {
    throw new Error('Failed to fetch articles')
  }
  const articles = await res.json()
  return articles.map((article: any) => ({
    ...article,
    slug: createSlug(article.title),
    // Normalizujeme kategóriu pre konzistentné zobrazenie
    category: normalizeCategory(article.category)
  }))
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles()
  return articles.find((article) => createSlug(article.title) === slug) || null
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function normalizeCategory(category: string): string {
  // Mapovanie kategórií z backendu na frontend zobrazenie
  const categoryMap: { [key: string]: string } = {
    'Politika': 'Politika',
    'Ekonomika': 'Ekonomika',
    'Šport': 'Šport',
    'Kultúra': 'Kultúra',
    'Technológie': 'Technológie',
    'Zdravie': 'Zdravie',
    'Veda': 'Veda'
  }

  return categoryMap[category] || category
}
