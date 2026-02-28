import Image from "next/image"
import { IntentPrefetchLink } from "@/components/intent-prefetch-link"
import { Article } from "@/lib/types"

interface FeedArticleCardProps {
  article: Article
  isWide?: boolean
}

export function FeedArticleCard({ article, isWide = false }: FeedArticleCardProps) {
  const isVerified = article.fact_check_results?.status === "Overene fakty"
  const factCheckBadgeSrc = isVerified ? "/verify_green.png" : "/delete.png"
  const factCheckBadgeAlt = isVerified ? "Overené fakty" : "Neoverené fakty"
  const factCheckBadgeTitle = article.fact_check_results?.checked_at
    ? (article.fact_check_results?.status || factCheckBadgeAlt)
    : "Článok nebol overený"

  return (
    <IntentPrefetchLink
      href={`/articles/${article.slug}`}
      className="group flex h-full flex-col gap-4 md:flex-row"
    >
      <div className={`relative ${isWide ? "md:w-1/3" : "w-full"} h-[120px]`}>
        <Image
          src={article.top_image || "/placeholder.jpg"}
          alt={article.title}
          fill
          sizes={isWide ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 50vw"}
          className="object-cover"
        />
        <div className="absolute right-2 top-2">
          <Image
            src={factCheckBadgeSrc}
            alt={factCheckBadgeAlt}
            title={factCheckBadgeTitle}
            width={20}
            height={20}
            className="h-5 w-5 object-contain"
          />
        </div>
      </div>
      <div className="flex flex-grow flex-col">
        <h4 className="min-h-[3rem] text-lg font-serif font-bold mb-2 group-hover:text-coffee-800 transition-colors flex items-start">
          {article.title}
        </h4>
        {isWide && (
          <p className="mb-2 line-clamp-2 text-zinc-700">{article.intro}</p>
        )}
        <p className="mt-auto text-sm text-zinc-500">
          {article.category} • {new Date(article.scraped_at).toLocaleDateString("sk-SK")}
        </p>
      </div>
    </IntentPrefetchLink>
  )
}
