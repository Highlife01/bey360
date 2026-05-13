import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Wallet,
  Settings as SettingsIcon,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  LogIn,
  Search,
  Bell,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Boxes,
  Briefcase,
  Signal,
  Plus,
} from 'lucide-react';
import { isSuperAdmin } from '../config/admins';
import SEO from './SEO';
import { getUserProfile } from '../services/userService';

interface AppLayoutProps {
  user: User;
  onSignOut: () => void;
  children: ReactNode;
}

const navItems = [
  { id: 'dashboard', path: '/panel', label: 'Panel', icon: LayoutDashboard },
  { id: 'invoices', path: '/faturalar', label: 'Faturalar', icon: FileText },
  { id: 'customers', path: '/cariler', label: 'Cariler', icon: Users },
  { id: 'stocks', path: '/stoklar', label: 'Stoklar', icon: Package },
  { id: 'cash-bank', path: '/kasa-banka', label: 'Kasa/Banka', icon: Wallet },
  { id: 'finance', path: '/gelir-gider', icon: TrendingUp, label: 'Gelir/Gider' },
  { id: 'reports', path: '/raporlar', label: 'Raporlar', icon: Briefcase },
  { id: 'ayarlar', path: '/ayarlar', label: 'Ayarlar', icon: SettingsIcon },
];

const sidebarLogo = '/images/brand/bey360-command-logo-hero.png';

export default function AppLayout({ user, onSignOut, children }: AppLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('bey360_theme') || 'dark');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bey360_theme', theme);
  }, [theme]);

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
        { id: 'admin', path: '/admin', label: 'Sistem Admin', icon: ShieldCheck },
      ]
    : navItems;

  const activeItem =
    visibleNav.find((item) => item.path === location.pathname) || visibleNav[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const target = searchTerm.toLowerCase().includes('fatura') ? '/faturalar' : '/cariler';
    navigate(target);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen font-sans">
      <SEO
        path={location.pathname}
        title={`${activeItem.label} | Bey360 Panel`}
        description="Bey360 uygulama paneli."
        noindex
      />
      <div className="relative flex min-h-screen">
        <aside
          className={`sticky top-0 z-50 flex h-screen shrink-0 flex-col border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] backdrop-blur-xl transition-all duration-500 ${
            isSidebarOpen ? 'w-72' : 'w-24'
          }`}
        >
          <div className="shrink-0 p-5">
            <div className="flex items-center justify-between">
            <div className={`flex min-w-0 items-center gap-3 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
              <img src={sidebarLogo} alt="Bey360" className="h-11 w-auto object-contain drop-shadow-[0_0_18px_rgba(37,99,235,0.35)]" />
              <div className="min-w-0">
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
                      ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.12)]'
                      : 'border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white'
                  } ${!isSidebarOpen && 'justify-center'}`
                }
              >
                <item.icon size={20} className="shrink-0" />
                <span className={`text-sm font-black tracking-wide ${!isSidebarOpen && 'hidden'}`}>
                  {item.label}
                </span>
                {location.pathname === item.path && isSidebarOpen && (
                  <ChevronRight size={14} className="ml-auto text-cyan-300" />
                )}
              </NavLink>
            ))}
          </nav>

          <div className="shrink-0 p-4">
            <div
              className={`rounded-xl border border-white/5 bg-white/[0.02] p-5 ${
                !isSidebarOpen && 'hidden'
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

        <main className="min-w-0 flex-1 overflow-auto bg-[var(--bg-main)]">
          <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-sidebar)]/75 px-5 py-4 backdrop-blur-xl md:px-8">
            <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4">
              <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
                <form className="relative w-full max-w-xl" onSubmit={handleSearch}>
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] py-3 pl-12 pr-5 text-sm font-semibold text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                    placeholder="Cari, fatura veya işlem ara..."
                  />
                </form>
                <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Konum
                  </p>
                  <p className="text-sm font-black text-[var(--text-main)]">{activeItem.label}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] transition-all hover:text-[var(--accent)] shadow-sm"
                  title={theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
                >
                  {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                </button>
                <Link
                  to="/bildirimler"
                  className="relative rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-3 text-[var(--text-muted)] transition hover:text-[var(--accent)]"
                  aria-label="Bildirimlere git"
                >
                  <Bell size={19} />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500" />
                </Link>
                <div className="hidden h-10 w-px bg-white/10 sm:block" />
                <div className="flex items-center gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-black text-[var(--text-main)]">{profile?.displayName || user.email?.split('@')[0]}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
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
