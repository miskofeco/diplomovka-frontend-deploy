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

  const last5ArticleTitles = articles.slice(-5).map(article => article.title).filter(Boolean)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero section with background image */}
      <ContentContainer>
      <div className="border-b border-coffee-700 py-12 px-4 bg-white">
          
          {/* Nadpis */}
          <div className="flex flex-row items-center gap-4">
          <Image 
                      src="/logo-d.png" 
                      alt="Denná šálka kávy" 
                      width={25} 
                      height={25} 
                      className="h-auto object-contain"
                      style={{
                        width: "clamp(1.5rem, 3vw, 4rem)",
                        height: "auto"
                      }}
            />
          <h1
            className="font-serif font-black text-zinc-900 tracking-tight text-left leading-none w-full"
            style={{
              fontSize: "clamp(1rem, 2vw, 3rem)",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            denná šálka kávy
          </h1>
          </div>
          <h1
            className="font-serif font-black text-zinc-900 tracking-tight mb-10 text-left leading-none w-full"
            style={{
              fontSize: "clamp(3rem, 7vw, 8rem)",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {categoryNames[slug].toLocaleLowerCase()}
          </h1>
            {/* Dátum */}
            <p className="text-sm text-zinc-400 mb-6 text-left">
              {formattedDate}
            </p>

          {/* Hnedý banner s automaticky posuvnými titulkami */}
        <div className="mt-5 mb-5 bg-coffee-700 text-white text-sm md:text-base font-semibold px-4 py-3 overflow-hidden">
          <div className="flex items-center gap-6">
          <span className="text-white tracking-widest uppercase whitespace-nowrap text-xs md:text-sm">Obsah</span>
            
            {/* Scrolling titles container */}
            <div className="flex-1 overflow-hidden relative">
              <div className="flex gap-8 animate-scroll-left whitespace-nowrap">
                {/* Duplicate the titles for seamless loop */}
                {[...last5ArticleTitles, ...last5ArticleTitles].map((title, index) => (
                  <span 
                    key={index}
                    className="font-normal text-white/90 inline-block"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <main className="container mx-auto px-4 py-8">
        

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
      </ContentContainer> 
    </div>

  )
}
