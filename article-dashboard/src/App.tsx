import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import ArticleGrid from './components/ArticleGrid';
import ArticleDetail from './components/ArticleDetail';
import { Article } from './types/Article';

const PREDEFINED_CATEGORIES = ["Všetky", "Domov", "Svet", "Ekonomika", "Šport"];
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Všetky");
  const [scraping, setScraping] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/api/articles`);
      if (!res.ok) {
        throw new Error(`Chyba pri načítaní článkov: ${res.statusText} (${res.status})`);
      }
      const data = await res.json();
      data.sort((a: Article, b: Article) => 
        new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime()
      );
      setArticles(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Nastala neznáma chyba.");
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    setScraping(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/api/scrape`, { method: 'POST' });
      if (!res.ok) {
        throw new Error(`Chyba pri scrapovaní: ${res.statusText} (${res.status})`);
      }
      await new Promise(resolve => setTimeout(resolve, 2500));
      await fetchArticles();
    } catch (err) {
      console.error("Scrape error:", err);
      setError(err instanceof Error ? err.message : "Nastala neznáma chyba pri scrapingu.");
    } finally {
      setScraping(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="app-header">
              <h1>📰 AI Generátor článkov</h1>
              <button
                className="scrape-button"
                onClick={handleScrape}
                disabled={scraping || loading}
              >
                {scraping ? "Spracúvam..." : "Načítať nové články"}
              </button>
            </header>

            {error && <p style={{ color: 'red', textAlign: 'center', padding: '0 2rem' }}>Chyba: {error}</p>}

            <div className="categories-filter">
              <div className="categories-list">
                {PREDEFINED_CATEGORIES.map(category => (
                  <button
                    key={category}
                    className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                    disabled={loading || scraping}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="article-grid-container">
              <ArticleGrid
                articles={articles}
                selectedCategory={selectedCategory}
                loading={loading}
                scraping={scraping}
              />
            </div>
          </div>
        } />
        <Route path="/article/:slug" element={<ArticleDetail articles={articles} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
