import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { newsAPI, userAPI } from '../utils/api';
import NewsCard from '../components/NewsCard';
import CategoryFilter from '../components/CategoryFilter';
import './Feed.css';

const Feed = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userCategories = user?.preferences?.categories || [];

  const fetchSaved = useCallback(async () => {
    try {
      const res = await userAPI.getSaved();
      const ids = new Set(res.data.articles.map((a) => a.articleId));
      setSavedIds(ids);
    } catch {
      // Sessizce devam et
    }
  }, []);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, pageSize: 12 };
      const res = await newsAPI.getFeed(params);
      let fetched = res.data.articles || [];
      if (selectedCategory) {
        fetched = fetched.filter((a) => a.category === selectedCategory);
      }
      setArticles(fetched);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError('Haber akışı yüklenirken hata oluştu.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchFeed();
    fetchSaved();
  }, [fetchFeed, fetchSaved]);

  const handleSaveToggle = (articleId, nowSaved) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(articleId);
      else next.delete(articleId);
      return next;
    });
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  if (userCategories.length === 0) {
    return (
      <div className="feed-page container">
        <div className="empty-preferences">
          <div className="empty-icon">⚙️</div>
          <h2>Kategori Seçilmedi</h2>
          <p>Kişisel haber akışınızı görmek için tercihlerinizi güncelleyin.</p>
          <Link to="/settings" className="btn btn-primary">
            Tercihleri Güncelle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <div className="feed-header">
        <div className="container">
          <div className="feed-header-content">
            <div>
              <h1 className="feed-title">Haber Akışım</h1>
              <p className="feed-subtitle">
                Seçilen kategorilere göre kişiselleştirilmiş haberler
              </p>
            </div>
            <Link to="/settings" className="btn btn-secondary btn-sm">
              ⚙️ Tercihler
            </Link>
          </div>

          {/* Kullanıcının kategori filtresi */}
          <div className="feed-filter">
            <CategoryFilter
              categories={userCategories}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
              showAll={true}
            />
          </div>
        </div>
      </div>

      <div className="container feed-content">
        {error && (
          <div className="alert alert-error">
            {error}
            <button className="retry-btn" onClick={fetchFeed}>
              Tekrar Dene
            </button>
          </div>
        )}

        {loading && (
          <div className="loading-center">
            <div className="spinner"></div>
          </div>
        )}

        {!loading && !error && (
          <>
            {articles.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📰</div>
                <h3>Bu kategoride haber bulunamadı</h3>
                <p>Farklı bir kategori seçin veya tercihlerinizi güncelleyin.</p>
              </div>
            ) : (
              <div className="news-grid">
                {articles.map((article) => (
                  <NewsCard
                    key={article.articleId}
                    article={article}
                    isSaved={savedIds.has(article.articleId)}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Önceki
                </button>
                <span className="page-info">
                  {page} / {totalPages}
                </span>
                <button
                  className="page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Sonraki →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;
