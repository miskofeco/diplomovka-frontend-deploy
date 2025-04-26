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

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-coffee-50 py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-coffee-900">Denná šálka kávy</h1>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center mb-6 text-coffee-600 hover:text-coffee-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Späť na hlavnú stránku
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="text-sm text-zinc-500">
              {new Date(article.scraped_at).toLocaleDateString("sk-SK", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <span className="inline-block px-2 py-1 text-sm bg-coffee-100 text-coffee-800 rounded-md">
              {article.category}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span key={tag} className="inline-block px-3 py-1 text-sm bg-zinc-100 text-zinc-700 rounded-md">
                {tag}
              </span>
            ))}
          </div>

          {article.top_image && (
            <div className="mb-8 relative aspect-video">
              <Image
                src={article.top_image}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div className="prose prose-zinc max-w-none mb-12">
            <p className="text-lg text-zinc-700 mb-4">{article.intro}</p>
            <div className="text-zinc-700 whitespace-pre-wrap">{article.summary}</div>
          </div>

          {/* Source URLs */}
          {article.url && article.url.length > 0 && (
            <div className="bg-zinc-50 p-6 rounded-lg mb-8">
              <h2 className="text-lg font-semibold mb-4 text-zinc-900">Pôvodné zdroje</h2>
              <div className="space-y-4">
                {article.url.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-3 bg-white rounded-md hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-zinc-600"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </div>
                    <div className="text-sm text-zinc-600 hover:text-zinc-900">{url}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}
