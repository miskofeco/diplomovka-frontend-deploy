'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ScrapeButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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

      // Wait a moment for backend processing to complete
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Use Next.js router to refresh data without full page reload
      router.refresh()
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
