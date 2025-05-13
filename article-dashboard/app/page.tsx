"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { ArticleCard } from "@/components/article-card"
import { HeroArticle } from "@/components/hero-article"
import { Header } from "@/components/header"
import { ScrapeButton } from "../components/scrape-button"
import { LoadMoreButton } from "@/components/load-more-button"
import { Article } from "@/lib/types"
import { getArticles } from "@/lib/data"

const ARTICLES_PER_PAGE = 21

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

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
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-4">
        <div className="mb-12 text-left p-6 relative">
          {/* Background image */}
          <div 
            className="absolute inset-0 z-0 opacity-70" 
            style={{ 
              backgroundImage: "url('/bg-coffee.jpg')", 
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          ></div>
          {/* Coffee-colored overlay */}
          <div 
            className="absolute inset-0 z-1 opacity-40" 
            style={{ 
              backgroundColor: "#805840", // coffee-700 color
              mixBlendMode: "multiply"
            }}
          ></div>
          
          {/* Content with relative positioning to appear above the background */}
          <div className="relative z-10">
            <h1 
              className="text-4xl md:text-6xl font-medium text-zinc-900 mb-2 md:mb-4 px-3 py-1 inline-block"
              style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Denná šálka kávy
            </h1>
            <p 
              className="text-base md:text-lg text-zinc-800 max-w-2xl mb-4 md:mb-6 p-2"
              style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Váš denný prehľad najdôležitejších správ. 
              Všetky informácie na jednom mieste, spracované umelou inteligenciou.
            </p>
            <ScrapeButton/>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-coffee-700" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-900">No articles available</h2>
            <p className="text-zinc-600 mt-2">Please make sure the backend server is running and accessible</p>
          </div>
        ) : (
          <>
            <HeroArticle article={articles[0]} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-coffee-200 mt-12">
              {articles.slice(1).map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
            
            <LoadMoreButton 
              onLoadMore={loadMoreArticles}
              isLoading={loadingMore}
              hasMore={hasMore}
            />
          </>
        )}
      </main>
    </div>
  )
}
