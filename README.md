# Bey360

Bey360; cari hesap, stok, kasa/banka, gelir-gider, fatura, e-Fatura/e-Arşiv, raporlama ve akıllı işletme içgörüleri için geliştirilen React + Firebase tabanlı online ön muhasebe platformudur.

Canlı adres:

```txt
https://bey360.web.app
```

## Teknoloji

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Firebase Auth
- Firebase Firestore
- Firebase Hosting
- Lucide React ikonları
- XLSX Excel içe/dışa aktarma

## Kurulum

```bash
npm install
npm run dev
```

Yerel geliştirme adresi:

```txt
http://127.0.0.1:5173
```

Production build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

## Deploy

Firebase Hosting hedefi:

```txt
hosting site: bey360
project id: advera-c8dd0
```

Deploy komutu:

```bash
firebase deploy --only hosting:bey360 --project advera-c8dd0
```

`firebase.json` içindeki hosting public klasörü:

```txt
dist
```

## Uygulama Modülleri

Panel içindeki ana modüller:

- Ana Panel
- Cari Hesaplar
- Faturalar
- e-Fatura / e-Arşiv
- Stok
- Stok Hareketleri
- Kasa & Banka
- Gelir & Gider
- Raporlar
- Bildirimler
- Muhasebeci
- Ayarlar
- Süper Admin

Veri modeli genel olarak şu yapıyı kullanır:

```txt
users/{uid}/customers
users/{uid}/invoices
users/{uid}/eInvoices
users/{uid}/stock
users/{uid}/stockMovements
users/{uid}/cashBank
users/{uid}/finance
users/{uid}/notifications
users/{uid}/companies
```

## Yapılan Büyük Geliştirmeler

### Son Güncellemeler - 13 Mayıs 2026

Canlıya alınan son eklemeler:

- Ana sayfa ve footer alanına `@beyogluteknoloji` Instagram hesabı eklendi.
- Organization schema içindeki sosyal profil listesine Beyoğlu Teknoloji web sitesi ve Instagram hesabı eklendi.
- Dashboard modül durumları sıfır veri varken artık `Eksik` yerine `Hazır` mantığıyla gösterilir.
- Fatura formu genişletildi: KDV oranı, KDV tutarı, genel toplam, düzenleme tarihi, açıklama ve `Ödendi` durumu desteklenir.
- `InvoiceRecord` veri modeliyle fatura ekranı uyumlu hale getirildi.
- Vite build uyarıları giderildi; Firebase, XLSX ve diğer büyük paketler `manualChunks` ile ayrıldı.
- Son production build uyarısız tamamlandı ve Firebase Hosting'e deploy edildi.

Sosyal bağlantılar:

```txt
Instagram: https://www.instagram.com/beyogluteknoloji/
Web: https://www.beyogluteknoloji.com
```

- Hızlı aksiyonlar

### Modern Komuta İşletim Sistemi (Faz 1 & 2) - Mayıs 2026

Bey360, basit bir muhasebe yazılımından gerçek bir "Komuta İşletim Sistemi" (Command OS) vizyonuna taşındı:

*   **OmniSearch (Küresel Arama):** `Ctrl + K` kısayolu ile tüm sistemde (Cari, Fatura, Stok, Modül) anlık arama ve hızlı navigasyon.
*   **WhatsApp Entegrasyonu:** Tek tıkla müşteriye bakiye hatırlatması gönderme (`utils/whatsapp.ts`).
*   **İnteraktif Analitik (Recharts):** Nakit akışı tahmini ve mali denge için etkileşimli, detaylı grafikler.
*   **AI Stok Tahminleme:** Satış hızını analiz ederek ürünlerin kaç gün içinde tükeneceğini öngören akıllı algoritma.
*   **Canlı Döviz Takibi:** Dashboard üzerinde anlık USD/EUR/GBP kurları (API entegrasyonlu).
*   **Hızlı Notlar (Notepad):** Dashboard üzerinde kalıcı, tarayıcı bazlı hızlı not alma alanı.
*   **İşlem Terminali (Audit Logs):** Tüm kullanıcı hareketlerini (oluşturma, silme, güncelleme) izleyen ve dashboard üzerinde "Terminal" modunda gösteren denetim sistemi.
*   **Toplu İşlem Merkezi (Bulk Actions):** Faturalar ve diğer listeler üzerinde toplu silme, toplu durum güncelleme ve seçim yönetimi.
*   **Gelişmiş Fatura Sistemi:** Kalem bazlı giriş (itemized), otomatik hesaplama ve zenginleştirilmiş PDF çıktıları.
*   **Cari & Stok 360 Panelleri:** Yan paneller aracılığıyla derinlemesine hareket geçmişi ve kârlılık analizi.
*   **Modern Tasarım Dili:** Neon-estetik, backdrop-blur, framer-motion animasyonları ve premium "Dark Mode" deneyimi.
*   **Global İletişim Servisi:** WhatsApp Web API entegrasyonu ile otomatik mesaj taslakları oluşturma.
*   **Akıllı PDF Motoru:** `jspdf-autotable` ile kalem bazlı, profesyonel fatura dökümleri.
*   **Performans & Stabilite:** Production build hataları giderildi, `tsc` uyumluluğu sağlandı, `manualChunks` ile bundle optimizasyonu yapıldı.

