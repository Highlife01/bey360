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
  Barcode
} from 'lucide-react';
import { addStockItem, deleteStockItem, getStockItems, StockRecord } from '../services/stockService';
import { getStockMovements, StockMovementRecord } from '../services/stockMovementService';

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
    if (!user) return;
    await addStockItem(user.uid, form);
    setForm({ 
      name: '', code: '', barcode: '', category: 'Genel', brand: '', 
      purchasePrice: 0, salePrice: 0, vatRate: 20, unit: 'Adet', 
      quantity: 0, minStock: 5 
    });
    setIsFormOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Bu stok kartını silmek istediğinize emin misiniz?')) return;
    await deleteStockItem(user.uid, id);
    loadData();
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
            onClick={() => setIsFormOpen(!isFormOpen)} 
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
        <section className="card">
          <h3 className="mb-6">Ürün / Hizmet Detayları</h3>
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
              <button type="button" onClick={() => setIsFormOpen(false)} className="button-secondary">İptal</button>
              <button type="submit" className="button-primary px-8">Stok Kartı Oluştur</button>
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
                  return (
                    <tr key={item.id} className="group">
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
                        <button onClick={() => handleDelete(item.id!)} className="p-2 text-slate-600 hover:text-rose-400 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
