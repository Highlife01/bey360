import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram } from 'lucide-react';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center justify-between h-20 px-6 max-w-7xl mx-auto">
          <Link to="/" className="flex flex-col items-center md:items-start group">
            <img src="/logos/logo_branding.png" alt="Bey360 Logo" className="h-12 w-auto group-hover:scale-105 transition-transform" />
            <span className="hidden md:block text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 -mt-1 ml-1 group-hover:text-indigo-600 transition-colors">Gelişmiş Çözümler, Tek Platform</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <Link to="/ozellikler" className={`hover:text-slate-900 ${location.pathname === '/ozellikler' ? 'text-indigo-600' : ''}`}>Özellikler</Link>
            <Link to="/fiyatlar" className={`hover:text-slate-900 ${location.pathname === '/fiyatlar' ? 'text-indigo-600' : ''}`}>Fiyatlar</Link>
            <Link to="/blog" className={`hover:text-slate-900 ${location.pathname.startsWith('/blog') ? 'text-indigo-600' : ''}`}>Blog</Link>
            <Link to="/hakkimizda" className={`hover:text-slate-900 ${location.pathname === '/hakkimizda' ? 'text-indigo-600' : ''}`}>Hakkımızda</Link>
            <Link to="/iletisim" className={`hover:text-slate-900 ${location.pathname === '/iletisim' ? 'text-indigo-600' : ''}`}>İletişim</Link>
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

      <main>{children}</main>

      <footer className="border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">B</div>
              <span className="font-black">Bey360</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Gelişmiş Çözümler, Tek Platform</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
            <Link to="/hakkimizda" className="hover:text-indigo-600">Hakkımızda</Link>
            <Link to="/iletisim" className="hover:text-indigo-600">İletişim</Link>
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
