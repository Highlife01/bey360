import { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Landmark,
  ReceiptText,
  TriangleAlert,
  WalletCards,
} from 'lucide-react';
import { CashBankRecord, getCashBankRecords } from '../services/cashBankService';
import { CompanyRecord, getCompanies } from '../services/companyService';
import { exportToExcel } from '../services/excelService';
import { FinanceRecord, getFinanceRecords } from '../services/financeService';
import { getInvoices, InvoiceRecord } from '../services/invoiceService';

interface AccountantProps {
  user: User | null;
}

interface ChecklistItem {
  title: string;
  detail: string;
  status: 'Hazır' | 'Kontrol' | 'Eksik';
  href: string;
}

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (date: string) => {
  if (!date) return 'Tarih yok';
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
};

const getMonthLabel = (month: string) =>
  new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(new Date(`${month}-01T00:00:00`));

export default function Accountant({ user }: AccountantProps) {
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [finance, setFinance] = useState<FinanceRecord[]>([]);
  const [cashBank, setCashBank] = useState<CashBankRecord[]>([]);
  const [activeCompany, setActiveCompany] = useState(() => localStorage.getItem('bey360_active_company') || '');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAccountantData = async () => {
      if (!user) return;
      setLoading(true);
      setError('');

      try {
        const [companyRows, invoiceRows, financeRows, cashBankRows] = await Promise.all([
          getCompanies(user.uid),
          getInvoices(user.uid),
          getFinanceRecords(user.uid),
          getCashBankRecords(user.uid),
        ]);

        setCompanies(companyRows);
        setInvoices(invoiceRows);
        setFinance(financeRows);
        setCashBank(cashBankRows);

        const savedCompany = localStorage.getItem('bey360_active_company') || '';
        const savedCompanyExists = companyRows.some((company) => company.id === savedCompany);
        if (!savedCompanyExists && companyRows[0]?.id) {
          setActiveCompany(companyRows[0].id);
          localStorage.setItem('bey360_active_company', companyRows[0].id);
        }
      } catch (loadError) {
        console.error(loadError);
        setError('Muhasebeci paneli verileri alınamadı. Lütfen bağlantıyı ve Firebase izinlerini kontrol edin.');
      } finally {
        setLoading(false);
      }
    };

    loadAccountantData();
  }, [user]);

  const activeCompanyRecord = useMemo(
    () => companies.find((company) => company.id === activeCompany),
    [activeCompany, companies]
  );

  const periodData = useMemo(() => {
    const inMonth = (date: string) => Boolean(date?.startsWith(selectedMonth));
    const periodInvoices = invoices.filter((invoice) => inMonth(invoice.dueDate));
    const periodFinance = finance.filter((record) => inMonth(record.date));
    const periodCashBank = cashBank.filter((record) => inMonth(record.date));

    const salesInvoices = periodInvoices.filter((invoice) =>
      ['Satış', 'Hizmet', 'Ürün'].includes(invoice.invoiceType)
    );
    const purchaseInvoices = periodInvoices.filter((invoice) => invoice.invoiceType === 'Alış');
    const returnInvoices = periodInvoices.filter((invoice) => invoice.invoiceType === 'İade');

    const totalSales = salesInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
    const totalPurchases = purchaseInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
    const totalReturns = returnInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
    const totalIncome = periodFinance
      .filter((record) => record.type === 'Gelir')
      .reduce((sum, record) => sum + (record.amount || 0), 0);
    const totalExpense = periodFinance
      .filter((record) => record.type === 'Gider')
      .reduce((sum, record) => sum + (record.amount || 0), 0);
    const cashIn = periodCashBank
      .filter((record) => record.transactionType === 'Giriş')
      .reduce((sum, record) => sum + (record.amount || 0), 0);
    const cashOut = periodCashBank
      .filter((record) => record.transactionType === 'Çıkış')
      .reduce((sum, record) => sum + (record.amount || 0), 0);
    const pendingInvoices = periodInvoices.filter((invoice) => invoice.status === 'Beklemede');
    const overdueInvoices = invoices.filter(
      (invoice) => invoice.status === 'Beklemede' && invoice.dueDate && invoice.dueDate < new Date().toISOString().slice(0, 10)
    );

    const vatBase = totalSales - totalPurchases - totalReturns;

    return {
      periodInvoices,
      periodFinance,
      periodCashBank,
      salesInvoices,
      purchaseInvoices,
      totalSales,
      totalPurchases,
      totalReturns,
      totalIncome,
      totalExpense,
      netProfit: totalSales + totalIncome - totalPurchases - totalExpense - totalReturns,
      estimatedVat: vatBase * 0.18,
      cashIn,
      cashOut,
      netCashFlow: cashIn - cashOut,
      pendingInvoices,
      overdueInvoices,
    };
  }, [cashBank, finance, invoices, selectedMonth]);

  const checklist = useMemo<ChecklistItem[]>(() => {
    const hasCompanyTaxInfo = Boolean(activeCompanyRecord?.taxId && activeCompanyRecord?.taxOffice);
    const hasSales = periodData.salesInvoices.length > 0;
    const hasPurchasesOrExpenses = periodData.purchaseInvoices.length > 0 || periodData.totalExpense > 0;
    const hasCashBank = periodData.periodCashBank.length > 0;
    const hasPending = periodData.pendingInvoices.length > 0;
    const hasOverdue = periodData.overdueInvoices.length > 0;

    return [
      {
        title: 'Firma kartı',
        detail: hasCompanyTaxInfo ? `${activeCompanyRecord?.taxOffice} / ${activeCompanyRecord?.taxId}` : 'Vergi no ve vergi dairesi tamamlanmalı.',
        status: hasCompanyTaxInfo ? 'Hazır' : 'Eksik',
        href: '/ayarlar',
      },
      {
        title: 'Satış evrakları',
        detail: hasSales ? `${periodData.salesInvoices.length} satış faturası döneme işlendi.` : 'Bu ay satış faturası görünmüyor.',
        status: hasSales ? 'Hazır' : 'Kontrol',
        href: '/faturalar',
      },
      {
        title: 'Alış ve gider kayıtları',
        detail: hasPurchasesOrExpenses
          ? `${periodData.purchaseInvoices.length} alış faturası, ${periodData.periodFinance.length} gelir/gider kaydı var.`
          : 'Alış faturası veya gider kaydı bekleniyor.',
        status: hasPurchasesOrExpenses ? 'Hazır' : 'Kontrol',
        href: '/gelir-gider',
      },
      {
        title: 'Kasa ve banka mutabakatı',
        detail: hasCashBank ? `${periodData.periodCashBank.length} hareket ile dönem akışı oluştu.` : 'Bu ay kasa/banka hareketi yok.',
        status: hasCashBank ? 'Hazır' : 'Eksik',
        href: '/kasa-banka',
      },
      {
        title: 'Bekleyen evrak kontrolü',
        detail: hasPending ? `${periodData.pendingInvoices.length} bekleyen fatura onay bekliyor.` : 'Bekleyen fatura kalmadı.',
        status: hasPending ? 'Kontrol' : 'Hazır',
        href: '/faturalar',
      },
      {
        title: 'Vade riski',
        detail: hasOverdue ? `${periodData.overdueInvoices.length} gecikmiş bekleyen fatura var.` : 'Gecikmiş bekleyen fatura yok.',
        status: hasOverdue ? 'Kontrol' : 'Hazır',
        href: '/faturalar',
      },
    ];
  }, [activeCompanyRecord, periodData]);

  const readyCount = checklist.filter((item) => item.status === 'Hazır').length;
  const periodReadiness = Math.round((readyCount / checklist.length) * 100);
  const recentInvoices = invoices.slice(0, 6);

  const handleCompanyChange = (companyId: string) => {
    setActiveCompany(companyId);
    localStorage.setItem('bey360_active_company', companyId);
  };

  const handleExport = () => {
    const rows = [
      { Bolum: 'Dönem', Kalem: 'Firma', Deger: activeCompanyRecord?.name || 'Firma seçilmedi' },
      { Bolum: 'Dönem', Kalem: 'Ay', Deger: getMonthLabel(selectedMonth) },
      { Bolum: 'Özet', Kalem: 'Satış', Deger: periodData.totalSales },
      { Bolum: 'Özet', Kalem: 'Alış', Deger: periodData.totalPurchases },
      { Bolum: 'Özet', Kalem: 'Gelir', Deger: periodData.totalIncome },
      { Bolum: 'Özet', Kalem: 'Gider', Deger: periodData.totalExpense },
      { Bolum: 'Özet', Kalem: 'Net Kar/Zarar', Deger: periodData.netProfit },
      { Bolum: 'Özet', Kalem: 'Tahmini KDV', Deger: periodData.estimatedVat },
      { Bolum: 'Özet', Kalem: 'Net Nakit Akışı', Deger: periodData.netCashFlow },
      ...checklist.map((item) => ({
        Bolum: 'Kontrol Listesi',
        Kalem: item.title,
        Deger: item.status,
        Aciklama: item.detail,
      })),
      ...periodData.periodInvoices.map((invoice) => ({
        Bolum: 'Faturalar',
        Kalem: invoice.invoiceNumber,
        Deger: invoice.amount,
        Aciklama: `${invoice.customerName} - ${invoice.invoiceType} - ${invoice.status}`,
      })),
    ];

    exportToExcel(rows, `bey360-muhasebeci-paketi-${selectedMonth}`, 'Muhasebeci Paketi');
  };

  if (loading) {
    return <div className="page-section">Muhasebeci paneli hazırlanıyor...</div>;
  }

  return (
    <div className="page-section">
      <div className="page-header-block">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="badge">Muhasebe Kontrol Merkezi</span>
            <h2 className="mt-4">Muhasebeci Paneli</h2>
            <p>
              Dönem kapanışına hazırlık, eksik evrak kontrolü, KDV taslağı ve müşteri firma takibini tek ekranda yönetin.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="button-secondary" to="/raporlar">
              Raporlara Git
            </Link>
            <button className="button-primary inline-flex items-center gap-2" onClick={handleExport}>
              <Download size={17} />
              Excel Paketi
            </button>
          </div>
        </div>
      </div>

      {error && <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-4 text-sm font-bold text-rose-100">{error}</div>}

      <section className="card">
        <div className="dashboard-form grid gap-4 lg:grid-cols-[1fr_220px_220px] lg:items-end">
          <label>
            Aktif Firma
            <select value={activeCompany} onChange={(event) => handleCompanyChange(event.target.value)}>
              {companies.length === 0 && <option value="">Firma eklenmedi</option>}
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Dönem
            <input type="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} />
          </label>
          <Link className="button-secondary text-center" to="/ayarlar">
            Firma Ayarları
          </Link>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="card overflow-hidden">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="badge badge-success">{getMonthLabel(selectedMonth)}</span>
              <h3 className="mt-4">Dönem Kapanış Skoru</h3>
              <p className="mt-2 text-sm font-semibold text-slate-400">
                {activeCompanyRecord?.name || 'Firma seçilmedi'} için kontrol listesi ve evrak yoğunluğu.
              </p>
            </div>
            <div className="min-w-44 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-5 text-center">
              <div className="text-5xl font-black text-cyan-100">{periodReadiness}</div>
              <div className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">/100 Hazırlık</div>
            </div>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.45)]" style={{ width: `${periodReadiness}%` }} />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {checklist.map((item) => (
              <Link key={item.title} to={item.href} className="list-item">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <span
                    className={`badge ${
                      item.status === 'Hazır' ? 'badge-success' : item.status === 'Eksik' ? 'badge-danger' : 'badge-warning'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="badge">Ajanda</span>
              <h3 className="mt-4">Sıradaki İşler</h3>
            </div>
            <CalendarClock className="text-cyan-200" size={28} />
          </div>
          <div className="mt-5 space-y-3">
            <article className="list-item">
              <strong>KDV taslağını kontrol et</strong>
              <span>{formatCurrency(periodData.estimatedVat)} tahmini KDV sonucu oluştu.</span>
            </article>
            <article className="list-item">
              <strong>Bekleyen faturaları kapat</strong>
              <span>{periodData.pendingInvoices.length} fatura onay veya red bekliyor.</span>
            </article>
            <article className="list-item">
              <strong>Kasa/banka hareketlerini eşleştir</strong>
              <span>{formatCurrency(periodData.netCashFlow)} net nakit akışı görünüyor.</span>
            </article>
          </div>
        </section>
      </div>

      <div className="cards-grid">
        <article className="stat-card">
          <FileText className="text-cyan-200" size={22} />
          <span>Satış Faturaları</span>
          <strong>{formatCurrency(periodData.totalSales)}</strong>
        </article>
        <article className="stat-card">
          <ReceiptText className="text-emerald-200" size={22} />
          <span>Gelir - Gider Neti</span>
          <strong>{formatCurrency(periodData.totalIncome - periodData.totalExpense)}</strong>
        </article>
        <article className="stat-card">
          <Landmark className="text-amber-200" size={22} />
          <span>Tahmini KDV</span>
          <strong>{formatCurrency(periodData.estimatedVat)}</strong>
        </article>
        <article className="stat-card">
          <TriangleAlert className="text-rose-200" size={22} />
          <span>Vade Riski</span>
          <strong>{periodData.overdueInvoices.length} adet</strong>
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="badge">Firma Dosyası</span>
              <h3 className="mt-4">{activeCompanyRecord?.name || 'Firma seçilmedi'}</h3>
            </div>
            <Building2 className="text-cyan-200" size={28} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="list-item">
              <strong>Vergi No</strong>
              <span>{activeCompanyRecord?.taxId || 'Eksik'}</span>
            </article>
            <article className="list-item">
              <strong>Vergi Dairesi</strong>
              <span>{activeCompanyRecord?.taxOffice || 'Eksik'}</span>
            </article>
            <article className="list-item">
              <strong>Firma Sayısı</strong>
              <span>{companies.length} kayıt</span>
            </article>
            <article className="list-item">
              <strong>Dönem Evrakı</strong>
              <span>{periodData.periodInvoices.length + periodData.periodFinance.length + periodData.periodCashBank.length} kayıt</span>
            </article>
          </div>
        </section>

        <section className="card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="badge">Mali Özet</span>
              <h3 className="mt-4">Kâr, nakit ve evrak akışı</h3>
            </div>
            <WalletCards className="text-cyan-200" size={28} />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <article className="list-item">
              <strong>Net Kâr / Zarar</strong>
              <span>{formatCurrency(periodData.netProfit)}</span>
            </article>
            <article className="list-item">
              <strong>Alış + Gider</strong>
              <span>{formatCurrency(periodData.totalPurchases + periodData.totalExpense)}</span>
            </article>
            <article className="list-item">
              <strong>Kasa/Banka Giriş</strong>
              <span>{formatCurrency(periodData.cashIn)}</span>
            </article>
            <article className="list-item">
              <strong>Kasa/Banka Çıkış</strong>
              <span>{formatCurrency(periodData.cashOut)}</span>
            </article>
          </div>
        </section>
      </div>

      <section className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="badge">Son Evraklar</span>
            <h3 className="mt-4">Son Faturalar</h3>
          </div>
          <Link className="button-secondary" to="/faturalar">
            Tüm Faturalar
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="empty-state mt-5">Henüz fatura kaydı yok.</div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Fatura</th>
                  <th>Cari</th>
                  <th>Tür</th>
                  <th>Vade</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id || invoice.invoiceNumber}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.customerName}</td>
                    <td>{invoice.invoiceType}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td>{formatCurrency(invoice.amount)}</td>
                    <td>
                      <span
                        className={`badge ${
                          invoice.status === 'Onaylandı'
                            ? 'badge-success'
                            : invoice.status === 'Reddedildi'
                              ? 'badge-danger'
                              : 'badge-warning'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <div className="grid gap-4 md:grid-cols-3">
          <Link className="button-primary inline-flex items-center justify-center gap-2" to="/faturalar">
            <ClipboardList size={17} />
            Fatura Topla
          </Link>
          <Link className="button-secondary inline-flex items-center justify-center gap-2" to="/kasa-banka">
            <Landmark size={17} />
            Mutabakat Yap
          </Link>
          <Link className="button-secondary inline-flex items-center justify-center gap-2" to="/raporlar">
            <CheckCircle2 size={17} />
            Rapor Kontrol Et
          </Link>
        </div>
      </section>
    </div>
  );
}
