import { ArticleCard } from "@/components/article-card"
import { HeroArticle } from "@/components/hero-article"
import { Header } from "@/components/header"
import { getArticles } from "@/lib/data"

export default async function Home() {
  const articles = await getArticles()
  const latestArticle = articles[0]
  const otherArticles = articles.slice(1)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Intro section */}
      <section className="bg-coffee-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-coffee-900">Vaša denná dávka správ</h1>
          <p className="text-lg md:text-xl text-coffee-800 max-w-3xl mx-auto">
            Vitajte pri nasej Dennej šálke kávy, kde každý deň prinášame čerstvé správy zo svetaaj z domova na jednom mieste pre vás.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Hero section with latest article */}
        <section className="mb-12">
          <HeroArticle article={latestArticle} />
        </section>

        {/* Other articles grid */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-zinc-900">Najnovšie články</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
