import React from 'react';
import { Article } from '../types/Article';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <article className="article-card" onClick={onClick}>
      {article.top_image && (
        <img
          src={article.top_image}
          alt=""
          className="article-image"
          loading="lazy"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      <div className="article-card-content">
        <h2>{article.title || 'Bez názvu'}</h2>
        {article.intro && <p className="article-intro">{article.intro}</p>}
        <div className="article-meta">
          {article.category && (
            <>
              <strong>Kategória:</strong> 
              <span className="article-category">{article.category}</span>
            </>
          )}
          <strong>Dátum:</strong>
          <span className="article-date">
            {new Date(article.scraped_at).toLocaleDateString('sk-SK', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
