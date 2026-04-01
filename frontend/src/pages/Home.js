import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { newsAPI } from '../utils/api';
import NewsCard from '../components/NewsCard';
import CategoryFilter from '../components/CategoryFilter';
import './Home.css';

const CATEGORIES = ['teknoloji', 'spor', 'ekonomi', 'eglence', 'saglik', 'bilim', 'genel', 'politika'];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDemo, setIsDemo] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, pageSize: 12 };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.q = searchQuery;

      const res = await newsAPI.getNews(params);
      setArticles(res.data.articles || []);
      setTotalPages(res.data.totalPages || 1);
      setIsDemo(res.data.source === 'demo');
    } catch (err) {
      setError('Haberler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setSearchQuery('');
    setPage(1);
  };

  return (
    <main className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="hero-content container">
          <h1 className="hero-title">
            Güncel Haberleri <span className="accent">Keşfedin</span>
          </h1>
          <p className="hero-subtitle">
            Teknoloji, spor, ekonomi ve daha fazlası — hepsi tek bir yerde.
          </p>

          {/* Arama */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Haber ara..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button type="button" className="search-clear" onClick={handleSearchClear}>
                  ×
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary search-btn">
              Ara
            </button>
          </form>

          {!isAuthenticated && (
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                Ücretsiz Başla
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Giriş Yap
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* İçerik */}
      <section className="home-content container">
        {/* Demo banner */}
        {isDemo && (
          <div className="demo-banner">
            <span>Demo Modu</span> — Örnek haberler gösteriliyor. Gerçek haberler için NewsAPI anahtarı ekleyin.
          </div>
        )}

        {/* Arama sonucu bilgisi */}
        {searchQuery && (
          <div className="search-info">
            "<strong>{searchQuery}</strong>" için arama sonuçları
            <button className="search-info-clear" onClick={handleSearchClear}>
              Temizle
            </button>
          </div>
        )}

        {/* Kategori filtre */}
        <div className="filter-section">
          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={handleCategorySelect}
            showAll={true}
          />
        </div>

        {/* Hata */}
        {error && (
          <div className="alert alert-error">
            {error}
            <button className="retry-btn" onClick={fetchNews}>
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-center">
            <div className="spinner"></div>
          </div>
        )}

        {/* Haberler */}
        {!loading && !error && (
          <>
            {articles.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Sonuç bulunamadı</h3>
                <p>Farklı bir arama terimi veya kategori deneyin.</p>
              </div>
            ) : (
              <div className="news-grid">
                {articles.map((article) => (
                  <NewsCard key={article.articleId} article={article} />
                ))}
              </div>
            )}

            {/* Sayfalama */}
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
      </section>

      {/* Özellikler — misafir kullanıcılar için */}
      {!isAuthenticated && (
        <section className="features-section container">
          <h2 className="features-title">Neden NewsFlow?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h3>Kişisel Akış</h3>
              <p>İlgilendiğiniz kategorilere göre özelleştirilmiş haber akışı oluşturun.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔖</span>
              <h3>Haberleri Kaydedin</h3>
              <p>Beğendiğiniz haberleri kaydedin ve istediğiniz zaman okuyun.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔍</span>
              <h3>Gelişmiş Arama</h3>
              <p>Anahtar kelimelerle tüm haberler içinde anında arama yapın.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Güvenli Hesap</h3>
              <p>JWT ve bcrypt ile korunan hesabınızla verileriniz güvende.</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;
