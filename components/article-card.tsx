import Image from "next/image"
import { IntentPrefetchLink } from "@/components/intent-prefetch-link"
import { Article } from "@/lib/types"
import { getDomainFromUrl } from "@/lib/utils"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const tags = article.tags || []
  const domains = article.url && article.url.length > 0
    ? [...new Set(article.url.map((url) => getDomainFromUrl(url)).filter(Boolean))]
    : []

  const favicons = domains
    .map((domain) => (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=16` : ""))
    .filter(Boolean)

  const factCheck = article.fact_check_results
  const isVerified = factCheck?.status === "Overene fakty"
  const factCheckBadgeSrc = isVerified ? "/verify_green.png" : "/delete.png"
  const factCheckBadgeAlt = isVerified ? "Overené fakty" : "Neoverené fakty"
  const factCheckBadgeTitle = factCheck?.checked_at
    ? (factCheck.status || factCheckBadgeAlt)
    : "Článok nebol overený"

  return (
    <IntentPrefetchLink href={`/articles/${article.slug}`}>
      <div className="group relative flex h-full flex-col border-b border-r border-zinc-200 bg-white p-4 transition-colors">
        <div className="relative mb-4 aspect-video">
          <Image
            src={article.top_image || "/placeholder.jpg"}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-grow flex-col">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs px-3 py-1 bg-coffee-700 text-white">
              {article.category}
            </span>
            <Image
              src={factCheckBadgeSrc}
              alt={factCheckBadgeAlt}
              title={factCheckBadgeTitle}
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          </div>

          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              {new Date(article.scraped_at).toLocaleString("sk-SK", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <div className="flex items-center gap-1">
              {favicons.map((favicon, index) => (
                <Image
                  key={favicon + index}
                  src={favicon}
                  alt={domains[index]}
                  title={domains[index]}
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              ))}
            </div>
          </div>

          <h3 className="mb-2 border-b border-zinc-800 pb-2 text-xl font-semibold text-zinc-900 group-hover:underline underline-offset-4 break-words">
            {article.title}
          </h3>
          <p className="mb-3 h-[4.5rem] overflow-hidden text-zinc-600 line-clamp-3">
            {article.intro}
          </p>
          <div className="mt-auto flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-block bg-zinc-200 px-2 py-1 text-xs text-zinc-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </IntentPrefetchLink>
  )
}
