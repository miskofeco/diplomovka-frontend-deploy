import { Article } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export function HeroArticle({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="bg-coffee-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <div className="relative aspect-[16/9]">
              <Image
                src={article.top_image || "/placeholder.jpg"}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <div className="md:w-1/3 p-4 md:pr-6 md:py-6">
            <div className="mb-2">
              <span className="text-sm px-3 py-1 bg-zinc-100 text-zinc-800 rounded-full">
                {article.category}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-zinc-900">{article.title}</h2>
            <p className="text-base text-zinc-600 mb-4 line-clamp-2">{article.intro}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-sm px-3 py-1 rounded-full bg-zinc-100 text-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                {new Date(article.scraped_at).toLocaleDateString("sk-SK")}
              </span>
              <span className="text-sm text-coffee-700 font-medium">
                Read more →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
