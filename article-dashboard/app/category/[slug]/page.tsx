import { Header } from "@/components/header"
import { ArticleCard } from "@/components/article-card"
import { getArticles } from "@/lib/data"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return [
    { slug: "politika" },
    { slug: "ekonomika" },
    { slug: "sport" },
    { slug: "kultura" },
    { slug: "technologie" },
    { slug: "zdravie" },
    { slug: "veda" }
  ]
}

const categoryNames: { [key: string]: string } = {
  politika: "Politika",
  ekonomika: "Ekonomika",
  sport: "Šport",
  kultura: "Kultúra",
  technologie: "Technológie",
  zdravie: "Zdravie",
  veda: "Veda"
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const articles = await getArticles()
  
  // Kontrola či kategória existuje
  if (!categoryNames[params.slug]) {
    notFound()
  }

  // Filtrovanie článkov podľa kategórie
  const filteredArticles = articles.filter(article => {
    const normalizedCategory = article.category
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
    
    return normalizedCategory === params.slug
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-zinc-900">
          {categoryNames[params.slug]}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <p className="text-center text-zinc-600 py-12">
            Nenašli sa žiadne články v tejto kategórii.
          </p>
        )}
      </main>
    </div>
  )
}