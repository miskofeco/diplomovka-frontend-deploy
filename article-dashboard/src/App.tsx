import React, { useEffect, useState } from "react"

type Article = {
  title: string
  intro: string
  summary: string
  url: string[]       // zoznam URL adries
  top_image: string   // URL obrázku
  category: string
  tags: string[]
  scraped_at: string
}
const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:5050"

function App() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)

  const fetchArticles = async () => {
    const res = await fetch(`${baseUrl}/api/articles`)
    const data = await res.json()
    data.sort((a: Article, b: Article) => new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime())
    setArticles(data)
  }

  const handleScrape = async () => {
    setLoading(true)
    await fetch(`${baseUrl}/api/scrape`, { method: "POST" })
    await fetchArticles()
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📰 Vygenerované články</h1>
      <button onClick={handleScrape} disabled={loading}>
        {loading ? "Spracúvam..." : "Načítať nové články"}
      </button>

      <ul>
        {articles.map((article, i) => (
          <li key={i} style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
            <h2>{article.title}</h2>
            <p><strong>Scraped at:</strong> {new Date(article.scraped_at).toLocaleString()}</p>

            {article.top_image && (
              <img src={article.top_image} alt="top image" style={{ width: "100%", maxHeight: "300px", objectFit: "cover", marginBottom: "1rem" }} />
            )}

            <p><strong>Intro:</strong> {article.intro}</p>
            <p>{article.summary}</p>
            <p><strong>Kategória:</strong> {article.category}</p>
            <p><strong>Tagy:</strong> {article.tags.join(", ")}</p>

            <div>
              <strong>Zdrojové URL:</strong>
              <ul>
                {article.url?.map((link, j) => (
                  <li key={j}>
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App