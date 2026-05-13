export const SITE_URL = 'https://bey360.com.tr';
export const SITE_NAME = 'Bey360';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/bey360-og.jpg`;

export interface SeoFaq {
  question: string;
  answer: string;
}

export interface SeoPage {
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  primaryKeyword: string;
  keywords: string[];
  cta: string;
  secondaryCta?: string;
  audience: string;
  features: string[];
  sections: Array<{
    title: string;
    body: string;
  }>;
  faqs: SeoFaq[];
  schemaType?: 'SoftwareApplication' | 'Product' | 'Article' | 'WebPage';
}

const commonFaqs: SeoFaq[] = [
  {
    question: 'Bey360 nedir?',
    answer:
      'Bey360, işletmelerin cari, stok, kasa, banka, gelir-gider, fatura, e-Fatura ve e-Arşiv süreçlerini online yönetmesini sağlayan ön muhasebe yazılımıdır.',
  },
  {
    question: 'Bey360 kimler için uygundur?',
    answer:
      'Bey360; KOBİ’ler, esnaflar, mağazalar, hizmet işletmeleri, oto servisler, emlak ofisleri, teknik servisler ve muhasebeciler için uygundur.',
  },
  {
    question: 'Bey360 mobil kullanılabilir mi?',
    answer:
      'Evet. Bey360 web tabanlı yapısıyla masaüstü, tablet ve mobil cihazlarda kullanılabilecek şekilde tasarlanır.',
  },
];

export const seoPages: SeoPage[] = [
  {
    path: '/online-on-muhasebe-programi',
    title: 'Online Ön Muhasebe Programı | Bey360',
    description:
      'Bey360 online ön muhasebe programı ile cari, stok, kasa, banka, gelir-gider ve fatura süreçlerinizi tek panelden yönetin.',
    h1: 'Online Ön Muhasebe Programı',
    eyebrow: 'Ön Muhasebe',
    intro:
      'Cari hesap, stok, kasa, banka, gelir-gider ve fatura operasyonlarını tek panelde toplayan bulut tabanlı ön muhasebe çözümü.',
    primaryKeyword: 'online ön muhasebe programı',
    keywords: ['online ön muhasebe programı', 'ön muhasebe programı', 'bulut muhasebe programı'],
    cta: 'Ücretsiz Başla',
    secondaryCta: 'Özellikleri İncele',
    audience: 'KOBİ’ler, esnaflar ve günlük finans operasyonlarını dijitalleştirmek isteyen işletmeler',
    features: [
      'Cari hesap ve borç-alacak takibi',
      'Stok, kasa ve banka hareketleri',
      'Fatura, gelir-gider ve raporlama',
      'Bulut tabanlı güvenli erişim',
    ],
    sections: [
      {
        title: 'Online ön muhasebe programı nedir?',
        body:
          'Online ön muhasebe programı, işletmenin günlük finans kayıtlarını web üzerinden takip etmesini sağlar. Bey360 bu süreci cari, stok, kasa, banka, fatura ve rapor modülleriyle tek ekranda toplar.',
      },
      {
        title: 'Bey360 ile hangi işlemleri yapabilirsiniz?',
        body:
          'Müşteri ve tedarikçi kayıtları, tahsilat ve ödeme hareketleri, stok giriş-çıkışları, gelir-gider kayıtları, fatura süreçleri ve işletme raporları Bey360 üzerinden yönetilebilir.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/e-fatura-programi',
    title: 'e-Fatura Programı | Bey360',
    description:
      'Bey360 e-Fatura programı ile fatura oluşturma, gönderme, gelen-giden fatura takibi ve e-Arşiv süreçlerinizi online yönetin.',
    h1: 'e-Fatura Programı',
    eyebrow: 'e-Fatura',
    intro:
      'Fatura oluşturma, gelen-giden fatura takibi, e-Arşiv süreçleri ve fatura durum izleme için tek panel yaklaşımı.',
    primaryKeyword: 'e fatura programı',
    keywords: ['e fatura programı', 'e arşiv fatura programı', 'online fatura kesme programı'],
    cta: 'e-Fatura Sürecini Planla',
    secondaryCta: 'Demo Talep Et',
    audience: 'e-Fatura ve e-Arşiv süreçlerini dijitalleştirmek isteyen işletmeler',
    features: [
      'Satış, alış, iade ve proforma fatura kayıtları',
      'Gelen ve giden fatura takibi',
      'e-Fatura/e-Arşiv entegrasyonuna hazır yapı',
      'Cari ve tahsilat süreçleriyle bağlantı',
    ],
    sections: [
      {
        title: 'e-Fatura programı işletmeye ne kazandırır?',
        body:
          'e-Fatura programı, fatura operasyonlarını hızlandırır, kayıt düzenini güçlendirir ve gelen-giden fatura süreçlerinin tek yerden izlenmesini sağlar.',
      },
      {
        title: 'Bey360 ile fatura yönetimi',
        body:
          'Bey360’da fatura kayıtları cari hesaplar, tahsilatlar, kasa/banka hareketleri ve raporlarla birlikte izlenir. Böylece fatura sadece belge değil, finans akışının parçası olur.',
      },
    ],
    faqs: [
      ...commonFaqs,
      {
        question: 'Bey360 ile e-Fatura kesilebilir mi?',
        answer:
          'Bey360 e-Fatura ve e-Arşiv süreçlerini özel entegratör bağlantısı ile yönetecek şekilde planlanmıştır.',
      },
    ],
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/e-arsiv-fatura-programi',
    title: 'e-Arşiv Fatura Programı | Bey360',
    description:
      'Bey360 e-Arşiv fatura programı ile e-Arşiv fatura oluşturma, gönderme ve fatura takip süreçlerinizi online yönetin.',
    h1: 'e-Arşiv Fatura Programı',
    eyebrow: 'e-Arşiv',
    intro:
      'e-Arşiv fatura süreçlerini cari, kasa, tahsilat ve rapor akışıyla birlikte yönetmek için pratik online çözüm.',
    primaryKeyword: 'e arşiv fatura programı',
    keywords: ['e arşiv fatura programı', 'e arşiv programı', 'online fatura kesme'],
    cta: 'e-Arşiv Akışını İncele',
    audience: 'e-Arşiv fatura düzenleyen küçük ve orta ölçekli işletmeler',
    features: ['e-Arşiv fatura kayıtları', 'Fatura durum takibi', 'Cari bağlantısı', 'Tahsilat izleme'],
    sections: [
      {
        title: 'e-Arşiv fatura takibi neden önemlidir?',
        body:
          'e-Arşiv faturaların düzenli izlenmesi, tahsilatların gecikmemesi ve satış raporlarının doğru oluşması için kritiktir.',
      },
      {
        title: 'Bey360 ile e-Arşiv operasyonu',
        body:
          'Bey360, e-Arşiv fatura kayıtlarını cari, kasa/banka ve raporlama modülleriyle birleştirerek işletmeye daha net finans görünürlüğü sağlar.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/cari-hesap-takip-programi',
    title: 'Cari Hesap Takip Programı | Bey360',
    description:
      'Bey360 cari hesap takip programı ile müşteri, tedarikçi, borç, alacak, tahsilat ve cari ekstre süreçlerinizi kolayca yönetin.',
    h1: 'Cari Hesap Takip Programı',
    eyebrow: 'Cari Takip',
    intro:
      'Müşteri ve tedarikçi bakiyelerini, borç-alacak durumunu ve tahsilat süreçlerini tek panelden takip edin.',
    primaryKeyword: 'cari hesap takip programı',
    keywords: ['cari hesap takip programı', 'cari takip programı', 'borç alacak takip programı'],
    cta: 'Cari Takibe Başla',
    audience: 'Müşteri ve tedarikçi hesaplarını düzenli izlemek isteyen işletmeler',
    features: ['Müşteri ve tedarikçi kartları', 'Borç-alacak takibi', 'Cari ekstre mantığı', 'Tahsilat uyarıları'],
    sections: [
      {
        title: 'Cari hesap takibi nasıl yapılır?',
        body:
          'Cari hesap takibi, müşteri ve tedarikçilerle olan borç-alacak hareketlerinin düzenli kaydedilmesiyle yapılır. Bey360 bu kayıtları fatura ve kasa hareketleriyle ilişkilendirir.',
      },
      {
        title: 'Tahsilat kontrolü',
        body:
          'Vadesi yaklaşan veya geciken alacakları izlemek, nakit akışını korumak için önemlidir. Bey360 cari takibi nakit tahminiyle birlikte düşünür.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/stok-takip-programi',
    title: 'Stok Takip Programı | Bey360',
    description:
      'Bey360 stok takip programı ile ürün, hizmet, depo, stok giriş-çıkış, minimum stok ve satış süreçlerinizi online takip edin.',
    h1: 'Stok Takip Programı',
    eyebrow: 'Stok Yönetimi',
    intro:
      'Ürün ve hizmet kayıtlarını, stok giriş-çıkışlarını, minimum stok uyarılarını ve satış bağlantılarını online yönetin.',
    primaryKeyword: 'stok takip programı',
    keywords: ['stok takip programı', 'stoklu muhasebe programı', 'depo takip programı'],
    cta: 'Stok Yönetimini İncele',
    audience: 'Stoklu çalışan mağaza, servis, market ve ticaret işletmeleri',
    features: ['Ürün kartları', 'Stok giriş-çıkış hareketleri', 'Minimum stok uyarısı', 'Satış ve maliyet görünürlüğü'],
    sections: [
      {
        title: 'Stok takip programı ne işe yarar?',
        body:
          'Stok takip programı ürün miktarlarını, giriş-çıkış hareketlerini ve kritik stok seviyelerini izlemeye yardımcı olur.',
      },
      {
        title: 'Bey360 ile stok sürekliliği',
        body:
          'Bey360 düşük stok sinyallerini dashboard analizleriyle birlikte göstererek işletmenin satış ve tedarik dengesini korumasına yardımcı olur.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/kasa-banka-takip-programi',
    title: 'Kasa ve Banka Takip Programı | Bey360',
    description:
      'Bey360 ile kasa, banka, tahsilat, ödeme, para girişi ve para çıkışı hareketlerinizi tek panelden kolayca yönetin.',
    h1: 'Kasa ve Banka Takip Programı',
    eyebrow: 'Kasa & Banka',
    intro:
      'Nakit kasa, banka hesabı, tahsilat, ödeme ve para hareketlerini işletme finans akışıyla birlikte izleyin.',
    primaryKeyword: 'kasa banka takip programı',
    keywords: ['kasa takip programı', 'banka takip programı', 'tahsilat takip programı'],
    cta: 'Nakit Akışını Yönet',
    audience: 'Kasa ve banka hareketlerini düzenli kontrol etmek isteyen işletmeler',
    features: ['Kasa ve banka hesapları', 'Giriş-çıkış hareketleri', 'Tahsilat ve ödeme izleme', 'Nakit akışı analizi'],
    sections: [
      {
        title: 'Kasa banka takibi neden kritiktir?',
        body:
          'Kasa ve banka hareketleri işletmenin gerçek nakit durumunu gösterir. Düzenli takip, ödeme planlaması ve tahsilat kontrolü için gereklidir.',
      },
      {
        title: 'Bey360 nakit akışı yaklaşımı',
        body:
          'Bey360 kasa/banka verilerini fatura ve gelir-gider kayıtlarıyla birlikte değerlendirerek kısa vadeli nakit tahmini üretir.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/gelir-gider-takip-programi',
    title: 'Gelir Gider Takip Programı | Bey360',
    description:
      'Bey360 gelir gider takip programı ile masraf, gelir, kategori, kâr-zarar ve finansal rapor süreçlerinizi online yönetin.',
    h1: 'Gelir Gider Takip Programı',
    eyebrow: 'Gelir & Gider',
    intro:
      'Gelirleri ve giderleri kategorilere ayırarak işletmenin kârlılığını, maliyetlerini ve trendlerini takip edin.',
    primaryKeyword: 'gelir gider takip programı',
    keywords: ['gelir gider takip programı', 'masraf takip programı', 'kar zarar takip programı'],
    cta: 'Gelir Gideri Takip Et',
    audience: 'Masraf ve kârlılık kontrolünü güçlendirmek isteyen işletmeler',
    features: ['Kategori bazlı takip', 'Aylık kâr-zarar görünümü', 'Gider anomalileri', 'Raporlama'],
    sections: [
      {
        title: 'Gelir gider takibi nasıl yapılır?',
        body:
          'Gelir ve gider kayıtları tarih, kategori ve tutar bilgisiyle düzenli tutulur. Bey360 bu verileri rapor ve dashboard analizlerinde kullanır.',
      },
      {
        title: 'Kârlılık görünürlüğü',
        body:
          'İşletmenin hangi dönemde kâr ettiğini, hangi giderlerin arttığını ve nakit akışını nasıl etkilediğini Bey360 üzerinden izleyebilirsiniz.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/teklif-siparis-yonetimi',
    title: 'Teklif ve Sipariş Yönetimi | Bey360',
    description:
      'Bey360 ile teklif, sipariş, fatura, cari ve stok süreçlerinizi birbirine bağlı şekilde online yönetin.',
    h1: 'Teklif ve Sipariş Yönetimi',
    eyebrow: 'Satış Operasyonu',
    intro:
      'Tekliften siparişe, siparişten faturaya uzanan satış sürecini cari ve stok yönetimiyle birlikte planlayın.',
    primaryKeyword: 'teklif sipariş yönetimi',
    keywords: ['teklif programı', 'sipariş takip programı', 'satış takip programı'],
    cta: 'Satış Akışını İncele',
    audience: 'Teklif ve sipariş süreçlerini düzenli takip etmek isteyen satış ekipleri',
    features: ['Teklif süreci', 'Sipariş takibi', 'Faturaya dönüşüm', 'Cari ve stok bağlantısı'],
    sections: [
      {
        title: 'Teklif ve sipariş yönetimi neden önemlidir?',
        body:
          'Satış fırsatlarının kaybolmaması, stok planının doğru yapılması ve fatura sürecinin hızlanması için teklif-sipariş akışı düzenli olmalıdır.',
      },
      {
        title: 'Bey360 satış operasyonu',
        body:
          'Bey360, teklif ve sipariş süreçlerini cari, stok ve fatura modülleriyle aynı panelde ele alacak şekilde büyütülebilir.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/muhasebeciler-icin',
    title: 'Muhasebeciler İçin Ön Muhasebe Paneli | Bey360',
    description:
      'Bey360 muhasebeci paneli ile müşterilerinizin cari, fatura, gelir-gider ve rapor süreçlerini tek ekrandan izleyin.',
    h1: 'Muhasebeciler İçin Bey360',
    eyebrow: 'Muhasebeci Paneli',
    intro:
      'Müşteri işletmelerin ön muhasebe verilerini düzenli takip etmek ve raporlama süreçlerini kolaylaştırmak için tek panel.',
    primaryKeyword: 'muhasebeciler için ön muhasebe programı',
    keywords: ['muhasebeci paneli', 'muhasebeciler için yazılım', 'müşteri yönetimi muhasebe'],
    cta: 'Muhasebeci Panelini İncele',
    audience: 'Mali müşavirler ve muhasebe ofisleri',
    features: ['Müşteri işletme takibi', 'Rapor görünürlüğü', 'Fatura ve cari verileri', 'Çoklu firma yapısı'],
    sections: [
      {
        title: 'Muhasebeciler için neden ayrı panel?',
        body:
          'Muhasebeciler birden fazla işletmenin finansal verisini düzenli ve güvenli şekilde takip etmek ister. Bey360 bu ihtiyacı çoklu firma yaklaşımıyla destekler.',
      },
      {
        title: 'Müşteri verisine hızlı erişim',
        body:
          'Cari, fatura, gelir-gider ve kasa hareketleri tek yapıda izlenebilir; böylece raporlama ve kontrol süreçleri hızlanır.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/kucuk-isletmeler-icin',
    title: 'Küçük İşletmeler İçin Muhasebe Programı | Bey360',
    description:
      'Bey360, küçük işletmeler için cari, stok, kasa, fatura ve gelir-gider takibini kolaylaştıran online ön muhasebe programıdır.',
    h1: 'Küçük İşletmeler İçin Muhasebe Programı',
    eyebrow: 'Küçük İşletmeler',
    intro:
      'Günlük satış, tahsilat, stok, fatura ve gider takibini karmaşık muhasebe bilgisi gerektirmeden yönetmek için Bey360.',
    primaryKeyword: 'küçük işletme muhasebe programı',
    keywords: ['küçük işletme muhasebe programı', 'kolay muhasebe programı', 'online muhasebe programı'],
    cta: 'Küçük İşletme Paketini İncele',
    audience: 'Küçük işletme sahipleri ve esnaflar',
    features: ['Kolay kullanım', 'Cari ve kasa takibi', 'Fatura yönetimi', 'Basit raporlar'],
    sections: [
      {
        title: 'Küçük işletmeler için kolay takip',
        body:
          'Bey360 günlük finans kayıtlarını sade bir panelde toplar. İşletme sahibi nakit durumunu, alacaklarını ve giderlerini hızlıca görebilir.',
      },
      {
        title: 'Excel yerine düzenli sistem',
        body:
          'Dağınık Excel tabloları yerine cari, stok, kasa ve fatura kayıtları aynı yapı içinde yönetilir.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/esnaflar-icin',
    title: 'Esnaflar İçin Ön Muhasebe Programı | Bey360',
    description:
      'Bey360 ile esnaflar cari, kasa, stok, fatura ve gelir-gider süreçlerini online ve kolay şekilde takip edebilir.',
    h1: 'Esnaflar İçin Ön Muhasebe Programı',
    eyebrow: 'Esnaf Çözümü',
    intro:
      'Günlük kasa, müşteri borcu, stok ve fatura takibini pratik şekilde yapmak isteyen esnaflar için online çözüm.',
    primaryKeyword: 'esnaf muhasebe programı',
    keywords: ['esnaf muhasebe programı', 'esnaf cari takip programı', 'kolay ön muhasebe'],
    cta: 'Esnaf Çözümünü İncele',
    audience: 'Esnaflar, mağazalar ve yerel işletmeler',
    features: ['Günlük kasa kontrolü', 'Cari borç-alacak', 'Stok takibi', 'Fatura kayıtları'],
    sections: [
      {
        title: 'Esnaflar için ön muhasebe',
        body:
          'Esnaflar için hızlı kayıt, kolay tahsilat takibi ve net kasa görünümü önemlidir. Bey360 bu süreçleri sadeleştirir.',
      },
      {
        title: 'Günlük kontrol listesi',
        body:
          'Kasa, alacak, ödeme ve stok uyarıları düzenli takip edildiğinde işletmenin günlük kontrolü güçlenir.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/kobiler-icin',
    title: 'KOBİ’ler İçin Online Ön Muhasebe Programı | Bey360',
    description:
      'Bey360, KOBİ’ler için cari, stok, kasa, banka, fatura, e-Fatura ve rapor süreçlerini tek panelden yöneten yazılımdır.',
    h1: 'KOBİ’ler İçin Online Ön Muhasebe Programı',
    eyebrow: 'KOBİ Çözümü',
    intro:
      'Büyüyen işletmelerin çoklu süreçlerini tek panelde düzenlemek, raporlamak ve finansal görünürlüğü artırmak için Bey360.',
    primaryKeyword: 'kobi muhasebe programı',
    keywords: ['kobi muhasebe programı', 'kobi ön muhasebe programı', 'işletme yönetim programı'],
    cta: 'KOBİ Çözümünü İncele',
    audience: 'KOBİ’ler ve büyüyen işletmeler',
    features: ['Çoklu süreç yönetimi', 'Raporlama', 'Fatura ve cari takibi', 'Stok ve nakit görünürlüğü'],
    sections: [
      {
        title: 'KOBİ’lerde finansal görünürlük',
        body:
          'KOBİ’ler için satış, stok, tahsilat ve gider verilerini tek yerde görmek karar alma hızını artırır.',
      },
      {
        title: 'Bey360 ile operasyon kontrolü',
        body:
          'Bey360, cari, stok, kasa, banka ve fatura modüllerini tek panelde birleştirerek işletme yönetimini kolaylaştırır.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'SoftwareApplication',
  },
  {
    path: '/sektorler/oto-servis-muhasebe-programi',
    title: 'Oto Servis Muhasebe Programı | Bey360',
    description:
      'Bey360 ile oto servis işletmenizin cari, stok, iş emri, kasa, fatura ve tahsilat süreçlerini tek panelden yönetin.',
    h1: 'Oto Servis Muhasebe Programı',
    eyebrow: 'Sektörler',
    intro:
      'Oto servislerde müşteri, araç, parça stoku, tahsilat ve fatura süreçlerini düzenli takip etmek için Bey360.',
    primaryKeyword: 'oto servis muhasebe programı',
    keywords: ['oto servis muhasebe programı', 'oto servis cari takip', 'oto servis stok takip'],
    cta: 'Oto Servis Çözümünü İncele',
    audience: 'Oto servisler, bakım ve tamir işletmeleri',
    features: ['Müşteri cari takibi', 'Parça stok takibi', 'Servis faturaları', 'Tahsilat ve kasa yönetimi'],
    sections: [
      {
        title: 'Oto servislerde takip ihtiyacı',
        body:
          'Oto servis işletmelerinde parça stokları, müşteri bakiyeleri ve servis faturaları birlikte yönetilmelidir.',
      },
      {
        title: 'Bey360 ile servis operasyonu',
        body:
          'Bey360, stok, cari, kasa ve fatura modülleriyle oto servislerin günlük finans kontrolünü sadeleştirir.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'Product',
  },
  {
    path: '/sektorler/insaat-muhasebe-programi',
    title: 'İnşaat Muhasebe Programı | Bey360',
    description:
      'Bey360 ile inşaat firmalarında cari, hakediş, gider, kasa, ödeme, stok ve fatura süreçlerinizi online yönetin.',
    h1: 'İnşaat Muhasebe Programı',
    eyebrow: 'Sektörler',
    intro:
      'İnşaat firmalarının cari, gider, ödeme, malzeme ve fatura takibini tek panelde yönetmesi için online çözüm.',
    primaryKeyword: 'inşaat muhasebe programı',
    keywords: ['inşaat muhasebe programı', 'inşaat gelir gider takibi', 'şantiye gider takibi'],
    cta: 'İnşaat Çözümünü İncele',
    audience: 'İnşaat firmaları, müteahhitler ve proje bazlı çalışan işletmeler',
    features: ['Proje giderleri', 'Cari ve ödeme takibi', 'Malzeme stokları', 'Fatura raporları'],
    sections: [
      {
        title: 'İnşaat firmalarında finans takibi',
        body:
          'Proje bazlı gelir-gider, tedarikçi ödemeleri ve malzeme takibi inşaat firmalarının kârlılığını doğrudan etkiler.',
      },
      {
        title: 'Bey360 ile finans kontrolü',
        body:
          'Bey360 kasa, cari, stok ve rapor modülleriyle inşaat işletmelerinin finansal görünürlüğünü artırır.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'Product',
  },
  {
    path: '/sektorler/emlak-ofisi-muhasebe-programi',
    title: 'Emlak Ofisi Muhasebe Programı | Bey360',
    description:
      'Bey360 ile emlak ofisinizin cari, komisyon, gelir-gider, kasa ve fatura süreçlerini kolayca takip edin.',
    h1: 'Emlak Ofisi Muhasebe Programı',
    eyebrow: 'Sektörler',
    intro:
      'Emlak ofisleri için komisyon, cari, gelir-gider, kasa ve fatura kayıtlarını düzenli tutan online ön muhasebe yapısı.',
    primaryKeyword: 'emlak ofisi muhasebe programı',
    keywords: ['emlak ofisi muhasebe programı', 'emlak cari takip', 'emlak komisyon takibi'],
    cta: 'Emlak Ofisi Çözümünü İncele',
    audience: 'Emlak ofisleri ve gayrimenkul danışmanları',
    features: ['Komisyon takibi', 'Cari kayıtlar', 'Gelir-gider izleme', 'Fatura ve kasa kontrolü'],
    sections: [
      {
        title: 'Emlak ofislerinde komisyon takibi',
        body:
          'Komisyon gelirleri, müşteri kayıtları ve ofis giderleri düzenli takip edildiğinde finansal kontrol güçlenir.',
      },
      {
        title: 'Bey360 ile ofis yönetimi',
        body:
          'Bey360, emlak ofislerinin gelir-gider, cari ve kasa hareketlerini tek panelden takip etmesini sağlar.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'Product',
  },
  {
    path: '/sektorler/teknik-servis-muhasebe-programi',
    title: 'Teknik Servis Muhasebe Programı | Bey360',
    description:
      'Bey360 ile teknik servis işletmenizin müşteri, cihaz, cari, stok, servis bedeli, tahsilat ve fatura süreçlerini yönetin.',
    h1: 'Teknik Servis Muhasebe Programı',
    eyebrow: 'Sektörler',
    intro:
      'Teknik servislerde müşteri, cihaz, parça stoku, tahsilat ve fatura takibini düzenlemek için Bey360.',
    primaryKeyword: 'teknik servis muhasebe programı',
    keywords: ['teknik servis muhasebe programı', 'teknik servis cari takip', 'servis stok takip'],
    cta: 'Teknik Servis Çözümünü İncele',
    audience: 'Teknik servisler, bakım-onarım ve cihaz servis işletmeleri',
    features: ['Müşteri takibi', 'Parça stok kontrolü', 'Servis bedeli ve tahsilat', 'Fatura kayıtları'],
    sections: [
      {
        title: 'Teknik servislerde kayıt düzeni',
        body:
          'Teknik servislerde müşteri ve cihaz bilgileri, parça kullanımı, servis bedeli ve tahsilat kayıtları birlikte izlenmelidir.',
      },
      {
        title: 'Bey360 ile servis finansı',
        body:
          'Bey360 cari, stok, kasa ve fatura modülleriyle teknik servis finans operasyonunu tek panelde toplar.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'Product',
  },
  {
    path: '/fiyatlar',
    title: 'Bey360 Fiyatları | Online Ön Muhasebe ve e-Fatura Paketleri',
    description:
      'Bey360 fiyatları ve paketlerini inceleyin. Cari, stok, kasa, fatura, e-Fatura ve e-Arşiv özelliklerine uygun paketi seçin.',
    h1: 'Bey360 Fiyatları',
    eyebrow: 'Paketler',
    intro:
      'İşletmenizin büyüklüğüne ve ihtiyaçlarına göre ön muhasebe, stok, fatura ve e-Fatura paketlerini planlayın.',
    primaryKeyword: 'Bey360 fiyatları',
    keywords: ['Bey360 fiyatları', 'ön muhasebe programı fiyatları', 'e fatura programı fiyatları'],
    cta: 'Ücretsiz Başla',
    audience: 'Paket ve fiyat araştıran işletmeler',
    features: ['Başlangıç paketi', 'Pro paket', 'e-Fatura paketi', 'Kurumsal çözüm'],
    sections: [
      {
        title: 'İhtiyaca göre paketleme',
        body:
          'Cari, kasa ve gelir-gider ile başlayan işletmeler zamanla stok, rapor, e-Fatura ve çoklu kullanıcı ihtiyaçlarına geçebilir.',
      },
      {
        title: 'Demo ile karar verin',
        body:
          'Bey360’ı işletme sürecinize göre değerlendirip uygun paketi seçmek için demo veya ücretsiz başlangıç akışı kullanılabilir.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'Product',
  },
  {
    path: '/hakkimizda',
    title: 'Hakkımızda | Bey360',
    description:
      'Bey360, işletmeler için online ön muhasebe, cari takip, stok yönetimi, fatura ve e-Fatura süreçlerini kolaylaştıran yazılımdır.',
    h1: 'Bey360 Hakkında',
    eyebrow: 'Kurumsal',
    intro:
      'Bey360, işletmelerin finansal operasyonlarını daha düzenli, hızlı ve görünür hale getirmek için geliştirilen online ön muhasebe platformudur.',
    primaryKeyword: 'Bey360',
    keywords: ['Bey360', 'online ön muhasebe', 'işletme yönetim programı'],
    cta: 'Bey360’ı İncele',
    audience: 'Bey360 markasını ve ürün yaklaşımını tanımak isteyen ziyaretçiler',
    features: ['İşletme odağı', 'Kolay kullanım', 'Güvenli altyapı', 'Gelişen modül yapısı'],
    sections: [
      {
        title: 'Misyonumuz',
        body:
          'İşletmelerin cari, stok, kasa, fatura ve rapor süreçlerini sadeleştirerek günlük finans yönetimini erişilebilir hale getirmek.',
      },
      {
        title: 'Ürün yaklaşımımız',
        body:
          'Bey360 sadece kayıt tutan değil, işletmenin finansal sağlığını gösteren ve aksiyon öneren bir karar destek platformu olmayı hedefler.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'WebPage',
  },
  {
    path: '/iletisim',
    title: 'İletişim | Bey360',
    description:
      'Bey360 ile iletişime geçin. Online ön muhasebe, e-Fatura, cari, stok ve kasa takip çözümleri hakkında bilgi alın.',
    h1: 'Bey360 İletişim',
    eyebrow: 'İletişim',
    intro:
      'Bey360 hakkında bilgi almak, demo talep etmek veya işletmenize uygun çözümü konuşmak için bizimle iletişime geçin.',
    primaryKeyword: 'Bey360 iletişim',
    keywords: ['Bey360 iletişim', 'ön muhasebe demo', 'e fatura demo'],
    cta: 'Demo Talep Et',
    audience: 'Demo ve bilgi talep eden işletmeler',
    features: ['Demo talebi', 'Ürün bilgilendirme', 'Paket danışmanlığı', 'Destek yönlendirmesi'],
    sections: [
      {
        title: 'Demo ve ürün bilgisi',
        body:
          'İşletmenizin cari, stok, kasa, fatura ve e-Fatura ihtiyaçlarını değerlendirerek Bey360 kullanım senaryosunu planlayabiliriz.',
      },
      {
        title: 'Destek kanalları',
        body:
          'Bey360 kullanıcıları için yardım merkezi, destek içerikleri ve iletişim kanalları ürün büyüdükçe genişletilecektir.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'WebPage',
  },
  {
    path: '/guvenlik',
    title: 'Bey360 Güvenlik ve Veri Koruma',
    description:
      'Bey360’da işletme verilerinizin güvenliği, yetkilendirme, yedekleme ve veri koruma süreçleri hakkında bilgi alın.',
    h1: 'Bey360 Güvenlik ve Veri Koruma',
    eyebrow: 'Güvenlik',
    intro:
      'İşletme verileri için güvenli erişim, yetkilendirme, düzenli yedekleme ve veri koruma yaklaşımı Bey360’ın temel önceliklerindendir.',
    primaryKeyword: 'Bey360 güvenlik',
    keywords: ['Bey360 güvenlik', 'muhasebe programı veri güvenliği', 'ön muhasebe güvenlik'],
    cta: 'Güvenli Başla',
    audience: 'Veri güvenliği ve KVKK hassasiyeti olan işletmeler',
    features: ['SSL erişim', 'Yetkilendirme', 'Veri yedekleme yaklaşımı', 'Güvenli kullanıcı oturumu'],
    sections: [
      {
        title: 'Veri güvenliği yaklaşımı',
        body:
          'Bey360, işletme verilerinin güvenli saklanması ve sadece yetkili kullanıcılar tarafından erişilmesi için güvenli altyapı prensipleriyle tasarlanır.',
      },
      {
        title: 'Rol ve erişim kontrolü',
        body:
          'Panel, admin ve kullanıcı alanları arama motorlarından ayrıştırılır; erişim kontrolü Firebase Auth ile sağlanır.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'WebPage',
  },
  {
    path: '/blog/online-on-muhasebe-programi-nedir',
    title: 'Online Ön Muhasebe Programı Nedir? | Bey360 Blog',
    description:
      'Online ön muhasebe programı nedir, kimler kullanır ve işletmelere ne kazandırır? Bey360 ile dijital ön muhasebe rehberi.',
    h1: 'Online Ön Muhasebe Programı Nedir?',
    eyebrow: 'Blog',
    intro:
      'Online ön muhasebe programlarının cari, stok, kasa, fatura ve raporlama süreçlerinde işletmelere nasıl yardımcı olduğunu öğrenin.',
    primaryKeyword: 'online ön muhasebe programı nedir',
    keywords: ['online ön muhasebe programı nedir', 'ön muhasebe nedir', 'bulut muhasebe'],
    cta: 'Bey360’ı Deneyin',
    audience: 'Ön muhasebeyi dijitalleştirmek isteyen işletme sahipleri',
    features: ['Ön muhasebe tanımı', 'Kimler kullanır', 'Avantajlar', 'Bey360 ile uygulama'],
    sections: [
      {
        title: 'Online ön muhasebe nedir?',
        body:
          'Online ön muhasebe, işletmenin günlük cari, stok, kasa, fatura ve gelir-gider kayıtlarını web tabanlı bir sistemden yönetmesidir.',
      },
      {
        title: 'Neden dijital takip?',
        body:
          'Dijital takip, hata riskini azaltır, raporlamayı hızlandırır ve işletme sahibine güncel finansal görünürlük sağlar.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'Article',
  },
  {
    path: '/yardim/cari-nasil-eklenir',
    title: 'Bey360’da Cari Nasıl Eklenir? | Yardım',
    description:
      'Bey360’da müşteri veya tedarikçi carisi eklemek için adım adım kullanım rehberi.',
    h1: 'Bey360’da Cari Nasıl Eklenir?',
    eyebrow: 'Yardım Merkezi',
    intro:
      'Bey360 panelinde müşteri veya tedarikçi carisi oluşturmak ve cari bilgilerini düzenli tutmak için kısa rehber.',
    primaryKeyword: 'Bey360 cari nasıl eklenir',
    keywords: ['Bey360 cari nasıl eklenir', 'cari ekleme', 'cari hesap rehberi'],
    cta: 'Cari Takip Sayfasını İncele',
    audience: 'Bey360 kullanıcıları ve yardım arayan ziyaretçiler',
    features: ['Cari modülüne girin', 'Bilgileri doldurun', 'Kaydedin', 'Cari listesinden takip edin'],
    sections: [
      {
        title: 'Cari ekleme adımları',
        body:
          'Panelde Cari Hesaplar sayfasına girin, unvan, tür, vergi bilgileri, iletişim ve IBAN alanlarını doldurun, ardından Cari Kaydet butonuyla kaydı oluşturun.',
      },
      {
        title: 'Cari kayıtları neden önemlidir?',
        body:
          'Cari kayıtları müşteri ve tedarikçi borç-alacak takibini düzenler, fatura ve tahsilat süreçlerinin doğru ilerlemesine yardımcı olur.',
      },
    ],
    faqs: commonFaqs,
    schemaType: 'Article',
  },
];

export const seoPageMap = new Map(seoPages.map((page) => [page.path, page]));

export const footerGroups = [
  {
    title: 'Özellikler',
    links: [
      ['/online-on-muhasebe-programi', 'Online Ön Muhasebe'],
      ['/e-fatura-programi', 'e-Fatura'],
      ['/e-arsiv-fatura-programi', 'e-Arşiv'],
      ['/cari-hesap-takip-programi', 'Cari Takip'],
      ['/stok-takip-programi', 'Stok Takip'],
      ['/kasa-banka-takip-programi', 'Kasa Banka'],
    ],
  },
  {
    title: 'Sektörler',
    links: [
      ['/sektorler/oto-servis-muhasebe-programi', 'Oto Servis'],
      ['/sektorler/insaat-muhasebe-programi', 'İnşaat'],
      ['/sektorler/emlak-ofisi-muhasebe-programi', 'Emlak Ofisi'],
      ['/sektorler/teknik-servis-muhasebe-programi', 'Teknik Servis'],
    ],
  },
  {
    title: 'Bey360',
    links: [
      ['/fiyatlar', 'Fiyatlar'],
      ['/hakkimizda', 'Hakkımızda'],
      ['/iletisim', 'İletişim'],
      ['/guvenlik', 'Güvenlik'],
    ],
  },
  {
    title: 'Kaynaklar',
    links: [
      ['/blog/online-on-muhasebe-programi-nedir', 'Blog'],
      ['/yardim/cari-nasil-eklenir', 'Yardım Merkezi'],
    ],
  },
] as const;
