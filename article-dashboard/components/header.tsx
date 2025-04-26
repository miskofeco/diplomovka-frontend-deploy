import Link from "next/link"
import { Coffee, User, Filter } from "lucide-react"

const categories = [
  { name: "Politika", slug: "politika" },
  { name: "Ekonomika", slug: "ekonomika" },
  { name: "Šport", slug: "sport" },
  { name: "Kultúra", slug: "kultura" },
  { name: "Technológie", slug: "technologie" },
  { name: "Zdravie", slug: "zdravie" },
  { name: "Veda", slug: "veda" }
]

export function Header() {
  return (
    <header className="border-b border-zinc-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <Coffee className="h-8 w-8 text-coffee-700" />
              <span className="ml-2 text-2xl font-bold text-zinc-900">Denná šálka kávy</span>
            </Link>

            <div className="flex md:hidden items-center">
              {/* My Feed button for mobile */}
              <Link
                href="/my-feed"
                className="flex items-center justify-center p-2 mr-2 text-coffee-700 hover:text-coffee-900"
              >
                <Filter className="h-5 w-5" />
                <span className="sr-only">My Feed</span>
              </Link>

              {/* User profile for mobile - shown only on small screens */}
              <Link
                href="/profile/settings"
                className="flex items-center justify-center p-2 rounded-full hover:bg-coffee-100 transition-colors"
              >
                <User className="h-5 w-5 text-coffee-700" />
                <span className="sr-only">Profile Settings</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="text-zinc-600 hover:text-coffee-700 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* My Feed button - hidden on small screens */}
            <Link
              href="/my-feed"
              className="hidden md:flex items-center justify-center ml-6 text-sm text-coffee-700 hover:text-coffee-900 transition-colors"
            >
              <Filter className="h-4 w-4 mr-1" />
              My Feed
            </Link>

            {/* User profile for desktop - hidden on small screens */}
            <Link
              href="/profile/settings"
              className="hidden md:flex items-center justify-center ml-6 p-2 rounded-full hover:bg-coffee-100 transition-colors"
              aria-label="Profile Settings"
            >
              <User className="h-5 w-5 text-coffee-700" />
              <span className="sr-only">Profile Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
