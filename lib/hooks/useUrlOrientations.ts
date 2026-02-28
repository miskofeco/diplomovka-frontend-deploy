import { useState, useEffect, useMemo } from 'react'
import { buildApiUrl } from "@/lib/api-url"

interface UrlOrientation {
  orientation: 'left' | 'right' | 'neutral'
  confidence: number
  reasoning: string
}

const urlOrientationsCache = new Map<string, Record<string, UrlOrientation>>()
const urlOrientationsInFlight = new Map<string, Promise<Record<string, UrlOrientation>>>()

async function fetchUrlOrientations(urls: string[], cacheKey: string) {
  const existingRequest = urlOrientationsInFlight.get(cacheKey)
  if (existingRequest) {
    return existingRequest
  }

  const request = (async () => {
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

    return response.json()
  })()

  urlOrientationsInFlight.set(cacheKey, request)

  try {
    const orientations = await request
    urlOrientationsCache.set(cacheKey, orientations)
    return orientations
  } finally {
    urlOrientationsInFlight.delete(cacheKey)
  }
}

export function useUrlOrientations(urls: string[]) {
  const [orientations, setOrientations] = useState<Record<string, UrlOrientation>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cacheKey = useMemo(
    () => JSON.stringify([...new Set(Array.isArray(urls) ? urls.filter(Boolean) : [])].sort()),
    [urls]
  )

  useEffect(() => {
    let isCancelled = false
    const requestUrls = JSON.parse(cacheKey) as string[]

    if (requestUrls.length === 0) {
      setOrientations({})
      setError(null)
      setIsLoading(false)
      return
    }

    const cachedOrientations = urlOrientationsCache.get(cacheKey)
    if (cachedOrientations) {
      setOrientations(cachedOrientations)
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
    setError(null)

    fetchUrlOrientations(requestUrls, cacheKey)
      .then((fetchedOrientations) => {
        if (isCancelled) {
          return
        }
        setOrientations(fetchedOrientations)
      })
      .catch((err) => {
        if (isCancelled) {
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to fetch orientations')
        if (!cachedOrientations) {
          setOrientations({})
        }
      })
      .finally(() => {
        if (isCancelled) {
          return
        }
        setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [cacheKey])

  return { orientations, isLoading, error }
}