### Akıllı İşletme İçgörüleri

Yeni servis:

```txt
src/services/insightService.ts
```

Bu servis mevcut Firestore verilerinden şunları hesaplar:

- İşletme sağlık skoru
- Nakit akışı tahmini
- Geciken alacak riski
- Geciken ödeme riski
- Düşük stok riski
- Gider anomalisi
- Olağandışı kasa çıkışı
- Satış düşüş sinyali
- Aksiyon önerileri

### Panel Genel Tasarım Birliği

`src/components/AppLayout.tsx` yenilendi.

Eklenenler:

- Koyu komuta merkezi sidebar
- Koyu üst bar
- Aktif modül göstergesi
- Kullanıcı alanı
- Arama alanı
- Sidebar scroll/flex düzeni
- Güvenlik ve çıkış alanı

Ortak stiller:

```txt
src/styles.css
```

Güncellenen ortak sınıflar:

- `.card`
- `.form-card`
- `.list-card`
- `.dashboard-form`
- `.stat-card`
- `.list-item`
- `.badge`
- `table`
- `.page-header-block`
- `.report-filter`
- `.cards-grid`

Bu sayede Cariler, Faturalar, Stok, Kasa/Banka, Raporlar ve diğer panel sayfaları aynı koyu panel tasarımına çekildi.

### Google ile Giriş

Yeni servis:

```txt
src/services/authService.ts
```

Güncellenen ekranlar:

```txt
src/pages/Login.tsx
src/pages/Signup.tsx
```

Özellikler:

- Google popup ile giriş
- Google ile kayıt/giriş sonrası `users/{uid}` dokümanını otomatik oluşturma
- E-posta/şifre girişinde de kullanıcı dashboard kaydını garanti etme

Firebase Console tarafında Google provider açık olmalıdır:

```txt
Authentication > Sign-in method > Google
```

### SEO İlk Fazı

SEO sadece meta tag seviyesinde değil, route bazlı landing sayfalarla kuruldu.

Yeni dosyalar:

```txt
src/components/SEO.tsx
src/data/seoPages.ts
src/pages/SeoLanding.tsx
```

Eklenen teknik SEO özellikleri:

- Dinamik title
- Dinamik description
- Canonical URL
- Robots meta
- Open Graph
- Twitter Card
- JSON-LD schema
- Organization schema
- WebSite schema
- FAQPage schema
- BreadcrumbList schema
- SoftwareApplication / Product / Article schema
- Sosyal profil bağlantıları

Panel ve auth sayfaları `noindex` yapılır. SEO landing sayfaları indexlenebilir şekilde ayarlanır.

Eklenen public SEO dosyaları:

```txt
public/robots.txt
public/sitemap.xml
public/sitemap-pages.xml
public/sitemap-sektorler.xml
public/sitemap-blog.xml
public/sitemap-yardim.xml
```

Önemli:

Sitemap ve canonical hedefi `https://bey360.com.tr` olarak ayarlandı. En doğru SEO için `bey360.com.tr` domaini Firebase Hosting’e bağlanmalı ve Search Console’a şu sitemap gönderilmelidir:

