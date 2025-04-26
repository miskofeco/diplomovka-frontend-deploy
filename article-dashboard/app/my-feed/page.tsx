import { Header } from "@/components/header"
import { ArticleCard } from "@/components/article-card"
import { getArticles } from "@/lib/data"
import Link from "next/link"

export default function MyFeed() {
  // This would normally be filtered based on user preferences
  // For now, we'll just show all articles as a placeholder
  const articles = getArticles()

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Intro section */}
      <section className="bg-coffee-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-coffee-900">Váš personalizovaný feed</h1>
          <p className="text-lg text-coffee-800 max-w-3xl mx-auto">
            Články vybrané na základe vašich preferencií a záujmov.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">My Personalized Feed</h2>
            <Link href="/profile/settings" className="text-sm text-coffee-700 hover:text-coffee-900 flex items-center">
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
                className="mr-1"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Adjust Preferences
            </Link>
          </div>

          <div className="bg-coffee-50 p-4 rounded-lg mb-8">
            <p className="text-coffee-800">
              <strong>Your feed is based on:</strong> Technology, Health, AI, Renewable Energy, and more topics you've
              selected in your preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
