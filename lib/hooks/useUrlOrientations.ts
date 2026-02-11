import { useState, useEffect } from 'react'
import { buildApiUrl } from "@/lib/api-url"

interface UrlOrientation {
  orientation: 'left' | 'right' | 'neutral'
  confidence: number
  reasoning: string
}

export function useUrlOrientations(urls: string[]) {
  const [orientations, setOrientations] = useState<Record<string, UrlOrientation>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!urls || urls.length === 0) {
      setOrientations({})
      return
    }

    const fetchOrientations = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(buildApiUrl("/api/url-orientations"), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ urls }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch URL orientations')
        }

        const data = await response.json()
        setOrientations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orientations')
        setOrientations({})
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrientations()
  }, [urls])

  return { orientations, isLoading, error }
}
