import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { getInvoices } from '../services/invoiceService';
import { getFinanceRecords } from '../services/financeService';
import { getCashBankRecords } from '../services/cashBankService';
import { getStockItems } from '../services/stockService';
import { exportToExcel } from '../services/excelService';
import DashboardCharts from '../components/DashboardCharts';

interface ReportsProps {
  user: User | null;
}

interface ReportSummary {
  totalSales: number;
  totalPurchases: number;
  totalExpense: number;
  totalIncome: number;
  netProfit: number;
  cashTotal: number;
  bankTotal: number;
  stockCount: number;
  lowStock: number;
  vatTotal: number;
}

const emptySummary: ReportSummary = {
  totalSales: 0,
  totalPurchases: 0,
  totalExpense: 0,
  totalIncome: 0,
  netProfit: 0,
  cashTotal: 0,
  bankTotal: 0,
  stockCount: 0,
  lowStock: 0,
  vatTotal: 0,
};

const formatCurrency = (value: number) => `₺${value.toLocaleString('tr-TR')}`;

export default function Reports({ user }: ReportsProps) {
  const [summary, setSummary] = useState<ReportSummary>(emptySummary);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [finance, setFinance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');

  const fetchSummary = async () => {
    if (!user) return;
    setLoading(true);
    const [invList, finList, cashBank, stocks] = await Promise.all([
      getInvoices(user.uid),
      getFinanceRecords(user.uid),
      getCashBankRecords(user.uid),
      getStockItems(user.uid),
    ]);

    setInvoices(invList);
    setFinance(finList);

    const inRange = (date: string) => {
      if (!date) return false;
      if (rangeStart && date < rangeStart) return false;
      if (rangeEnd && date > rangeEnd) return false;
      return true;
    };

    const totalSales = invList
      .filter((inv) => (inv.invoiceType === 'Satış' || inv.invoiceType === 'Hizmet') && (!rangeStart || inRange(inv.dueDate)))
      .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

    const totalPurchases = invList
      .filter((inv) => inv.invoiceType === 'Alış' && (!rangeStart || inRange(inv.dueDate)))
      .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

    const totalExpense = finList
      .filter((f) => f.type === 'Gider' && (!rangeStart || inRange(f.date)))
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    const totalIncome = finList
      .filter((f) => f.type === 'Gelir' && (!rangeStart || inRange(f.date)))
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    const cashTotal = cashBank
      .filter((c) => c.accountType === 'Kasa')
      .reduce((sum, c) => sum + (c.transactionType === 'Giriş' ? c.amount : -c.amount), 0);

    const bankTotal = cashBank
      .filter((c) => c.accountType === 'Banka')
      .reduce((sum, c) => sum + (c.transactionType === 'Giriş' ? c.amount : -c.amount), 0);

    const stockCount = stocks.reduce((sum, s) => sum + (s.quantity || 0), 0);
    const lowStock = stocks.filter((s) => s.quantity <= (s.minStock || 5)).length;
    
    const vatTotal = invoices
      .filter((inv) => (!rangeStart || inRange(inv.dueDate)))
      .reduce((sum, inv) => sum + (inv.vatAmount || 0), 0);

    setSummary({
      totalSales,
      totalPurchases,
      totalExpense,
      totalIncome,
      netProfit: totalIncome + totalSales - totalExpense - totalPurchases,
      cashTotal,
      bankTotal,
      stockCount,
      lowStock,
      vatTotal,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [user, rangeStart, rangeEnd]);

  const handleExport = () => {
    exportToExcel(
      [
        { Rapor: 'Toplam Satış', Tutar: summary.totalSales },
        { Rapor: 'Toplam Alış', Tutar: summary.totalPurchases },
        { Rapor: 'Toplam Gelir', Tutar: summary.totalIncome },
        { Rapor: 'Toplam Gider', Tutar: summary.totalExpense },
        { Rapor: 'Net Kâr', Tutar: summary.netProfit },
        { Rapor: 'Kasa', Tutar: summary.cashTotal },
        { Rapor: 'Banka', Tutar: summary.bankTotal },
        { Rapor: 'Stok Adet', Tutar: summary.stockCount },
        { Rapor: 'Düşük Stok', Tutar: summary.lowStock },
        { Rapor: 'Tahmini KDV', Tutar: summary.vatTotal },
      ],
      'bey360-rapor'
    );
  };

  if (loading) return <div className="page shell">Raporlar yükleniyor...</div>;

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Toplam Satış', value: formatCurrency(summary.totalSales) },
    { label: 'Toplam Alış', value: formatCurrency(summary.totalPurchases) },
    { label: 'Toplam Gelir', value: formatCurrency(summary.totalIncome) },
    { label: 'Toplam Gider', value: formatCurrency(summary.totalExpense) },
    { label: 'Net Kâr / Zarar', value: formatCurrency(summary.netProfit) },
    { label: 'Kasa Bakiyesi', value: formatCurrency(summary.cashTotal) },
    { label: 'Banka Bakiyesi', value: formatCurrency(summary.bankTotal) },
    { label: 'Toplam Stok Adedi', value: summary.stockCount.toString() },
    { label: 'Düşük Stok Ürünleri', value: summary.lowStock.toString() },
    { label: 'Tahmini KDV', value: formatCurrency(summary.vatTotal) },
  ];

  return (
    <div className="page-section">
      <div className="page-header-block">
        <h2>Raporlar</h2>
        <p>Satış, alış, gelir-gider, kâr-zarar ve KDV özet raporları.</p>
      </div>

      <section className="card">
        <div className="report-filter">
          <label>
            Başlangıç
            <input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} />
          </label>
          <label>
            Bitiş
            <input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} />
          </label>
          <button onClick={handleExport}>Excel İndir</button>
        </div>
      </section>

      <div className="cards-grid">
        {rows.map((row) => (
          <article key={row.label} className="stat-card">
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </article>
        ))}
      </div>

      <DashboardCharts invoices={invoices} finance={finance} />
    </div>
  );
}
