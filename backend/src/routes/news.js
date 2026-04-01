const express = require('express');
const fetch = require('node-fetch');
const auth = require('../middleware/auth');

const router = express.Router();

// Kategoriler
const CATEGORIES = ['teknoloji', 'spor', 'ekonomi', 'eglence', 'saglik', 'bilim', 'genel', 'politika'];

// NewsAPI kategori eşlemesi
const CATEGORY_MAP = {
  teknoloji: 'technology',
  spor: 'sports',
  ekonomi: 'business',
  eglence: 'entertainment',
  saglik: 'health',
  bilim: 'science',
  genel: 'general',
  politika: 'general',
};

// Demo haberler (API anahtarı olmadığında kullanılır)
const DEMO_NEWS = [
  {
    articleId: 'demo-1',
    title: 'Türkiye\'nin yapay zeka stratejisi 2025-2030 dönemi için güncellendi',
    description: 'Cumhurbaşkanlığı Dijital Dönüşüm Ofisi, Türkiye\'nin yapay zeka alanındaki hedeflerini belirleyen yeni strateji belgesini kamuoyuyla paylaştı. Belgede eğitim, sanayi ve kamu hizmetleri alanlarında yapay zekanın yaygınlaştırılması hedefleniyor.',
    url: 'https://example.com/news/1',
    urlToImage: 'https://picsum.photos/seed/tech1/800/450',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    source: 'Teknoloji Haberleri',
    category: 'teknoloji',
  },
  {
    articleId: 'demo-2',
    title: 'Galatasaray Şampiyonlar Ligi\'nde çeyrek finale yükseldi',
    description: 'Galatasaray, UEFA Şampiyonlar Ligi son 16 turu rövanş maçında rakibini 2-0 mağlup ederek çeyrek finale adını yazdırdı. Sarı-kırmızılılar bu başarıyla Türk futbol tarihine geçmeyi başardı.',
    url: 'https://example.com/news/2',
    urlToImage: 'https://picsum.photos/seed/sport1/800/450',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: 'Spor Gazetesi',
    category: 'spor',
  },
  {
    articleId: 'demo-3',
    title: 'Merkez Bankası faiz kararını açıkladı: Beklentilerle örtüşüyor',
    description: 'Türkiye Cumhuriyet Merkez Bankası Para Politikası Kurulu toplantısında politika faizini değiştirmeme kararı aldı. Ekonomistler bu kararın enflasyonla mücadele sürecinde doğru bir adım olduğunu değerlendiriyor.',
    url: 'https://example.com/news/3',
    urlToImage: 'https://picsum.photos/seed/econ1/800/450',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    source: 'Ekonomi Bülteni',
    category: 'ekonomi',
  },
  {
    articleId: 'demo-4',
    title: 'Yerli elektrikli otomobil TOGG, Avrupa pazarına açılıyor',
    description: 'TOGG, ilk Avrupa ihracatını gerçekleştirdi. Yerli elektrikli otomobilin Almanya, Fransa ve İngiltere\'de satışa sunulması planlanıyor. Şirket, 2025 yılında 50.000 araç ihraç etmeyi hedefliyor.',
    url: 'https://example.com/news/4',
    urlToImage: 'https://picsum.photos/seed/tech2/800/450',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: 'Otomotiv Dünyası',
    category: 'teknoloji',
  },
  {
    articleId: 'demo-5',
    title: 'Türk bilim insanları kanser tedavisinde çığır açan buluş yaptı',
    description: 'Hacettepe Üniversitesi araştırmacıları, akciğer kanserinin erken teşhisinde kullanılabilecek yeni bir biyobelirteç keşfetti. Yapay zeka destekli bu yöntemin doğruluk oranı yüzde 94 olarak belirlendi.',
    url: 'https://example.com/news/5',
    urlToImage: 'https://picsum.photos/seed/health1/800/450',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: 'Sağlık Haberleri',
    category: 'saglik',
  },
  {
    articleId: 'demo-6',
    title: 'Netflix\'in yeni Türk dizisi dünya genelinde rekor kırdı',
    description: 'Netflix Türkiye yapımı yeni dizi, platformun tarihinde ilk haftada en çok izlenen yapımlar arasına girdi. 50\'den fazla ülkede ilk sıraya oturan dizi, Türk dizi endüstrisi açısından tarihi bir başarı olarak değerlendiriliyor.',
    url: 'https://example.com/news/6',
    urlToImage: 'https://picsum.photos/seed/ent1/800/450',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: 'Eğlence Dünyası',
    category: 'eglence',
  },
  {
    articleId: 'demo-7',
    title: 'Uzay araştırmalarında yeni dönem: Türksat 6A göreve başladı',
    description: 'Türkiye\'nin ilk yerli ve milli haberleşme uydusu Türksat 6A, yörüngesinde göreve başladı. Uydu, Türkiye\'nin uzay teknolojilerindeki bağımsızlığı açısından kritik bir adım olarak değerlendiriliyor.',
    url: 'https://example.com/news/7',
    urlToImage: 'https://picsum.photos/seed/sci1/800/450',
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    source: 'Bilim ve Teknoloji',
    category: 'bilim',
  },
  {
    articleId: 'demo-8',
    title: 'İstanbul\'da yeni metro hatları açılıyor',
    description: 'İstanbul Büyükşehir Belediyesi, şehrin ulaşım sorununu çözmeye yönelik 4 yeni metro hattının açılış takvimini açıkladı. 2025 yılı sonuna kadar toplamda 45 yeni istasyonun hizmete gireceği belirtildi.',
    url: 'https://example.com/news/8',
    urlToImage: 'https://picsum.photos/seed/gen1/800/450',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: 'Şehir Haberleri',
    category: 'genel',
  },
  {
    articleId: 'demo-9',
    title: 'Meclis\'te eğitim reformu yasa tasarısı görüşmeleri başladı',
    description: 'Türkiye Büyük Millet Meclisi\'nde eğitim sistemini köklü biçimde değiştirecek yasa tasarısının görüşmeleri başladı. Tasarı, müfredat güncellemeleri, öğretmen atama sistemi ve üniversite sınav yapısında kapsamlı değişiklikler öngörüyor.',
    url: 'https://example.com/news/9',
    urlToImage: 'https://picsum.photos/seed/pol1/800/450',
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    source: 'Politika Haberleri',
    category: 'politika',
  },
  {
    articleId: 'demo-10',
    title: 'Fenerbahçe transferde büyük bomba patlattı',
    description: 'Fenerbahçe Spor Kulübü, Dünya\'nın en değerli orta sahalarından birini kadrosuna katmak için anlaşma sağladığını duyurdu. Transferin bedeli 45 milyon euro olarak açıklandı.',
    url: 'https://example.com/news/10',
    urlToImage: 'https://picsum.photos/seed/sport2/800/450',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    source: 'Spor Gazetesi',
    category: 'spor',
  },
  {
    articleId: 'demo-11',
    title: 'Siber güvenlik alanında Türk girişimi 20 milyon dolar yatırım aldı',
    description: 'İstanbul merkezli siber güvenlik girişimi CyberShield, Silikon Vadisi\'nden yatırımcıların katıldığı turda 20 milyon dolar yatırım almayı başardı. Şirket, yapay zeka destekli tehdit tespiti alanında çalışıyor.',
    url: 'https://example.com/news/11',
    urlToImage: 'https://picsum.photos/seed/tech3/800/450',
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    source: 'Girişim Dünyası',
    category: 'teknoloji',
  },
  {
    articleId: 'demo-12',
    title: 'Döviz kurlarında sert hareketler: Uzmanlar değerlendirdi',
    description: 'Küresel piyasalardaki belirsizlik ortamında Türk lirası önemli hareketler yaşadı. Ekonomistler, merkez bankasının para politikasının bu süreçteki belirleyici rolünü analiz ediyor.',
    url: 'https://example.com/news/12',
    urlToImage: 'https://picsum.photos/seed/econ2/800/450',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: 'Finans Haberleri',
    category: 'ekonomi',
  },
  {
    articleId: 'demo-13',
    title: 'Dünyaca ünlü müzisyen İstanbul konserini iptal etti',
    description: 'Grammy ödüllü müzisyenin Türkiye turnesi kapsamında planlanan İstanbul konseri, organizatörlerin teknik sorunlar gerekçesiyle iptal etmesi üzerine hayranları hayal kırıklığına uğrattı.',
    url: 'https://example.com/news/13',
    urlToImage: 'https://picsum.photos/seed/ent2/800/450',
    publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
    source: 'Müzik Haberleri',
    category: 'eglence',
  },
  {
    articleId: 'demo-14',
    title: 'Kovid-19\'un yeni varyantı Türkiye\'de görüldü',
    description: 'Dünya Sağlık Örgütü tarafından takip altına alınan yeni Kovid-19 varyantının Türkiye\'de ilk vakaları tespit edildi. Sağlık Bakanlığı, varyantın mevcut aşılara karşı duyarlılığını araştırıyor.',
    url: 'https://example.com/news/14',
    urlToImage: 'https://picsum.photos/seed/health2/800/450',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    source: 'Sağlık Haberleri',
    category: 'saglik',
  },
  {
    articleId: 'demo-15',
    title: 'Milli Eğitim Bakanı\'ndan müfredat açıklaması',
    description: 'Milli Eğitim Bakanı, 2025-2026 eğitim öğretim yılından itibaren uygulanacak yeni müfredatın detaylarını paylaştı. Kodlama, girişimcilik ve sürdürülebilirlik dersleri zorunlu hale getirilecek.',
    url: 'https://example.com/news/15',
    urlToImage: 'https://picsum.photos/seed/pol2/800/450',
    publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    source: 'Eğitim Haberleri',
    category: 'politika',
  },
  {
    articleId: 'demo-16',
    title: 'Türk araştırmacılar Mars\'ta su izleri keşfetti',
    description: 'Türkiye\'nin uzay araştırmalarına katkı sunan bilim insanları, NASA verileri üzerinde yaptıkları analizde Mars\'ın kuzey kutbunda antik su kanallarının izlerini tespit etti.',
    url: 'https://example.com/news/16',
    urlToImage: 'https://picsum.photos/seed/sci2/800/450',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    source: 'Uzay ve Bilim',
    category: 'bilim',
  },
  {
    articleId: 'demo-17',
    title: 'Beşiktaş yeni sezon formalarını tanıttı',
    description: 'Beşiktaş Jimnastik Kulübü, 2025-2026 sezonu için hazırlanan yeni formalarını tanıttı. Siyah-beyazlı ekibin yeni forma tasarımı sosyal medyada büyük beğeni topladı.',
    url: 'https://example.com/news/17',
    urlToImage: 'https://picsum.photos/seed/sport3/800/450',
    publishedAt: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
    source: 'Spor Dünyası',
    category: 'spor',
  },
  {
    articleId: 'demo-18',
    title: 'Türkiye turizm rekoru kırdı: 60 milyon ziyaretçi hedefi aşıldı',
    description: 'Kültür ve Turizm Bakanlığı verilerine göre Türkiye, 2024 yılında 62 milyon uluslararası ziyaretçi ağırlayarak tüm zamanların rekorunu kırdı. Bu rakam, önceki yıla kıyasla yüzde 15 artışa işaret ediyor.',
    url: 'https://example.com/news/18',
    urlToImage: 'https://picsum.photos/seed/gen2/800/450',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    source: 'Turizm Haberleri',
    category: 'genel',
  },
  {
    articleId: 'demo-19',
    title: 'İklim değişikliğiyle mücadelede yeni yasa yürürlüğe girdi',
    description: 'Türkiye Büyük Millet Meclisi\'nde kabul edilen İklim Kanunu resmi gazetede yayımlanarak yürürlüğe girdi. Yasa, 2053 net sıfır emisyon hedefine ulaşmak için şirketlere yükümlülükler getiriyor.',
    url: 'https://example.com/news/19',
    urlToImage: 'https://picsum.photos/seed/sci3/800/450',
    publishedAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
    source: 'Çevre ve İklim',
    category: 'bilim',
  },
  {
    articleId: 'demo-20',
    title: 'Dijital Türk lirası projesi pilot aşamayı tamamladı',
    description: 'Türkiye Cumhuriyet Merkez Bankası, dijital Türk lirası (TCMB Dijital TL) projesinin pilot aşamasının başarıyla tamamlandığını açıkladı. 2026 yılında geniş çaplı kullanıma sunulması planlanıyor.',
    url: 'https://example.com/news/20',
    urlToImage: 'https://picsum.photos/seed/econ3/800/450',
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    source: 'Finans Teknolojileri',
    category: 'ekonomi',
  },
  {
    articleId: 'demo-21',
    title: 'Yapay zeka destekli tarım uygulaması köylülerin hayatını kolaylaştırıyor',
    description: 'Anadolu\'nun farklı illerinde çiftçilere hizmet veren yapay zeka destekli tarım uygulaması, ürün verimini yüzde 30 artırdı. Uygulama, hava durumu tahmini ve toprak analizi yaparak anlık öneriler sunuyor.',
    url: 'https://example.com/news/21',
    urlToImage: 'https://picsum.photos/seed/tech4/800/450',
    publishedAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
    source: 'Tarım Teknolojileri',
    category: 'teknoloji',
  },
  {
    articleId: 'demo-22',
    title: 'Türk filmi Cannes\'da büyük ödül kazandı',
    description: 'Türk yönetmen Nuri Bilge Ceylan\'ın yeni filmi Cannes Film Festivali\'nde jüri büyük ödülüne layık görüldü. Film, festival boyunca ayakta alkışlanarak uzun süre izleyicilerden büyük beğeni topladı.',
    url: 'https://example.com/news/22',
    urlToImage: 'https://picsum.photos/seed/ent3/800/450',
    publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    source: 'Sinema Dünyası',
    category: 'eglence',
  },
  {
    articleId: 'demo-23',
    title: 'Sağlık Bakanlığı şeker tüketimini azaltmaya yönelik kampanya başlattı',
    description: 'Sağlık Bakanlığı, özellikle çocuklarda şeker tüketiminin yol açtığı sağlık sorunlarına dikkat çekmek amacıyla ulusal bir bilinçlendirme kampanyası başlattı. Kampanya kapsamında okullarda da etkinlikler düzenlenecek.',
    url: 'https://example.com/news/23',
    urlToImage: 'https://picsum.photos/seed/health3/800/450',
    publishedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    source: 'Sağlıklı Yaşam',
    category: 'saglik',
  },
  {
    articleId: 'demo-24',
    title: 'Cumhurbaşkanı yeni ekonomik teşvik paketini açıkladı',
    description: 'Cumhurbaşkanı Erdoğan, üretim ve ihracatı desteklemek amacıyla hazırlanan yeni ekonomik teşvik paketini açıkladı. Paket kapsamında KOBİ\'lere yüzde 0 faizli kredi imkânı sunulacak.',
    url: 'https://example.com/news/24',
    urlToImage: 'https://picsum.photos/seed/pol3/800/450',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: 'Genel Haberler',
    category: 'politika',
  },
];

