import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../types/Article';
import { createSlug } from './ArticleDetail';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  selectedCategory: string;
  loading: boolean;
  scraping: boolean;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ 
  articles, 
  selectedCategory, 
  loading, 
  scraping 
}) => {
  const navigate = useNavigate();

  const getFilteredArticles = () => {
    return selectedCategory === "Všetky"
      ? articles
      : articles.filter(article => article.category === selectedCategory);
  };

  const handleArticleClick = (article: Article) => {
    const slug = createSlug(article.title);
    navigate(`/article/${slug}`);
    window.scrollTo(0, 0);
  };

  const filteredArticles = getFilteredArticles();

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Načítavam články...</p>;
  }

  if (filteredArticles.length === 0) {
    return (
      <p style={{ textAlign: 'center' }}>
        {articles.length === 0
          ? `Zatiaľ žiadne články. Skúste ${scraping ? 'počkať na dokončenie spracovania' : 'načítať nové'}...`
          : `Žiadne články v kategórii "${selectedCategory}"`}
      </p>
    );
  }

  return (
    <div className="article-grid">
      {filteredArticles.map((article, i) => (
        <ArticleCard
          key={article.id || article.url?.join('-') || `article-${i}`}
          article={article}
          onClick={() => handleArticleClick(article)}
        />
      ))}
    </div>
  );
};

export default ArticleGrid;