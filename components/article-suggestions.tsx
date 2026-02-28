"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Article } from "@/lib/types"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Loader2, Brain } from "lucide-react"
import { useSimilarArticles } from "@/lib/hooks/useSimilarArticles"
import { IntentPrefetchLink } from "@/components/intent-prefetch-link"
import { Skeleton } from "@/components/ui/skeleton"

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

  const { similarArticles, isLoading, error } = useSimilarArticles(currentArticleId)
  const fallbackArticlesToShow = useMemo(
    () => fallbackArticles.filter(article => article.slug !== currentArticleSlug),
    [fallbackArticles, currentArticleSlug]
  )
  const hasAiSuggestions = similarArticles.length > 0
  const articlesToShow = hasAiSuggestions ? similarArticles : fallbackArticlesToShow
  const showSkeletons = isLoading && articlesToShow.length === 0
  const showEmptyState = !isLoading && articlesToShow.length === 0
  const showErrorHint = Boolean(error) && !hasAiSuggestions

  useEffect(() => {
    if (showSkeletons || articlesToShow.length <= 3) {
      setShowLeftArrow(false)
      setShowRightArrow(false)
      return
    }
    setShowLeftArrow(false)
    setShowRightArrow(true)
    scrollContainerRef.current?.scrollTo({ left: 0, behavior: "auto" })
  }, [showSkeletons, articlesToShow.length, currentArticleId])

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

  return (
    <div className="relative mt-12 border-t border-zinc-800 pt-6">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 flex items-center gap-2">
        <Brain className="h-5 w-5 text-coffee-600" />
        Podobné články:
        {hasAiSuggestions ? (
          <span className="text-xs font-normal text-coffee-600 bg-coffee-100 px-2 py-1 rounded">
            AI navrhnuté
          </span>
        ) : (
          <span className="text-xs font-normal text-zinc-600 bg-zinc-100 px-2 py-1 rounded">
            podľa kategórie
          </span>
        )}
        {isLoading && (
          <span className="ml-auto inline-flex items-center gap-2 text-sm text-zinc-600">
            <Loader2 className="h-4 w-4 animate-spin text-coffee-600" />
            AI analyzuje obsah...
          </span>
        )}
      </h3>
      {showErrorHint && (
        <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          AI odporúčania sa nepodarilo načítať, zobrazujem alternatívne články.
        </p>
      )}

      {showEmptyState ? (
        <div className="text-sm text-zinc-500 bg-zinc-50 p-3 rounded-md">
          Momentálne nemáme podobné články na odporúčanie.
        </div>
      ) : (
        <div className="relative min-h-[216px]">
          {showLeftArrow && (
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-coffee-50 transition-colors border border-coffee-200"
              aria-label="Posunúť doľava"
            >
              <ChevronLeft className="h-6 w-6 text-coffee-700" />
            </button>
          )}

          {showRightArrow && (
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-coffee-50 transition-colors border border-coffee-200"
              aria-label="Posunúť doprava"
            >
              <ChevronRight className="h-6 w-6 text-coffee-700" />
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 px-2 -mx-2"
            onScroll={handleScroll}
          >
            {showSkeletons && (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`suggestion-skeleton-${index}`}
                  className="flex-shrink-0 w-[280px] border border-zinc-200 rounded-md overflow-hidden p-3"
                >
                  <Skeleton className="h-36 w-full rounded-md" />
                  <Skeleton className="mt-3 h-5 w-4/5 rounded-md" />
                  <Skeleton className="mt-2 h-5 w-3/5 rounded-md" />
                  <div className="mt-3 flex items-center justify-between">
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                </div>
              ))
            )}

            {!showSkeletons && articlesToShow.slice(0, 10).map((article, index) => {
              const isVerified = article.fact_check_results?.status === "Overene fakty"
              const factCheckBadgeSrc = isVerified ? "/checkmarks.png" : "/cross.png"
              const factCheckBadgeAlt = isVerified ? "Overené fakty" : "Neoverené fakty"
              const factCheckBadgeTitle = article.fact_check_results?.checked_at
                ? (article.fact_check_results?.status || factCheckBadgeAlt)
                : "Článok nebol overený"

              return (
                <IntentPrefetchLink
                  key={`${article.id}-${index}`}
                  href={`/articles/${article.slug}`}
                  className="flex-shrink-0 w-[280px] border border-zinc-200 rounded-md overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-coffee-200 group"
                >
                  <div className="relative h-36 w-full">
                    <Image
                      src={article.top_image || "/placeholder.jpg"}
                      alt={article.title}
                      fill
                      sizes="280px"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {hasAiSuggestions && (
                      <div className="absolute top-2 left-2 bg-coffee-600/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        AI
                      </div>
                    )}
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
                </IntentPrefetchLink>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
