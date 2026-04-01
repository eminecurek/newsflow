import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import { CATEGORY_LABELS } from './CategoryFilter';
import './NewsCard.css';

const NewsCard = ({ article, onSaveToggle, isSaved: isSavedProp = false }) => {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [saving, setSaving] = useState(false);

  const {
    articleId,
    title,
    description,
    url,
    urlToImage,
    publishedAt,
    source,
    category,
  } = article;

  const categoryInfo = CATEGORY_LABELS[category] || { label: category, icon: '📰' };

  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true, locale: tr })
    : '';

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || saving) return;

    setSaving(true);
    try {
      if (isSaved) {
        await userAPI.removeSaved(articleId);
        setIsSaved(false);
        if (onSaveToggle) onSaveToggle(articleId, false);
      } else {
        await userAPI.saveArticle({
          articleId,
          title,
          description,
          url,
          urlToImage,
          publishedAt,
          source,
          category,
        });
        setIsSaved(true);
        if (onSaveToggle) onSaveToggle(articleId, true);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'İşlem başarısız.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = `https://picsum.photos/seed/${articleId}/800/450`;
  };

  return (
    <article className="news-card">
      <a href={url} target="_blank" rel="noopener noreferrer" className="card-image-link">
        {urlToImage ? (
          <img
            src={urlToImage}
            alt={title}
            className="card-image"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="card-image-placeholder">
            <span>{categoryInfo.icon}</span>
          </div>
        )}
      </a>

      <div className="card-content">
        <div className="card-meta">
          <span className="card-category">
            {categoryInfo.icon} {categoryInfo.label}
          </span>
          <span className="card-source">{source}</span>
        </div>

        <a href={url} target="_blank" rel="noopener noreferrer" className="card-title-link">
          <h3 className="card-title">{title}</h3>
        </a>

        {description && <p className="card-description">{description}</p>}

        <div className="card-footer">
          <span className="card-time">{timeAgo}</span>
          <div className="card-actions">
            {isAuthenticated && (
              <button
                className={`save-btn ${isSaved ? 'saved' : ''}`}
                onClick={handleSaveToggle}
                disabled={saving}
                title={isSaved ? 'Kaydedilenlerden kaldır' : 'Kaydet'}
              >
                {saving ? (
                  <span className="btn-spinner"></span>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isSaved ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                )}
                {isSaved ? 'Kaydedildi' : 'Kaydet'}
              </button>
            )}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="read-btn"
            >
              Devamını Oku
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
