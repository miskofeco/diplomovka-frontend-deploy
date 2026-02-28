import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { notFound } from "next/navigation"
import { ArticleCard } from "@/components/article-card"
import { ContentContainer } from "@/components/content-container"
import { Header } from "@/components/header"
import { getArticles } from "@/lib/data"

export async function generateStaticParams() {
  return [
    { slug: "politika" },
    { slug: "ekonomika" },
    { slug: "sport" },
    { slug: "kultura" },
    { slug: "technologie" },
    { slug: "zdravie" },
    { slug: "veda" },
  ]
}

const categoryNames: { [key: string]: string } = {
  politika: "Politika",
  ekonomika: "Ekonomika",
  sport: "Šport",
  kultura: "Kultúra",
  technologie: "Technológie",
  zdravie: "Zdravie",
  veda: "Veda",
}

function normalizeCategory(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!categoryNames[slug]) {
    notFound()
  }

  const articles = await getArticles()
  const filteredArticles = articles.filter((article) => normalizeCategory(article.category) === slug)
  const last5ArticleTitles = articles.slice(5).map((article) => article.title).filter(Boolean)

  const currentDate = new Date()
  const formattedDate = format(currentDate, "EEEE, d. MMMM yyyy", { locale: sk })
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-zinc-100">
        <ContentContainer>
          <div className="pt-12">
            <div className="flex flex-column items-center">
              <p className="text-lg text-zinc-600 mb-4 text-center align-middle">
                {capitalizedDate}
              </p>
            </div>
            <h1
              className="w-full pb-10 text-left font-serif tracking-tight text-zinc-900 leading-none"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 7rem)",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {`${categoryNames[slug].toLocaleUpperCase()}.`}
            </h1>
          </div>
        </ContentContainer>
      </div>

      <div className="border-y border-zinc-300 py-0">
        <ContentContainer>
          <div className="bg-white px-4 py-3 text-sm font-semibold text-zinc-600 md:text-base overflow-hidden">
            <div className="flex items-center gap-6">
              <span className="text-xs tracking-widest uppercase whitespace-nowrap md:text-sm">
                Obsah
              </span>
              <div className="relative flex-1 overflow-hidden">
                <div className="flex gap-8 whitespace-nowrap animate-scroll-left">
                  {[...last5ArticleTitles, ...last5ArticleTitles].map((title, index) => (
                    <span key={`${title}-${index}`} className="inline-block font-normal text-zinc-600">
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ContentContainer>
      </div>

      <ContentContainer>
        <main className="container mx-auto px-0 py-8">
          <div className="grid grid-cols-1 border-l border-t border-zinc-200 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="space-y-2 py-12 text-center text-zinc-600">
              <p>Nenašli sa žiadne články v tejto kategórii.</p>
              <p className="text-sm text-zinc-500">
                Ak sa backend po neaktivite práve spúšťa, načítanie môže trvať niekoľko minút.
              </p>
            </div>
          )}
        </main>
      </ContentContainer>
    </div>
  )
}
