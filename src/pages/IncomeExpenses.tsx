import { useEffect, useState, useMemo } from 'react';
import { User } from 'firebase/auth';
import { 
  Plus, 
  Search, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  FileDown,
  Edit3,
  Target,
  BarChart4
} from 'lucide-react';
import { addFinanceRecord, deleteFinanceRecord, getFinanceRecords, FinanceRecord, updateFinanceRecord } from '../services/financeService';
import { exportToExcel } from '../services/excelService';

interface IncomeExpensesProps {
  user: User | null;
}

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0);

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
};

export default function IncomeExpenses({ user }: IncomeExpensesProps) {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<Omit<FinanceRecord, 'id' | 'createdAt'>>({
    type: 'Gider',
    category: 'Genel',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getFinanceRecords(user.uid);
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
    
    if (editingId) {
      await updateFinanceRecord(user.uid, editingId, form);
    } else {
      await addFinanceRecord(user.uid, form);
    }
    
    setForm({ 
      type: 'Gider', category: 'Genel', 
      amount: 0, date: new Date().toISOString().slice(0, 10), note: '' 
    });
    setEditingId(null);
    setIsFormOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    await deleteFinanceRecord(user.uid, id);
    loadData();
  };

  const handleEdit = (record: FinanceRecord) => {
    setForm({
      type: record.type,
      category: record.category,
      amount: record.amount,
      date: record.date,
      note: record.note,
    });
    setEditingId(record.id!);
    setIsFormOpen(true);
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.note.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  const stats = useMemo(() => {
    const totalIncome = records.filter(r => r.type === 'Gelir').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter(r => r.type === 'Gider').reduce((sum, r) => sum + r.amount, 0);
    const categoryBreakdown: Record<string, number> = {};
    
    records.forEach(r => {
      categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + (r.type === 'Gider' ? r.amount : -r.amount);
    });

    return { totalIncome, totalExpense, categoryBreakdown };
  }, [records]);

  const handleExport = () => {
    exportToExcel(
      filteredRecords.map(r => ({
        'Tür': r.type,
        'Kategori': r.category,
        'Tutar': r.amount,
        'Tarih': r.date,
        'Not': r.note
      })),
      'bey360-gelir-gider'
    );
  };

  if (loading) return <div className="page-section">Veriler yükleniyor...</div>;

  return (
    <div className="page-section">
      <div className="page-header-block">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="badge">Mali Operasyonlar</span>
            <h2 className="mt-4">Gelir & Gider Yönetimi</h2>
            <p>Operasyonel harcamalarınızı ve yan gelirlerinizi kategori bazında takip ederek karlılığınızı analiz edin.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport} className="button-secondary flex items-center gap-2">
              <FileDown size={18} /> Excel İndir
            </button>
            <button 
              onClick={() => {
                if (isFormOpen) {
                  setEditingId(null);
                  setForm({ type: 'Gider', category: 'Genel', amount: 0, date: new Date().toISOString().slice(0, 10), note: '' });
                }
                setIsFormOpen(!isFormOpen);
              }} 
              className="button-primary flex items-center gap-2"
            >
              <Plus size={18} /> {isFormOpen ? 'Vazgeç' : 'Yeni Kayıt'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <article className="stat-card">
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <TrendingUp size={20} />
            <span>Toplam Gelir</span>
          </div>
          <strong>{formatCurrency(stats.totalIncome)}</strong>
        </article>
        <article className="stat-card">
          <div className="flex items-center gap-3 mb-4 text-rose-400">
            <TrendingDown size={20} />
            <span>Toplam Gider</span>
          </div>
          <strong>{formatCurrency(stats.totalExpense)}</strong>
        </article>
        <article className="stat-card">
          <div className="flex items-center gap-3 mb-4 text-cyan-400">
            <PieChart size={20} />
            <span>Net Operasyonel Durum</span>
          </div>
          <strong className={stats.totalIncome - stats.totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            {formatCurrency(stats.totalIncome - stats.totalExpense)}
          </strong>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <div className="space-y-6">
          {isFormOpen && (
            <section className="card animate-in fade-in slide-in-from-left-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="mb-0">{editingId ? 'Kaydı Güncelle' : 'Kayıt Ekle'}</h3>
                {editingId && <span className="badge badge-warning">Düzenleme</span>}
              </div>
              <form className="dashboard-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <label>
                    İşlem Türü
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
                      <option>Gider</option>
                      <option>Gelir</option>
                    </select>
                  </label>
                  <label>
                    Kategori
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      <option>Genel</option>
                      <option>Personel / Maaş</option>
                      <option>Kira / Aidat</option>
                      <option>Yakıt / Ulaşım</option>
                      <option>Reklam / Pazarlama</option>
                      <option>Vergi / Harç</option>
                      <option>Ofis Gideri</option>
                      <option>Yemek / Mutfak</option>
                      <option>Yazılım / Abonelik</option>
                      <option>Diğer</option>
                    </select>
                  </label>
                </div>

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
                  <input value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="İşlem detayı..." required />
                </label>

                <button type="submit" className="button-primary w-full">
                  {editingId ? 'Güncelle' : 'Kaydet'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingId(null);
                      setIsFormOpen(false);
                      setForm({ type: 'Gider', category: 'Genel', amount: 0, date: new Date().toISOString().slice(0, 10), note: '' });
                    }} 
                    className="button-secondary w-full"
                  >
                    Vazgeç
                  </button>
                )}
              </form>
            </section>
          )}

          <section className="card">
            <h3 className="mb-6">Kategori Dağılımı</h3>
            <div className="space-y-4">
              {Object.entries(stats.categoryBreakdown).length === 0 ? (
                <div className="text-xs text-slate-500 italic">Veri bulunmuyor.</div>
              ) : (
                Object.entries(stats.categoryBreakdown).map(([cat, amount]) => {
                  const percentage = Math.min(100, Math.max(0, (Math.abs(amount) / Math.max(stats.totalExpense, stats.totalIncome)) * 100));
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400">{cat}</span>
                        <span className={amount > 0 ? 'text-rose-400' : 'text-emerald-400'}>{formatCurrency(Math.abs(amount))}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${amount > 0 ? 'bg-rose-400' : 'bg-emerald-400'}`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <section className="card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="mb-0">İşlem Geçmişi</h3>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Kategori veya açıklama ara..." 
                className="pl-10 pr-4 py-3 w-full bg-white/5 border border-white/10 rounded-xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Tür / Kategori</th>
                  <th>Açıklama</th>
                  <th>Tutar</th>
                  <th>Tarih</th>
                  <th className="text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-slate-500 font-medium">Kayıt bulunamadı.</td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="group">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center 
                            ${r.type === 'Gelir' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'}
                          `}>
                            {r.type === 'Gelir' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <div>
                            <div className="font-bold text-white">{r.category}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{r.type}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-xs text-slate-300 max-w-[250px] truncate">{r.note}</div>
                      </td>
                      <td>
                        <div className={`font-black ${r.type === 'Gelir' ? 'text-emerald-400' : 'text-white'}`}>
                          {formatCurrency(r.amount)}
                        </div>
                      </td>
                      <td>
                        <div className="text-xs">{formatDate(r.date)}</div>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => handleEdit(r)}
                            className="p-2 text-slate-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(r.id!)} className="p-2 text-slate-600 hover:text-rose-400 transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
