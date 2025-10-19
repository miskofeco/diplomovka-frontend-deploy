"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Article } from "@/lib/types"
import { useUrlOrientations } from "@/lib/hooks/useUrlOrientations"
import { OrientationTag } from "@/components/orientation-tag"
import { getDomainFromUrl } from "@/lib/utils"

interface ArticleSourcesListProps {
  article: Article
}

// Helper function for Slovak plural forms
function getSlovakPluralForm(count: number): string {
  if (count === 1) {
    return "článok"
  } else if (count >= 2 && count <= 4) {
    return "články"
  } else {
    return "článkov"
  }
}

// Helper function to get orientation colors
function getOrientationColor(orientation: string): string {
  switch (orientation.toLowerCase()) {
    case 'left':
      return 'bg-blue-300'
    case 'right':
      return 'bg-red-300'
    case 'neutral':
    default:
      return 'bg-coffee-300'
  }
}

export function ArticleSourcesList({ article }: ArticleSourcesListProps) {
  const [expandedDomains, setExpandedDomains] = useState<{[key: string]: boolean}>({})
  
  // Get orientations for all URLs
  const { orientations, isLoading } = useUrlOrientations(article.url)

  if (!article.url || article.url.length === 0) {
    return (
      <div className="text-sm text-zinc-500 italic">
        Žiadne zdroje nie sú k dispozícii
      </div>
    )
  }

  // Group URLs by domain
  const urlsByDomain: {[key: string]: string[]} = {}
  
  article.url.forEach((url: string) => {
    const domain = getDomainFromUrl(url)
    if (!urlsByDomain[domain]) {
      urlsByDomain[domain] = []
    }
    urlsByDomain[domain].push(url)
  })

  // Toggle domain expansion
  const toggleDomain = (domain: string) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domain]: !prev[domain]
    }))
  }

  // Get domain's primary orientation (most common among its URLs)
  const getDomainOrientation = (urls: string[]) => {
    const orientationCounts = urls.reduce((acc, url) => {
      const orientation = orientations[url]?.orientation || 'neutral'
      acc[orientation] = (acc[orientation] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Find the most common orientation
    const primaryOrientation = Object.entries(orientationCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral'

    // Calculate average confidence for the domain
    const confidences = urls
      .map(url => orientations[url]?.confidence || 0)
      .filter(conf => conf > 0)
    const avgConfidence = confidences.length > 0 
      ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length 
      : 0

    return {
      orientation: primaryOrientation,
      confidence: avgConfidence,
      counts: orientationCounts
    }
  }

  return (
    <div className="space-y-3">
      {/* Overall summary of orientations */}
      {!isLoading && Object.keys(orientations).length > 0 && (
        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="text-sm font-medium text-zinc-700 mb-3">
            Súhrn politických orientácií zdrojov:
          </div>
          
          {/* Horizontal orientation bar */}
          {(() => {
            const totalCounts = article.url.reduce((acc, url) => {
              const orientation = orientations[url]?.orientation || 'neutral'
              acc[orientation] = (acc[orientation] || 0) + 1
              return acc
            }, {} as Record<string, number>)
            
            const totalUrls = article.url.length
            const sortedOrientations = Object.entries(totalCounts)
              .sort(([,a], [,b]) => b - a)
            
            return (
              <>
                {/* Color bar */}
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-3 flex">
                  {sortedOrientations.map(([orientation, count], index) => {
                    const percentage = (count / totalUrls) * 100
                    const colorClass = getOrientationColor(orientation)
                    
                    return (
                      <div
                        key={orientation}
                        className={`${colorClass} h-full transition-all duration-300 relative group`}
                        style={{ width: `${percentage}%` }}
                        title={`${orientation}: ${count} zdrojov (${Math.round(percentage)}%)`}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {orientation}: {Math.round(percentage)}%
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* Legend with counts */}
                <div className="flex flex-wrap gap-2">
                  {sortedOrientations.map(([orientation, count]) => {
                    const percentage = Math.round((count / totalUrls) * 100)
                    return (
                      <div key={orientation} className="flex items-center gap-2 bg-white px-3 py-2 rounded border">
                        <OrientationTag orientation={orientation as any} size="sm" />
                        <span className="text-sm text-zinc-600">
                          {count} ({percentage}%)
                        </span>
                      </div>
                    )
                  })}
                </div>
              </>
            )
          })()}
          
          {/* Show domains breakdown */}
          <div className="mt-3 pt-3 border-t border-zinc-200">
            <div className="text-xs text-zinc-600 mb-2">
              Zdroje podľa domén: {Object.keys(urlsByDomain).length} {Object.keys(urlsByDomain).length === 1 ? 'doména' : 'domény'}
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(urlsByDomain).map(([domain, urls]) => {
                const domainData = getDomainOrientation(urls)
                return (
                  <div key={domain} className="text-xs text-zinc-500 bg-white px-2 py-1 rounded border">
                    <span className="font-medium">{domain}</span>
                    <span className="ml-1">({urls.length})</span>
                    <span className="ml-2">
                      <OrientationTag 
                        orientation={domainData.orientation as any} 
                        size="sm"
                      />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      
      {Object.entries(urlsByDomain).map(([domain, urls]) => {
        const favicon = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : ""
        const isExpanded = expandedDomains[domain] || false
        const hasMultipleUrls = urls.length > 1
        const domainData = getDomainOrientation(urls)
        
        return (
          <div key={domain} className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
            <div
              className={`w-full flex items-center justify-between px-4 py-3 ${
                hasMultipleUrls ? 'cursor-pointer hover:bg-zinc-50' : ''
              } transition-colors`}
              onClick={() => hasMultipleUrls && toggleDomain(domain)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {favicon && (
                  <img 
                    src={favicon} 
                    alt={domain}
                    className="w-6 h-6 rounded-sm flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-800 font-medium truncate">{domain}</span>
                    {urls.length > 1 && (
                      <span className="text-zinc-500 text-sm flex-shrink-0">
                        ({urls.length} {getSlovakPluralForm(urls.length)})
                      </span>
                    )}
                  </div>
                  
                  {/* Show orientation breakdown for domains with multiple URLs */}
                  {hasMultipleUrls && !isLoading && Object.keys(domainData.counts).length > 1 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(domainData.counts).map(([orientation, count]) => (
                        <span key={orientation} className="text-xs text-zinc-400">
                          <OrientationTag 
                            orientation={orientation as any} 
                            size="sm" 
                          />
                          <span className="ml-1">({count})</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Domain orientation tag */}
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full"></div>
                ) : (
                  <OrientationTag 
                    orientation={domainData.orientation as any}
                    confidence={domainData.confidence}
                    reasoning={hasMultipleUrls 
                      ? `Dominantná orientácia z ${urls.length} zdrojov`
                      : orientations[urls[0]]?.reasoning || "Nie je analyzované"
                    }
                  />
                )}
                
                {hasMultipleUrls && (
                  <div className="text-zinc-500">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                )}
              </div>
            </div>
            
            {/* If only one URL, show it directly */}
            {urls.length === 1 && (
              <div className="border-t border-zinc-200 px-4 py-3 bg-zinc-50">
                <a 
                  href={urls[0]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-coffee-700 hover:text-coffee-900 hover:underline text-sm inline-flex items-center gap-2 break-all"
                >
                  {urls[0]}
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              </div>
            )}
            
            {/* If multiple URLs and expanded, show all */}
            {urls.length > 1 && isExpanded && (
              <div className="border-t border-zinc-200">
                {urls.map((url, index) => {
                  const urlOrientation = orientations[url]
                  
                  return (
                    <div key={index} className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 border-t border-zinc-200 first:border-t-0">
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-coffee-700 hover:text-coffee-900 hover:underline text-sm inline-flex items-center gap-2 break-all flex-1 min-w-0 mr-3"
                      >
                        {url}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                      
                      <div className="flex-shrink-0">
                        {isLoading ? (
                          <div className="animate-pulse bg-gray-200 h-5 w-12 rounded-full"></div>
                        ) : urlOrientation ? (
                          <OrientationTag 
                            orientation={urlOrientation.orientation}
                            confidence={urlOrientation.confidence}
                            reasoning={urlOrientation.reasoning}
                            size="sm"
                          />
                        ) : (
                          <OrientationTag 
                            orientation="neutral"
                            confidence={0}
                            reasoning="Nie je analyzované"
                            size="sm"
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
