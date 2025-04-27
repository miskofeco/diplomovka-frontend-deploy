import { Header } from "@/components/header"
import { getArticleBySlug, getArticles } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-zinc-600">
              <span>{new Date(article.scraped_at).toLocaleDateString('sk-SK')}</span>
              <span>•</span>
              <span>{article.category}</span>
            </div>
          </div>

          {article.top_image && (
            <div className="relative w-full h-[400px] mb-8">
              <Image
                src={article.top_image}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div className="prose prose-zinc max-w-none">
            {article.content}
          </div>
        </article>
      </main>
    </div>
  )
}
