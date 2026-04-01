# 📰 NewsFlow — Kişiselleştirilebilir Haber Beslemesi

DT Cloud Yazılım Stajyer Görevi kapsamında geliştirilmiş, Node.js ve React tabanlı kişiselleştirilebilir haber uygulaması.

---

## 🚀 Özellikler

- **Haber Kategorileri** — Teknoloji, Spor, Ekonomi, Eğlence, Sağlık, Bilim, Genel, Politika
- **Arama** — Anahtar kelimeyle anlık haber arama
- **Kullanıcı Kaydı & Girişi** — JWT tabanlı güvenli kimlik doğrulama
- **Kişisel Akış** — Kullanıcının seçtiği kategorilere göre haber akışı
- **Haber Kaydetme** — Beğenilen haberleri kaydetme ve yönetme
- **Tercih Yönetimi** — İlgi alanlarını ayarlar sayfasından güncelleme
- **Şifre Değiştirme** — Güvenli şifre güncelleme
- **Demo Modu** — API anahtarı olmadan test edebilme
- **Responsive Tasarım** — Mobil uyumlu modern arayüz

---

## 🛠 Teknoloji Yığını

### Backend
| Teknoloji | Açıklama |
|---|---|
| Node.js + Express | REST API sunucusu |
| MongoDB + Mongoose | Veritabanı |
| JWT (jsonwebtoken) | Kimlik doğrulama |
| bcryptjs | Şifre hashleme |
| Helmet | HTTP güvenlik başlıkları |
| express-rate-limit | Rate limiting |
| node-fetch | NewsAPI HTTP istekleri |

### Frontend
| Teknoloji | Açıklama |
|---|---|
| React 18 | UI framework |
| React Router v6 | Sayfa yönlendirme |
| Axios | HTTP istemcisi |
| date-fns | Tarih formatlama |
| CSS Modules | Bileşen stilleri |

---

## 📦 Kurulum

### Ön Gereksinimler
- Node.js v16+
- MongoDB (yerel veya MongoDB Atlas)
- [NewsAPI](https://newsapi.org) anahtarı (isteğe bağlı — demo mod mevcut)

---

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/KULLANICI_ADI/newsflow.git
cd newsflow
```

---

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

`.env.example` dosyasını kopyalayın:
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/newsapp
JWT_SECRET=gizli_ve_uzun_bir_anahtar_buraya
JWT_EXPIRES_IN=7d
NEWS_API_KEY=newsapi_org_anahtariniz
FRONTEND_URL=http://localhost:3000
```

Backend'i başlatın:
```bash
# Geliştirme (nodemon ile)
npm run dev

# Üretim
npm start
```

---

### 3. Frontend Kurulumu

```bash
cd ../frontend
npm install
```

`.env.example` dosyasını kopyalayın:
```bash
cp .env.example .env
```

Frontend'i başlatın:
```bash
npm start
```

Uygulama `http://localhost:3000` adresinde açılacaktır.

---

## 🔑 NewsAPI Anahtarı Nasıl Alınır?

1. [https://newsapi.org](https://newsapi.org) adresine gidin
2. **Get API Key** butonuna tıklayın
3. Ücretsiz hesap oluşturun
4. Size verilen anahtarı `backend/.env` dosyasındaki `NEWS_API_KEY` alanına yapıştırın

> **Not:** API anahtarı olmadan uygulama **demo modda** çalışır. Demo modda örnek haberler gösterilir.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Açıklama |
|---|---|---|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Kullanıcı girişi |
| GET | `/api/auth/me` | Mevcut kullanıcı bilgisi |

### Haberler
| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/news` | Kategoriye göre haberler |
| GET | `/api/news/feed` | Kişisel haber akışı (JWT gerekli) |
| GET | `/api/news/categories` | Tüm kategoriler |

**Query Parametreleri:** `category`, `page`, `pageSize`, `q` (arama)

### Kullanıcı (JWT gerekli)
| Method | Endpoint | Açıklama |
|---|---|---|
| PUT | `/api/user/preferences` | Kategori tercihlerini güncelle |
| GET | `/api/user/saved` | Kaydedilen haberleri getir |
| POST | `/api/user/saved` | Haber kaydet |
| DELETE | `/api/user/saved` | Kaydedilen haberi sil |
| PUT | `/api/user/password` | Şifre değiştir |

---

## 🗂 Proje Yapısı

```
newsflow/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT doğrulama middleware
│   │   ├── models/
│   │   │   └── User.js          # Kullanıcı modeli
│   │   ├── routes/
│   │   │   ├── auth.js          # Kimlik doğrulama rotaları
│   │   │   ├── news.js          # Haber rotaları (NewsAPI entegrasyonu)
│   │   │   └── user.js          # Kullanıcı işlemleri
│   │   └── server.js            # Express sunucu
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js/css    # Navigasyon
        │   ├── NewsCard.js/css  # Haber kartı
        │   └── CategoryFilter.js/css  # Kategori filtresi
        ├── context/
        │   └── AuthContext.js   # Global auth durumu
        ├── pages/
        │   ├── Home.js/css      # Ana sayfa (keşfet)
        │   ├── Login.js         # Giriş
        │   ├── Register.js      # Kayıt
        │   ├── Feed.js/css      # Kişisel akış
        │   ├── Saved.js/css     # Kaydedilenler
        │   ├── Settings.js/css  # Ayarlar
        │   └── Auth.css         # Paylaşılan auth stilleri
        ├── utils/
        │   └── api.js           # Axios instance (token yönetimi)
        ├── App.js               # Routing
        ├── index.css            # Global stiller
        └── index.js
```

---

## 🔒 Güvenlik Önlemleri

- Şifreler **bcrypt** ile hashlenir (salt rounds: 12)
- **JWT** token authentication — şifreler hiçbir zaman token'da saklanmaz
- **Helmet.js** ile güvenli HTTP başlıkları
- **Rate limiting** — Auth endpoint'leri 15 dakikada 10 istek
- API anahtarları sadece backend `.env` dosyasında tutulur, frontend'e asla gönderilmez
- **CORS** konfigürasyonu ile izin verilen origin kısıtlaması
- Kullanıcı girdileri Mongoose validation ile doğrulanır

---

## 🌐 Desteklenen Haber API'leri

Uygulama **NewsAPI.org** kullanmaktadır. İsteğe bağlı olarak şu API'lerle de entegre edilebilir:
- The Guardian API
- New York Times API
- BBC News RSS Feed
- OpenNews

---

## 📱 Ekran Görüntüleri

Uygulama şu sayfaları içerir:
- **Ana Sayfa** — Kategori filtreleme, arama, haber grid'i
- **Akışım** — Kişisel haber beslemesi
- **Kaydedilenler** — Bookmarklanan haberler
- **Kayıt/Giriş** — Kimlik doğrulama
- **Ayarlar** — Tercih ve şifre yönetimi

---

## 📝 Lisans

Bu proje DT Cloud staj görevi kapsamında geliştirilmiştir.
