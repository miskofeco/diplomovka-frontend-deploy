import { Suspense } from "react"
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import Image from "next/image"
import { Header } from "@/components/header"
import { ScrapeButton } from "@/components/scrape-button"
import { ArticleCard } from "@/components/article-card"
import { HeroArticle } from "@/components/hero-article"
import { ContentContainer } from "@/components/content-container"
import { BackendStartupNotice } from "@/components/backend-startup-notice"
import { HomeLoadMore } from "@/components/home-load-more"
import { ArticleCardSkeleton, HeroArticleSkeleton } from "@/components/skeleton-layouts"
import { getArticles } from "@/lib/data"
import { IntentPrefetchLink } from "@/components/intent-prefetch-link"

const ARTICLES_PER_PAGE = 22
const SECTION_HEADING_CLASS = "border-t border-zinc-300 py-6 text-3xl md:text-[2rem]"
const SECTION_SUBHEADING_CLASS = "border-t border-zinc-300 pb-6 pt-8 text-3xl md:text-[2rem]"

function StreamingHomeContentFallback() {
  return (
    <ContentContainer>
      <main className="py-8">
        <BackendStartupNotice />
        <h1 className={SECTION_HEADING_CLASS}>NAJNOVŠIE ČLÁNKY.</h1>
        <HeroArticleSkeleton />
        <h2 className={SECTION_SUBHEADING_CLASS}>OSTATNÉ ČLÁNKY.</h2>
        <div className="grid grid-cols-1 border-l border-t border-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      </main>
    </ContentContainer>
  )
}

async function LatestArticlesSection() {
  const articles = await getArticles(ARTICLES_PER_PAGE + 1)
  const heroArticle = articles[0]
  const featureArticles = articles.slice(1, 5)
  const otherArticles = articles.slice(5)

  if (!articles.length) {
    return (
      <ContentContainer>
        <main className="py-8">
          <h1 className={SECTION_HEADING_CLASS}>NAJNOVŠIE ČLÁNKY.</h1>
          <div className="mb-8">
            <ScrapeButton />
          </div>
          <div className="border border-zinc-200 p-8 text-zinc-600 space-y-3">
            <p>Články sa momentálne nepodarilo načítať.</p>
            <p className="text-zinc-700">
              Backend sa môže po neaktivite ešte spúšťať. Skúste to prosím znova o chvíľu.
            </p>
          </div>
        </main>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <main className="py-8">
        <h1 className={SECTION_HEADING_CLASS}>NAJNOVŠIE ČLÁNKY.</h1>
        <div className="mb-8">
          <ScrapeButton />
        </div>

        {heroArticle && (
          <section className="mb-12">
            <HeroArticle article={heroArticle} />
          </section>
        )}

        <div className="mb-6 px-4 pb-8 pt-8 text-center">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {featureArticles.map((article) => (
              <IntentPrefetchLink
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group flex h-full flex-col"
              >
                <div className="relative mb-3 aspect-square w-full overflow-hidden bg-zinc-200">
                  <Image
                    src={article.top_image || "/placeholder.jpg"}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <h4 className="min-h-[3rem] text-lg font-serif font-bold mb-2 group-hover:underline underline-offset-4 transition-colors flex items-start">
                  {article.title}
                </h4>
                <p className="mt-auto text-sm text-zinc-600">
                  {article.category} • {new Date(article.scraped_at).toLocaleDateString("sk-SK")}
                </p>
              </IntentPrefetchLink>
            ))}
          </div>
        </div>

        <h2 className={SECTION_SUBHEADING_CLASS}>OSTATNÉ ČLÁNKY.</h2>
        <section>
          <div className="grid grid-cols-1 border-l border-t border-zinc-200 md:grid-cols-2 lg:grid-cols-3">
            {otherArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          <HomeLoadMore
            initialOffset={articles.length}
            initialHasMore={articles.length === ARTICLES_PER_PAGE + 1}
          />
        </section>
      </main>
    </ContentContainer>
  )
}

export default function HomePage() {
  const currentDate = new Date()
  const formattedDate = format(currentDate, "EEEE, d. MMMM yyyy", { locale: sk })
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ContentContainer>
        <section className="py-16 text-center">
          <p className="text-xs tracking-[0.35em] uppercase text-zinc-500">
            Agregované média
          </p>
          <h2 className="mt-4 text-3xl md:text-4xl font-serif text-zinc-900">
            Monitorujeme dianie v popredných slovenských médiách
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-16">
            <Image
              src="/aktuality_logo.png"
              alt="Aktuality logo"
              width={180}
              height={48}
              className="h-5 md:h-8 w-auto object-contain"
            />
            <Image
              src="/sme_logo.png"
              alt="SME logo"
              width={160}
              height={48}
              className="h-5 md:h-8 w-auto object-contain"
            />
            <Image
              src="/pravda_logo.png"
              alt="Pravda logo"
              width={180}
              height={48}
              className="h-5 md:h-8 w-auto object-contain"
            />
            <Image
              src="/topky_logo.png"
              alt="Topky logo"
              width={160}
              height={48}
              className="h-5 md:h-8 w-auto object-contain"
            />
            <Image
              src="/teraz_logo.svg"
              alt="Teraz logo"
              width={140}
              height={40}
              className="h-5 md:h-6 w-auto object-contain"
            />
          </div>
        </section>
      </ContentContainer>

      <Suspense fallback={<StreamingHomeContentFallback />}>
        <LatestArticlesSection />
      </Suspense>
    </div>
  )
}
