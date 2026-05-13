import { useEffect, useState, useMemo } from 'react';
import { User } from 'firebase/auth';
import { 
  Plus, 
  Search, 
  Trash2, 
  Wallet, 
  Landmark, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  History,
  FileDown
} from 'lucide-react';
import { addCashBankRecord, deleteCashBankRecord, getCashBankRecords, CashBankRecord } from '../services/cashBankService';
import { exportToExcel } from '../services/excelService';

interface CashBankProps {
  user: User | null;
}

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0);

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
};

export default function CashBank({ user }: CashBankProps) {
  const [records, setRecords] = useState<CashBankRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<Omit<CashBankRecord, 'id' | 'createdAt'>>({
    accountType: 'Kasa',
    transactionType: 'Giriş',
    amount: 0,
    accountName: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
  });

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getCashBankRecords(user.uid);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    await addCashBankRecord(user.uid, form);
    setForm({ 
      accountType: 'Kasa', transactionType: 'Giriş', 
      amount: 0, accountName: '', 
      date: new Date().toISOString().slice(0, 10), description: '' 
    });
    setIsFormOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Bu hareketi silmek istediğinize emin misiniz?')) return;
    await deleteCashBankRecord(user.uid, id);
    loadData();
  };

  const accounts = useMemo(() => {
    const accs: Record<string, { type: string; balance: number; in: number; out: number }> = {};
    records.forEach(r => {
      if (!accs[r.accountName]) {
        accs[r.accountName] = { type: r.accountType, balance: 0, in: 0, out: 0 };
      }
      if (r.transactionType === 'Giriş') {
        accs[r.accountName].balance += r.amount;
        accs[r.accountName].in += r.amount;
      } else {
        accs[r.accountName].balance -= r.amount;
        accs[r.accountName].out += r.amount;
      }
    });
    return accs;
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.accountName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  const stats = useMemo(() => {
    const totalCash = Object.values(accounts).filter(a => a.type === 'Kasa').reduce((sum, a) => sum + a.balance, 0);
    const totalBank = Object.values(accounts).filter(a => a.type === 'Banka').reduce((sum, a) => sum + a.balance, 0);
    return { totalCash, totalBank };
  }, [accounts]);

  const handleExport = () => {
    exportToExcel(
      filteredRecords.map(r => ({
        'Hesap Adı': r.accountName,
        'Tür': r.accountType,
        'İşlem': r.transactionType,
        'Tutar': r.amount,
        'Tarih': r.date,
        'Açıklama': r.description
      })),
      'bey360-kasa-banka-hareketleri'
    );
  };

  if (loading) return <div className="page-section">Kasa/Banka verileri yükleniyor...</div>;

  return (
    <div className="page-section">
      <div className="page-header-block">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="badge">Nakit Yönetimi</span>
            <h2 className="mt-4">Kasa & Banka Takibi</h2>
            <p>İşletmenizin nakit akışını, banka bakiyelerini ve günlük kasa hareketlerini yönetin.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport} className="button-secondary flex items-center gap-2">
              <FileDown size={18} /> Excel İndir
            </button>
            <button 
              onClick={() => setIsFormOpen(!isFormOpen)} 
              className="button-primary flex items-center gap-2"
            >
              <Plus size={18} /> {isFormOpen ? 'Vazgeç' : 'Yeni Hareket'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <article className="stat-card flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400">
            <Wallet size={28} />
          </div>
          <div>
            <span>Toplam Kasa Bakiyesi</span>
            <strong>{formatCurrency(stats.totalCash)}</strong>
          </div>
        </article>
        <article className="stat-card flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
            <Landmark size={28} />
          </div>
          <div>
            <span>Toplam Banka Bakiyesi</span>
            <strong>{formatCurrency(stats.totalBank)}</strong>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <section className="card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="mb-0">Hesap Hareketleri</h3>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Hesap veya açıklama ara..." 
                className="pl-10 pr-4 py-2 w-full bg-white/5 border border-white/10 rounded-lg text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Hesap / Tür</th>
                  <th>İşlem</th>
                  <th>Tutar</th>
                  <th>Tarih</th>
                  <th className="text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500 font-medium">Hareket bulunamadı.</td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="group">
                      <td>
                        <div className="font-bold text-white">{r.accountName}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">{r.accountType}</div>
                      </td>
                      <td>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest
                          ${r.transactionType === 'Giriş' ? 'text-emerald-400' : 'text-rose-400'}
                        `}>
                          {r.transactionType === 'Giriş' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {r.transactionType}
                        </span>
                      </td>
                      <td>
                        <div className="font-black text-white">{formatCurrency(r.amount)}</div>
                      </td>
                      <td>
                        <div className="text-xs">{formatDate(r.date)}</div>
                      </td>
                      <td className="text-right">
                        <button onClick={() => handleDelete(r.id!)} className="p-2 text-slate-600 hover:text-rose-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          {isFormOpen && (
            <section className="card animate-in fade-in slide-in-from-right-4">
              <h3 className="mb-6">Hareket İşle</h3>
              <form className="dashboard-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <label>
                    Hesap Türü
                    <select value={form.accountType} onChange={e => setForm({...form, accountType: e.target.value as any})}>
                      <option>Kasa</option>
                      <option>Banka</option>
                    </select>
                  </label>
                  <label>
                    İşlem Türü
                    <select value={form.transactionType} onChange={e => setForm({...form, transactionType: e.target.value as any})}>
                      <option>Giriş</option>
                      <option>Çıkış</option>
                    </select>
                  </label>
                </div>

                <label>
                  Hesap Adı
                  <input value={form.accountName} onChange={e => setForm({...form, accountName: e.target.value})} placeholder="Merkez Kasa / Garanti Ticari vb." required />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label>
                    Tutar
                    <input type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: Number(e.target.value)})} required />
                  </label>
                  <label>
                    Tarih
                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                  </label>
                </div>

                <label>
                  Açıklama
                  <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Tahsilat, Ödeme, Maaş vb." />
                </label>

                <button type="submit" className="button-primary w-full">Kaydet</button>
              </form>
            </section>
          )}

          <section className="card">
            <h3 className="mb-6">Hesap Özetleri</h3>
            <div className="space-y-3">
              {Object.keys(accounts).length === 0 ? (
                <div className="text-xs text-slate-500 italic">Henüz hesap özeti oluşmadı.</div>
              ) : (
                Object.entries(accounts).map(([name, data]) => (
                  <div key={name} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {data.type === 'Kasa' ? <Wallet size={14} className="text-amber-400" /> : <Landmark size={14} className="text-cyan-400" />}
                        <span className="text-xs font-black text-white">{name}</span>
                      </div>
                      <span className={`text-xs font-black ${data.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatCurrency(data.balance)}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Toplam Giriş</p>
                        <p className="text-[10px] font-bold text-emerald-400/80">{formatCurrency(data.in)}</p>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Toplam Çıkış</p>
                        <p className="text-[10px] font-bold text-rose-400/80">{formatCurrency(data.out)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