```txt
https://bey360.com.tr/sitemap.xml
```

### SEO Landing Sayfaları

Eklenen route örnekleri:

```txt
/online-on-muhasebe-programi
/e-fatura-programi
/e-arsiv-fatura-programi
/cari-hesap-takip-programi
/stok-takip-programi
/kasa-banka-takip-programi
/gelir-gider-takip-programi
/teklif-siparis-yonetimi
/muhasebeciler-icin
/kucuk-isletmeler-icin
/esnaflar-icin
/kobiler-icin
/fiyatlar
/hakkimizda
/iletisim
/guvenlik
/blog/online-on-muhasebe-programi-nedir
/yardim/cari-nasil-eklenir
/sektorler/oto-servis-muhasebe-programi
/sektorler/insaat-muhasebe-programi
/sektorler/emlak-ofisi-muhasebe-programi
/sektorler/teknik-servis-muhasebe-programi
```

### Hızlı Teknoloji eConnect Hazırlığı

e-Fatura ekranına Hızlı Teknoloji entegrasyon paneli eklendi.

Yeni dosyalar:

```txt
src/services/hizliTechnologyService.ts
docs/hizli-teknoloji-entegrasyon.md
```

Güncellenen ekran:

```txt
src/pages/EInvoice.tsx
```

Eklenenler:

- Hızlı Teknoloji eConnect test entegrasyon paneli
- Swagger ve entegrasyon dokümanı bağlantıları
- Backend proxy bağlantı testi
- Token ve güvenlik bilgilendirmesi
- e-Fatura/e-Arşiv senaryo ve tip alanları
- Özel matrah girişi
- KDV istisna kodu ve GİB durum kodu alanları
- e-Arşiv teslim tipi ve alıcı e-posta alanları
- Excel dışa aktarma

Önemli güvenlik notu:

`SecretKey`, `ApiKey`, kullanıcı adı ve şifre React/Vite frontend koduna yazılmamalıdır. Bu bilgiler sadece backend veya güvenli sunucu ortamında saklanmalıdır.

Token mimarisi:

- Her firma/mükellef entegrasyonu kendi Hızlı Teknoloji oturumu ve token kaydıyla yönetilmelidir.
- Tek global token ile tüm firmaları yürütmek doğru değildir; firma ayrımı, yetki, loglama, iptal ve güvenlik açısından risklidir.
- Hızlı Teknoloji ile netleştirilecek konu: ERP iş ortağı yapısında her mükellef için ayrı şifrelenmiş kullanıcı bilgisi ve token akışı nasıl yönetilecek?
- Token süresi dokümana göre 3 gündür; backend token süresini takip etmeli, süresi dolunca ilgili firma için yeniden login yapmalıdır.

Frontend yalnızca proxy çağırır:

```txt
POST /api/hizli-teknoloji/login
```

Frontend ortam değişkeni örneği:

```txt
VITE_HIZLI_TEKNOLOJI_PROXY_URL=/api/hizli-teknoloji
```

Detay:

```txt
docs/hizli-teknoloji-entegrasyon.md
```

### Muhasebeci Paneli

`src/pages/Accountant.tsx` operasyon paneli haline getirildi.

Eklenenler:

- Firma ve dönem seçimi
- Dönem kapanış skoru
- KDV tahmini
- Eksik evrak ve kapanış kontrol listesi
- Müşteri/firma operasyon özeti
- Son faturalar
- Excel dışa aktarma
- Bey360 koyu panel tasarımıyla uyumlu arayüz

### e-Fatura / e-Arşiv Modülü

`src/pages/EInvoice.tsx` ve `src/services/eInvoiceService.ts` genişletildi.

Eklenenler:

- `TEMELFATURA`, `TICARIFATURA`, `EARSIVFATURA` senaryoları
- Satış, iade, istisna ve özel matrah fatura tipleri
- Özel matrah tutarı ve açıklaması
- KDV istisna kodu
- GİB durum kodu takibi
- Alıcı vergi/TCKN, vergi dairesi, e-posta ve adres alanları
- e-Arşiv teslim tipi
- Hazırlık, gönderim ve durum takibi için daha zengin kayıt modeli

## Ortam Değişkenleri

Örnek dosya:

