import Image from "next/image"
import { IntentPrefetchLink } from "@/components/intent-prefetch-link"
import { Article } from "@/lib/types"
import { getDomainFromUrl } from "@/lib/utils"

export function HeroArticle({ article }: { article: Article }) {
  const domains = article.url && article.url.length > 0
    ? [...new Set(article.url.map((url) => getDomainFromUrl(url)).filter(Boolean))]
    : []

  const favicons = domains
    .map((domain) => (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=16` : ""))
    .filter(Boolean)

  const factCheck = article.fact_check_results
  const isVerified = factCheck?.status === "Overene fakty"
  const factCheckBadgeSrc = isVerified ? "/checkmarks.png" : "/cross.png"
  const factCheckBadgeAlt = isVerified ? "Overené fakty" : "Neoverené fakty"
  const factCheckBadgeTitle = factCheck?.checked_at
    ? (factCheck.status || factCheckBadgeAlt)
    : "Článok nebol overený"

  return (
    <IntentPrefetchLink href={`/articles/${article.slug}`}>
      <div className="group border border-zinc-200 bg-white p-6 transition-colors">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-video overflow-hidden bg-zinc-200">
            <Image
              src={article.top_image || "/placeholder.jpg"}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-sm px-3 py-1 bg-coffee-700 text-white">
                {article.category}
              </span>
              <Image
                src={factCheckBadgeSrc}
                alt={factCheckBadgeAlt}
                title={factCheckBadgeTitle}
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            </div>

            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-zinc-500">
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
                    className="h-4 w-4 rounded-sm"
                    title={domains[index]}
                    width={16}
                    height={16}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {article.tags?.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="inline-block bg-zinc-200 px-2 py-1 text-xs text-zinc-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="mb-2 border-b border-zinc-800 pb-2 text-3xl font-bold text-zinc-900 group-hover:underline underline-offset-4">
              {article.title}
            </h2>

            <p className="line-clamp-3 text-zinc-600">{article.intro}</p>
          </div>
        </div>
      </div>
    </IntentPrefetchLink>
  )
}
