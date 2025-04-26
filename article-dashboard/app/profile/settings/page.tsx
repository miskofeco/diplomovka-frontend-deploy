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
            Back to home
          </Link>

          <div className="bg-white p-6 rounded-lg border border-zinc-200">
            <h1 className="text-2xl font-bold mb-6 text-zinc-900">Profile Settings</h1>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-3 text-zinc-800">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your name"
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                  </div>
                </div>
              </div>

              {/* New section for article preferences */}
              <div>
                <h2 className="text-lg font-medium mb-3 text-zinc-800">Article Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="natural-language" className="block text-sm font-medium text-zinc-700 mb-1">
                      Describe your interests in natural language
                    </label>
                    <textarea
                      id="natural-language"
                      rows={3}
                      placeholder="Example: I'm interested in technology articles about AI and renewable energy, and health articles about nutrition."
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    ></textarea>
                    <p className="mt-1 text-xs text-zinc-500">
                      This helps us understand your preferences in your own words.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-zinc-700 mb-1">
                      Keywords (separated by commas)
                    </label>
                    <input
                      type="text"
                      id="keywords"
                      placeholder="AI, climate change, nutrition, etc."
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Content Length Preference</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="length-short"
                          name="content-length"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300"
                        />
                        <label htmlFor="length-short" className="ml-2 block text-sm text-zinc-700">
                          Short
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
                          Medium
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
                          Long
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Content Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="type-news"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                        />
                        <label htmlFor="type-news" className="ml-2 block text-sm text-zinc-700">
                          News
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="type-analysis"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                        />
                        <label htmlFor="type-analysis" className="ml-2 block text-sm text-zinc-700">
                          Analysis
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="type-opinion"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                        />
                        <label htmlFor="type-opinion" className="ml-2 block text-sm text-zinc-700">
                          Opinion
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="type-feature"
                          className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                        />
                        <label htmlFor="type-feature" className="ml-2 block text-sm text-zinc-700">
                          Feature
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-3 text-zinc-800">Preferences</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newsletter"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="newsletter" className="ml-2 block text-sm text-zinc-700">
                      Subscribe to newsletter
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="notifications" className="ml-2 block text-sm text-zinc-700">
                      Enable notifications for new articles
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-3 text-zinc-800">Favorite Categories</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cat-technology"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="cat-technology" className="ml-2 block text-sm text-zinc-700">
                      Technology
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cat-business"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="cat-business" className="ml-2 block text-sm text-zinc-700">
                      Business
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cat-health"
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="cat-health" className="ml-2 block text-sm text-zinc-700">
                      Health
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-coffee-700 text-white rounded-md hover:bg-coffee-800 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