```txt
.env.example
```

Mevcut frontend env:

```txt
VITE_HIZLI_TEKNOLOJI_PROXY_URL=/api/hizli-teknoloji
```

Firebase config şu anda `src/firebase.ts` içindedir.

Uzun vadede önerilen yapı:

- Firebase web config değerlerini `.env` üzerinden okumak
- Hızlı Teknoloji anahtarlarını backend ortam değişkenlerinde saklamak
- Panel, ödeme ve entegrasyon işlemlerini backend proxy üzerinden yürütmek

## Güvenlik Notları

Dikkat edilmesi gerekenler:

- Hızlı Teknoloji `SecretKey` frontend’e konulmamalı.
- Hızlı Teknoloji `ApiKey` frontend’e konulmamalı.
- Test kullanıcı adı/şifre frontend’e konulmamalı.
- Admin şifreleri veya özel erişim bilgileri repo içinde tutulmamalı.
- Süper admin kontrolü sadece client-side allowlist ile sınırlı kalmamalı; Firestore rules veya custom claims ile desteklenmeli.
- Panel sayfaları SEO’da indexlenmemeli.
- Firestore security rules mutlaka kullanıcı bazlı erişimi kısıtlamalı.

## Bilinen Teknik Borçlar

- Route bazlı lazy loading ileride eklenirse ilk yükleme daha da küçültülebilir.
- SEO için Vite SPA yerine uzun vadede Next.js SSR/SSG daha iyi olur.
- Hızlı Teknoloji entegrasyonu için backend proxy henüz gerçek olarak kurulmadı.
- Firebase config `.env` yapısına taşınmalı.
- Firestore rules gözden geçirilmeli.
- Test ve lint scriptleri eklenmeli.

## Önerilen Sonraki Adımlar

1. `bey360.com.tr` domainini Firebase Hosting’e bağla.
2. Google Search Console’a `https://bey360.com.tr/sitemap.xml` gönder.
3. Hızlı Teknoloji backend proxy endpointlerini kur.
4. Hızlı Teknoloji ile firma/mükellef bazlı token akışını netleştir.
5. Firestore security rules ve admin custom claims yapısını güçlendir.
6. Route bazlı lazy loading ile ilk yükleme süresini daha da iyileştir.
7. SEO içeriklerini blog ve sektör sayfalarıyla genişlet.
8. Ödeme linki / QR tahsilat modülünü ekle.

## Faydalı Komutlar

```bash
npm run dev
npm run build
npm run preview
firebase deploy --only hosting:bey360 --project advera-c8dd0
```

## Proje Yapısı

```txt
src/
  components/
    AppLayout.tsx
    ProtectedRoute.tsx
    SEO.tsx
  data/
    seoPages.ts
  pages/
    Dashboard.tsx
    Landing.tsx
    Login.tsx
    Signup.tsx
    SeoLanding.tsx
    EInvoice.tsx
    ...
  services/
    authService.ts
    insightService.ts
    hizliTechnologyService.ts
    eInvoiceService.ts
    ...
  styles.css
  firebase.ts
public/
  robots.txt
  sitemap.xml
  sitemap-pages.xml
  sitemap-sektorler.xml
  sitemap-blog.xml
  sitemap-yardim.xml
docs/
  hizli-teknoloji-entegrasyon.md
```

## Kısa Ürün Tanımı

Bey360, işletmelerin finansal süreçlerini kolaylaştırmak için geliştirilen online ön muhasebe ve e-Fatura yönetim yazılımıdır. Cari hesap takibi, stok yönetimi, kasa ve banka hareketleri, gelir-gider kayıtları, teklif ve sipariş süreçleri, fatura oluşturma, e-Fatura ve e-Arşiv yönetimi Bey360 ile tek panelden kolayca takip edilebilir.

KOBİ’ler, esnaflar, oto servisler, inşaat firmaları, emlak ofisleri, teknik servisler, mağazalar ve hizmet işletmeleri için geliştirilen Bey360, işletmenizin günlük finansal operasyonlarını daha düzenli, hızlı ve güvenli hale getirir.

```txt
Bey360
İşletmenizi 360 derece yönetin.
Online Ön Muhasebe ve e-Fatura Programı
```
