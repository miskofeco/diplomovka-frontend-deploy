import { Article } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { getDomainFromUrl } from "@/lib/utils"

export function HeroArticle({ article }: { article: Article }) {
  // Get unique domains and favicons
  const domains = article.url && article.url.length > 0 
    ? [...new Set(article.url.map(url => getDomainFromUrl(url)).filter(Boolean))]
    : []
  
  const favicons = domains.map(domain => 
    domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=16` : ""
  ).filter(Boolean)

  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="border border-coffee-200 p-6 hover:bg-coffee-50/50 transition-colors">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-video">
            <Image
              src={article.top_image || "/placeholder.jpg"}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">
                  {new Date(article.scraped_at).toLocaleString("sk-SK", {
                    year: 'numeric',
                    month: 'numeric', 
                    day: 'numeric',
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </span>
                <span className="text-sm px-2 py-1 bg-coffee-100 text-coffee-800 rounded">
                  {article.category}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {favicons.map((favicon, index) => (
                  <img 
                    key={index}
                    src={favicon} 
                    alt={domains[index]}
                    className="w-4 h-4 rounded-sm"
                    title={domains[index]}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">
              {article.title}
            </h2>
            <p className="text-zinc-600 line-clamp-3">
              {article.summary}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
