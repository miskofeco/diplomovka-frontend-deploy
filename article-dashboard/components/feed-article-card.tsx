"use client"

import { Article } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

interface FeedArticleCardProps {
  article: Article
  isWide?: boolean
}

export function FeedArticleCard({ article, isWide = false }: FeedArticleCardProps) {
  return (
    <Link 
      href={`/articles/${article.slug}`}
      className={`group flex flex-col md:flex-row gap-4 h-full`}
    >
      <div className={`relative ${isWide ? 'md:w-1/3' : 'w-full'} h-[120px]`}>
        <Image
          src={article.top_image || "/placeholder.jpg"}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <h4 className="text-lg font-serif font-bold mb-2 group-hover:text-coffee-800 transition-colors min-h-[3rem] flex items-start">
          {article.title}
        </h4>
        {isWide && (
          <p className="text-zinc-700 line-clamp-2 mb-2">{article.intro}</p>
        )}
        <p className="text-sm text-zinc-500 mt-auto">{article.category} • {new Date(article.scraped_at).toLocaleDateString("sk-SK")}</p>
      </div>
    </Link>
  )
}