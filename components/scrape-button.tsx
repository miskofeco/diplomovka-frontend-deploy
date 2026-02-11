'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ScrapeButton() {
  const [isPerSourceLoading, setIsPerSourceLoading] = useState(false)
  const [isFactCheckLoading, setIsFactCheckLoading] = useState(false)
  const router = useRouter()
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"

  const handlePerSourceScrape = async () => {
    setIsPerSourceLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/scrape-per-source`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_per_source: 3,
          max_articles_per_page: 3,
          max_rounds_per_source: 3,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to scrape 3 articles per source')
      }
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.refresh()
    } catch (error) {
      console.error('Error scraping articles:', error)
    } finally {
      setIsPerSourceLoading(false)
    }
  }

  const handleOverallWithFactCheck = async () => {
    setIsFactCheckLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/scrape-with-fact-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_total_articles: 3,
          max_articles_per_page: 3,
          max_facts_per_article: 5,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to scrape and fact-check articles')
      }

      await new Promise(resolve => setTimeout(resolve, 2000))
      router.refresh()
    } catch (error) {
      console.error('Error scraping + fact-checking articles:', error)
    } finally {
      setIsFactCheckLoading(false)
    }
  }

  const isAnyLoading = isPerSourceLoading || isFactCheckLoading

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Button
        onClick={handlePerSourceScrape}
        disabled={isAnyLoading}
        variant="coffee"
      >
        {isPerSourceLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Spracúvam 3 články zo zdrojov...
          </>
        ) : (
          "Spracovať 3 články z každého zdroja"
        )}
      </Button>

      <Button
        onClick={handleOverallWithFactCheck}
        disabled={isAnyLoading}
        variant="outline"
      >
        {isFactCheckLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Spracúvam 3 články + overenie faktov...
          </>
        ) : (
          "Spracovať 3 články celkovo + overiť fakty"
        )}
      </Button>
    </div>
  )
}
