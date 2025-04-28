'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function ScrapeButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleScrape = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ max_articles: 5 }),
      })

      if (!response.ok) {
        throw new Error('Failed to scrape articles')
      }

      // Refresh the page to show new articles
      window.location.reload()
    } catch (error) {
      console.error('Error scraping articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleScrape}
      disabled={isLoading}
      className="bg-coffee-700 hover:bg-coffee-800 text-white"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sťahujem články...
        </>
      ) : (
        'Stiahnuť nové články'
      )}
    </Button>
  )
}