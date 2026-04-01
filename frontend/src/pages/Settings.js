import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import { CATEGORY_LABELS } from '../components/CategoryFilter';
import './Settings.css';

const ALL_CATEGORIES = ['teknoloji', 'spor', 'ekonomi', 'eglence', 'saglik', 'bilim', 'genel', 'politika'];

const Settings = () => {
  const { user, updateUserPreferences } = useAuth();

  const [selectedCategories, setSelectedCategories] = useState(
    user?.preferences?.categories || ['genel']
  );
  const [prefLoading, setPrefLoading] = useState(false);
  const [prefMessage, setPrefMessage] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState(null);

  // Kategori toggle
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) {
        if (prev.length === 1) return prev; // En az 1 kategori
        return prev.filter((c) => c !== cat);
      }
      return [...prev, cat];
    });
    setPrefMessage(null);
  };

  const handleSavePreferences = async () => {
    if (selectedCategories.length === 0) {
      setPrefMessage({ type: 'error', text: 'En az bir kategori seçmelisiniz.' });
      return;
    }
    setPrefLoading(true);
    setPrefMessage(null);
    try {
      const res = await userAPI.updatePreferences({ categories: selectedCategories });
      updateUserPreferences(res.data.preferences);
      setPrefMessage({ type: 'success', text: 'Tercihler başarıyla güncellendi.' });
    } catch (err) {
      setPrefMessage({
        type: 'error',
        text: err.response?.data?.message || 'Tercihler güncellenirken hata oluştu.',
      });
    } finally {
      setPrefLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (passMessage) setPassMessage(null);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassMessage({ type: 'error', text: 'Tüm alanlar zorunludur.' });
      return;
    }
    if (newPassword.length < 6) {
      setPassMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
      return;
    }

    setPassLoading(true);
    setPassMessage(null);
    try {
      await userAPI.changePassword({ currentPassword, newPassword });
      setPassMessage({ type: 'success', text: 'Şifre başarıyla güncellendi.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMessage({
        type: 'error',
        text: err.response?.data?.message || 'Şifre güncellenirken hata oluştu.',
      });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="container">
          <h1 className="settings-title">Ayarlar</h1>
          <p className="settings-subtitle">Hesap ve tercihlerinizi yönetin</p>
        </div>
      </div>

      <div className="container settings-content">
        {/* Profil bilgisi */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h2 className="settings-card-title">Profil Bilgileri</h2>
          </div>
          <div className="settings-card-body">
            <div className="profile-info">
              <div className="profile-avatar">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="profile-details">
                <p className="profile-username">{user?.username}</p>
                <p className="profile-email">{user?.email}</p>
                <p className="profile-joined">
                  Katılım: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kategori tercihleri */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h2 className="settings-card-title">Haber Kategorileri</h2>
            <p className="settings-card-desc">
              Haber akışınızda görmek istediğiniz kategorileri seçin. En az bir kategori seçilmelidir.
            </p>
          </div>
          <div className="settings-card-body">
            <div className="category-grid">
              {ALL_CATEGORIES.map((cat) => {
                const info = CATEGORY_LABELS[cat] || { label: cat, icon: '📰' };
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    className={`category-toggle ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleCategory(cat)}
                    disabled={isSelected && selectedCategories.length === 1}
                    title={
                      isSelected && selectedCategories.length === 1
                        ? 'En az bir kategori seçilmeli'
                        : undefined
                    }
                  >
                    <span className="toggle-icon">{info.icon}</span>
                    <span className="toggle-label">{info.label}</span>
                    {isSelected && (
                      <span className="toggle-check">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {prefMessage && (
              <div className={`alert alert-${prefMessage.type === 'success' ? 'success' : 'error'}`}>
                {prefMessage.text}
              </div>
            )}

            <div className="settings-actions">
              <button
                className="btn btn-primary"
                onClick={handleSavePreferences}
                disabled={prefLoading}
              >
                {prefLoading ? (
                  <>
                    <span className="btn-spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', width: 16, height: 16 }}></span>
                    Kaydediliyor...
                  </>
                ) : (
                  'Tercihleri Kaydet'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Şifre değiştir */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h2 className="settings-card-title">Şifre Değiştir</h2>
            <p className="settings-card-desc">
              Güvenliğiniz için güçlü bir şifre kullanın.
            </p>
          </div>
          <div className="settings-card-body">
            <form className="password-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="currentPassword">
                  Mevcut Şifre
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="form-input"
                  placeholder="Mevcut şifrenizi girin"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={passLoading}
                  autoComplete="current-password"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">
                  Yeni Şifre
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="form-input"
                  placeholder="En az 6 karakter"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={passLoading}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Yeni Şifre Tekrar
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="Yeni şifrenizi tekrar girin"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={passLoading}
                  autoComplete="new-password"
                />
              </div>

              {passMessage && (
                <div className={`alert alert-${passMessage.type === 'success' ? 'success' : 'error'}`}>
                  {passMessage.text}
                </div>
              )}

              <div className="settings-actions">
                <button type="submit" className="btn btn-primary" disabled={passLoading}>
                  {passLoading ? (
                    <>
                      <span className="btn-spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', width: 16, height: 16 }}></span>
                      Güncelleniyor...
                    </>
                  ) : (
                    'Şifreyi Güncelle'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
