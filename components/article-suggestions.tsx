"use client"

import { useState, useRef, useEffect } from "react"
import { Article } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Loader2, Brain } from "lucide-react"
import { useSimilarArticles } from "@/lib/hooks/useSimilarArticles"

interface ArticleSuggestionsProps {
  currentArticleId: string
  currentArticleSlug: string
  fallbackArticles?: Article[] // Optional fallback articles
}

export function ArticleSuggestions({ 
  currentArticleId, 
  currentArticleSlug, 
  fallbackArticles = [] 
}: ArticleSuggestionsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  // Use the new hook to fetch similar articles
  const { similarArticles, isLoading, error } = useSimilarArticles(currentArticleId)

  // Use similar articles if available, otherwise fallback to provided articles
  const articlesToShow = similarArticles.length > 0 
    ? similarArticles 
    : fallbackArticles.filter(article => article.slug !== currentArticleSlug)

  // Update arrow visibility when articles change
  useEffect(() => {
    setShowRightArrow(articlesToShow.length > 3)
  }, [articlesToShow.length])

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

  // Loading state
  if (isLoading) {
    return (
      <div className="relative mt-12 border-t border-zinc-800 pt-6">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900 flex items-center gap-2">
          <Brain className="h-5 w-5 text-coffee-600" />
          Hľadám podobné články...
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-coffee-600" />
          <span className="ml-2 text-zinc-600">Analyzujem obsah...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="relative mt-12 border-t border-zinc-800 pt-6">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900">Podobné články:</h3>
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          Nepodarilo sa načítať podobné články. Skúste obnoviť stránku.
        </div>
      </div>
    )
  }

  // No articles found
  if (articlesToShow.length === 0) {
    return (
      <div className="relative mt-12 border-t border-zinc-800 pt-6">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900">Podobné články:</h3>
        <div className="text-sm text-zinc-500 bg-zinc-50 p-3 rounded-md">
          Momentálne nemáme podobné články na odporúčanie.
        </div>
      </div>
    )
  }

  return (
    <div className="relative mt-12 border-t border-zinc-800 pt-6">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 flex items-center gap-2">
        <Brain className="h-5 w-5 text-coffee-600" />
        Podobné články:
        <span className="text-xs font-normal text-coffee-600 bg-coffee-100 px-2 py-1 rounded">
          AI navrhnuté
        </span>
      </h3>
      
      {/* Ľavá šípka */}
      {showLeftArrow && (
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-coffee-50 transition-colors border border-coffee-200"
          aria-label="Posunúť doľava"
        >
          <ChevronLeft className="h-6 w-6 text-coffee-700" />
        </button>
      )}
      
      {/* Pravá šípka */}
      {showRightArrow && (
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-coffee-50 transition-colors border border-coffee-200"
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
        {articlesToShow.slice(0, 10).map((article, index) => {
          const isVerified = article.fact_check_results?.status === "Overene fakty"
          const factCheckBadgeSrc = isVerified ? "/verify.png" : "/unverify.png"
          const factCheckBadgeAlt = isVerified ? "Overené fakty" : "Neoverené fakty"
          const factCheckBadgeTitle = article.fact_check_results?.checked_at
            ? (article.fact_check_results?.status || factCheckBadgeAlt)
            : "Článok nebol overený"

          return (
            <Link 
              key={`${article.id}-${index}`}
              href={`/articles/${article.slug}`}
              className="flex-shrink-0 w-[280px] border border-zinc-200 rounded-md overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-coffee-200 group"
            >
              <div className="relative h-36 w-full">
                <Image
                  src={article.top_image || "/placeholder.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* AI indicator overlay */}
                <div className="absolute top-2 left-2 bg-coffee-600/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  AI
                </div>
                <div className="absolute top-2 right-2">
                  <Image
                    src={factCheckBadgeSrc}
                    alt={factCheckBadgeAlt}
                    title={factCheckBadgeTitle}
                    width={22}
                    height={22}
                    className="h-6 w-6 object-contain"
                  />
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-zinc-900 line-clamp-2 mb-2 h-12 group-hover:text-coffee-700 transition-colors">
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
          )
        })}
      </div>
    </div>
  )
}
