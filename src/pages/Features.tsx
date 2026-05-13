import { 
  FileText, Users, Wallet, PieChart, BarChart3, ShieldCheck, 
  Smartphone, Cloud, Lock, Zap, Clock, HeartHandshake 
} from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import SEO from '../components/SEO';

const allFeatures = [
  { icon: FileText, title: 'e-Fatura & e-Arşiv', desc: 'Tek tıkla GİB uyumlu fatura kes, arşivle ve gönder. Kağıt fatura yükünden kurtulun.' },
  { icon: Users, title: 'Cari Hesap Yönetimi', desc: 'Müşteri ve tedarikçilerinin bakiyesini canlı izle. Kim ne kadar borçlu anında gör.' },
  { icon: Wallet, title: 'Kasa & Banka', desc: 'Tüm hesap hareketlerini tek panelden yönet. Nakit akışını kontrol altına al.' },
  { icon: PieChart, title: 'Gelir / Gider', desc: 'Kategorize edilmiş gelir-gider takibi ve kâr/zarar analizleri ile finansal sağlık.' },
  { icon: BarChart3, title: 'Akıllı Raporlar', desc: 'Excel çıktı, tarih aralığı ve trend analizleri. Karar verme süreçlerinizi hızlandırın.' },
  { icon: ShieldCheck, title: '%100 Güvenli', desc: 'Firebase altyapısı ile bankacılık seviyesi güvenlik. Verileriniz her zaman güvende.' },
  { icon: Smartphone, title: 'Mobil Uyumlu', desc: 'Dilediğiniz yerden, her cihazdan erişim sağlayın. Cebinizdeki ön muhasebe.' },
  { icon: Cloud, title: 'Bulut Yedekleme', desc: 'Verileriniz bulutta yedeklenir. Bilgisayar bozulsa da verileriniz kaybolmaz.' },
  { icon: Lock, title: 'Yetkilendirme', desc: 'Personelinize özel yetkiler tanımlayın. Kimin neyi göreceğine siz karar verin.' },
];

export default function Features() {
  return (
    <PublicLayout>
      <SEO 
        path="/ozellikler"
        title="Özellikler | Bey360 Ön Muhasebe"
        description="Bey360'ın sunduğu e-Fatura, Cari Takip, Kasa Yönetimi ve daha fazlasını keşfedin."
      />
      
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">İşinizi Büyüten <span className="text-indigo-600">Güçlü Özellikler.</span></h1>
            <p className="text-xl text-slate-500 font-medium">Bey360, bir ön muhasebe yazılımından çok daha fazlasıdır. İşletmenizin dijital dönüşümündeki en büyük yardımcınız.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allFeatures.map((f, i) => (
              <div key={i} className="p-8 rounded-[32px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <f.icon size={32} />
                </div>
                <h3 className="text-xl font-black mb-3">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 bg-indigo-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8">Hemen Deneyimleyin.</h2>
          <p className="text-indigo-100 text-xl mb-10 max-w-2xl mx-auto">14 gün boyunca tüm özellikleri ücretsiz test edin. Kredi kartı gerekmez.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/signup" className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">Ücretsiz Başla</a>
            <a href="/iletisim" className="px-10 py-5 border border-white/20 bg-white/10 rounded-2xl font-black hover:bg-white/20 transition-all">Bize Ulaşın</a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
