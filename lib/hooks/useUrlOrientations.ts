import { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

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
        const response = await fetch(`${API_BASE}/api/url-orientations`, {
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