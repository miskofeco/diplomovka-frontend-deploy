'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ScrapeButton() {
  const [isSessionLoading, setIsSessionLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isPerSourceLoading, setIsPerSourceLoading] = useState(false)
  const [isFactCheckLoading, setIsFactCheckLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" })
        const payload = (await response.json()) as { authenticated?: boolean }
        setIsAuthenticated(Boolean(payload.authenticated))
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsSessionLoading(false)
      }
    }

    checkSession()
  }, [])

  const handlePerSourceScrape = async () => {
    setIsPerSourceLoading(true)
    try {
      const response = await fetch("/api/admin/scrape-per-source", {
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
        if (response.status === 401) {
          setIsAuthenticated(false)
        }
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
      const response = await fetch("/api/admin/scrape-with-fact-check", {
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
        if (response.status === 401) {
          setIsAuthenticated(false)
        }
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

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      setIsAuthenticated(false)
      router.refresh()
    } catch (error) {
      console.error("Error logging out admin session:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isAnyLoading = isPerSourceLoading || isFactCheckLoading || isLoggingOut

  if (isSessionLoading || !isAuthenticated) {
    return null
  }

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

      <Button
        onClick={handleLogout}
        disabled={isAnyLoading}
        variant="ghost"
      >
        {isLoggingOut ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Odhlasujem...
          </>
        ) : (
          "Odhlásiť admin"
        )}
      </Button>
    </div>
  )
}
