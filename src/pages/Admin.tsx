import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, Users as UsersIcon, FileText, Wallet, Package, PieChart, RefreshCw, LucideIcon, Mail } from 'lucide-react';
import { isSuperAdmin } from '../config/admins';
import { listAllUsers, AdminUserRow } from '../services/adminService';
import { getContactMessages, ContactMessage } from '../services/messageService';

interface AdminProps {
  user: User | null;
}

export default function Admin({ user }: AdminProps) {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'messages'>('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [u, m] = await Promise.all([listAllUsers(), getContactMessages()]);
      setRows(u);
      setMessages(m);
    } catch (err) {
      setError((err as Error).message || 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!isSuperAdmin(user)) {
    return <Navigate to="/panel" replace />;
  }

  const totals = rows.reduce(
    (acc, r) => ({
      customers: acc.customers + r.customers,
      invoices: acc.invoices + r.invoices,
      cashBank: acc.cashBank + r.cashBank,
      finance: acc.finance + r.finance,
      stock: acc.stock + r.stock,
    }),
    { customers: 0, invoices: 0, cashBank: 0, finance: 0, stock: 0 }
  );

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-lg border border-cyan-300/15 bg-slate-950/70 p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:p-8">
        <ShieldCheck className="absolute -right-10 -bottom-10 h-72 w-72 text-cyan-300/5" />
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
          Süper Admin Paneli
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white">
          Tüm sistemi {user?.email?.split('@')[0]} kontrolünde.
        </h2>
        <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-300">
          Bey360 platformundaki tüm kullanıcıları, gelen mesajları ve sistem
          istatistiklerini buradan izleyebilirsin.
        </p>
        <button
          onClick={load}
          disabled={loading}
          className="mt-6 flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-6 py-3 font-bold text-cyan-100 transition-all hover:bg-cyan-300/15 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Yenile
        </button>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatTile label="Kullanıcı" value={rows.length} icon={UsersIcon} color="indigo" />
        <StatTile label="Mesajlar" value={messages.length} icon={Mail} color="rose" />
        <StatTile label="Cari" value={totals.customers} icon={UsersIcon} color="emerald" />
        <StatTile label="Fatura" value={totals.invoices} icon={FileText} color="violet" />
        <StatTile label="Kasa/Banka" value={totals.cashBank} icon={Wallet} color="amber" />
        <StatTile label="Gelir/Gider" value={totals.finance} icon={PieChart} color="rose" />
        <StatTile label="Stok" value={totals.stock} icon={Package} color="indigo" />
      </section>

      <section className="overflow-hidden rounded-lg border border-cyan-300/15 bg-slate-950/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-8 border-b border-white/10 px-6 py-2 md:px-8">
          <button 
            onClick={() => setActiveTab('users')}
            className={`py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-slate-500 hover:text-white'}`}
          >
            Kullanıcılar ({rows.length})
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-slate-500 hover:text-white'}`}
          >
            Gelen Mesajlar ({messages.length})
          </button>
        </div>

        {error && <p className="px-8 py-4 text-sm font-bold text-rose-200">{error}</p>}

        {loading ? (
          <p className="px-8 py-12 text-center font-medium text-slate-400">Yükleniyor...</p>
        ) : activeTab === 'users' ? (
          <div className="overflow-x-auto">
            {rows.length === 0 ? (
              <p className="px-8 py-12 text-center font-medium text-slate-400">Henüz kullanıcı yok.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>E-posta</th>
                    <th>Kayıt</th>
                    <th>Cari</th>
                    <th>Fatura</th>
                    <th>Kasa</th>
                    <th>Gelir/Gider</th>
                    <th>Stok</th>
                    <th>UID</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.uid}>
                      <td className="font-black text-white">{r.email}</td>
                      <td>{r.createdAt}</td>
                      <td>{r.customers}</td>
                      <td>{r.invoices}</td>
                      <td>{r.cashBank}</td>
                      <td>{r.finance}</td>
                      <td>{r.stock}</td>
                      <td className="font-mono text-[10px] text-slate-500">{r.uid.slice(0, 12)}…</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {messages.length === 0 ? (
              <p className="px-8 py-12 text-center font-medium text-slate-400">Henüz mesaj yok.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Ad Soyad</th>
                    <th>E-posta</th>
                    <th>Telefon</th>
                    <th>Mesaj</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m.id}>
                      <td className="whitespace-nowrap">{m.createdAt}</td>
                      <td className="font-black text-white whitespace-nowrap">{m.name}</td>
                      <td>{m.email}</td>
                      <td className="whitespace-nowrap">{m.phone}</td>
                      <td className="max-w-xs text-xs leading-relaxed">{m.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

interface TileProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose';
}

function StatTile({ label, value, icon: Icon, color }: TileProps) {
  const tones: Record<TileProps['color'], string> = {
    indigo: 'border-indigo-300/20 bg-indigo-300/5 text-indigo-100',
    emerald: 'border-emerald-300/20 bg-emerald-300/5 text-emerald-100',
    violet: 'border-violet-300/20 bg-violet-300/5 text-violet-100',
    amber: 'border-amber-300/20 bg-amber-300/5 text-amber-100',
    rose: 'border-rose-300/20 bg-rose-300/5 text-rose-100',
  };

  return (
    <div className={`rounded-lg border p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${tones[color]}`}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
        <Icon size={18} />
      </div>
      <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  );
}
