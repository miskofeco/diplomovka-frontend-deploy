"use client"

import { Button } from "@/components/ui/button"
import { Loader2, ChevronDown } from "lucide-react"

interface LoadMoreButtonProps {
  onLoadMore: () => Promise<void>
  isLoading: boolean
  hasMore: boolean
}

export function LoadMoreButton({ onLoadMore, isLoading, hasMore }: LoadMoreButtonProps) {
  if (!hasMore) return null
  
  return (
    <div className="flex justify-center my-8">
      <Button 
        onClick={onLoadMore}
        disabled={isLoading}
        variant="loadMore"
        className="text-base"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Načítavam...
          </>
        ) : (
          <>
            Načítať ďalšie články
            <ChevronDown className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