// GET /api/news/categories
router.get('/categories', (req, res) => {
  res.json({ categories: CATEGORIES });
});

// GET /api/news/feed (JWT gerekli)
router.get('/feed', auth, async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const userCategories = req.user.preferences.categories || ['genel'];

    let articles = DEMO_NEWS.filter((a) => userCategories.includes(a.category));

    // Sayfalama
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const start = (pageNum - 1) * pageSizeNum;
    const end = start + pageSizeNum;
    const paginated = articles.slice(start, end);

    res.json({
      articles: paginated,
      totalResults: articles.length,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(articles.length / pageSizeNum),
      source: 'demo',
    });
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ message: 'Haber akışı yüklenirken hata oluştu.' });
  }
});

// GET /api/news
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, pageSize = 10, q } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    let articles = [...DEMO_NEWS];

    // Kategori filtresi
    if (category && CATEGORIES.includes(category)) {
      articles = articles.filter((a) => a.category === category);
    }

    // Arama filtresi
    if (q && q.trim()) {
      const query = q.trim().toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          (a.description && a.description.toLowerCase().includes(query))
      );
    }

    // NewsAPI entegrasyonu (API anahtarı varsa)
    if (apiKey && apiKey !== 'newsapi_org_anahtariniz') {
      try {
        const newsApiCategory = category ? CATEGORY_MAP[category] || 'general' : 'general';
        let url;
        if (q) {
          url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=tr&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;
        } else {
          url = `https://newsapi.org/v2/top-headlines?country=tr&category=${newsApiCategory}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'ok' && data.articles && data.articles.length > 0) {
          const mappedArticles = data.articles.map((a, i) => ({
            articleId: `api-${i}-${Date.now()}`,
            title: a.title || 'Başlıksız',
            description: a.description || '',
            url: a.url,
            urlToImage: a.urlToImage || '',
            publishedAt: a.publishedAt,
            source: a.source?.name || 'Bilinmeyen Kaynak',
            category: category || 'genel',
          }));

          return res.json({
            articles: mappedArticles,
            totalResults: data.totalResults,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(data.totalResults / pageSize),
            source: 'newsapi',
          });
        }
      } catch (apiError) {
        console.error('NewsAPI error, falling back to demo:', apiError.message);
      }
    }

    // Demo modunda sayfalama
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const start = (pageNum - 1) * pageSizeNum;
    const end = start + pageSizeNum;
    const paginated = articles.slice(start, end);

    res.json({
      articles: paginated,
      totalResults: articles.length,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(articles.length / pageSizeNum),
      source: 'demo',
    });
  } catch (error) {
    console.error('News error:', error);
    res.status(500).json({ message: 'Haberler yüklenirken hata oluştu.' });
  }
});

module.exports = router;
