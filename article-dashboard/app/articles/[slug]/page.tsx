import { Header } from "@/components/header"
import { getArticleBySlug, getArticles } from "@/lib/data"
import Image from "next/image"
import { notFound } from "next/navigation"
import { createSlug } from "@/lib/utils"
import "@/styles/globals.css"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ArticleSourcesList } from "@/components/article-sources-list"

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({
    slug: createSlug(article.title),
  }))
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <article className="max-w-3xl mx-auto">
          <div className="mb-4">
            <Link 
              href="/" 
              className="inline-flex items-center text-coffee-700 hover:text-coffee-900 mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Späť na domov
            </Link>
            
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-zinc-600 mb-4">
              <span>{new Date(article.scraped_at).toLocaleString("sk-SK", {
                year: 'numeric',
                month: 'numeric', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit'
              })}</span>
              <span>•</span>
              <span>{article.category}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-block text-sm px-3 py-1 bg-zinc-100 text-zinc-600 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {article.top_image && (
            <div className="mb-8">
              <div className="relative w-full h-[400px]">
                <Image
                  src={article.top_image}
                  alt={article.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="mt-2 text-sm text-zinc-500">
                <span>Zdroj: </span>
                <a 
                  href={article.top_image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-coffee-700 hover:underline break-all"
                >
                  {article.top_image}
                </a>
              </div>
            </div>
          )}

          <div className="prose prose-zinc max-w-none mb-8">
            {article.content}
          </div>

          <div className="border-t border-zinc-200 pt-6 mt-8">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900">Zdroje článku:</h3>
            <ArticleSourcesList article={article} />
          </div>
        </article>
      </main>
    </div>
  )
}


