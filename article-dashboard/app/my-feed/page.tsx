import { Header } from "@/components/header"
import { getArticles } from "@/lib/data"
import Link from "next/link"
import { cookies } from "next/headers"
import Image from "next/image"
import { format } from "date-fns"
import { sk } from "date-fns/locale"

// Default categories if user has no preferences
const DEFAULT_CATEGORIES = ["politika", "kultura", "sport"]

export default async function MyFeed() {
  const articles = await getArticles()
  
  // Get user preferences from cookies
  const cookieStore = await cookies()
  const userPreferencesCookie = cookieStore.get("userPreferences")
  
  let userCategories = DEFAULT_CATEGORIES
  
  // If user has saved preferences, use those instead of defaults
  if (userPreferencesCookie) {
    try {
      const preferences = JSON.parse(userPreferencesCookie.value)
      if (preferences.categories && preferences.categories.length > 0) {
        userCategories = preferences.categories
      }
    } catch (e) {
      console.error("Error parsing user preferences:", e)
    }
  }
  
  // Filter articles based on user categories
  const filteredArticles = articles.filter(article => {
    const normalizedCategory = article.category
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
    
    return userCategories.includes(normalizedCategory)
  })

  // Get current date for newspaper header
  const currentDate = new Date()
  const formattedDate = format(currentDate, "EEEE, d. MMMM yyyy", { locale: sk })

  // No articles case
  if (filteredArticles.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h2 className="text-3xl font-serif font-bold mb-4">Žiadne články</h2>
            <p className="text-zinc-600 mb-6">
              Nenašli sa žiadne články podľa vašich preferencií.
            </p>
            <Link href="/profile/settings" className="text-coffee-700 hover:text-coffee-900 underline">
              Upravte svoje preferencie
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Split articles for different layout sections
  const mainArticle = filteredArticles[0]
  const secondaryArticles = filteredArticles.slice(1, 3)
  const tertiaryArticles = filteredArticles.slice(3, 6)
  const remainingArticles = filteredArticles.slice(6)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Newspaper header */}
      <div className="bg-coffee-50 border-b border-zinc-200 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif text-center font-bold mb-2">Vaša šálka kávy</h1>
          <p className="text-center text-zinc-500">{formattedDate}</p>
          
          <div className="flex justify-center items-center mt-4">
            <div className="hidden text-sm text-zinc-500">Váš personalizovaný feed</div>
            <Link href="/profile/settings" className="text-sm text-coffee-700 hover:text-coffee-900 flex items-center">
              Upraviť preferencie
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Main headline article */}
        <div className="mb-12 border-b border-zinc-200 pb-8">
          <Link href={`/articles/${mainArticle.slug}`}>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight hover:text-coffee-800 transition-colors">
              {mainArticle.title}
            </h2>
            <div className="flex items-center text-sm text-zinc-500 mb-4">
              <span className="mr-2">{mainArticle.category}</span>
              <span>•</span>
              <span className="ml-2">{new Date(mainArticle.scraped_at).toLocaleDateString("sk-SK")}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="relative aspect-video">
                <Image
                  src={mainArticle.top_image || "/placeholder.jpg"}
                  alt={mainArticle.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-bold mb-4">{mainArticle.intro}</p>
                <p className="text-zinc-700 line-clamp-4">{mainArticle.content?.substring(0, 300)}...</p>
                <span className="inline-block mt-4 text-coffee-700 hover:underline">Čítať viac</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Secondary articles - 2 columns with equal heights */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 border-b border-zinc-200 pb-8">
          {secondaryArticles.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="group flex flex-col h-full">
              <div className="mb-3">
                <span className="text-xs px-2 py-1 bg-coffee-700 text-white">
                  {article.category}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 group-hover:text-coffee-800 transition-colors min-h-[4rem] flex items-start">
                {article.title}
              </h3>
              <div className="relative aspect-video mb-3 w-full">
                <Image
                  src={article.top_image || "/placeholder.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-zinc-700 line-clamp-3 flex-grow">{article.intro}</p>
            </Link>
          ))}
        </div>

        {/* Special feature section */}
        <div className="mb-12 text-center">
          <h3 className="inline-block text-xl font-serif font-bold border-b-2 border-coffee-700 mb-8 pb-1">
            MÔŽE SA VÁM PÁČIŤ
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {tertiaryArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className="group flex flex-col h-full">
                <div className="relative aspect-square mb-3 w-full">
                  <Image
                    src={article.top_image || "/placeholder.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-lg font-serif font-bold mb-2 group-hover:text-coffee-800 transition-colors min-h-[3rem] flex items-start">
                  {article.title}
                </h4>
                <p className="text-sm text-zinc-500 mt-auto">{article.category} • {new Date(article.scraped_at).toLocaleDateString("sk-SK")}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Remaining articles in consistent layout */}
        {remainingArticles.length > 0 && (
          <div className="mb-12">
            <h3 className="inline-block text-xl font-serif font-bold border-b-2 border-coffee-700 mb-8 pb-1">
              ĎALŠIE ČLÁNKY
            </h3>
            
            <div className="space-y-6">
              {/* Group articles into pairs for layout */}
              {Array.from({ length: Math.ceil(remainingArticles.length / 2) }).map((_, rowIndex) => {
                const startIdx = rowIndex * 2;
                const article1 = remainingArticles[startIdx];
                const article2 = remainingArticles[startIdx + 1];
                
                // Alternate which article is wide based on row index
                const isFirstWide = rowIndex % 2 === 0;
                
                return (
                  <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* First article in the pair */}
                    {article1 && (
                      <Link 
                        href={`/articles/${article1.slug}`}
                        className={`group ${isFirstWide ? 'md:col-span-8' : 'md:col-span-4'} border-t border-zinc-200 pt-4 flex flex-col h-full`}
                      >
                        <div className="flex flex-col md:flex-row gap-4 h-full">
                          <div className={`relative ${isFirstWide ? 'md:w-1/3' : 'w-full'} h-[120px]`}>
                            <Image
                              src={article1.top_image || "/placeholder.jpg"}
                              alt={article1.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col flex-grow">
                            <h4 className="text-lg font-serif font-bold mb-2 group-hover:text-coffee-800 transition-colors min-h-[3rem] flex items-start">
                              {article1.title}
                            </h4>
                            {isFirstWide && (
                              <p className="text-zinc-700 line-clamp-2 mb-2">{article1.intro}</p>
                            )}
                            <p className="text-sm text-zinc-500 mt-auto">{article1.category} • {new Date(article1.scraped_at).toLocaleDateString("sk-SK")}</p>
                          </div>
                        </div>
                      </Link>
                    )}
                    
                    {/* Second article in the pair */}
                    {article2 && (
                      <Link 
                        href={`/articles/${article2.slug}`}
                        className={`group ${!isFirstWide ? 'md:col-span-8' : 'md:col-span-4'} border-t border-zinc-200 pt-4 flex flex-col h-full`}
                      >
                        <div className="flex flex-col md:flex-row gap-4 h-full">
                          <div className={`relative ${!isFirstWide ? 'md:w-1/3' : 'w-full'} h-[120px]`}>
                            <Image
                              src={article2.top_image || "/placeholder.jpg"}
                              alt={article2.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col flex-grow">
                            <h4 className="text-lg font-serif font-bold mb-2 group-hover:text-coffee-800 transition-colors min-h-[3rem] flex items-start">
                              {article2.title}
                            </h4>
                            {!isFirstWide && (
                              <p className="text-zinc-700 line-clamp-2 mb-2">{article2.intro}</p>
                            )}
                            <p className="text-sm text-zinc-500 mt-auto">{article2.category} • {new Date(article2.scraped_at).toLocaleDateString("sk-SK")}</p>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
