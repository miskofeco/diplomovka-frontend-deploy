'use client'

import { useState } from 'react'
import { ArticleCard } from '@/components/article-card'
import { LoadMoreButton } from '@/components/load-more-button'
import { Article } from '@/lib/types'
import { getArticles } from '@/lib/data'

const ARTICLES_PER_PAGE = 22

interface HomeLoadMoreProps {
  initialOffset: number
  initialHasMore: boolean
}

export function HomeLoadMore({ initialOffset, initialHasMore }: HomeLoadMoreProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialHasMore)

  const loadMoreArticles = async () => {
    if (loadingMore || !hasMore) {
      return
    }

    setLoadingMore(true)

    try {
      const nextPage = page + 1
      const offset = initialOffset + page * ARTICLES_PER_PAGE
      const moreArticles = await getArticles(ARTICLES_PER_PAGE, offset)

      if (moreArticles.length === 0) {
        setHasMore(false)
        return
      }

      setArticles((previous) => [...previous, ...moreArticles])
      setPage(nextPage)
      setHasMore(moreArticles.length === ARTICLES_PER_PAGE)
    } catch {
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <>
      {articles.length > 0 && (
        <div className="grid grid-cols-1 border-l border-t border-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={`extra-${article.id}-${article.slug}`} article={article} />
          ))}
        </div>
      )}

      <LoadMoreButton
        onLoadMore={loadMoreArticles}
        isLoading={loadingMore}
        hasMore={hasMore}
      />
    </>
  )
}
