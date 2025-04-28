import { ArticleCard } from "@/components/article-card"
import { HeroArticle } from "@/components/hero-article"
import { Header } from "@/components/header"
import { ScrapeButton } from "../components/scrape-button"
import { getArticles } from "@/lib/data"

export default async function Home() {
  const articles = await getArticles()
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            Denná šálka kávy
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto mb-6">
            Váš denný prehľad najdôležitejších správ zo Slovenska a sveta. 
            Všetky relevantné informácie na jednom mieste, spracované pomocou umelej inteligencie.
          </p>
          <ScrapeButton />
        </div>

        {articles.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-900">No articles available</h2>
            <p className="text-zinc-600 mt-2">Please make sure the backend server is running and accessible</p>
          </div>
        ) : (
          <>
            <HeroArticle article={articles[0]} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-coffee-200 mt-12">
              {articles.slice(1).map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
