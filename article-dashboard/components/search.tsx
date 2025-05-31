"use client"

import { useState, useEffect, useRef } from 'react'
import { Search as SearchIcon, X, Loader2, Settings } from 'lucide-react'
import { useSearch } from '@/lib/hooks/useSearch'
import Link from 'next/link'
import Image from 'next/image'
import { useDebounce } from '@/lib/hooks/useDebounce'

export function Search() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isAdvancedEnabled, setIsAdvancedEnabled] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { results, isLoading, error, search, clearResults } = useSearch()
  const debouncedQuery = useDebounce(query, 300)

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery, isAdvancedEnabled) // Pass advanced search flag
      setIsOpen(true)
    } else {
      clearResults()
      setIsOpen(false)
    }
  }, [debouncedQuery, isAdvancedEnabled, search, clearResults])

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClear = () => {
    setQuery('')
    clearResults()
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleSelectResult = () => {
    setQuery('')
    setIsOpen(false)
    clearResults()
  }

  const toggleAdvancedSearch = () => {
    setIsAdvancedEnabled(!isAdvancedEnabled)
    // Re-search with new mode if there's a query
    if (query) {
      search(query, !isAdvancedEnabled)
    }
    console.log('Advanced search:', isAdvancedEnabled ? 'disabled' : 'enabled')
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={isAdvancedEnabled ? "AI vyhľadávanie..." : "Hľadať články..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="w-full pl-10 pr-20 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {/* Advanced Search Toggle Button */}
          <button
            onClick={toggleAdvancedSearch}
            className={`p-1 rounded transition-colors ${
              isAdvancedEnabled 
                ? 'text-coffee-600 bg-coffee-100 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
            }`}
            title={isAdvancedEnabled ? "Zakázať AI vyhľadávanie" : "Povoliť AI vyhľadávanie"}
          >
            <Settings className="h-4 w-4" />
          </button>
          
          {/* Clear Button */}
          {query && (
            <button
              onClick={handleClear}
              className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded"
              title="Vymazať"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-coffee-600" />
              <span className="ml-2 text-sm text-zinc-600">
                {isAdvancedEnabled ? 'AI hľadá...' : 'Hľadám...'}
              </span>
            </div>
          )}

          {error && (
            <div className="p-4 text-sm text-red-600">
              Chyba pri hľadaní: {error}
            </div>
          )}

          {!isLoading && !error && results.length === 0 && query && (
            <div className="p-4 text-sm text-zinc-600">
              Nenašli sa žiadne výsledky pre "{query}"
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide border-b flex items-center justify-between">
                <span>Výsledky hľadania ({results.length})</span>
                {isAdvancedEnabled && (
                  <span className="text-coffee-600 font-normal">AI</span>
                )}
              </div>
              {results.map((article, index) => (
                <Link
                  key={`${article.id || 'no-id'}-${index}`}
                  href={`/articles/${article.slug}`}
                  onClick={handleSelectResult}
                  className="block px-3 py-3 hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0"
                >
                  <div className="flex gap-3">
                    {article.top_image && (
                      <div className="relative w-16 h-12 flex-shrink-0">
                        <Image
                          src={article.top_image}
                          alt={article.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-zinc-900 line-clamp-2 mb-1">
                        {article.title}
                      </h4>
                      <div className="flex items-center text-xs text-zinc-500 space-x-2">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span>
                          {new Date(article.scraped_at).toLocaleDateString("sk-SK")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}