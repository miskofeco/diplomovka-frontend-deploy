import { Header } from "@/components/header"
import Link from "next/link"

export default function ProfileSettings() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center mb-6 text-coffee-600 hover:text-coffee-800">
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
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Späť na domovskú stránku
          </Link>

          <div className="bg-white p-6 border border-coffee-300">
            <h1 className="text-2xl font-bold mb-6 text-zinc-900">Nastavenia profilu</h1>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-3 text-zinc-800">Osobné informácie</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
                      Meno
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Vaše meno"
                      className="w-full px-3 py-2 border text-sm border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="vas.email@example.com"
                      className="w-full px-3 py-2 border text-sm border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                  </div>
                </div>
              </div>

              {/* New section for article preferences */}
              <div>
                <h2 className="text-lg font-medium mb-3 text-zinc-800">Preferencie článkov</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="natural-language" className="block text-sm font-medium text-zinc-700 mb-1">
                      Opíšte svoje záujmy vlastnými slovami
                    </label>
                    <textarea
                      id="natural-language"
                      rows={3}
                      placeholder="Príklad: Zaujímajú ma technologické články o AI a obnoviteľnej energii, a zdravotné články o výžive."
                      className="w-full px-3 py-2 border text-sm border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    ></textarea>
                    <p className="mt-1 text-xs text-zinc-500">
                      Toto nám pomáha lepšie pochopiť vaše preferencie.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-zinc-700 mb-1">
                      Kľúčové slová (oddelené čiarkami)
                    </label>
                    <input
                      type="text"
                      id="keywords"
                      placeholder="AI, klimatická zmena, výživa, atď."
                      className="w-full px-3 py-2 border text-sm border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Preferovaná dĺžka obsahu</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="length-short"
                          name="content-length"
                          className="h-4 w-4 text-sm text-coffee-600 focus:ring-coffee-500 border-zinc-300"
                        />
                        <label htmlFor="length-short" className="ml-2 block text-sm text-zinc-700">
                          Krátke
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="length-medium"
                          name="content-length"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300"
                          defaultChecked
                        />
                        <label htmlFor="length-medium" className="ml-2 block text-sm text-zinc-700">
                          Stredné
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="length-long"
                          name="content-length"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300"
                        />
                        <label htmlFor="length-long" className="ml-2 block text-sm text-zinc-700">
                          Dlhé
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Typ obsahu</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="type-news"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                        />
                        <label htmlFor="type-news" className="ml-2 block text-sm text-zinc-700">
                          Správy
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="type-analysis"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                        />
                        <label htmlFor="type-analysis" className="ml-2 block text-sm text-zinc-700">
                          Analýzy
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="type-opinion"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                        />
                        <label htmlFor="type-opinion" className="ml-2 block text-sm text-zinc-700">
                          Názory
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="type-feature"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                        />
                        <label htmlFor="type-feature" className="ml-2 block text-sm text-zinc-700">
                          Reportáže
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-3 text-zinc-800">Nastavenia</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newsletter"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="newsletter" className="ml-2 block text-sm text-zinc-700">
                      Prihlásiť sa na odber newslettera
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="notifications" className="ml-2 block text-sm text-zinc-700">
                      Povoliť notifikácie o nových článkoch
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-3 text-zinc-800">Obľúbené kategórie</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cat-politika"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="cat-politika" className="ml-2 block text-sm text-zinc-700">
                      Politika
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cat-ekonomika"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="cat-ekonomika" className="ml-2 block text-sm text-zinc-700">
                      Ekonomika
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cat-sport"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="cat-sport" className="ml-2 block text-sm text-zinc-700">
                      Šport
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cat-kultura"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="cat-kultura" className="ml-2 block text-sm text-zinc-700">
                      Kultúra
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cat-technologie"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="cat-technologie" className="ml-2 block text-sm text-zinc-700">
                      Technológie
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cat-zdravie"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="cat-zdravie" className="ml-2 block text-sm text-zinc-700">
                      Zdravie
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cat-veda"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="cat-veda" className="ml-2 block text-sm text-zinc-700">
                      Veda
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-coffee-700 text-white rounded-md hover:bg-coffee-800 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-2"
                >
                  Uložiť zmeny
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
