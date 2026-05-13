import { CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Başlangıç',
    price: '0',
    desc: 'Küçük işletmeler ve yeni başlayanlar için.',
    features: ['Sınırsız cari kayıt', 'Aylık 50 fatura', 'Gelir/Gider takibi', 'Temel raporlar', 'E-posta destek'],
    button: 'Ücretsiz Başla',
    link: '/signup',
    highlight: false
  },
  {
    name: 'Profesyonel',
    price: '299',
    desc: 'Büyümekte olan işletmeler için en popüler seçim.',
    features: ['Sınırsız fatura & e-Fatura', 'Sınırsız cari & stok', 'Kasa & Banka yönetimi', 'Gelişmiş analitikler', 'WhatsApp destek'],
    button: 'Şimdi Başla',
    link: '/signup',
    highlight: true
  },
  {
    name: 'Kurumsal',
    price: '599',
    desc: 'Birden fazla şubesi olan büyük yapılar için.',
    features: ['Çoklu firma yönetimi', 'Özel entegratör desteği', 'Muhasebeci özel paneli', 'Audit log (Denetim)', '7/24 Öncelikli destek'],
    button: 'İletişime Geç',
    link: '/iletisim',
    highlight: false
  }
];

export default function Pricing() {
  return (
    <PublicLayout>
      <SEO 
        path="/fiyatlar"
        title="Fiyatlar | Bey360 Uygun Ön Muhasebe Çözümleri"
        description="İşletmenize en uygun Bey360 paketini seçin. Gizli maliyet yok, esnek ödeme planları."
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Şeffaf ve <span className="text-indigo-600">Esnek Fiyatlandırma.</span></h1>
            <p className="text-xl text-slate-500 font-medium">İhtiyacınıza göre ölçeklenebilen paketlerle işletmenizin maliyetlerini kontrol altında tutun.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((p, i) => (
              <div key={i} className={`relative p-10 rounded-[40px] border transition-all ${p.highlight ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-200 scale-105 z-10' : 'bg-white border-slate-100'}`}>
                {p.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-2">
                    <Zap size={12} fill="currentColor" /> En Popüler
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-black mb-2">{p.name}</h3>
                  <p className={`text-sm font-medium ${p.highlight ? 'text-indigo-100' : 'text-slate-500'}`}>{p.desc}</p>
                </div>
                <div className="flex items-end gap-2 mb-8">
                  <span className="text-5xl font-black">₺{p.price}</span>
                  <span className={`text-sm font-bold mb-2 ${p.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>/ ay + KDV</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle2 size={18} className={p.highlight ? 'text-white' : 'text-emerald-500'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={p.link} className={`block text-center w-full py-5 rounded-2xl font-black transition-all ${p.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                  {p.button}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 p-10 rounded-[40px] bg-slate-100 border border-slate-200 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shrink-0 shadow-sm text-indigo-600">
              <HelpCircle size={40} />
            </div>
            <div>
              <h4 className="text-2xl font-black mb-2">Özel bir ihtiyacınız mı var?</h4>
              <p className="text-slate-500 font-medium">Büyük hacimli işlemler veya özel entegrasyonlar için size özel teklif hazırlayabiliriz.</p>
            </div>
            <Link to="/iletisim" className="md:ml-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all whitespace-nowrap">Bize Ulaşın</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
