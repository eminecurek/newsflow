import React, { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../utils/api';
import NewsCard from '../components/NewsCard';
import CategoryFilter from '../components/CategoryFilter';
import { CATEGORY_LABELS } from '../components/CategoryFilter';
import './Saved.css';

const Saved = () => {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchSaved = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userAPI.getSaved();
      setArticles(res.data.articles || []);
    } catch (err) {
      setError('Kaydedilen haberler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  useEffect(() => {
    if (selectedCategory) {
      setFiltered(articles.filter((a) => a.category === selectedCategory));
    } else {
      setFiltered(articles);
    }
  }, [articles, selectedCategory]);

  const handleSaveToggle = (articleId, nowSaved) => {
    if (!nowSaved) {
      setArticles((prev) => prev.filter((a) => a.articleId !== articleId));
    }
  };

  const availableCategories = [...new Set(articles.map((a) => a.category))].filter(Boolean);

  return (
    <div className="saved-page">
      <div className="saved-header">
        <div className="container">
          <h1 className="saved-title">Kaydedilen Haberler</h1>
          <p className="saved-subtitle">
            {articles.length > 0
              ? `${articles.length} haber kaydedildi`
              : 'Henüz haber kaydedilmedi'}
          </p>

          {availableCategories.length > 0 && (
            <div className="saved-filter">
              <CategoryFilter
                categories={availableCategories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                showAll={true}
              />
            </div>
          )}
        </div>
      </div>

      <div className="container saved-content">
        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div className="loading-center">
            <div className="spinner"></div>
          </div>
        )}

        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔖</div>
                <h3>
                  {selectedCategory
                    ? `${CATEGORY_LABELS[selectedCategory]?.label || selectedCategory} kategorisinde kaydedilen haber yok`
                    : 'Henüz haber kaydetmediniz'}
                </h3>
                <p>
                  {selectedCategory
                    ? 'Farklı bir kategori seçin veya filtreyi kaldırın.'
                    : 'Ana sayfada veya haber akışında haberlerin üzerindeki "Kaydet" butonuna tıklayın.'}
                </p>
                {selectedCategory && (
                  <button
                    className="btn btn-secondary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => setSelectedCategory('')}
                  >
                    Filtreyi Kaldır
                  </button>
                )}
              </div>
            ) : (
              <div className="news-grid">
                {filtered.map((article) => (
                  <NewsCard
                    key={article.articleId}
                    article={article}
                    isSaved={true}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Saved;
