import { Article } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export function ArticleCard({ article }: { article: Article }) {
  // Tags are already an array, no need to split
  const tags = article.tags || []

  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="relative border-b border-r border-coffee-200 p-4 hover:bg-coffee-50/50 transition-colors">
        <div className="relative aspect-video mb-4">
          <Image
            src={article.top_image || "/placeholder.jpg"}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-zinc-500">
            {new Date(article.scraped_at).toLocaleString("sk-SK", {
                year: 'numeric',
                month: 'numeric', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </span>
            <span className="text-xs px-2 py-1 bg-coffee-100 text-coffee-800 rounded">
              {article.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-zinc-900 line-clamp-2">
            {article.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>  
  )
}
