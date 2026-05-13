import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  PieChart,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import SEO from '../components/SEO';
import { HeroCarousel } from '../components/HeroCarousel';
import PublicLayout from '../components/PublicLayout';

const features = [
  { icon: FileText, title: 'e-Fatura & e-Arşiv', desc: 'Tek tıkla GİB uyumlu fatura kes, arşivle ve gönder.' },
  { icon: Users, title: 'Cari Hesap Yönetimi', desc: 'Müşteri ve tedarikçilerinin bakiyesini canlı izle.' },
  { icon: Wallet, title: 'Kasa & Banka', desc: 'Tüm hesap hareketlerini tek panelden yönet.' },
  { icon: PieChart, title: 'Gelir / Gider', desc: 'Kategorize edilmiş gelir-gider takibi ve kâr/zarar.' },
  { icon: BarChart3, title: 'Akıllı Raporlar', desc: 'Excel çıktı, tarih aralığı ve trend analizleri.' },
  { icon: ShieldCheck, title: '%100 Güvenli', desc: 'Firebase altyapısı ile bankacılık seviyesi güvenlik.' },
];

export default function Landing() {
  return (
    <PublicLayout>
      <SEO
        path="/"
        title="Bey360 | Online Ön Muhasebe ve e-Fatura Programı"
        description="Bey360 ile cari, stok, kasa, banka, gelir-gider, fatura, e-Fatura ve e-Arşiv süreçlerinizi tek panelden yönetin. İşletmenizi 360 derece yönetin."
      />
      
      <HeroCarousel />

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Dijital Dönüşüm</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">İşletmeni 360 Derece Yönetmeye Hazır Mısın?</h2>
          </div>
          <Link to="/ozellikler" className="px-8 py-4 border-2 border-slate-900 rounded-2xl font-black hover:bg-slate-900 hover:text-white transition-all whitespace-nowrap">Tüm Özellikleri Gör</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="group bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-black mb-4">{f.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-white">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Neden Bey360?</h2>
              <div className="space-y-8">
                {[
                  { t: 'Hızlı Kurulum', d: 'Dakikalar içinde hesabınızı oluşturun ve fatura kesmeye başlayın.' },
                  { t: 'Veri Güvenliği', d: 'Tüm verileriniz yüksek güvenlikli bulut sunucularımızda saklanır.' },
                  { t: 'Kullanıcı Dostu', d: 'Karmaşık muhasebe terimleri yerine herkesin anlayabileceği şık arayüz.' }
                ].map(item => (
                  <div key={item.t} className="flex gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 text-indigo-400">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black mb-2">{item.t}</h4>
                      <p className="text-slate-400 font-medium leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="/images/hero3.png" alt="Dashboard" className="rounded-[40px] shadow-2xl shadow-black/50" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-8">İşletmenizi bir üst seviyeye taşıyın.</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/signup" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl hover:bg-indigo-700 transition-all hover:scale-[1.02]">Hemen Ücretsiz Dene</Link>
          <Link to="/fiyatlar" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition-all">Paketleri İncele</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
