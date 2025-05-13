"use client"

import { useState, useRef } from "react"
import { Article } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ArticleSuggestionsProps {
  articles: Article[]
  currentArticleSlug: string
}

export function ArticleSuggestions({ articles, currentArticleSlug }: ArticleSuggestionsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(articles.length > 3)

  // Filtrovanie článkov - vylúčenie aktuálneho článku
  const filteredArticles = articles.filter(article => article.slug !== currentArticleSlug)

  // Funkcia pre posúvanie doľava
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  // Funkcia pre posúvanie doprava
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  // Sledovanie pozície scrollu pre zobrazenie/skrytie šípok
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  if (filteredArticles.length === 0) {
    return null
  }

  return (
    <div className="relative mt-12 border-t border-zinc-800 pt-6">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900">Podobné články:</h3>
      
      {/* Ľavá šípka */}
      {showLeftArrow && (
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-coffee-50 transition-colors"
          aria-label="Posunúť doľava"
        >
          <ChevronLeft className="h-6 w-6 text-coffee-700" />
        </button>
      )}
      
      {/* Pravá šípka */}
      {showRightArrow && (
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-coffee-50 transition-colors"
          aria-label="Posunúť doprava"
        >
          <ChevronRight className="h-6 w-6 text-coffee-700" />
        </button>
      )}
      
      {/* Horizontálne posúvateľný kontajner */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 px-2 -mx-2"
        onScroll={handleScroll}
      >
        {filteredArticles.slice(0, 10).map((article) => (
          <Link 
            key={article.slug} 
            href={`/articles/${article.slug}`}
            className="flex-shrink-0 w-[280px] border border-zinc-200 rounded-md overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-36 w-full">
              <Image
                src={article.top_image || "/placeholder.jpg"}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h4 className="font-medium text-zinc-900 line-clamp-2 mb-2 h-12">
                {article.title}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {new Date(article.scraped_at).toLocaleDateString("sk-SK")}
                </span>
                <span className="text-xs px-2 py-1 bg-coffee-100 text-coffee-700 rounded">
                  {article.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}