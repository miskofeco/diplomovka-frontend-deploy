import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Article } from '../types/Article';
import PoliticalOrientationBar from './PoliticalOrientationBar';
import SourceButton from './SourceButton';

interface ArticleDetailProps {
  articles: Article[];
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ articles }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const article = articles.find(a => createSlug(a.title) === slug);

  if (!article) {
    return <div>Článok nebol nájdený</div>;
  }

  const handleGoBack = () => {
    navigate('/');
  };

  const orientationData = typeof article.source_orientation === 'string' 
    ? JSON.parse(article.source_orientation) 
    : article.source_orientation;

  // Predpokladáme, že article.sources obsahuje informácie o zdrojoch
  // Ak nie, vytvoríme zdroj z URL
  const sources = Array.isArray(article.url) ? article.url.map(url => ({
    url,
    sourceInfo: {
      name: new URL(url).hostname.replace('www.', ''),
      orientation: 'neutral' as const,
      // Logo môžeme získať z favicon.ico alebo podobne
      logo: `https://www.google.com/s2/favicons?domain=${url}&sz=64`
    }
  })) : [];

  return (
    <div className="article-detail-view">
      <button onClick={handleGoBack} className="back-button">
        ← Späť na prehľad
      </button>

      <h1>{article.title || 'Bez názvu'}</h1>

      <p className="detail-meta-info">
        {article.category && <><strong>Kategória:</strong> <span>{article.category}</span></>}
        {article.tags && article.tags.length > 0 && <><strong>Tagy:</strong> <span>{article.tags.join(', ')}</span></>}
        <strong>Dátum:</strong> <span>{new Date(article.scraped_at).toLocaleString()}</span>
      </p>

      {article.top_image && (
        <img
          src={article.top_image}
          alt={article.title || 'Obrázok článku'}
          className="article-detail-image"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          loading="lazy"
        />
      )}

      <PoliticalOrientationBar orientation={orientationData} />

      <div className="article-detail-content">
        {article.intro && (
          <div>
            <strong>Úvod</strong>
            <p>{article.intro}</p>
          </div>
        )}

        <div>
          <strong>Zhrnutie</strong>
          <p>{article.summary || 'Zhrnutie nie je k dispozícii.'}</p>
        </div>

        {sources.length > 0 && (
          <div className="article-sources">
            <strong>Zdrojové články</strong>
            <div className="source-buttons">
              {sources.map((source, index) => (
                <SourceButton
                  key={index}
                  url={source.url}
                  sourceInfo={source.sourceInfo}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <button onClick={handleGoBack} className="back-button" style={{marginTop: '2rem'}}>
        ← Späť na prehľad
      </button>
    </div>
  );
};

// Helper funkcia na vytvorenie URL-friendly slug-u
export const createSlug = (title: string = ''): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export default ArticleDetail;
