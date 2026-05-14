import { useEffect, useState, useMemo } from 'react';
import { User } from 'firebase/auth';
import { 
  Plus, 
  Search, 
  Trash2, 
  Package, 
  Tag, 
  Layers, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Boxes,
  Barcode,
  Edit3,
  X,
  History,
  TrendingUp,
  Percent,
  Activity,
  ArrowRight,
  FileText
} from 'lucide-react';
import { addStockItem, deleteStockItem, getStockItems, StockRecord, updateStockItem } from '../services/stockService';
import { getStockMovements, StockMovementRecord } from '../services/stockMovementService';
import { Sparkles, TrendingDown } from 'lucide-react';

interface StocksProps {
  user: User | null;
}

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0);

export default function Stocks({ user }: StocksProps) {
  const [items, setItems] = useState<StockRecord[]>([]);
  const [movements, setMovements] = useState<StockMovementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<Omit<StockRecord, 'id' | 'createdAt'>>({
    name: '',
    code: '',
    barcode: '',
    category: 'Genel',
    brand: '',
    purchasePrice: 0,
    salePrice: 0,
    vatRate: 20,
    unit: 'Adet',
    quantity: 0,
    minStock: 5,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<StockRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [stockItems, moves] = await Promise.all([
        getStockItems(user.uid),
        getStockMovements(user.uid)
      ]);
      setItems(stockItems);
      setMovements(moves);
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
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateStockItem(user.uid, editingId, form);
      } else {
        await addStockItem(user.uid, form);
      }
      
      setForm({ 
        name: '', code: '', barcode: '', category: 'Genel', brand: '', 
        purchasePrice: 0, salePrice: 0, vatRate: 20, unit: 'Adet', 
        quantity: 0, minStock: 5 
      });
      setEditingId(null);
      setIsFormOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Stok kaydedilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !window.confirm('Bu stok kartını silmek istediğinize emin misiniz?')) return;
    await deleteStockItem(user.uid, id);
    if (selectedItem?.id === id) setSelectedItem(null);
    loadData();
  };

  const handleEdit = (item: StockRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setForm({
      name: item.name,
      code: item.code,
      barcode: item.barcode || '',
      category: item.category || 'Genel',
      brand: item.brand || '',
      purchasePrice: item.purchasePrice,
      salePrice: item.salePrice,
      vatRate: item.vatRate,
      unit: item.unit,
      quantity: item.quantity,
      minStock: item.minStock,
    });
    setEditingId(item.id!);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const stats = useMemo(() => {
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0);
    const lowStock = items.filter(item => item.quantity <= (item.minStock || 5)).length;
    return { totalValue, lowStock };
  }, [items]);

  if (loading) return <div className="page-section">Stok kartları yükleniyor...</div>;

  return (
    <div className="page-section">
      <div className="page-header-block">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="badge">Envanter Kontrolü</span>
            <h2 className="mt-4">Stok & Hizmet Kartları</h2>
            <p>Ürünlerinizin maliyetlerini, satış fiyatlarını ve anlık stok durumlarını yönetin.</p>
          </div>
          <button 
            onClick={() => {
              if (isFormOpen) {
                setEditingId(null);
                setForm({ 
                  name: '', code: '', barcode: '', category: 'Genel', brand: '', 
                  purchasePrice: 0, salePrice: 0, vatRate: 20, unit: 'Adet', 
                  quantity: 0, minStock: 5 
                });
              }
              setIsFormOpen(!isFormOpen);
            }} 
            className="button-primary flex items-center gap-2"
          >
            <Plus size={18} /> {isFormOpen ? 'Vazgeç' : 'Yeni Stok Kartı'}
          </button>
        </div>
      </div>

      <div className="cards-grid">
        <article className="stat-card">
          <span>Toplam Stok Değeri</span>
          <strong>{formatCurrency(stats.totalValue)}</strong>
        </article>
        <article className="stat-card">
          <span>Kritik Stok Uyarıları</span>
          <strong className={stats.lowStock > 0 ? 'text-rose-400' : 'text-emerald-400'}>
            {stats.lowStock} Ürün
          </strong>
        </article>
        <article className="stat-card">
          <span>Toplam Çeşit</span>
          <strong>{items.length} Kalem</strong>
        </article>
        <article className="stat-card">
          <span>KDV Uyumluluk</span>
          <strong className="text-cyan-400">GİB %20 / %10</strong>
        </article>
      </div>

      {isFormOpen && (
        <section className="card animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="mb-0">{editingId ? 'Stok Kartını Güncelle' : 'Ürün / Hizmet Detayları'}</h3>
            {editingId && <span className="badge badge-warning">Düzenleme Modu</span>}
          </div>
          <form className="dashboard-form" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <label>
                Ürün/Hizmet Adı
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </label>
              <label>
                Kategori
                <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <label>
                Stok Kodu
                <input value={form.code} onChange={e => setForm({...form, code: e.target.value})} required />
              </label>
              <label>
                Barkod
                <input value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} />
              </label>
              <label>
                Birim
                <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                  <option>Adet</option>
                  <option>KG</option>
                  <option>Metre</option>
                  <option>Koli</option>
                  <option>Hizmet</option>
                </select>
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <label>
                Alış Fiyatı
                <input type="number" step="0.01" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: Number(e.target.value)})} required />
              </label>
              <label>
                Satış Fiyatı
                <input type="number" step="0.01" value={form.salePrice} onChange={e => setForm({...form, salePrice: Number(e.target.value)})} required />
              </label>
              <label>
                KDV Oranı
                <select value={form.vatRate} onChange={e => setForm({...form, vatRate: Number(e.target.value)})}>
                  <option value={0}>%0</option>
                  <option value={1}>%1</option>
                  <option value={10}>%10</option>
                  <option value={20}>%20</option>
                </select>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label>
                Açılış Miktarı
                <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} required />
              </label>
              <label>
                Min. Stok Uyarısı
                <input type="number" value={form.minStock} onChange={e => setForm({...form, minStock: Number(e.target.value)})} />
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => {
                setIsFormOpen(false);
                setEditingId(null);
                setForm({ 
                  name: '', code: '', barcode: '', category: 'Genel', brand: '', 
                  purchasePrice: 0, salePrice: 0, vatRate: 20, unit: 'Adet', 
                  quantity: 0, minStock: 5 
                });
              }} className="button-secondary">İptal</button>
              <button type="submit" disabled={isSubmitting} className="button-primary px-8">
                {isSubmitting ? 'İşleniyor...' : (editingId ? 'Güncelle' : 'Stok Kartı Oluştur')}
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
              placeholder="Ürün adı veya stok kodu ara..." 
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
                <th>Ürün Bilgisi</th>
                <th>Kategori / Marka</th>
                <th>Maliyet</th>
                <th>Satış Fiyatı</th>
                <th>Stok Durumu</th>
                <th className="text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-500 font-medium">Stok kaydı bulunamadı.</td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.quantity <= (item.minStock || 5);
                  const margin = item.salePrice - item.purchasePrice;
                  const marginPercent = item.purchasePrice > 0 ? (margin / item.purchasePrice) * 100 : 0;

                  return (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedItem(item)}
                      className="group cursor-pointer"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLow ? 'bg-rose-400/10 text-rose-400' : 'bg-cyan-400/10 text-cyan-400'}`}>
                            <Package size={20} />
                          </div>
                          <div>
                            <div className="font-black text-white">{item.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{item.code}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-xs font-bold text-slate-300">{item.category}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">{item.brand || '-'}</div>
                      </td>
                      <td>
                        <div className="text-xs font-bold">{formatCurrency(item.purchasePrice)}</div>
                      </td>
                      <td>
                        <div className="text-xs font-black text-cyan-100">{formatCurrency(item.salePrice)}</div>
                        <div className="text-[10px] text-slate-500">%{item.vatRate} KDV Dahil</div>
                      </td>
                      <td>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black
                          ${isLow ? 'bg-rose-400/10 text-rose-400 border border-rose-400/20' : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'}
                        `}>
                          {isLow && <AlertTriangle size={14} />}
                          {item.quantity} {item.unit}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={(e) => handleEdit(item, e)}
                            className="p-2 text-slate-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={(e) => handleDelete(item.id!, e)}
                            className="p-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Stok Detay Paneli */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="w-full max-w-2xl h-full bg-[#07111f] border-l border-white/10 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500"
          >
            <div className="sticky top-0 z-10 bg-[#07111f]/80 backdrop-blur-md p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-200">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="mb-0 text-xl font-black">{selectedItem.name}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{selectedItem.code}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
               {/* AI Stok Öngörüsü */}
              {(() => {
                const itemMovements = movements.filter(m => 
                  m.stockCode.toLowerCase() === selectedItem.code.toLowerCase() && 
                  m.movementType === 'Çıkış'
                );
                
                if (itemMovements.length < 2) {
                  return (
                    <div className="card !bg-slate-900/50 border border-white/5 !p-5 relative overflow-hidden group opacity-60">
                      <div className="flex items-center gap-3 mb-2">
                        <Activity size={18} className="text-slate-500" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-0">AI Stok Öngörüsü</h4>
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                        Analiz için en az 2 adet "Çıkış" hareketi gereklidir. Henüz yeterli veri toplanmadı.
                      </p>
                    </div>
                  );
                }

                const totalOut = itemMovements.reduce((sum, m) => sum + m.quantity, 0);
                const sortedMoves = [...itemMovements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                const firstDate = new Date(sortedMoves[0].date);
                const lastDate = new Date();
                const daysDiff = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
                const velocity = totalOut / daysDiff;
                const daysRemaining = velocity > 0 ? Math.floor(selectedItem.quantity / velocity) : Infinity;

                return (
                  <div className="card !bg-cyan-400/5 border border-cyan-400/20 !p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <Sparkles size={80} className="text-cyan-400" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-cyan-400/20 text-cyan-200">
                        <Activity size={18} />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-cyan-100 mb-0">AI Stok Öngörüsü</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tüketim Hızı</p>
                        <p className="text-lg font-black text-white">{velocity.toFixed(2)} <span className="text-xs text-slate-400">{selectedItem.unit}/Gün</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tahmini Ömür</p>
                        <p className={`text-lg font-black ${daysRemaining <= 7 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {daysRemaining === Infinity ? 'Sınırsız' : `${daysRemaining} Gün`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                        {daysRemaining <= 7 
                          ? "🚨 Kritik Seviye! Mevcut satış hızıyla stoklar bir haftadan az sürede tükenecek. Tedarik planlaması yapılması önerilir."
                          : "✅ Stok seviyesi güvenli bölgede. Mevcut hızla önümüzdeki haftalarda kesinti beklenmiyor."}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Kârlılık Analizi */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card !bg-white/5 !p-4 border-l-4 border-l-emerald-400">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Birim Kâr</span>
                    <TrendingUp size={14} className="text-emerald-400" />
                  </div>
                  <p className="mt-2 text-xl font-black text-white">
                    {formatCurrency(selectedItem.salePrice - selectedItem.purchasePrice)}
                  </p>
                </div>
                <div className="card !bg-white/5 !p-4 border-l-4 border-l-cyan-400">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kâr Oranı</span>
                    <Percent size={14} className="text-cyan-400" />
                  </div>
                  <p className="mt-2 text-xl font-black text-white">
                    %{selectedItem.purchasePrice > 0 
                      ? ((selectedItem.salePrice - selectedItem.purchasePrice) / selectedItem.purchasePrice * 100).toFixed(1) 
                      : '0'}
                  </p>
                </div>
              </div>

              {/* Teknik Detaylar */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Barcode size={16} className="text-cyan-400" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-white mb-0">Ürün Detayları</h4>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-sm">
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Kategori</span>
                      <p className="font-bold">{selectedItem.category || 'Genel'}</p>
                    </div>
                    <div className="text-sm">
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Marka</span>
                      <p className="font-bold">{selectedItem.brand || '-'}</p>
                    </div>
                    <div className="text-sm">
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Barkod</span>
                      <p className="font-mono font-bold">{selectedItem.barcode || '-'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-sm">
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Alış Fiyatı</span>
                      <p className="font-bold">{formatCurrency(selectedItem.purchasePrice)}</p>
                    </div>
                    <div className="text-sm">
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Satış Fiyatı</span>
                      <p className="font-bold text-cyan-200">{formatCurrency(selectedItem.salePrice)}</p>
                    </div>
                    <div className="text-sm">
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Stok Miktarı</span>
                      <p className={`font-black ${selectedItem.quantity <= (selectedItem.minStock || 5) ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {selectedItem.quantity} {selectedItem.unit}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Hareket Geçmişi */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-cyan-400" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-white mb-0">Stok Hareketleri</h4>
                  </div>
                </div>
                <div className="space-y-2">
                  {movements.filter(m => m.stockCode === selectedItem.code).length === 0 ? (
                    <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl text-slate-500 text-xs font-bold">
                      Henüz hareket kaydı bulunmuyor.
                    </div>
                  ) : (
                    movements.filter(m => m.stockCode === selectedItem.code).slice(0, 5).map(m => (
                      <div key={m.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            m.movementType === 'Giriş' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'
                          }`}>
                            <Activity size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">{m.movementType}</p>
                            <p className="text-[10px] font-bold text-slate-500">{m.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-white">{m.quantity} {selectedItem.unit}</p>
                          <p className="text-[10px] font-bold text-slate-500">{m.note || '-'}</p>
                        </div>
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
