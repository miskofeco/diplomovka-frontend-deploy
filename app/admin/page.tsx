"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const [token, setToken] = useState("")
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" })
        const data = (await response.json()) as { authenticated?: boolean }
        setIsAuthenticated(Boolean(data.authenticated))
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string }
        setError(payload.error || "Nepodarilo sa prihlásiť do admin režimu.")
        return
      }

      setIsAuthenticated(true)
      setToken("")
      router.push("/")
      router.refresh()
    } catch {
      setError("Nepodarilo sa prihlásiť do admin režimu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    setIsAuthenticated(false)
    router.refresh()
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-700" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 p-6">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">Admin prístup</h1>
        <p className="text-sm text-zinc-600 mb-6">
          Tento panel slúži na odomknutie spracovania článkov.
        </p>

        {isAuthenticated ? (
          <div className="space-y-3">
            <p className="text-sm text-green-700">Admin režim je aktívny.</p>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/")} variant="coffee">
                Späť na hlavnú stránku
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Odhlásiť
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-token" className="block text-sm text-zinc-700 mb-1">
                Admin token
              </label>
              <input
                id="admin-token"
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
                autoComplete="off"
                required
              />
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <div className="flex items-center gap-2">
              <Button type="submit" variant="coffee" disabled={isSubmitting}>
                {isSubmitting ? "Prihlasujem..." : "Prihlásiť admin režim"}
              </Button>
              <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
                Zrušiť
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

