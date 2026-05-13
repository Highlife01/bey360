import { useEffect, useState, useMemo } from 'react';
import { User } from 'firebase/auth';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  User as UserIcon,
  CreditCard,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { addCustomer, deleteCustomer, getCustomers, CustomerRecord, updateCustomer } from '../services/customerService';
import { getInvoices, InvoiceRecord } from '../services/invoiceService';

interface CustomersProps {
  user: User | null;
}

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0);

export default function Customers({ user }: CustomersProps) {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<Omit<CustomerRecord, 'id' | 'createdAt'>>({
    name: '',
    type: 'Firma',
    taxId: '',
    taxOffice: '',
    phone: '',
    email: '',
    address: '',
    iban: '',
  });

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [custs, invs] = await Promise.all([
        getCustomers(user.uid),
        getInvoices(user.uid)
      ]);
      setCustomers(custs);
      setInvoices(invs);
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
    await addCustomer(user.uid, form);
    setForm({
      name: '',
      type: 'Firma',
      taxId: '',
      taxOffice: '',
      phone: '',
      email: '',
      address: '',
      iban: '',
    });
    setIsFormOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Bu cariyi silmek istediğinize emin misiniz?')) return;
    await deleteCustomer(user.uid, id);
    loadData();
  };

  const customerStats = useMemo(() => {
    const stats: Record<string, { balance: number; totalSales: number; totalPurchases: number }> = {};
    
    customers.forEach(c => {
      stats[c.id!] = { balance: 0, totalSales: 0, totalPurchases: 0 };
    });

    invoices.forEach(inv => {
      if (inv.customerId && stats[inv.customerId]) {
        if (inv.invoiceType === 'Satış' || inv.invoiceType === 'Hizmet') {
          stats[inv.customerId].totalSales += inv.grandTotal;
          if (inv.status !== 'Ödendi') stats[inv.customerId].balance += inv.grandTotal;
        } else if (inv.invoiceType === 'Alış') {
          stats[inv.customerId].totalPurchases += inv.grandTotal;
          if (inv.status !== 'Ödendi') stats[inv.customerId].balance -= inv.grandTotal;
        }
      }
    });

    return stats;
  }, [customers, invoices]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.taxId.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  if (loading) return <div className="page-section">Cariler yükleniyor...</div>;

  return (
    <div className="page-section">
      <div className="page-header-block">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="badge">Cari Hesap Yönetimi</span>
            <h2 className="mt-4">Müşteri & Tedarikçiler</h2>
            <p>İşletmenizin bütün ticari paydaşlarını, borç/alacak bakiyelerini ve iletişim bilgilerini yönetin.</p>
          </div>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)} 
            className="button-primary flex items-center gap-2"
          >
            <Plus size={18} /> {isFormOpen ? 'Vazgeç' : 'Yeni Cari Kart'}
          </button>
        </div>
      </div>

      {isFormOpen && (
        <section className="card animate-in fade-in slide-in-from-top-4">
          <h3 className="mb-6">Cari Bilgileri</h3>
          <form className="dashboard-form" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <label>
                Ünvan / Ad Soyad
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </label>
              <label>
                Cari Tipi
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
                  <option>Firma</option>
                  <option>Şahıs</option>
                </select>
              </label>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <label>
                Vergi No / TCKN
                <input value={form.taxId} onChange={e => setForm({...form, taxId: e.target.value})} />
              </label>
              <label>
                Vergi Dairesi
                <input value={form.taxOffice} onChange={e => setForm({...form, taxOffice: e.target.value})} />
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label>
                Telefon
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </label>
              <label>
                E-Posta
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </label>
            </div>

            <label>
              Adres
              <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={2} />
            </label>

            <label>
              IBAN
              <input value={form.iban} onChange={e => setForm({...form, iban: e.target.value})} placeholder="TR00..." />
            </label>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="button-secondary">İptal</button>
              <button type="submit" className="button-primary px-8">Kaydet</button>
            </div>
          </form>
        </section>
      )}

      <section className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Cari adı, VKN veya telefon ara..." 
              className="pl-10 pr-4 py-3 w-full bg-white/5 border border-white/10 rounded-xl text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-bold">
              <div className="w-3 h-3 bg-emerald-400 rounded-full" /> 
              <span className="text-slate-400">Alacaklı</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <div className="w-3 h-3 bg-rose-400 rounded-full" /> 
              <span className="text-slate-400">Borçlu</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="text-slate-500 font-bold mb-2">Cari kayıt bulunamadı.</div>
              <button onClick={() => setIsFormOpen(true)} className="text-cyan-400 font-black text-xs uppercase tracking-widest hover:underline">İlk cariyi ekle</button>
            </div>
          ) : (
            filteredCustomers.map((c) => {
              const stat = customerStats[c.id!] || { balance: 0, totalSales: 0, totalPurchases: 0 };
              const isReceivable = stat.balance > 0;
              const isPayable = stat.balance < 0;

              return (
                <div key={c.id} className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-cyan-300/30 hover:bg-cyan-300/5">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-200 shadow-xl group-hover:scale-110 transition-transform">
                        {c.type === 'Firma' ? <Building2 size={24} /> : <UserIcon size={24} />}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white leading-tight mb-1 truncate max-w-[160px]">{c.name}</h4>
                        <span className="badge text-[8px] py-0.5">{c.type}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(c.id!)}
                      className="p-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <Phone size={14} className="text-slate-600" /> {c.phone || '-'}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <Mail size={14} className="text-slate-600" /> {c.email || '-'}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <MapPin size={14} className="text-slate-600" /> {c.address || '-'}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/5 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Bakiye</p>
                      <p className={`text-lg font-black ${isReceivable ? 'text-emerald-400' : isPayable ? 'text-rose-400' : 'text-white'}`}>
                        {formatCurrency(Math.abs(stat.balance))}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {isReceivable && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                          <TrendingUp size={10} /> ALACAKLI
                        </span>
                      )}
                      {isPayable && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md">
                          <TrendingDown size={10} /> BORÇLU
                        </span>
                      )}
                      {!isReceivable && !isPayable && (
                        <span className="text-[10px] font-black text-slate-500 bg-white/5 px-2 py-1 rounded-md">
                          MUTABIK
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
