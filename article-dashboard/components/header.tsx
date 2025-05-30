"use client"

import Link from "next/link"
import Image from "next/image"
import { User, Filter, Menu, Coffee, Search as SearchImage } from "lucide-react"
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-coffee-700">
      {/* Top header with logo and user actions */}
      <ContentContainer>
      <div className="relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image 
                src="/coffee-logo-2.png" 
                alt="Denná šálka kávy" 
                width={40} 
                height={40} 
                className="h-10 w-10 md:h-12 md:w-12"
              />
              <p className="ml-2 text-lg md:text-2xl text-zinc-900 font-semibold font-heading hidden md:inline">Denná šálka kávy</p>
            </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <Search />
          </div>

            <div className="flex items-center">
              {/* Desktop navigation links - hidden on mobile */}
              <div className="hidden md:flex items-center">
                <Link
                  href="/"
                  className="flex items-center justify-center ml-4 text-sm text-zinc-900 hover:text-coffee-900 transition-colors"
                  aria-label="Profile Settings"
                >
                  <Coffee className="h-4 w-4 mr-1" />
                  <span className="md:inline">Ku káve</span>
                </Link>

                {/* My Feed button */}
                <Link
                  href="/my-feed"
                  className="flex items-center justify-center ml-4 text-sm text-zinc-900 hover:text-coffee-900 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  <span className="md:inline">Moja šálka kávy</span>
                </Link>

                {/* User profile */}
                <Link
                  href="/profile/settings"
                  className="flex items-center justify-center ml-4 p-2 rounded-full hover:bg-coffee-100 transition-colors"
                  aria-label="Profile Settings"
                >
                  <User className="h-5 w-5 text-zinc-900" />
                  <span className="sr-only">Profile Settings</span>
                </Link>
              </div>

              {/* Categories menu for mobile */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden ml-2">
                  <button className="p-2 text-coffee-700 hover:text-coffee-900">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Categories Menu</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] p-0">
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
            </div>
          </div>
        </div>
      </div>

      {/* Bottom header with categories - hidden on mobile */}
      <div className="hidden md:block ">
        <div className="container mx-auto px-4 py-1">
          <nav className="flex justify-left gap-8">
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
