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
  TrendingDown,
  X,
  History,
  Activity,
  ArrowRight,
  FileText
} from 'lucide-react';
import { getCustomers, CustomerRecord, updateCustomer, deleteCustomer, addCustomer } from '../services/customerService';
import { getInvoices, InvoiceRecord } from '../services/invoiceService';
import { sendWhatsAppReminder } from '../utils/whatsapp';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

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

    if (editingId) {
      await updateCustomer(user.uid, editingId, form);
    } else {
      await addCustomer(user.uid, form);
    }
    
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
    setEditingId(null);
    setIsFormOpen(false);
    loadData();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !window.confirm('Bu cariyi silmek istediğinize emin misiniz?')) return;
    await deleteCustomer(user.uid, id);
    if (selectedCustomer?.id === id) setSelectedCustomer(null);
    loadData();
  };

  const handleEdit = (customer: CustomerRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setForm({
      name: customer.name,
      type: customer.type,
      taxId: customer.taxId,
      taxOffice: customer.taxOffice,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      iban: customer.iban,
    });
    setEditingId(customer.id!);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onClick={() => {
              if (isFormOpen) {
                setEditingId(null);
                setForm({
                  name: '', type: 'Firma', taxId: '', taxOffice: '',
                  phone: '', email: '', address: '', iban: ''
                });
              }
              setIsFormOpen(!isFormOpen);
            }} 
            className="button-primary flex items-center gap-2"
          >
            <Plus size={18} /> {isFormOpen ? 'Vazgeç' : 'Yeni Cari Kart'}
          </button>
        </div>
      </div>

      {isFormOpen && (
        <section className="card animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="mb-0">{editingId ? 'Cari Bilgilerini Güncelle' : 'Cari Bilgileri'}</h3>
            {editingId && <span className="badge badge-warning">Düzenleme Modu</span>}
          </div>
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
              <button type="button" onClick={() => {
                setIsFormOpen(false);
                setEditingId(null);
                setForm({
                  name: '', type: 'Firma', taxId: '', taxOffice: '',
                  phone: '', email: '', address: '', iban: ''
                });
              }} className="button-secondary">İptal</button>
              <button type="submit" className="button-primary px-8">
                {editingId ? 'Güncelle' : 'Kaydet'}
              </button>
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
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCustomer(c)}
                  className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-cyan-300/30 hover:bg-cyan-300/5 cursor-pointer"
                >
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
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => handleDelete(c.id!, e)}
                        className="p-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      {c.phone && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            sendWhatsAppReminder(c.name, c.phone, customerStats[c.id!]?.balance || 0);
                          }}
                          className="p-2 text-slate-600 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                        </button>
                      )}
                    </div>
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

      {/* Cari Detay Paneli */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="w-full max-w-2xl h-full bg-[#07111f] border-l border-white/10 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500"
          >
            <div className="sticky top-0 z-10 bg-[#07111f]/80 backdrop-blur-md p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-200">
                  {selectedCustomer.type === 'Firma' ? <Building2 size={24} /> : <UserIcon size={24} />}
                </div>
                <div>
                  <h3 className="mb-0 text-xl font-black">{selectedCustomer.name}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{selectedCustomer.type}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Özet Kartları */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card !bg-white/5 !p-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Toplam Satış</span>
                  <p className="mt-2 text-xl font-black text-emerald-400">
                    {formatCurrency(customerStats[selectedCustomer.id!]?.totalSales || 0)}
                  </p>
                </div>
                <div className="card !bg-white/5 !p-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Güncel Bakiye</span>
                  <p className={`mt-2 text-xl font-black ${
                    (customerStats[selectedCustomer.id!]?.balance || 0) > 0 ? 'text-emerald-400' : 
                    (customerStats[selectedCustomer.id!]?.balance || 0) < 0 ? 'text-rose-400' : 'text-white'
                  }`}>
                    {formatCurrency(Math.abs(customerStats[selectedCustomer.id!]?.balance || 0))}
                  </p>
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={16} className="text-cyan-400" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-white mb-0">İletişim & Vergi</h4>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <Phone size={16} className="text-slate-600" /> {selectedCustomer.phone || 'Belirtilmedi'}
                      {selectedCustomer.phone && (
                        <button 
                          onClick={() => sendWhatsAppReminder(selectedCustomer.name, selectedCustomer.phone, customerStats[selectedCustomer.id!]?.balance || 0)}
                          className="ml-2 text-emerald-400 hover:text-emerald-300 text-[10px] font-black uppercase tracking-widest"
                        >
                          HATIRLATMA GÖNDER
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <Mail size={16} className="text-slate-600" /> {selectedCustomer.email || 'Belirtilmedi'}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <MapPin size={16} className="text-slate-600" /> {selectedCustomer.address || 'Belirtilmedi'}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-sm">
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Vergi Dairesi / No</span>
                      <p className="font-bold">{selectedCustomer.taxOffice || '-'} / {selectedCustomer.taxId || '-'}</p>
                    </div>
                    <div className="text-sm">
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">IBAN</span>
                      <p className="font-mono text-xs font-bold">{selectedCustomer.iban || 'Belirtilmedi'}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Son İşlemler */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-cyan-400" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-white mb-0">Son İşlemler</h4>
                  </div>
                  <button className="text-[10px] font-black text-cyan-400 hover:underline">TÜMÜNÜ GÖR</button>
                </div>
                <div className="space-y-2">
                  {invoices.filter(inv => inv.customerId === selectedCustomer.id).slice(0, 5).length === 0 ? (
                    <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl text-slate-500 text-xs font-bold">
                      Henüz işlem kaydı bulunmuyor.
                    </div>
                  ) : (
                    invoices.filter(inv => inv.customerId === selectedCustomer.id).slice(0, 5).map(inv => (
                      <div key={inv.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            inv.invoiceType === 'Satış' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'
                          }`}>
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">{inv.invoiceNumber}</p>
                            <p className="text-[10px] font-bold text-slate-500">{inv.issueDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-white">{formatCurrency(inv.grandTotal)}</p>
                          <p className={`text-[10px] font-black ${
                            inv.status === 'Ödendi' ? 'text-emerald-400' : 'text-amber-400'
                          }`}>{inv.status}</p>
                        </div>
                        <ArrowRight size={14} className="ml-2 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
