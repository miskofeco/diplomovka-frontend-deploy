"use client"

import { Article } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { getDomainFromUrl } from "@/lib/utils"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Tags are already an array, no need to split
  const tags = article.tags || []
  
  // Get unique domains and favicons
  const domains = article.url && article.url.length > 0 
    ? [...new Set(article.url.map(url => getDomainFromUrl(url)).filter(Boolean))]
    : []
  
  const favicons = domains.map(domain => 
    domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=16` : ""
  ).filter(Boolean)

  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="group bg-white relative border-b-2 border-r-2 border-coffee-10 p-4 transition-colors h-full flex flex-col">
        <div className="relative aspect-video mb-4">
          <Image
            src={article.top_image || "/placeholder.jpg"}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col flex-grow">
          {/* Category displayed at the top */}
          <div className="mb-2">
            <span className="text-xs px-3 py-1 bg-coffee-700 text-white">
              {article.category}
            </span>
          </div>
          
          {/* Time and source icons */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-xs text-zinc-500">
                {new Date(article.scraped_at).toLocaleString("sk-SK", {
                  year: 'numeric',
                  month: 'numeric', 
                  day: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
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
          
          <h3 className="group-hover:underline underline-offset-4 text-xl font-semibold mb-2 text-zinc-900 line-clamp-2n border-b pb-2 border-zinc-800">
            {article.title}
          </h3>
          <p className="text-zinc-600 mb-3 h-[4.5rem] line-clamp-3 overflow-hidden">
            {article.intro}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block text-xs px-2 py-1 bg-zinc-200 text-zinc-800"
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
