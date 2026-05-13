import { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Gauge,
  Lightbulb,
  PackageCheck,
  Plus,
  Radar,
  ReceiptText,
  RefreshCw,
  ShieldAlert,
  Signal,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { isSuperAdmin } from '../config/admins';
import { getContactMessages, ContactMessage } from '../services/messageService';
import { CashBankRecord, getCashBankRecords } from '../services/cashBankService';
import { CustomerRecord, getCustomers } from '../services/customerService';
import { getDashboardStats } from '../services/dashboardService';
import { exportToExcel } from '../services/excelService';
import { FinanceRecord, getFinanceRecords } from '../services/financeService';
import { getInvoices, InvoiceRecord } from '../services/invoiceService';
import { getNotifications, NotificationRecord } from '../services/notificationService';
import { getStockItems, StockRecord } from '../services/stockService';
import {
  type BusinessInsights,
  type InsightSeverity,
  emptyBusinessInsights,
  getBusinessInsights,
} from '../services/insightService';

interface DashboardProps {
  user: User | null;
}

interface DashboardStats {
  dailySales: string;
  dailyCollection: string;
  dailyExpense: string;
  cashBalance: string;
  bankBalance: string;
  pendingReceivables: string;
  overdueDebts: string;
  invoicesIssued: string;
  invoicesReceived: string;
  stockAlerts: string;
  upcomingPayments: string;
  monthlyProfitLoss: string;
}

interface ChartData {
  path: string;
  areaPath: string;
  points: Array<{ x: number; y: number; value: number }>;
}

interface ActionItem {
  title: string;
  detail: string;
  route: string;
  severity: InsightSeverity;
  icon: typeof AlertCircle;
}

const initialStats: DashboardStats = {
  dailySales: '₺0',
  dailyCollection: '₺0',
  dailyExpense: '₺0',
  cashBalance: '₺0',
  bankBalance: '₺0',
  pendingReceivables: '₺0',
  overdueDebts: '₺0',
  invoicesIssued: '0',
  invoicesReceived: '0',
  stockAlerts: '0 ürün',
  upcomingPayments: '0 adet',
  monthlyProfitLoss: '₺0',
};

const severityStyles: Record<
  InsightSeverity,
  { panel: string; badge: string; dot: string; title: string; rail: string }
> = {
  success: {
    panel: 'border-emerald-400/20 bg-emerald-400/5',
    badge: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/20',
    dot: 'bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.65)]',
    title: 'text-emerald-100',
    rail: 'from-emerald-300 to-cyan-300',
  },
  info: {
    panel: 'border-cyan-400/20 bg-cyan-400/5',
    badge: 'bg-cyan-400/10 text-cyan-100 border-cyan-400/20',
    dot: 'bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.65)]',
    title: 'text-cyan-100',
    rail: 'from-cyan-300 to-blue-300',
  },
  warning: {
    panel: 'border-amber-300/25 bg-amber-300/5',
    badge: 'bg-amber-300/10 text-amber-100 border-amber-300/20',
    dot: 'bg-amber-200 shadow-[0_0_16px_rgba(253,230,138,0.65)]',
    title: 'text-amber-100',
    rail: 'from-amber-200 to-orange-300',
  },
  critical: {
    panel: 'border-rose-300/25 bg-rose-400/10',
    badge: 'bg-rose-300/10 text-rose-100 border-rose-300/20',
    dot: 'bg-rose-300 shadow-[0_0_16px_rgba(253,164,175,0.7)]',
    title: 'text-rose-100',
    rail: 'from-rose-300 to-fuchsia-300',
  },
};


const opsLinks = [
  { label: 'Yeni Fatura', path: '/faturalar', icon: Plus },
  { label: 'Cari Kart', path: '/cariler', icon: Users },
  { label: 'Kasa/Banka', path: '/kasa-banka', icon: Wallet },
  { label: 'e-Fatura', path: '/e-fatura', icon: ReceiptText },
  { label: 'Rapor Al', path: '/raporlar', icon: Download },
];

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseMetricValue(value: string) {
  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return Number(normalized) || 0;
}

function formatCurrency(value: number) {
  const sign = value < 0 ? '-' : '';
  return `${sign}₺${Math.abs(Math.round(value)).toLocaleString('tr-TR')}`;
}

function formatDate(date: string) {
  if (!date) return 'Tarih yok';
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
}

function daysUntil(dateKey: string) {
  if (!dateKey) return Number.NaN;
  const today = new Date(`${getDateKey()}T00:00:00`);
  const target = new Date(`${dateKey}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

function isIncomeInvoice(invoice: InvoiceRecord) {
  return invoice.invoiceType !== 'Alış' && invoice.invoiceType !== 'İade';
}

function buildLineChart(values: number[], width = 680, height = 260, padding = 28): ChartData {
  const safeValues = values.length ? values : [0];
  const min = Math.min(...safeValues, 0);
  const max = Math.max(...safeValues, 1);
  const range = max - min || 1;
  const step = safeValues.length > 1 ? (width - padding * 2) / (safeValues.length - 1) : 0;
  const points = safeValues.map((value, index) => ({
    value,
    x: padding + index * step,
    y: height - padding - ((value - min) / range) * (height - padding * 2),
  }));
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const first = points[0];
  const last = points[points.length - 1];
  const areaPath = `${path} L ${last.x} ${height - padding} L ${first.x} ${height - padding} Z`;

  return { path, areaPath, points };
}

function getScoreVisual(score: number) {
  if (score >= 85) {
    return {
      stroke: '#34d399',
      text: 'text-emerald-200',
      glow: 'shadow-[0_0_36px_rgba(52,211,153,0.32)]',
      badge: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100',
    };
  }
  if (score >= 70) {
    return {
      stroke: '#67e8f9',
      text: 'text-cyan-100',
      glow: 'shadow-[0_0_36px_rgba(103,232,249,0.32)]',
      badge: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
    };
  }
  if (score >= 55) {
    return {
      stroke: '#fcd34d',
      text: 'text-amber-100',
      glow: 'shadow-[0_0_36px_rgba(252,211,77,0.28)]',
      badge: 'border-amber-300/25 bg-amber-300/10 text-amber-100',
    };
  }
  return {
    stroke: '#fb7185',
    text: 'text-rose-100',
    glow: 'shadow-[0_0_36px_rgba(251,113,133,0.32)]',
    badge: 'border-rose-300/25 bg-rose-300/10 text-rose-100',
  };
}

export default function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [insights, setInsights] = useState<BusinessInsights>(emptyBusinessInsights);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [cashBank, setCashBank] = useState<CashBankRecord[]>([]);
  const [finance, setFinance] = useState<FinanceRecord[]>([]);
  const [stock, setStock] = useState<StockRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const [nextStats, nextInsights, nextInvoices, nextCashBank, nextFinance, nextStock, nextCustomers, nextNotifications] =
        await Promise.all([
          getDashboardStats(user.uid),
          getBusinessInsights(user.uid),
          getInvoices(user.uid),
          getCashBankRecords(user.uid),
          getFinanceRecords(user.uid),
          getStockItems(user.uid),
          getCustomers(user.uid),
          getNotifications(user.uid),
          isSuperAdmin(user) ? getContactMessages() : Promise.resolve([]),
        ]);

      setStats(nextStats);
      setInsights(nextInsights);
      setInvoices(nextInvoices);
      setCashBank(nextCashBank);
      setFinance(nextFinance);
      setStock(nextStock);
      setCustomers(nextCustomers);
      setNotifications(nextNotifications);
      setMessages(nextMessages);
    } catch (loadError) {
      console.error(loadError);
      setError('Dashboard verileri alınamadı. Firebase izinlerini ve bağlantıyı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const todayKey = getDateKey();
  const currentBalance = useMemo(
    () => parseMetricValue(stats.cashBalance) + parseMetricValue(stats.bankBalance),
    [stats.bankBalance, stats.cashBalance]
  );
  const forecastValues = useMemo(
    () => [currentBalance, ...insights.forecast.map((item) => item.projectedBalance)],
    [currentBalance, insights.forecast]
  );
  const cashRouteChart = useMemo(() => buildLineChart(forecastValues), [forecastValues]);
  const scoreVisual = getScoreVisual(insights.healthScore);
  const gaugeRadius = 66;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeCircumference * (1 - insights.healthScore / 100);

  const dashboardState = useMemo(() => {
    const pendingInvoices = invoices.filter((invoice) => invoice.status === 'Beklemede');
    const overdueReceivables = pendingInvoices
      .filter((invoice) => isIncomeInvoice(invoice) && daysUntil(invoice.dueDate) < 0)
      .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate));
    const upcomingReceivables = pendingInvoices
      .filter((invoice) => isIncomeInvoice(invoice) && daysUntil(invoice.dueDate) >= 0 && daysUntil(invoice.dueDate) <= 14)
      .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate));
    const upcomingPayables = pendingInvoices
      .filter((invoice) => !isIncomeInvoice(invoice) && daysUntil(invoice.dueDate) >= 0 && daysUntil(invoice.dueDate) <= 14)
      .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate));
    const lowStockItems = stock
      .filter((item) => item.quantity <= (item.minStock || 5))
      .sort((a, b) => a.quantity - b.quantity);
    const unreadNotifications = notifications.filter((item) => !item.read);

    const actionQueue: ActionItem[] = [];
    if (overdueReceivables.length) {
      actionQueue.push({
        title: 'Geciken tahsilatları kapat',
        detail: `${overdueReceivables.length} fatura vadesini geçti.`,
        route: '/faturalar',
        severity: 'critical',
        icon: AlertCircle,
      });
    }
    if (upcomingPayables.length) {
      actionQueue.push({
        title: 'Yaklaşan ödemeleri planla',
        detail: `${upcomingPayables.length} ödeme 14 gün içinde.`,
        route: '/faturalar',
        severity: 'warning',
        icon: CalendarClock,
      });
    }
    if (lowStockItems.length) {
      actionQueue.push({
        title: 'Stok alarmını çöz',
        detail: `${lowStockItems.length} ürün minimum seviyede.`,
        route: '/stok',
        severity: 'warning',
        icon: Boxes,
      });
    }
    if (unreadNotifications.length) {
      actionQueue.push({
        title: 'Okunmamış bildirimleri incele',
        detail: `${unreadNotifications.length} bildirim bekliyor.`,
        route: '/bildirimler',
        severity: 'info',
        icon: Bell,
      });
    }
    if (!invoices.length) {
      actionQueue.push({
        title: 'İlk faturayı oluştur',
        detail: 'Satış, tahsilat ve kârlılık analizleri için ilk belgeyi girin.',
        route: '/faturalar',
        severity: 'info',
        icon: FileText,
      });
    }
    if (!cashBank.length) {
      actionQueue.push({
        title: 'Kasa/banka hareketi ekle',
        detail: 'Nakit rotası ve sağlık skoru bu veriye göre netleşir.',
        route: '/kasa-banka',
        severity: 'info',
        icon: Wallet,
      });
    }
    if (!actionQueue.length) {
      actionQueue.push({
        title: 'Raporları gözden geçir',
        detail: 'Operasyon dengede; detaylı rapor kontrolü için hazır.',
        route: '/raporlar',
        severity: 'success',
        icon: CheckCircle2,
      });
    }

    return {
      pendingInvoices,
      overdueReceivables,
      upcomingReceivables,
      upcomingPayables,
      lowStockItems,
      unreadNotifications,
      actionQueue: actionQueue.slice(0, 5),
    };
  }, [cashBank.length, invoices, notifications, stock]);

  const telemetryBars = useMemo(
    () => [
      { label: 'Tahsilat', value: parseMetricValue(stats.dailyCollection), tone: 'bg-cyan-300', route: '/kasa-banka' },
      { label: 'Gider', value: parseMetricValue(stats.dailyExpense), tone: 'bg-rose-300', route: '/gelir-gider' },
      { label: 'Banka', value: parseMetricValue(stats.bankBalance), tone: 'bg-emerald-300', route: '/kasa-banka' },
      { label: 'Alacak', value: parseMetricValue(stats.pendingReceivables), tone: 'bg-amber-200', route: '/faturalar' },
      { label: 'Vade', value: parseMetricValue(stats.overdueDebts), tone: 'bg-fuchsia-300', route: '/faturalar' },
      { label: 'K/Z', value: Math.abs(parseMetricValue(stats.monthlyProfitLoss)), tone: 'bg-lime-300', route: '/raporlar' },
    ],
    [stats]
  );
  const telemetryMax = Math.max(...telemetryBars.map((item) => item.value), 1);
  const highestRisk = insights.risks[0] ?? emptyBusinessInsights.risks[0];

  const moduleStatus = [
    {
      label: 'Cari Hesaplar',
      value: customers.length ? `${customers.length} kayıt` : 'İlk cari bekleniyor',
      route: '/cariler',
      status: customers.length ? 'Aktif' : 'Hazır',
      icon: Users,
    },
    {
      label: 'Faturalar',
      value: invoices.length ? `${invoices.length} belge` : 'İlk fatura bekleniyor',
      route: '/faturalar',
      status: invoices.length ? 'Aktif' : 'Hazır',
      icon: FileText,
    },
    {
      label: 'e-Fatura',
      value: 'UBL hazırlığı',
      route: '/e-fatura',
      status: 'Hazır',
      icon: ReceiptText,
    },
    {
      label: 'Stok',
      value: stock.length ? `${stock.length} kart` : 'İlk stok kartı bekleniyor',
      route: '/stok',
      status: stock.length ? 'Aktif' : 'Hazır',
      icon: PackageCheck,
    },
    {
      label: 'Kasa & Banka',
      value: cashBank.length ? `${cashBank.length} hareket` : 'İlk hareket bekleniyor',
      route: '/kasa-banka',
      status: cashBank.length ? 'Aktif' : 'Hazır',
      icon: Wallet,
    },
    {
      label: 'Gelir & Gider',
      value: finance.length ? `${finance.length} kayıt` : 'İlk kayıt bekleniyor',
      route: '/gelir-gider',
      status: finance.length ? 'Aktif' : 'Hazır',
      icon: BarChart3,
    },
  ];

  const recentActivities = [
    ...invoices.slice(0, 3).map((invoice) => ({
      id: `invoice-${invoice.id || invoice.invoiceNumber}`,
      title: invoice.invoiceNumber,
      detail: `${invoice.customerName} - ${invoice.invoiceType}`,
      value: formatCurrency(invoice.amount || 0),
      date: invoice.dueDate,
      route: '/faturalar',
    })),
    ...cashBank.slice(0, 3).map((record) => ({
      id: `cash-${record.id || record.accountName}-${record.date}`,
      title: `${record.accountType} ${record.transactionType}`,
      detail: record.accountName,
      value: formatCurrency(record.transactionType === 'Giriş' ? record.amount : -record.amount),
      date: record.date,
      route: '/kasa-banka',
    })),
    ...finance.slice(0, 3).map((record) => ({
      id: `finance-${record.id || record.category}-${record.date}`,
      title: record.type,
      detail: record.category,
      value: formatCurrency(record.type === 'Gelir' ? record.amount : -record.amount),
      date: record.date,
      route: '/gelir-gider',
    })),
  ].slice(0, 7);

  const handleExport = () => {
    exportToExcel(
      [
        { Bolum: 'KPI', Kalem: 'Günlük Satış', Deger: stats.dailySales },
        { Bolum: 'KPI', Kalem: 'Günlük Tahsilat', Deger: stats.dailyCollection },
        { Bolum: 'KPI', Kalem: 'Günlük Gider', Deger: stats.dailyExpense },
        { Bolum: 'KPI', Kalem: 'Kasa Bakiyesi', Deger: stats.cashBalance },
        { Bolum: 'KPI', Kalem: 'Banka Bakiyesi', Deger: stats.bankBalance },
        { Bolum: 'KPI', Kalem: 'Aylık Kâr/Zarar', Deger: stats.monthlyProfitLoss },
        { Bolum: 'Sağlık', Kalem: 'Skor', Deger: insights.healthScore },
        { Bolum: 'Sağlık', Kalem: 'Durum', Deger: insights.healthLabel },
        ...dashboardState.actionQueue.map((item) => ({
          Bolum: 'Aksiyon',
          Kalem: item.title,
          Deger: item.detail,
        })),
        ...dashboardState.lowStockItems.map((item) => ({
          Bolum: 'Stok Alarmı',
          Kalem: item.name,
          Deger: item.quantity,
          Aciklama: `Min: ${item.minStock || 5}`,
        })),
      ],
      `bey360-dashboard-${todayKey}`,
      'Dashboard'
    );
  };

  if (loading) {
    return (
      <div className="min-h-[560px] rounded-lg border border-slate-800 bg-[#07111f] p-8 text-cyan-100">
        <div className="flex h-full min-h-[480px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-16 w-16 animate-pulse rounded-lg border border-cyan-300/30 bg-cyan-300/10" />
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
              Komuta merkezi yükleniyor
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-[#07111f] p-4 text-slate-100 shadow-2xl shadow-slate-950/30 md:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(103,232,249,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="relative space-y-5">
        {error && <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-4 text-sm font-bold text-rose-100">{error}</div>}

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
          <div className="min-h-[360px] rounded-lg border border-cyan-300/15 bg-slate-950/65 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100">
                    <Signal size={14} />
                    Bey360 Command Deck
                  </div>
                  <div className="flex flex-col items-end">
                    <img src="/logos/logo_branding.png" alt="Bey360 Logo" className="h-10 w-auto" />
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-500">Gelişmiş Çözümler, Tek Platform</span>
                  </div>
                </div>
                <h2 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
                  {user?.email?.split('@')[0] || 'Operatör'}, bütün paneller aktif.
                </h2>
                <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
                  Fatura, tahsilat, vade, stok, kasa, bildirim ve analiz sinyalleri gerçek kayıtlarla çalışıyor.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={loadDashboard}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black text-slate-100 transition hover:border-cyan-300/35 hover:bg-cyan-300/10"
                >
                  <RefreshCw size={16} />
                  Yenile
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-cyan-200"
                >
                  <Download size={16} />
                  Excel Özet
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-5">
              {opsLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-center text-[11px] font-black text-slate-100 transition hover:border-cyan-300/35 hover:bg-cyan-300/10"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {[
                {
                  label: 'Günlük Satış',
                  statValue: stats.dailySales,
                  sub: 'Satış Kanalı',
                  route: '/faturalar',
                  icon: TrendingUp,
                  tone: 'border-cyan-300/20 bg-cyan-300/5 text-cyan-100',
                  line: 'from-cyan-300 to-sky-300',
                },
                {
                  label: 'Kasa Bakiyesi',
                  statValue: stats.cashBalance,
                  sub: 'Likidite',
                  route: '/kasa-banka',
                  icon: Wallet,
                  tone: 'border-emerald-300/20 bg-emerald-300/5 text-emerald-100',
                  line: 'from-emerald-300 to-lime-300',
                },
                {
                  label: 'Stok Alarmı',
                  statValue: stats.stockAlerts,
                  sub: 'Operasyon',
                  route: '/stok',
                  icon: Boxes,
                  tone: 'border-amber-300/20 bg-amber-300/5 text-amber-100',
                  line: 'from-amber-200 to-orange-300',
                },
                {
                  label: 'Bekleyen Ödeme',
                  statValue: stats.upcomingPayments,
                  sub: 'Vade',
                  route: '/faturalar',
                  icon: AlertCircle,
                  tone: 'border-rose-300/20 bg-rose-300/5 text-rose-100',
                  line: 'from-rose-300 to-pink-300',
                },
                ...(isSuperAdmin(user) ? [{
                  label: 'Yeni Mesajlar',
                  statValue: messages.length.toString(),
                  sub: 'Sistem',
                  route: '/admin',
                  icon: Mail,
                  tone: 'border-fuchsia-300/20 bg-fuchsia-300/5 text-fuchsia-100',
                  line: 'from-fuchsia-300 to-purple-300',
                }] : []),
              ].map((card) => (
                <Link key={card.label} to={card.route} className={`relative min-h-32 overflow-hidden rounded-lg border p-4 transition hover:-translate-y-0.5 ${card.tone}`}>
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.line}`} />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{card.sub}</p>
                      <h3 className="mt-2 text-sm font-black text-white">{card.label}</h3>
                    </div>
                    <card.icon size={22} />
                  </div>
                  <p className="mt-5 break-words text-2xl font-black leading-none text-white">{card.statValue}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-cyan-300/15 bg-slate-950/65 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">İşletme Çekirdeği</p>
                <h3 className="mt-2 text-xl font-black text-white">Sağlık Skoru</h3>
              </div>
              <Gauge className="text-cyan-200" size={28} />
            </div>

            <div className={`relative mx-auto mt-7 flex h-52 w-52 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] ${scoreVisual.glow}`}>
              <svg viewBox="0 0 180 180" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="90" cy="90" r={gaugeRadius} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="14" />
                <circle
                  cx="90"
                  cy="90"
                  r={gaugeRadius}
                  fill="none"
                  stroke={scoreVisual.stroke}
                  strokeLinecap="round"
                  strokeWidth="14"
                  strokeDasharray={gaugeCircumference}
                  strokeDashoffset={gaugeOffset}
                />
              </svg>
              <div className="relative text-center">
                <p className={`text-6xl font-black leading-none ${scoreVisual.text}`}>{insights.healthScore}</p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">/100</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className={`rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${scoreVisual.badge}`}>{insights.healthLabel}</span>
              <span className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">
                {insights.generatedAt || 'Bugün'}
              </span>
            </div>
            <p className="mt-5 text-center text-sm font-semibold leading-6 text-slate-300">{insights.healthSummary}</p>
            <div className="mt-5 space-y-2">
              {insights.healthDrivers.slice(0, 4).map((driver) => (
                <div key={driver} className="flex items-start gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-300">
                  <Sparkles size={14} className="mt-0.5 shrink-0 text-cyan-200" />
                  {driver}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.6fr)_minmax(360px,0.7fr)]">
          <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Görev Sırası</p>
                <h3 className="mt-2 text-xl font-black text-white">Bugünün Aksiyonları</h3>
              </div>
              <Target className="text-cyan-200" size={24} />
            </div>
            <div className="space-y-3">
              {dashboardState.actionQueue.map((item) => {
                const style = severityStyles[item.severity];
                return (
                  <Link key={item.title} to={item.route} className={`flex items-start justify-between gap-3 rounded-lg border p-4 transition hover:-translate-y-0.5 ${style.panel}`}>
                    <div className="flex items-start gap-3">
                      <item.icon className={style.title} size={19} />
                      <div>
                        <strong className="block text-sm font-black text-white">{item.title}</strong>
                        <span className="mt-1 block text-xs font-semibold leading-5 text-slate-400">{item.detail}</span>
                      </div>
                    </div>
                    <ChevronRight size={17} className="shrink-0 text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Modüller</p>
                <h3 className="mt-2 text-xl font-black text-white">Çalışma Durumu</h3>
              </div>
              <Building2 className="text-cyan-200" size={24} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {moduleStatus.map((item) => (
                <Link key={item.label} to={item.route} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-300/30 hover:bg-cyan-300/10">
                  <div className="flex items-center gap-3">
                    <item.icon size={17} className={item.status === 'Aktif' ? 'text-emerald-200' : 'text-cyan-200'} />
                    <div>
                      <strong className="block text-sm font-black text-white">{item.label}</strong>
                      <span className="text-xs font-semibold text-slate-400">{item.value}</span>
                    </div>
                  </div>
                  <span className={`badge ${item.status === 'Aktif' ? 'badge-success' : ''}`}>{item.status}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Akış</p>
                <h3 className="mt-2 text-xl font-black text-white">Son Hareketler</h3>
              </div>
              <Activity className="text-cyan-200" size={24} />
            </div>
            {recentActivities.length === 0 ? (
              <div className="empty-state">Henüz hareket yok.</div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((item) => (
                  <Link key={item.id} to={item.route} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-300/30 hover:bg-cyan-300/10">
                    <div className="min-w-0">
                      <strong className="block truncate text-sm font-black text-white">{item.title}</strong>
                      <span className="block truncate text-xs font-semibold text-slate-400">{item.detail} / {formatDate(item.date)}</span>
                    </div>
                    <span className="shrink-0 text-sm font-black text-cyan-100">{item.value}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
          <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Nakit Rotası</p>
                <h3 className="mt-2 text-2xl font-black text-white">30 / 60 / 90 Gün Projeksiyon</h3>
              </div>
              <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black text-cyan-100">
                Güven: {insights.forecast[0]?.confidence ?? 'Başlangıç'}
              </div>
            </div>

            <div className="mt-6 h-[320px] overflow-hidden rounded-lg border border-white/10 bg-[#050b14] p-4">
              <svg viewBox="0 0 680 260" className="h-full w-full" role="img" aria-label="Nakit akışı tahmin grafiği">
                <defs>
                  <linearGradient id="cashLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="48%" stopColor="#a7f3d0" />
                    <stop offset="100%" stopColor="#fcd34d" />
                  </linearGradient>
                  <linearGradient id="cashArea" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[48, 92, 136, 180, 224].map((y) => (
                  <line key={y} x1="28" x2="652" y1={y} y2={y} stroke="rgba(148,163,184,0.15)" strokeDasharray="5 8" />
                ))}
                <path d={cashRouteChart.areaPath} fill="url(#cashArea)" />
                <path d={cashRouteChart.path} fill="none" stroke="url(#cashLine)" strokeLinecap="round" strokeWidth="5" />
                {cashRouteChart.points.map((point, index) => (
                  <g key={`${point.x}-${index}`}>
                    <circle cx={point.x} cy={point.y} r="7" fill="#07111f" stroke="#67e8f9" strokeWidth="3" />
                    <text x={point.x} y={238} textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">
                      {index === 0 ? 'Bugün' : `${insights.forecast[index - 1]?.horizonDays ?? 0}G`}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {insights.forecast.map((item) => {
                const positive = item.projectedBalance >= 0;
                return (
                  <Link key={item.horizonDays} to="/raporlar" className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/30 hover:bg-cyan-300/10">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item.horizonDays} Gün</p>
                      <span className={`rounded-md px-2 py-1 text-[10px] font-black ${positive ? 'bg-emerald-300/10 text-emerald-100' : 'bg-rose-300/10 text-rose-100'}`}>
                        {positive ? 'POZİTİF' : 'RİSK'}
                      </span>
                    </div>
                    <p className="mt-4 text-2xl font-black text-white">{formatCurrency(item.projectedBalance)}</p>
                    <p className={`mt-1 text-xs font-bold ${item.netChange >= 0 ? 'text-emerald-200' : 'text-rose-200'}`}>
                      {item.netChange >= 0 ? '+' : ''}{formatCurrency(item.netChange)}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-slate-500">
                      Giriş {formatCurrency(item.expectedInflows)} / Çıkış {formatCurrency(item.expectedOutflows)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Radar</p>
                  <h3 className="mt-2 text-xl font-black text-white">Risk Alanı</h3>
                </div>
                <Radar className="text-cyan-200" size={26} />
              </div>
              <Link to={highestRisk?.route || '/raporlar'} className="mt-6 block rounded-lg border border-white/10 bg-[#050b14] p-5 transition hover:border-cyan-300/30 hover:bg-cyan-300/5">
                <div className="relative mx-auto aspect-square max-h-64 max-w-64 rounded-full border border-cyan-300/20">
                  <div className="absolute inset-8 rounded-full border border-cyan-300/20" />
                  <div className="absolute inset-16 rounded-full border border-cyan-300/20" />
                  <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px -translate-x-1/2 bg-cyan-300/15" />
                  <div className="absolute left-4 top-1/2 h-px w-[calc(100%-2rem)] -translate-y-1/2 bg-cyan-300/15" />
                  <span className="absolute left-[49%] top-[18%] h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.85)]" />
                  <span className="absolute right-[22%] top-[47%] h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_18px_rgba(253,230,138,0.85)]" />
                  <span className="absolute bottom-[23%] left-[29%] h-3 w-3 rounded-full bg-emerald-200 shadow-[0_0_18px_rgba(110,231,183,0.85)]" />
                  <div className="absolute inset-x-8 top-1/2 h-px origin-center -translate-y-1/2 rotate-[22deg] bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />
                </div>
                <p className="mt-5 text-sm font-black text-cyan-100">{highestRisk?.title ?? 'Risk sinyali bekleniyor'}</p>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">{highestRisk?.description ?? 'Veri arttıkça radar alanı daha hassas çalışır.'}</p>
              </Link>
            </div>

            <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Telemetri</p>
                  <h3 className="mt-2 text-xl font-black text-white">Operasyon Barları</h3>
                </div>
                <BarChart3 className="text-cyan-200" size={26} />
              </div>
              <div className="mt-6 flex h-64 items-end gap-3 rounded-lg border border-white/10 bg-[#050b14] p-4">
                {telemetryBars.map((item) => (
                  <Link key={item.label} to={item.route} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                    <div className={`min-h-2 rounded-t-md ${item.tone} shadow-[0_0_18px_rgba(103,232,249,0.14)]`} style={{ height: `${Math.max(8, (item.value / telemetryMax) * 100)}%` }} />
                    <p className="mt-3 truncate text-center text-[10px] font-black uppercase text-slate-400">{item.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          {[
            { title: 'Riskler', icon: ShieldAlert, items: insights.risks },
            { title: 'Öneriler', icon: Lightbulb, items: insights.recommendations },
            { title: 'Anomaliler', icon: Target, items: insights.anomalies },
          ].map((group) => (
            <div key={group.title} className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-md border border-white/10 bg-white/[0.05] p-2 text-cyan-100">
                    <group.icon size={18} />
                  </div>
                  <h3 className="text-lg font-black text-white">{group.title}</h3>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{group.items.length} sinyal</span>
              </div>

              <div className="space-y-3">
                {group.items.map((item) => {
                  const style = severityStyles[item.severity];
                  return (
                    <Link key={item.id} to={item.route || '/raporlar'} className={`group relative block min-h-[132px] overflow-hidden rounded-lg border p-4 transition hover:-translate-y-0.5 ${style.panel}`}>
                      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${style.rail}`} />
                      <div className="flex items-start gap-3">
                        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                        <div className="min-w-0">
                          <p className={`text-sm font-black ${style.title}`}>{item.title}</p>
                          <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">{item.description}</p>
                          <span className={`mt-4 inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${style.badge}`}>
                            {item.action || 'Detaya git'}
                            <ArrowUpRight size={12} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Vade</p>
                <h3 className="mt-2 text-xl font-black text-white">Tahsilat / Ödeme</h3>
              </div>
              <CalendarClock className="text-cyan-200" size={24} />
            </div>
            <div className="space-y-3">
              {[...dashboardState.overdueReceivables, ...dashboardState.upcomingReceivables, ...dashboardState.upcomingPayables].slice(0, 6).map((invoice) => {
                const diff = daysUntil(invoice.dueDate);
                return (
                  <Link key={invoice.id || invoice.invoiceNumber} to="/faturalar" className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-300/30 hover:bg-cyan-300/10">
                    <div className="min-w-0">
                      <strong className="block truncate text-sm font-black text-white">{invoice.customerName}</strong>
                      <span className="block truncate text-xs font-semibold text-slate-400">{invoice.invoiceNumber} / {formatDate(invoice.dueDate)}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-black text-cyan-100">{formatCurrency(invoice.amount)}</span>
                      <span className={`text-xs font-bold ${diff < 0 ? 'text-rose-200' : 'text-slate-500'}`}>{diff < 0 ? `${Math.abs(diff)} gün geçti` : `${diff} gün`}</span>
                    </div>
                  </Link>
                );
              })}
              {dashboardState.pendingInvoices.length === 0 && <div className="empty-state">Bekleyen fatura yok.</div>}
            </div>
          </div>

          <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Stok</p>
                <h3 className="mt-2 text-xl font-black text-white">Alarmdaki Ürünler</h3>
              </div>
              <Boxes className="text-cyan-200" size={24} />
            </div>
            {dashboardState.lowStockItems.length === 0 ? (
              <div className="empty-state">Stok alarmı yok.</div>
            ) : (
              <div className="space-y-3">
                {dashboardState.lowStockItems.slice(0, 6).map((item) => (
                  <Link key={item.id || item.code} to="/stok" className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-300/30 hover:bg-cyan-300/10">
                    <div className="min-w-0">
                      <strong className="block truncate text-sm font-black text-white">{item.name}</strong>
                      <span className="block truncate text-xs font-semibold text-slate-400">{item.code} / Min {item.minStock || 5}</span>
                    </div>
                    <span className="text-sm font-black text-amber-100">{item.quantity} {item.unit}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-cyan-300/15 bg-slate-950/70 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Bildirim</p>
                <h3 className="mt-2 text-xl font-black text-white">Uyarı Merkezi</h3>
              </div>
              <Bell className="text-cyan-200" size={24} />
            </div>
            {notifications.length === 0 ? (
              <div className="empty-state">Henüz bildirim yok.</div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 6).map((item) => (
                  <Link key={item.id || item.title} to="/bildirimler" className="block rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-300/30 hover:bg-cyan-300/10">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="truncate text-sm font-black text-white">{item.title}</strong>
                      <span className={`badge ${item.type === 'success' ? 'badge-success' : item.type === 'warning' ? 'badge-warning' : ''}`}>{item.read ? 'Okundu' : 'Yeni'}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-slate-400">{item.message}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
