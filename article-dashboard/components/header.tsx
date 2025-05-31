"use client"

import Link from "next/link"
import Image from "next/image"
import { User, Filter, Menu, Coffee, Search as SearchImage, X } from "lucide-react"
import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { CenteredBorder } from "@/components/ui/centered-border"
import { ContentContainer } from '@/components/content-container'
import { Search } from './search'

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
  const isMobile = useIsMobile()
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-coffee-700">
      {/* Top header with logo and user actions */}
      <ContentContainer>
      <div className="relative">
        <div className="py-4">
          <div className="flex items-center justify-between">
            {/* Left section - Mobile menu or Logo (desktop) */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <button className="p-2 text-coffee-700 hover:text-coffee-900">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Categories Menu</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] p-0">
                  <SheetTitle className="sr-only">Categories Menu</SheetTitle>
                  <div className="p-6">
                    {/* Mobile navigation links */}
                    <div className="mb-6 border-b border-coffee-200 pb-4">
                      <h2 className="text-lg font-semibold mb-4">Menu</h2>
                      <nav className="flex flex-col space-y-3">
                        <Link
                          href="/"
                          className="flex items-center text-zinc-600 hover:text-coffee-700 transition-colors py-1"
                        >
                          <Coffee className="h-4 w-4 mr-2" />
                          Ku káve
                        </Link>
                        <Link
                          href="/my-feed"
                          className="flex items-center text-zinc-600 hover:text-coffee-700 transition-colors py-1"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Moja šálka kávy
                        </Link>
                        <Link
                          href="/profile/settings"
                          className="flex items-center text-zinc-600 hover:text-coffee-700 transition-colors py-1"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profil
                        </Link>
                      </nav>
                    </div>
                    
                    {/* Categories section */}
                    <h2 className="text-lg font-semibold mb-4">Kategórie</h2>
                    <nav className="flex flex-col space-y-3">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/category/${category.slug}`}
                          className="text-zinc-600 hover:text-coffee-700 transition-colors py-1"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Logo (left position) */}
              <Link href="/" className="hidden md:flex items-center ml-2">
                <div className="relative w-10 h-10">
                  <Image 
                    src="/logo-d.png" 
                    alt="Denná šálka kávy" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Center section - Mobile Logo */}
            <div className="md:hidden flex justify-center flex-1">
              <Link href="/" className="flex items-center">
                <div className="relative w-10 h-10">
                  <Image 
                    src="/logo-d.png" 
                    alt="Denná šálka kávy" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Center section - Desktop Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <Search />
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Desktop navigation links */}
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center text-sm text-zinc-900 hover:text-coffee-900 transition-colors"
                  aria-label="Ku káve"
                >
                  <Coffee className="h-4 w-4 mr-1" />
                  <span>Ku káve</span>
                </Link>

                <Link
                  href="/my-feed"
                  className="flex items-center text-sm text-zinc-900 hover:text-coffee-900 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  <span>Moja šálka kávy</span>
                </Link>

                <Link
                  href="/profile/settings"
                  className="p-2 rounded-full hover:bg-coffee-100 transition-colors"
                  aria-label="Profile Settings"
                >
                  <User className="h-5 w-5 text-zinc-900" />
                  <span className="sr-only">Profile Settings</span>
                </Link>
              </div>

              {/* Mobile search toggle button */}
              <button 
                onClick={toggleMobileSearch}
                className="md:hidden p-2 text-coffee-700 hover:text-coffee-900 transition-colors"
                aria-label="Toggle Search"
              >
                {isMobileSearchOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <SearchImage className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search bar - shown/hidden based on state */}
        <div className={cn(
          "md:hidden border-t border-coffee-200 transition-all duration-200 ease-in-out overflow-visible",
          isMobileSearchOpen ? "block" : "hidden"
        )}>
          {/* Search container with proper z-index for dropdown */}
          <div className="relative z-[60] px-4 py-3">
            <Search />
          </div>
        </div>
      </div>

      {/* Bottom header with categories - hidden on mobile */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 py-1">
          <nav className="flex justify-center gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="font-heading px-4 py-3 text-coffee-800 hover:bg-coffee-100 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </ContentContainer>
    </header>
  )
}
