import { ContentContainer } from '@/components/content-container'
import { Skeleton } from '@/components/ui/skeleton'

export function ArticleCardSkeleton() {
  return (
    <div className="border border-zinc-200 bg-white p-4">
      <Skeleton className="mb-4 aspect-video w-full rounded-none" />
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-5 w-20 rounded-none" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="mb-2 h-3 w-44 rounded-none" />
      <Skeleton className="mb-3 h-7 w-full rounded-none" />
      <Skeleton className="mb-2 h-4 w-full rounded-none" />
      <Skeleton className="h-4 w-5/6 rounded-none" />
    </div>
  )
}

export function HeroArticleSkeleton() {
  return (
    <div className="border border-zinc-200 bg-white p-6">
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-video w-full rounded-none" />
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="h-6 w-28 rounded-none" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="mb-3 h-4 w-44 rounded-none" />
          <Skeleton className="mb-2 h-10 w-full rounded-none" />
          <Skeleton className="mb-2 h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-4/5 rounded-none" />
        </div>
      </div>
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
        <ContentContainer>
          <div className="py-4">
            <Skeleton className="h-8 w-full rounded-none" />
          </div>
          <div className="hidden pb-2 md:block">
            <Skeleton className="h-8 w-full rounded-none" />
          </div>
        </ContentContainer>
      </div>

      <div className="bg-zinc-100">
        <ContentContainer>
          <div className="py-12">
            <Skeleton className="mb-4 h-6 w-48 rounded-none" />
            <Skeleton className="h-14 w-96 max-w-full rounded-none" />
          </div>
        </ContentContainer>
      </div>

      <ContentContainer>
        <main className="py-8">
          <Skeleton className="mb-6 h-10 w-72 rounded-none" />
          <HeroArticleSkeleton />
          <div className="mt-8 grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        </main>
      </ContentContainer>
    </div>
  )
}

export function CategoryPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-zinc-100">
        <ContentContainer>
          <div className="py-12">
            <Skeleton className="mb-4 h-6 w-48 rounded-none" />
            <Skeleton className="h-14 w-80 max-w-full rounded-none" />
          </div>
        </ContentContainer>
      </div>
      <ContentContainer>
        <main className="py-8">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        </main>
      </ContentContainer>
    </div>
  )
}

export function ArticlePageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <ContentContainer variant="narrow">
        <main className="py-8">
          <Skeleton className="mb-6 h-5 w-36 rounded-none" />
          <Skeleton className="mb-4 h-12 w-full rounded-none" />
          <Skeleton className="mb-8 h-4 w-60 rounded-none" />
          <Skeleton className="mb-8 aspect-video w-full rounded-none" />
          <Skeleton className="mb-3 h-6 w-full rounded-none" />
          <Skeleton className="mb-2 h-5 w-full rounded-none" />
          <Skeleton className="mb-2 h-5 w-full rounded-none" />
          <Skeleton className="mb-8 h-5 w-4/5 rounded-none" />
          <Skeleton className="h-48 w-full rounded-none" />
        </main>
      </ContentContainer>
    </div>
  )
}
