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

// Background images for each category
const categoryBackgrounds: { [key: string]: string } = {
  politika: "/bg-politics.jpg",
  ekonomika: "/bg-economy.jpg",
  sport: "/bg-sport.jpg",
  kultura: "/bg-culture.jpg",
  technologie: "/bg-tech.jpg",
  zdravie: "/bg-health.jpg",
  veda: "/bg-science.jpg",
  // Fallback to coffee background if specific image not available
  default: "/bg-coffee.jpg"
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const articles = await getArticles()
  
  // Kontrola či kategória existuje
  if (!categoryNames[params.slug]) {
    notFound()
  }

  // Get background image for this category (or use default)
  const backgroundImage = categoryBackgrounds[params.slug] || categoryBackgrounds.default

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
        {/* Hero section with background image */}
        <div className="mb-12 text-left p-6 relative">
          {/* Background image */}
          <div 
            className="absolute inset-0 z-0 opacity-70" 
            style={{ 
              backgroundImage: `url('${backgroundImage}')`, 
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          ></div>
          
          {/* Coffee-colored overlay */}
          <div 
            className="absolute inset-0 z-1 opacity-60" 
            style={{ 
              backgroundColor: "#805840", // coffee-700 color
              mixBlendMode: "multiply"
            }}
          ></div>
          
          {/* Content with relative positioning to appear above the background */}
          <div className="relative z-10">
            <h1 
              className="text-3xl md:text-5xl font-medium text-zinc-900 mb-2 md:mb-4 px-3 py-1 inline-block"
              style={{ 
                fontFamily: "'DM Serif Text', serif",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              {categoryNames[params.slug]}
            </h1>
            <p 
              className="text-base md:text-lg text-zinc-800 max-w-2xl mb-4 md:mb-6 p-2"
              style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Prehľad najdôležitejších správ z kategórie {categoryNames[params.slug].toLowerCase()}.
              Všetky relevantné informácie na jednom mieste.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-coffee-200">
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
