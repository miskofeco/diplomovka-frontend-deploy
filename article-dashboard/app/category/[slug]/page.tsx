import { Header } from "@/components/header"
import { notFound } from "next/navigation"
import { getArticles } from "@/lib/data"
import dynamic from 'next/dynamic'
import { format } from "date-fns"
import { sk } from "date-fns/locale"
import { Suspense } from "react"
import { ContentContainer } from "@/components/content-container"
import Image from "next/image"

// Dynamicky importované komponenty
const ArticleCard = dynamic(() => import('@/components/article-card').then(mod => ({ default: mod.ArticleCard })), {
  loading: () => <div className="border border-coffee-200 p-4 h-full"><div className="animate-pulse bg-coffee-50 h-40 mb-4"></div><div className="animate-pulse bg-coffee-50 h-6 mb-2"></div></div>
})

const currentDate = new Date()
const formattedDate = format(currentDate, "EEEE, d. MMMM yyyy", { locale: sk })

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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const articles = await getArticles()
  
  // Awaiting params to get the slug
  const { slug } = await params
  
  // Kontrola či kategória existuje
  if (!categoryNames[slug]) {
    notFound()
  }

  // Get background image for this category (or use default)
  const backgroundImage = categoryBackgrounds[slug] || categoryBackgrounds.default

  // Filtrovanie článkov podľa kategórie
  const filteredArticles = articles.filter(article => {
    const normalizedCategory = article.category
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
    
    return normalizedCategory === slug
  })

  const last5ArticleTitles = articles.slice(5).map(article => article.title).filter(Boolean)

  // Get current date for newspaper header
  const currentDate = new Date()
  const formattedDate = format(currentDate, "EEEE, d. MMMM yyyy", { locale: sk })
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero section with background image */}
      <div className="bg-zinc-100">
        <ContentContainer>
        <div className=" pt-12">
          
        <div className="flex flex-column items-center">
        <p className="text-lg text-zinc-600 mb-4 text-center align-middle">
          {capitalizedDate}
        </p>
      </div>
          <h1
            className="font-serif text-zinc-900 tracking-tight pb-10 text-left leading-none w-full"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 7rem)",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {categoryNames[slug].toLocaleUpperCase()+"."}
          </h1>


      </div>
        </ContentContainer>
      </div>
      <div className="border-y border-zinc-300 py-0">
        <ContentContainer>
        <div className="bg-white text-zinc-600 text-sm md:text-base font-semibold px-4 py-3 overflow-hidden">
          <div className="flex items-center gap-6">
          <span className="text-zinc-600 tracking-widest uppercase whitespace-nowrap text-xs md:text-sm">Obsah</span>
            
            {/* Scrolling titles container */}
            <div className="flex-1 overflow-hidden relative">
              <div className="flex gap-8 animate-scroll-left whitespace-nowrap">
                {/* Duplicate the titles for seamless loop */}
                {[...last5ArticleTitles, ...last5ArticleTitles].map((title, index) => (
                  <span 
                    key={index}
                    className="font-normal text-zinc-600 inline-block"
                  >
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
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-zinc-200">
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
      </ContentContainer> 
    </div>

  )
}
