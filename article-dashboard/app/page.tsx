"use client"

import { useState, useEffect, Suspense } from "react"
import { Loader2 } from "lucide-react"
import dynamic from 'next/dynamic'
import { Header } from "@/components/header"
import { ScrapeButton } from "../components/scrape-button"
import { Article } from "@/lib/types"
import { getArticles } from "@/lib/data"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { ContentContainer } from '@/components/content-container'
import Image from "next/image"

// Dynamicky importované komponenty
const ArticleCard = dynamic(() => import('@/components/article-card').then(mod => ({ default: mod.ArticleCard })), {
  loading: () => <div className="border border-coffee-200 p-4 h-full"><div className="animate-pulse bg-coffee-50 h-40 mb-4"></div><div className="animate-pulse bg-coffee-50 h-6 mb-2"></div></div>
})

const HeroArticle = dynamic(() => import('@/components/hero-article').then(mod => ({ default: mod.HeroArticle })), {
  loading: () => <div className="animate-pulse bg-coffee-50 h-80 w-full"></div>
})

const LoadMoreButton = dynamic(() => import('@/components/load-more-button').then(mod => ({ default: mod.LoadMoreButton })))

const ARTICLES_PER_PAGE = 21

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  
  // Get current date for newspaper header
  const currentDate = new Date()
  const formattedDate = format(currentDate, "EEEE, d. MMMM yyyy", { locale: sk })

  // Initial load
  useEffect(() => {
    const fetchInitialArticles = async () => {
      setIsLoading(true)
      try {
        const initialArticles = await getArticles(ARTICLES_PER_PAGE + 1) // +1 for hero article
        setArticles(initialArticles)
        setHasMore(initialArticles.length === ARTICLES_PER_PAGE + 1)
      } catch (error) {
        console.error("Failed to fetch initial articles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialArticles()
  }, [])

  // Load more articles
  const loadMoreArticles = async () => {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const offset = (ARTICLES_PER_PAGE + 1) + (nextPage - 1) * ARTICLES_PER_PAGE
      const moreArticles = await getArticles(ARTICLES_PER_PAGE, offset)
      
      if (moreArticles.length === 0) {
        setHasMore(false)
      } else {
        setArticles([...articles, ...moreArticles])
        setPage(nextPage)
        setHasMore(moreArticles.length === ARTICLES_PER_PAGE)
      }
    } catch (error) {
      console.error("Failed to load more articles:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  const heroArticle = articles[0]
  const otherArticles = articles.slice(1)
  
  // Get last 5 article titles for scrolling banner
  const last5ArticleTitles = articles.slice(-5).map(article => article.title).filter(Boolean)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-coffee-700" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-coffee-10">
      <Header />
      <ContentContainer>
      <div className="border-b border-coffee-700 py-12">
      <div className="flex flex-column items-center">
        <p className="text-lg text-zinc-700 mb-6 text-center">
          {formattedDate}
        </p>
      </div>
        <div className="flex flex-row items-center gap-5">
          <Image 
            src="/logo-d.png" 
            alt="Denná šálka kávy" 
            width={150} 
            height={150} 
            className="h-auto object-contain"
            style={{
              width: "clamp(7rem, 8vw, 10rem)",
              height: "auto"
            }}
          />
          {/* Nadpis */}
          <h1
            className="font-serif font-black text-zinc-900 tracking-tight text-left mb-4 leading-none flex-1"
            style={{
              fontSize: "clamp(3rem, 6vw, 10rem)",
              lineHeight: 1,
            }}
          >
            denná šálka kávy
          </h1>
        </div>
        

        {/* Hnedý banner s automaticky posuvnými titulkami */}
        <div className="mt-5 mb-5 bg-white text-black text-sm md:text-base font-semibold px-4 py-3 overflow-hidden">
          <div className="flex items-center gap-6">
            <span className="text-coffee-950 tracking-widest uppercase whitespace-nowrap text-xs md:text-sm">Obsah</span>
            
            {/* Scrolling titles container */}
            <div className="flex-1 overflow-hidden relative">
              <div className="flex gap-8 animate-scroll-left whitespace-nowrap">
                {/* Duplicate the titles for seamless loop */}
                {[...last5ArticleTitles, ...last5ArticleTitles].map((title, index) => (
                  <span 
                    key={index}
                    className="font-normal text-black/90 inline-block"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Scrape Button */}
        <ScrapeButton />
      </div>
        <main className="py-8">
          {/* Hero Article */}
          {heroArticle && (
            <section className="mb-12">
              <Suspense fallback={<div className="animate-pulse bg-coffee-50 h-96 w-full"></div>}>
                <HeroArticle article={heroArticle} />
              </Suspense>
            </section>
          )}

          {/* Latest Articles Grid */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-coffee-10">
              {otherArticles.map((article) => (
                <Suspense 
                  key={article.slug} 
                  fallback={<div className="border border-coffee-200 p-4 h-full"><div className="animate-pulse bg-coffee-50 h-40 mb-4"></div></div>}
                >
                  <ArticleCard article={article} />
                </Suspense>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMoreArticles}
                  disabled={loadingMore}
                  className="flex items-center gap-2 border border-coffee-800 bg-coffee-100 text-coffee-800 px-6 py-3  hover:bg-coffee-200 disabled:opacity-50"
                >
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loadingMore ? 'Načítavam...' : 'Načítať viac článkov'}
                </button>
              </div>
            )}
          </section>
        </main>
      </ContentContainer>
    </div>
  )
}
