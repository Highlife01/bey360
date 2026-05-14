import { useEffect, useState, useMemo } from 'react';
import { User } from 'firebase/auth';
import { 
  Plus, 
  Search, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Package, 
  Calendar,
  History,
  TrendingUp,
  TrendingDown,
  FileDown
} from 'lucide-react';
import { addStockMovement, getStockMovements, StockMovementRecord } from '../services/stockMovementService';
import { getStockItems, StockRecord, updateStockItem } from '../services/stockService';
import { exportToExcel } from '../services/excelService';
import { logAction } from '../services/logService';

interface StockMovementsProps {
  user: User | null;
}

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
};

export default function StockMovements({ user }: StockMovementsProps) {
  const [movements, setMovements] = useState<StockMovementRecord[]>([]);
  const [stockItems, setStockItems] = useState<StockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<Omit<StockMovementRecord, 'id' | 'createdAt'>>({
    stockCode: '',
    stockName: '',
    movementType: 'Giriş',
    quantity: 0,
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [moves, items] = await Promise.all([
        getStockMovements(user.uid),
        getStockItems(user.uid)
      ]);
      setMovements(moves);
      setStockItems(items);
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
    
    // Find the stock item to update quantity
    const item = stockItems.find(i => i.code === form.stockCode);
    if (item && item.id) {
      const newQuantity = form.movementType === 'Giriş' 
        ? item.quantity + form.quantity 
        : item.quantity - form.quantity;
      
      await updateStockItem(user.uid, item.id, { quantity: newQuantity });
    }

    await addStockMovement(user.uid, form);
    await logAction(user.uid, 'Stok Hareketi', 'Stoklar', `${form.movementType}: ${form.quantity} ${form.stockName}`);
    
    setForm({ 
      stockCode: '', stockName: '', movementType: 'Giriş', 
      quantity: 0, date: new Date().toISOString().slice(0, 10), note: '' 
    });
    setIsFormOpen(false);
    await loadData();
  };

  const filteredMovements = useMemo(() => {
    return movements.filter(m => 
      m.stockName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.stockCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movements, searchTerm]);

  const handleExport = () => {
    exportToExcel(
      filteredMovements.map(m => ({
        'Ürün Adı': m.stockName,
        'Stok Kodu': m.stockCode,
        'Tür': m.movementType,
        'Miktar': m.quantity,
        'Tarih': m.date,
        'Not': m.note || ''
      })),
      'bey360-stok-hareketleri'
    );
  };

  if (loading) return <div className="page-section">Hareketler yükleniyor...</div>;

  return (
    <div className="page-section">
      <div className="page-header-block">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="badge">Depo Kayıtları</span>
            <h2 className="mt-4">Stok Hareketleri</h2>
            <p>Giriş ve çıkış hareketlerini manuel işleyin; depo dengenizi güncel tutun.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport} className="button-secondary flex items-center gap-2">
              <FileDown size={18} /> Excel İndir
            </button>
            <button 
              onClick={() => setIsFormOpen(!isFormOpen)} 
              className="button-primary flex items-center gap-2"
            >
              <Plus size={18} /> {isFormOpen ? 'Vazgeç' : 'Hareket İşle'}
            </button>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <section className="card">
          <h3 className="mb-6">Yeni Hareket Kaydı</h3>
          <form className="dashboard-form" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <label>
                Ürün Seçimi
                <select 
                  value={form.stockCode} 
                  onChange={(e) => {
                    const item = stockItems.find(i => i.code === e.target.value);
                    setForm({...form, stockCode: e.target.value, stockName: item?.name || ''});
                  }}
                  required
                >
                  <option value="">Ürün Seçin...</option>
                  {stockItems.map(item => (
                    <option key={item.id} value={item.code}>{item.name} ({item.code})</option>
                  ))}
                </select>
              </label>
              <label>
                Hareket Türü
                <select value={form.movementType} onChange={e => setForm({...form, movementType: e.target.value as any})}>
                  <option>Giriş</option>
                  <option>Çıkış</option>
                </select>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label>
                Miktar
                <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} required />
              </label>
              <label>
                Tarih
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
              </label>
            </div>

            <label>
              Açıklama / Not
              <input value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Sevkiyat No, Tedarikçi vb." />
            </label>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="button-secondary">İptal</button>
              <button type="submit" className="button-primary px-8">Hareketi Kaydet</button>
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
              placeholder="Ürün adı veya kod ile ara..." 
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
                <th>Ürün</th>
                <th>Tür</th>
                <th>Miktar</th>
                <th>Tarih</th>
                <th>Not</th>
                <th className="text-right">Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-500 font-medium">Hareket kaydı bulunamadı.</td>
                </tr>
              ) : (
                filteredMovements.map((move) => (
                  <tr key={move.id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                          <Package size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-white">{move.stockName}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-widest">{move.stockCode}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest
                        ${move.movementType === 'Giriş' ? 'text-emerald-400' : 'text-rose-400'}
                      `}>
                        {move.movementType === 'Giriş' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        {move.movementType}
                      </span>
                    </td>
                    <td>
                      <div className="font-black text-white">{move.quantity} Adet</div>
                    </td>
                    <td>
                      <div className="text-xs">{formatDate(move.date)}</div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-400 max-w-[200px] truncate">{move.note || '-'}</div>
                    </td>
                    <td className="text-right">
                      <span className="badge badge-success">Tamamlandı</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
