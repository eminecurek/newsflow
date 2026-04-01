import React from 'react';
import './CategoryFilter.css';

const CATEGORY_LABELS = {
  teknoloji: { label: 'Teknoloji', icon: '💻' },
  spor: { label: 'Spor', icon: '⚽' },
  ekonomi: { label: 'Ekonomi', icon: '📈' },
  eglence: { label: 'Eğlence', icon: '🎬' },
  saglik: { label: 'Sağlık', icon: '🏥' },
  bilim: { label: 'Bilim', icon: '🔬' },
  genel: { label: 'Genel', icon: '🌍' },
  politika: { label: 'Politika', icon: '🏛️' },
};

const CategoryFilter = ({ categories, selected, onSelect, showAll = true }) => {
  return (
    <div className="category-filter">
      {showAll && (
        <button
          className={`category-btn ${selected === '' || selected === null ? 'active' : ''}`}
          onClick={() => onSelect('')}
        >
          <span className="cat-icon">🗞️</span>
          <span className="cat-label">Tümü</span>
        </button>
      )}
      {categories.map((cat) => {
        const info = CATEGORY_LABELS[cat] || { label: cat, icon: '📰' };
        return (
          <button
            key={cat}
            className={`category-btn ${selected === cat ? 'active' : ''}`}
            onClick={() => onSelect(cat)}
          >
            <span className="cat-icon">{info.icon}</span>
            <span className="cat-label">{info.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export { CATEGORY_LABELS };
export default CategoryFilter;
