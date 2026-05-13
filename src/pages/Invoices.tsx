import { useEffect, useState, useMemo } from 'react';
import { User } from 'firebase/auth';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Download, 
  FileText, 
  ChevronDown, 
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  FileDown,
  Camera,
  RefreshCw
} from 'lucide-react';
import { addInvoice, deleteInvoice, getInvoices, InvoiceRecord, updateInvoice } from '../services/invoiceService';
import { getCustomers, CustomerRecord } from '../services/customerService';
import { exportToExcel } from '../services/excelService';
import { generateInvoicePDF } from '../services/pdfService';
import { getUserProfile } from '../services/userService';

interface InvoicesProps {
  user: User | null;
}

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0);

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
};

export default function Invoices({ user }: InvoicesProps) {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Hepsi');
  const [form, setForm] = useState<Omit<InvoiceRecord, 'id' | 'createdAt'>>({
    customerName: '',
    customerId: '',
    invoiceType: 'Satış',
    invoiceNumber: '',
    amount: 0,
    vatRate: 20,
    vatAmount: 0,
    grandTotal: 0,
    currency: 'TRY',
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    status: 'Beklemede',
    note: '',
  });
  const [scanning, setScanning] = useState(false);

  const handleMockScan = () => {
    setScanning(true);
    setTimeout(() => {
      setForm(prev => ({
        ...prev,
        invoiceNumber: `SCAN-${Math.floor(Math.random() * 9000) + 1000}`,
        amount: 1250.00,
        note: 'OCR ile otomatik tarandı.'
      }));
      setScanning(false);
      alert('Fatura başarıyla tarandı ve veriler dolduruldu!');
    }, 2000);
  };

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [invs, custs] = await Promise.all([
        getInvoices(user.uid),
        getCustomers(user.uid)
      ]);
      setInvoices(invs);
      setCustomers(custs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Automatic calculation
  useEffect(() => {
    const vat = (form.amount * form.vatRate) / 100;
    setForm(prev => ({
      ...prev,
      vatAmount: vat,
      grandTotal: prev.amount + vat
    }));
  }, [form.amount, form.vatRate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    await addInvoice(user.uid, form);
    setForm({
      customerName: '',
      customerId: '',
      invoiceType: 'Satış',
      invoiceNumber: '',
      amount: 0,
      vatRate: 20,
      vatAmount: 0,
      grandTotal: 0,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: '',
      status: 'Beklemede',
      note: '',
    });
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Bu faturayı silmek istediğinize emin misiniz?')) return;
    await deleteInvoice(user.uid, id);
    loadData();
  };

  const handleStatusUpdate = async (id: string, status: InvoiceRecord['status']) => {
    if (!user) return;
    await updateInvoice(user.uid, id, { status });
    loadData();
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'Hepsi' || inv.invoiceType === filterType;
      return matchesSearch && matchesType;
    });
  }, [invoices, searchTerm, filterType]);

  const stats = useMemo(() => {
    const total = filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const paid = filteredInvoices.filter(inv => inv.status === 'Ödendi').reduce((sum, inv) => sum + inv.grandTotal, 0);
    const pending = filteredInvoices.filter(inv => inv.status === 'Beklemede').reduce((sum, inv) => sum + inv.grandTotal, 0);
    return { total, paid, pending };
  }, [filteredInvoices]);

  const handleExport = () => {
    exportToExcel(
      filteredInvoices.map(inv => ({
        'Fatura No': inv.invoiceNumber,
        'Cari': inv.customerName,
        'Tür': inv.invoiceType,
        'Tarih': inv.issueDate,
        'Vade': inv.dueDate,
        'Tutar': inv.amount,
        'KDV Oranı': `%${inv.vatRate}`,
        'KDV Tutarı': inv.vatAmount,
        'Genel Toplam': inv.grandTotal,
        'Durum': inv.status
      })),
      'bey360-faturalar'
    );
  };

  const handleDownloadPDF = async (inv: InvoiceRecord) => {
    if (!user) return;
    const profile = await getUserProfile(user.uid);
    await generateInvoicePDF({
      ...inv,
      subtotal: inv.amount
    }, profile || {});
  };

  if (loading) return <div className="page-section">Faturalar yükleniyor...</div>;

  return (
    <div className="page-section">
      <div className="page-header-block">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="badge">Satış & Satın Alma</span>
            <h2 className="mt-4">Fatura Yönetimi</h2>
            <p>Bütün faturalarınızı, vadelerinizi ve ödeme durumlarını tek panelden izleyin.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport} className="button-secondary flex items-center gap-2">
              <FileDown size={18} /> Excel İndir
            </button>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        <article className="stat-card">
          <span>Toplam Hacim</span>
          <strong>{formatCurrency(stats.total)}</strong>
        </article>
        <article className="stat-card">
          <span className="text-emerald-400">Tahsil Edilen</span>
          <strong className="text-emerald-400">{formatCurrency(stats.paid)}</strong>
        </article>
        <article className="stat-card">
          <span className="text-amber-400">Bekleyen</span>
          <strong className="text-amber-400">{formatCurrency(stats.pending)}</strong>
        </article>
        <article className="stat-card">
          <span className="text-cyan-400">Belge Sayısı</span>
          <strong className="text-cyan-400">{filteredInvoices.length} Adet</strong>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <section className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Plus className="text-cyan-300" size={18} />
              <h3 className="mb-0">Yeni Fatura</h3>
            </div>
            <button 
              onClick={handleMockScan}
              disabled={scanning}
              className="text-[10px] font-black uppercase tracking-widest bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-3 py-1.5 rounded-lg hover:bg-cyan-400/20 transition-all flex items-center gap-2"
            >
              {scanning ? <RefreshCw className="animate-spin" size={12} /> : <Camera size={12} />}
              {scanning ? 'Taranıyor...' : 'OCR Tara'}
            </button>
          </div>
          <form className="dashboard-form" onSubmit={handleSubmit}>
            <label>
              Cari Seçimi
              <select 
                value={form.customerId} 
                onChange={(e) => {
                  const cust = customers.find(c => c.id === e.target.value);
                  setForm({...form, customerId: e.target.value, customerName: cust?.name || ''});
                }}
                required
              >
                <option value="">Cari Seçin...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label>
                Fatura Türü
                <select value={form.invoiceType} onChange={(e) => setForm({...form, invoiceType: e.target.value as any})}>
                  <option>Satış</option>
                  <option>Alış</option>
                  <option>Proforma</option>
                  <option>İade</option>
                </select>
              </label>
              <label>
                Fatura No
                <input value={form.invoiceNumber} onChange={(e) => setForm({...form, invoiceNumber: e.target.value})} placeholder="FAT2026001" required />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label>
                Tarih
                <input type="date" value={form.issueDate} onChange={(e) => setForm({...form, issueDate: e.target.value})} required />
              </label>
              <label>
                Vade
                <input type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} required />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label>
                Ara Toplam
                <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({...form, amount: Number(e.target.value)})} required />
              </label>
              <label>
                KDV Oranı
                <select value={form.vatRate} onChange={(e) => setForm({...form, vatRate: Number(e.target.value)})}>
                  <option value={0}>%0</option>
                  <option value={1}>%1</option>
                  <option value={10}>%10</option>
                  <option value={20}>%20</option>
                </select>
              </label>
              <label>
                Para Birimi
                <select value={(form as any).currency} onChange={(e) => setForm({...form, currency: e.target.value} as any)}>
                  <option>TRY</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </label>
            </div>

            <div className="bg-cyan-300/5 border border-cyan-300/10 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>KDV Tutarı</span>
                <span>{formatCurrency(form.vatAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/5">
                <span>Genel Toplam</span>
                <span className="text-cyan-200">{formatCurrency(form.grandTotal)}</span>
              </div>
            </div>

            <label>
              Notlar
              <textarea value={form.note} onChange={(e) => setForm({...form, note: e.target.value})} rows={2} />
            </label>

            <button type="submit" className="button-primary w-full">Faturayı Kaydet</button>
          </form>
        </section>

        <section className="card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="mb-0">Fatura Listesi</h3>
            <div className="flex flex-1 max-w-md gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Fatura no veya cari ara..." 
                  className="pl-10 pr-4 py-2 w-full bg-white/5 border border-white/10 rounded-lg text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="bg-white/5 border border-white/10 rounded-lg text-xs px-3"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option>Hepsi</option>
                <option>Satış</option>
                <option>Alış</option>
                <option>İade</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>No / Tür</th>
                  <th>Cari</th>
                  <th>Vade</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                  <th className="text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500 font-medium">Fatura bulunamadı.</td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <div className="font-black text-white">{inv.invoiceNumber}</div>
                        <div className="text-[10px] uppercase text-slate-500 tracking-widest">{inv.invoiceType}</div>
                      </td>
                      <td>
                        <div className="font-bold">{inv.customerName}</div>
                      </td>
                      <td>
                        <div className="text-xs">{formatDate(inv.dueDate)}</div>
                      </td>
                      <td>
                        <div className="font-black text-cyan-100">{formatCurrency(inv.grandTotal)}</div>
                        <div className="text-[10px] text-slate-500">Matrah: {formatCurrency(inv.amount)}</div>
                      </td>
                      <td>
                        <select 
                          value={inv.status} 
                          onChange={(e) => handleStatusUpdate(inv.id!, e.target.value as any)}
                          className={`text-[10px] font-black uppercase tracking-widest rounded-md px-2 py-1 border-none cursor-pointer
                            ${inv.status === 'Ödendi' ? 'bg-emerald-400/10 text-emerald-400' : 
                              inv.status === 'Onaylandı' ? 'bg-cyan-400/10 text-cyan-400' : 
                              inv.status === 'Reddedildi' ? 'bg-rose-400/10 text-rose-400' : 'bg-amber-400/10 text-amber-400'}
                          `}
                        >
                          <option>Beklemede</option>
                          <option>Onaylandı</option>
                          <option>Ödendi</option>
                          <option>Reddedildi</option>
                        </select>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleDownloadPDF(inv)} 
                            className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"
                            title="PDF Olarak İndir"
                          >
                            <FileDown size={16} />
                          </button>
                          <button onClick={() => handleDelete(inv.id!)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                            <Trash2 size={16} />
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
