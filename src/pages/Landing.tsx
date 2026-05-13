import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Instagram,
  PieChart,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import SEO from '../components/SEO';
import { submitContactMessage } from '../services/messageService';
import { ensureUserDashboard } from '../services/userService';
import { HeroCarousel } from '../components/HeroCarousel';

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <SEO
        path="/"
        title="Bey360 | Online Ön Muhasebe ve e-Fatura Programı"
        description="Bey360 ile cari, stok, kasa, banka, gelir-gider, fatura, e-Fatura ve e-Arşiv süreçlerinizi tek panelden yönetin. İşletmenizi 360 derece yönetin."
      />
      
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center justify-between h-20 px-6 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logos/logo_branding.png" alt="Bey360 Logo" className="h-12 w-auto group-hover:scale-105 transition-transform" />
            <span className="hidden text-2xl font-black tracking-tighter text-slate-900">BEY360</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-slate-900">Özellikler</a>
            <a href="#pricing" className="hover:text-slate-900">Fiyatlar</a>
            <Link to="/blog" className="hover:text-slate-900">Blog</Link>
            <a href="#about" className="hover:text-slate-900">Hakkımızda</a>
            <a href="#contact" className="hover:text-slate-900">İletişim</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-indigo-600">
              Giriş Yap
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-[1.02]"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </header>

      <HeroCarousel />

      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Özellikler</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">İşletmen için gereken her şey.</h2>
          <p className="mt-4 text-slate-500 font-medium">20+ modül ile fatura, stok, cari, kasa ve raporları tek noktadan yönet.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group bg-white p-8 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-black mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Başlangıç</p>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-black">₺0</span>
              <span className="text-slate-400 font-medium mb-2">/ ay</span>
            </div>
            <ul className="space-y-3 text-sm font-semibold text-slate-700 mb-8">
              {['Sınırsız cari', 'Aylık 50 fatura', 'Excel dışa aktarım', 'E-posta destek'].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500" /> {t}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="block text-center w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black hover:bg-slate-200 transition">Ücretsiz Başla</Link>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-10 rounded-[32px] text-white relative overflow-hidden shadow-xl shadow-indigo-200/50">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={12} /> En Popüler</p>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-black">₺299</span>
              <span className="text-indigo-200 font-medium mb-2">/ ay</span>
            </div>
            <ul className="space-y-3 text-sm font-semibold mb-8 relative z-10">
              {['Sınırsız fatura & e-Fatura', 'Çoklu firma yönetimi', 'Gelişmiş raporlar', 'Muhasebeci paneli', '7/24 öncelikli destek'].map((t) => (
                <li key={t} className="flex items-center gap-3"><CheckCircle2 size={18} /> {t}</li>
              ))}
            </ul>
            <Link to="/signup" className="block text-center w-full py-4 bg-white text-indigo-700 rounded-2xl font-black hover:scale-[1.02] transition shadow-2xl">Pro'ya Geç</Link>
          </div>
        </div>
      </section>

      <section id="blog" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Blog</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Blog'dan Haberler.</h2>
            <p className="mt-4 text-slate-500 font-medium">Finansal başarı ve dijital dönüşüm yolculuğunuzda size rehberlik edecek en yeni yazılarımız.</p>
          </div>
          <Link to="/blog" className="px-6 py-3 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">Tüm Yazıları Gör <ArrowRight size={14} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { id: 'e-fatura-rehberi', title: 'Yeni Başlayanlar İçin e-Fatura Rehberi', img: '/images/blog/efatura.png', cat: 'E-Dönüşüm' },
            { id: 'cari-hesap-yonetimi', title: 'Cari Hesap Takibinde Yapılan 5 Kritik Hata', img: '/images/blog/cari.png', cat: 'Muhasebe' },
            { id: 'akilli-stok-yonetimi', title: 'Akıllı Stok Yönetimi ile Kârlılığınızı Artırın', img: '/images/blog/stok.png', cat: 'Operasyon' }
          ].map(p => (
            <Link key={p.id} to={`/blog/${p.id}`} className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">{p.cat}</span>
                <h3 className="text-xl font-black mb-4 group-hover:text-indigo-600 transition-colors leading-tight">{p.title}</h3>
                <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">Devamını Oku <ArrowRight size={12} /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -left-10 -top-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            <img src="/images/hero3.png" alt="Beyoğlu Teknoloji" className="rounded-[40px] shadow-2xl relative z-10 w-full object-cover h-[500px]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Hakkımızda</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">15 Yıllık Sektörel Başarı ve Teknoloji Vizyonu.</h2>
            <div className="space-y-4 text-slate-500 font-medium leading-relaxed">
              <p>
                <a href="https://www.beyogluteknoloji.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline">www.beyogluteknoloji.com</a> olarak, 15 yılı aşkın süredir Türkiye'nin dijital dönüşümüne öncülük ediyoruz.
              </p>
              <p>Adana'nın kalbinde başlayan yolculuğumuzda, binlerce işletmeye değer katarak sektördeki yerimizi sağlamlaştırdık. Müşteri memnuniyeti ve sürekli inovasyon odaklı çalışma prensibimizle, geleceğin teknolojilerini bugünden sunuyoruz.</p>
              <div className="pt-6 mt-6 border-t border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0"><FileText size={18} /></div>
                  <div>
                    <h4 className="font-black text-slate-900">Merkez Ofis</h4>
                    <p className="text-sm text-slate-500">Reşatbey Mh. Ordu caddesi Ünsal Apt. No 79/B, Adana, Turkey 01122</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="max-w-7xl mx-auto px-6 py-20 bg-slate-900 rounded-[40px] my-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="grid lg:grid-cols-2 gap-16 relative z-10">
          <div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">İletişim</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Bizimle İletişime Geçin.</h2>
            <p className="text-slate-400 font-medium mb-10 max-w-md leading-relaxed">Sorularınız, önerileriniz veya destek talepleriniz için formu doldurabilir ya da doğrudan WhatsApp üzerinden bize ulaşabilirsiniz.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><Users size={20} /></div>
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">7/24 Destek</p>
                  <p className="font-bold text-white">+90 537 512 78 10</p>
                </div>
              </div>
              <a
                href="https://www.instagram.com/beyogluteknoloji/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-indigo-400/50 hover:bg-white/10"
              >
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <Instagram size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Instagram</p>
                  <p className="font-bold text-white">@beyogluteknoloji</p>
                </div>
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">B</div>
            <span className="font-black">Bey360</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
            <a href="#about" className="hover:text-indigo-600">Hakkımızda</a>
            <a href="#contact" className="hover:text-indigo-600">İletişim</a>
            <a
              href="https://www.instagram.com/beyogluteknoloji/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-indigo-600"
            >
              <Instagram size={14} />
              Instagram
            </a>
          </div>
          <p className="text-sm text-slate-400 font-medium">© {new Date().getFullYear()} Bey360. Tüm hakları saklıdır.</p>
        </div>
      </footer>

      {/* WhatsApp Floating Button with Menu */}
      <div className="fixed bottom-8 right-8 z-[100] group">
        {/* Quick Messages Menu */}
        <div className="absolute bottom-20 right-0 flex flex-col items-end gap-3 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
          {[
            { label: 'Fiyat Teklifi Almak İstiyorum', msg: 'Merhaba, Bey360 fiyatları ve paketleri hakkında bilgi alabilir miyim?' },
            { label: 'Ücretsiz Deneme Yardımı', msg: 'Merhaba, ücretsiz deneme hesabımı kurmak için yardıma ihtiyacım var.' },
            { label: 'Teknik Destek / Soru', msg: 'Merhaba, Bey360 sistemi hakkında teknik bir sorum var.' }
          ].map((item, idx) => (
            <a 
              key={idx}
              href={`https://wa.me/905375127810?text=${encodeURIComponent(item.msg)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="whitespace-nowrap bg-white text-slate-700 text-xs font-black px-5 py-3 rounded-2xl shadow-2xl border border-slate-100 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
              {item.label}
            </a>
          ))}
        </div>

        <a 
          href="https://wa.me/905375127810" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '';
      setError(
        errorMessage && !errorMessage.toLowerCase().includes('permission')
          ? errorMessage
          : 'Mesaj şu anda kaydedilemedi. Lütfen WhatsApp veya telefon üzerinden bize ulaşın.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-black mb-2 text-white">Mesajınız Alındı!</h3>
        <p className="text-slate-400 font-medium">En kısa sürede size dönüş yapacağız.</p>
        <button onClick={() => setSuccess(false)} className="mt-8 text-sm font-black text-indigo-400 hover:text-white transition">Yeni Mesaj Gönder</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input type="text" placeholder="Adınız" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-indigo-500 outline-none transition font-bold" />
        <input type="email" placeholder="E-posta" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-indigo-500 outline-none transition font-bold" />
      </div>
      <input type="tel" placeholder="Telefon" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-indigo-500 outline-none transition font-bold" />
      <textarea placeholder="Mesajınız" required rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-indigo-500 outline-none transition font-bold resize-none" />
      {error && (
        <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 px-5 py-4 text-sm font-bold leading-6 text-rose-100">
          {error}{' '}
          <a href="https://wa.me/905375127810" target="_blank" rel="noopener noreferrer" className="underline decoration-rose-200/50 underline-offset-4">
            WhatsApp ile yazın.
          </a>
        </div>
      )}
      <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl hover:bg-indigo-700 transition-all hover:scale-[1.02] disabled:opacity-50">{loading ? 'GÖNDERİLİYOR...' : 'MESAJ GÖNDER'}</button>
    </form>
  );
}
