import { Article } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-video">
          <Image
            src={article.top_image || "/placeholder.jpg"}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-zinc-500">
              {new Date(article.scraped_at).toLocaleDateString("sk-SK")}
            </span>
            <span className="text-xs px-2 py-1 bg-coffee-100 text-coffee-800 rounded">
              {article.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-zinc-900 line-clamp-2">{article.title}</h3>
          <p className="text-zinc-600 line-clamp-2">{article.intro}</p>
        </div>
      </div>
    </Link>
  )
}
