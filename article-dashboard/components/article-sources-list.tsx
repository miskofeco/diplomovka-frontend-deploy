"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { getDomainFromUrl } from "@/lib/utils"

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

export function ArticleSourcesList({ article }: { article: any }) {
  const [expandedDomains, setExpandedDomains] = useState<{[key: string]: boolean}>({})

  // Group URLs by domain
  const urlsByDomain: {[key: string]: string[]} = {}
  
  if (article.url && Array.isArray(article.url)) {
    article.url.forEach((url: string) => {
      const domain = getDomainFromUrl(url)
      if (!urlsByDomain[domain]) {
        urlsByDomain[domain] = []
      }
      urlsByDomain[domain].push(url)
    })
  }

  // Toggle domain expansion
  const toggleDomain = (domain: string) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domain]: !prev[domain]
    }))
  }

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(urlsByDomain).map(([domain, urls]) => {
        const favicon = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : "";
        const isExpanded = expandedDomains[domain] || false;
        const hasMultipleUrls = urls.length > 1;
        
        return (
          <div key={domain} className="border border-zinc-200 rounded-lg overflow-hidden">
            <button 
              onClick={() => hasMultipleUrls && toggleDomain(domain)}
              className={`w-full flex items-center justify-between px-4 py-3 ${hasMultipleUrls ? 'cursor-pointer hover:bg-zinc-50' : ''} transition-colors`}
            >
              <div className="flex items-center">
                {favicon && (
                  <img 
                    src={favicon} 
                    alt={domain}
                    className="w-6 h-6 mr-3 rounded-sm"
                  />
                )}
                <span className="text-zinc-800 font-medium">{domain}</span>
                <span className="ml-2 text-zinc-500 text-sm">
                  {urls.length > 1 ? `(${urls.length} ${getSlovakPluralForm(urls.length)})` : ''}
                </span>
              </div>
              {hasMultipleUrls && (
                <div className="text-zinc-500">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              )}
            </button>
            
            {/* If only one URL, show it directly */}
            {urls.length === 1 && (
              <a 
                href={urls[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block px-4 py-2 text-zinc-500 text-sm break-all hover:bg-zinc-50 border-t border-zinc-200"
              >
                {urls[0]}
              </a>
            )}
            
            {/* If multiple URLs and expanded, show all */}
            {urls.length > 1 && isExpanded && (
              <div className="border-t border-zinc-200">
                {urls.map((url, index) => (
                  <a 
                    key={index}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-zinc-500 text-sm break-all hover:bg-zinc-50 border-t border-zinc-200 first:border-t-0"
                  >
                    {url}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
