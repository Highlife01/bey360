import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Settings as SettingsIcon,
  Menu,
  X,
  LogIn,
  PieChart,
  Bell,
  Search,
  ShieldCheck,
  Wallet,
  Receipt,
  Boxes,
  Briefcase,
  Signal,
  Plus,
} from 'lucide-react';
import { isSuperAdmin } from '../config/admins';
import SEO from './SEO';

interface AppLayoutProps {
  user: User;
  onSignOut: () => void;
  children: ReactNode;
}

const navItems = [
  { id: 'dashboard', path: '/panel', label: 'Ana Panel', icon: LayoutDashboard },
  { id: 'cariler', path: '/cariler', label: 'Cari Hesaplar', icon: Users },
  { id: 'faturalar', path: '/faturalar', label: 'Faturalar', icon: FileText },
  { id: 'e-fatura', path: '/e-fatura', label: 'e-Fatura', icon: Receipt },
  { id: 'stok', path: '/stok', label: 'Stok', icon: Package },
  { id: 'stok-hareket', path: '/stok-hareket', label: 'Stok Hareketleri', icon: Boxes },
  { id: 'kasa-banka', path: '/kasa-banka', label: 'Kasa & Banka', icon: Wallet },
  { id: 'gelir-gider', path: '/gelir-gider', label: 'Gelir & Gider', icon: PieChart },
  { id: 'raporlar', path: '/raporlar', label: 'Raporlar', icon: PieChart },
  { id: 'bildirimler', path: '/bildirimler', label: 'Bildirimler', icon: Bell },
  { id: 'muhasebeci', path: '/muhasebeci', label: 'Muhasebeci', icon: Briefcase },
  { id: 'ayarlar', path: '/ayarlar', label: 'Ayarlar', icon: SettingsIcon },
];

import { getUserProfile } from '../services/userService';

export default function AppLayout({ user, onSignOut, children }: AppLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getUserProfile(user.uid);
      setProfile(data);
    };
    loadProfile();
  }, [user]);

  const superAdmin = isSuperAdmin(user);
  const visibleNav = superAdmin
    ? [
        ...navItems,
        { id: 'admin', path: '/admin', label: 'Süper Admin', icon: ShieldCheck },
      ]
    : navItems;
  const activeItem = visibleNav.find((item) => item.path === location.pathname) ?? visibleNav[0];

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim().toLocaleLowerCase('tr-TR');
    if (!query) return;

    const target =
      query.includes('e-fatura') || query.includes('efatura')
        ? '/e-fatura'
        : query.includes('fatura')
          ? '/faturalar'
          : query.includes('cari') || query.includes('müşteri') || query.includes('musteri')
            ? '/cariler'
            : query.includes('stok') || query.includes('ürün') || query.includes('urun')
              ? '/stok'
              : query.includes('kasa') || query.includes('banka') || query.includes('tahsilat')
                ? '/kasa-banka'
                : query.includes('gelir') || query.includes('gider')
                  ? '/gelir-gider'
                  : query.includes('rapor') || query.includes('analiz')
                    ? '/raporlar'
                    : query.includes('muhasebe')
                      ? '/muhasebeci'
                      : query.includes('bildirim') || query.includes('uyarı') || query.includes('uyari')
                        ? '/bildirimler'
                        : '/panel';

    navigate(target);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-[#07111f] font-sans text-slate-100">
      <SEO
        path={location.pathname}
        title={`${activeItem.label} | Bey360 Panel`}
        description="Bey360 uygulama paneli."
        noindex
      />
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(103,232,249,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="relative flex min-h-screen">
        <aside
          className={`sticky top-0 z-50 flex h-screen shrink-0 flex-col border-r border-cyan-300/15 bg-slate-950/90 backdrop-blur-xl transition-all duration-500 ${
            isSidebarOpen ? 'w-72' : 'w-24'
          }`}
        >
          <div className="shrink-0 p-5">
            <div className="flex items-center justify-between">
            <div className={`flex min-w-0 items-center gap-3 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
              <img src="/logos/logo_branding.png" alt="Bey360" className="h-12 w-auto" />
              <div className="min-w-0">
                <p className="text-lg font-black leading-none tracking-tight text-white">Bey360</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
                  Command OS
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-slate-300 transition hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-cyan-100"
              aria-label={isSidebarOpen ? 'Menüyü daralt' : 'Menüyü aç'}
            >
              {isSidebarOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
            </div>
          </div>

          <div className={`mx-4 mb-4 shrink-0 rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-4 ${!isSidebarOpen && 'hidden'}`}>
            <div className="flex items-center gap-3">
              <Signal size={18} className="text-cyan-200" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Aktif Modül
                </p>
                <p className="text-sm font-black text-white">{activeItem.label}</p>
              </div>
            </div>
          </div>

          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4 pb-4">
            {visibleNav.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/panel'}
                className={({ isActive }) =>
                  `group relative flex w-full items-center gap-4 rounded-lg border px-4 py-3 transition-all ${
                    isActive
                      ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100 shadow-[0_0_22px_rgba(103,232,249,0.12)]'
                      : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-100'
                  }`
                }
              >
                <item.icon size={19} className="shrink-0" />
                <span className={`truncate text-sm font-black tracking-wide ${!isSidebarOpen && 'hidden'}`}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="shrink-0 border-t border-white/10 p-4">
            <div
              className={`overflow-hidden rounded-lg border border-emerald-300/20 bg-emerald-300/5 p-4 transition-all ${
                !isSidebarOpen ? 'hidden' : 'block'
              }`}
            >
              <div className="mb-3 flex items-center gap-2 text-emerald-100">
                <ShieldCheck size={17} />
                <p className="text-[10px] font-black uppercase tracking-[0.18em]">Güvenlik</p>
              </div>
              <p className="text-sm font-bold leading-5 text-slate-200">
                Oturum ve veri katmanı aktif izleme modunda.
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" />
              </div>
            </div>
            <button
              onClick={onSignOut}
              className={`mt-3 flex w-full items-center gap-4 rounded-lg border border-rose-300/20 bg-rose-300/5 px-4 py-3 text-rose-100 transition hover:bg-rose-300/10 ${
                !isSidebarOpen && 'justify-center'
              }`}
            >
              <LogIn size={19} className="rotate-180" />
              <span className={`text-sm font-black tracking-wide ${!isSidebarOpen && 'hidden'}`}>
                Güvenli Çıkış
              </span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-auto">
          <header className="sticky top-0 z-40 border-b border-cyan-300/15 bg-slate-950/75 px-5 py-4 backdrop-blur-xl md:px-8">
            <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4">
              <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
                <form className="relative w-full max-w-xl" onSubmit={handleSearch}>
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-3 pl-12 pr-5 text-sm font-semibold text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-cyan-300/5"
                    placeholder="Cari, fatura veya işlem ara..."
                  />
                </form>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Konum
                  </p>
                  <p className="text-sm font-black text-white">{activeItem.label}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Link
                  to="/bildirimler"
                  className="relative rounded-lg border border-white/10 bg-white/[0.04] p-3 text-slate-300 transition hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-cyan-100"
                  aria-label="Bildirimlere git"
                >
                  <Bell size={19} />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border border-slate-950 bg-rose-300" />
                </Link>
                <div className="hidden h-10 w-px bg-white/10 sm:block" />
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-black text-white">{profile?.displayName || user.email?.split('@')[0]}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                      {profile?.companyName || 'Bey360 Operatör'}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-sm font-black text-cyan-100">
                    {(profile?.displayName?.[0] || user.email?.[0] || 'B').toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1680px] p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
