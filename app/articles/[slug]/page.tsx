import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { ArticleSuggestions } from "@/components/article-suggestions"
import { ArticleSourcesList } from "@/components/article-sources-list"
import { Header } from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { getArticleBySlug, getArticles } from "@/lib/data"
import { createSlug } from "@/lib/utils"

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({
    slug: createSlug(article.title),
  }))
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params

  const [article, fallbackPool] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(30),
  ])

  if (!article) {
    notFound()
  }

  const relatedArticles = fallbackPool
    .filter((item) => (
      item.category.toLowerCase() === article.category.toLowerCase() &&
      item.slug !== article.slug
    ))
    .slice(0, 10)

  const factCheck = article.fact_check_results
  const factCheckFacts = Array.isArray(factCheck?.facts) ? factCheck.facts : []
  const showFactCheckSection = Boolean(factCheck?.status) || factCheckFacts.length > 0

  const statusBadgeClass =
    factCheck?.status === "Overene fakty"
      ? "bg-emerald-100 text-emerald-800"
      : factCheck?.status === "Ciastocne overene fakty"
        ? "bg-amber-100 text-amber-800"
        : "bg-rose-100 text-rose-800"

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="container px-4 py-8 max-w-content flex-grow">
        <article className="max-w-content-narrow">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center mb-4 text-zinc-600 hover:text-zinc-900 hover:underline underline-offset-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Späť na domov
            </Link>

            <h1 className="mb-4 text-3xl text-zinc-900 md:text-4xl">{article.title}</h1>
            <div className="mb-4 flex items-center gap-4 text-zinc-600">
              <span>
                {new Date(article.scraped_at).toLocaleString("sk-SK", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>•</span>
              <span>{article.category}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags?.map((tag: string, index: number) => (
                <span
                  key={`${tag}-${index}`}
                  className="inline-block bg-zinc-200 px-3 py-1 text-sm text-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {article.top_image && (
            <div className="mb-8 border-t border-zinc-800 pt-5">
              <div className="relative h-[50vw] w-full md:h-[30vw]">
                <Image
                  src={article.top_image}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-2 flex text-sm text-zinc-500">
                <span className="whitespace-nowrap">Zdroj: </span>
                <a
                  href={article.top_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 truncate text-coffee-700 hover:underline"
                  title={article.top_image}
                >
                  {article.top_image}
                </a>
              </div>
            </div>
          )}

          <div className="mb-6 max-w-none font-bold">
            {article.intro}
          </div>

          <div className="prose prose-zinc mb-8 max-w-none">
            {article.content}
          </div>

          {showFactCheckSection && (
            <section className="mt-8 border-t border-zinc-800 pt-6">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900">Overenie faktov</h3>
              {factCheck?.status && (
                <div className="mb-4">
                  <span className={`inline-block text-sm px-3 py-1 ${statusBadgeClass}`}>
                    {factCheck.status}
                  </span>
                </div>
              )}

              {factCheckFacts.length > 0 && (
                <div className="space-y-3">
                  {factCheckFacts.map((item, index) => (
                    <div key={index} className="border border-zinc-200 bg-zinc-50 p-3">
                      <p className="mb-1 text-sm text-zinc-900">{item.fact || "Fakt nie je dostupný"}</p>
                      {item.source_url ? (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-coffee-700 hover:underline"
                        >
                          {item.source_title || item.source_url}
                        </a>
                      ) : (
                        <p className="text-sm text-zinc-600">Zdroj nebol nájdený.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <div className="mt-8 border-t border-zinc-800 pt-6">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900">Zdroje článku:</h3>
            <ArticleSourcesList article={article} />
          </div>

          <Suspense
            fallback={(
              <div className="mt-12 border-t border-zinc-800 pt-6">
                <Skeleton className="mb-4 h-6 w-40 rounded-none" />
                <Skeleton className="h-40 w-full rounded-none" />
              </div>
            )}
          >
            <ArticleSuggestions
              currentArticleId={article.id}
              currentArticleSlug={article.slug}
              fallbackArticles={relatedArticles}
            />
          </Suspense>
        </article>
      </main>
    </div>
  )
}
