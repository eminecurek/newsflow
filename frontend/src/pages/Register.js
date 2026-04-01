import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Tüm alanlar zorunludur.';
    }
    if (formData.username.length < 3) {
      return 'Kullanıcı adı en az 3 karakter olmalıdır.';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      return 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.';
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return 'Geçerli bir e-posta adresi giriniz.';
    }
    if (formData.password.length < 6) {
      return 'Şifre en az 6 karakter olmalıdır.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Şifreler eşleşmiyor.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    const result = await register(formData.username, formData.email, formData.password);
    if (result.success) {
      navigate('/feed');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">N</div>
          <h1 className="auth-title">Hesap Oluşturun</h1>
          <p className="auth-subtitle">NewsFlow'a katılın ve haberlerinizi kişiselleştirin</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Kullanıcı Adı
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              placeholder="kullanici_adi"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              E-posta Adresi
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="En az 6 karakter"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Şifre Tekrar
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-input"
              placeholder="Şifrenizi tekrar girin"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <span className="auth-submit-loading">
                <span
                  className="btn-spinner"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
                ></span>
                Kayıt yapılıyor...
              </span>
            ) : (
              'Kayıt Ol'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Zaten hesabınız var mı? <Link to="/login">Giriş Yapın</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
