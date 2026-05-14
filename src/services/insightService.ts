import { getCashBankRecords } from './cashBankService';
import { getFinanceRecords } from './financeService';
import { type InvoiceRecord, getInvoices } from './invoiceService';
import { getStockItems } from './stockService';
import { getStockMovements } from './stockMovementService';

export type InsightSeverity = 'success' | 'info' | 'warning' | 'critical';
export type ForecastConfidence = 'Yüksek' | 'Orta' | 'Başlangıç';

export interface SmartInsight {
  id: string;
  title: string;
  description: string;
  severity: InsightSeverity;
  route?: string;
  action?: string;
}

export interface CashFlowForecast {
  horizonDays: number;
  projectedBalance: number;
  expectedInflows: number;
  expectedOutflows: number;
  operatingTrend: number;
  netChange: number;
  confidence: ForecastConfidence;
}

export interface BusinessInsights {
  healthScore: number;
  healthLabel: string;
  healthSummary: string;
  healthDrivers: string[];
  forecast: CashFlowForecast[];
  risks: SmartInsight[];
  recommendations: SmartInsight[];
  anomalies: SmartInsight[];
  generatedAt: string;
}

export const emptyBusinessInsights: BusinessInsights = {
  healthScore: 72,
  healthLabel: 'Veri bekleniyor',
  healthSummary: 'Daha isabetli analiz için fatura, kasa/banka ve gelir-gider kayıtları ekleyin.',
  healthDrivers: ['İlk kayıtlar geldikçe skor otomatik netleşir.'],
  forecast: [30, 60, 90].map((horizonDays) => ({
    horizonDays,
    projectedBalance: 0,
    expectedInflows: 0,
    expectedOutflows: 0,
    operatingTrend: 0,
    netChange: 0,
    confidence: 'Başlangıç',
  })),
  risks: [],
  recommendations: [],
  anomalies: [],
  generatedAt: '',
};

const DAY_MS = 24 * 60 * 60 * 1000;
const FORECAST_HORIZONS = [30, 60, 90];

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function daysFromToday(dateKey: string, todayKey: string) {
  const target = parseDateKey(dateKey);
  const today = parseDateKey(todayKey);
  if (!target || !today) return Number.NaN;
  return Math.floor((target.getTime() - today.getTime()) / DAY_MS);
}

function isWithinLastDays(dateKey: string, days: number, todayKey: string) {
  const diff = daysFromToday(dateKey, todayKey);
  return Number.isFinite(diff) && diff <= 0 && diff > -days;
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function getInvoiceDirection(invoice: InvoiceRecord) {
  return invoice.invoiceType === 'Alış' ? 'outflow' : 'inflow';
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getHealthLabel(score: number) {
  if (score >= 85) return 'Güçlü';
  if (score >= 70) return 'Dengeli';
  if (score >= 55) return 'Dikkat';
  return 'Riskli';
}

function getHealthSummary(score: number) {
  if (score >= 85) return 'Nakit, tahsilat ve kârlılık göstergeleri sağlıklı görünüyor.';
  if (score >= 70) return 'Genel tablo dengeli; seçili riskleri izlemek avantaj sağlar.';
  if (score >= 55) return 'Bazı finansal göstergeler dikkat istiyor; aksiyon alırsanız tablo hızla toparlanır.';
  return 'Nakit akışı ve vade riskleri öncelikli müdahale gerektiriyor.';
}

function getConfidence(recordCount: number): ForecastConfidence {
  if (recordCount >= 24) return 'Yüksek';
  if (recordCount >= 8) return 'Orta';
  return 'Başlangıç';
}

export async function getBusinessInsights(uid: string): Promise<BusinessInsights> {
  const todayKey = getDateKey();
  const currentMonth = todayKey.slice(0, 7);
  const [invoices, cashBank, finance, stock, movements] = await Promise.all([
    getInvoices(uid),
    getCashBankRecords(uid),
    getFinanceRecords(uid),
    getStockItems(uid),
    getStockMovements(uid)
  ]);

  const recordCount = invoices.length + cashBank.length + finance.length + stock.length;
  const currentBalance = cashBank.reduce(
    (total, record) => total + (record.transactionType === 'Giriş' ? record.amount : -record.amount),
    0
  );

  const pendingInvoices = invoices.filter((invoice) => invoice.status === 'Beklemede');
  const pendingReceivables = pendingInvoices.filter((invoice) => getInvoiceDirection(invoice) === 'inflow');
  const pendingPayables = pendingInvoices.filter((invoice) => getInvoiceDirection(invoice) === 'outflow');

  const overdueReceivables = sum(
    pendingReceivables
      .filter((invoice) => daysFromToday(invoice.dueDate, todayKey) < 0)
      .map((invoice) => invoice.amount)
  );
  const overduePayables = sum(
    pendingPayables
      .filter((invoice) => daysFromToday(invoice.dueDate, todayKey) < 0)
      .map((invoice) => invoice.amount)
  );
  const totalPendingReceivables = sum(pendingReceivables.map((invoice) => invoice.amount));

  const monthFinance = finance.filter((record) => record.date.startsWith(currentMonth));
  const monthlyIncome = sum(monthFinance.filter((record) => record.type === 'Gelir').map((record) => record.amount));
  const monthlyExpense = sum(monthFinance.filter((record) => record.type === 'Gider').map((record) => record.amount));
  const monthlyProfitLoss = monthlyIncome - monthlyExpense;

  const financeLast30 = finance.filter((record) => isWithinLastDays(record.date, 30, todayKey));
  const cashBankLast30 = cashBank.filter((record) => isWithinLastDays(record.date, 30, todayKey));
  const financeNet30 = sum(
    financeLast30.map((record) => (record.type === 'Gelir' ? record.amount : -record.amount))
  );
  const cashBankNet30 = sum(
    cashBankLast30.map((record) => (record.transactionType === 'Giriş' ? record.amount : -record.amount))
  );
  const dailyOperatingTrend = (financeLast30.length ? financeNet30 : cashBankNet30) / 30;

  const lowStockItems = stock.filter((item) => {
    const minStock = Number.isFinite(item.minStock) ? item.minStock : 5;
    return item.quantity <= minStock;
  });

  const confidence = getConfidence(recordCount);
  const forecast = FORECAST_HORIZONS.map((horizonDays) => {
    const expectedInflows = sum(
      pendingReceivables
        .filter((invoice) => {
          const diff = daysFromToday(invoice.dueDate, todayKey);
          return Number.isFinite(diff) && diff <= horizonDays;
        })
        .map((invoice) => {
          const diff = daysFromToday(invoice.dueDate, todayKey);
          return diff < 0 ? invoice.amount * 0.45 : invoice.amount;
        })
    );
    const expectedOutflows = sum(
      pendingPayables
        .filter((invoice) => {
          const diff = daysFromToday(invoice.dueDate, todayKey);
          return Number.isFinite(diff) && diff <= horizonDays;
        })
        .map((invoice) => invoice.amount)
    );
    const operatingTrend = dailyOperatingTrend * horizonDays;
    const projectedBalance = currentBalance + expectedInflows - expectedOutflows + operatingTrend;

    return {
      horizonDays,
      projectedBalance,
      expectedInflows,
      expectedOutflows,
      operatingTrend,
      netChange: projectedBalance - currentBalance,
      confidence,
    };
  });

  let score = 100;
  if (recordCount < 5) score -= 15;
  if (currentBalance < 0) score -= 25;
  else if (monthlyExpense > 0 && currentBalance < monthlyExpense * 0.5) score -= 12;
  if (monthlyProfitLoss < 0) score -= 18;
  else if (monthlyIncome > 0 && monthlyExpense / monthlyIncome > 0.85) score -= 8;
  if (totalPendingReceivables > 0 && overdueReceivables / totalPendingReceivables > 0.4) score -= 20;
  else if (overdueReceivables > 0) score -= 10;
  if (overduePayables > 0) score -= 12;
  score -= Math.min(15, lowStockItems.length * 3);
  if ((forecast[0]?.projectedBalance ?? 0) < 0) score -= 15;
  if (recordCount < 5) score = Math.min(score, emptyBusinessInsights.healthScore);

  const healthScore = clampScore(score);
  const healthLabel = recordCount < 5 ? 'Veri bekleniyor' : getHealthLabel(healthScore);
  const healthSummary = recordCount < 5 ? emptyBusinessInsights.healthSummary : getHealthSummary(healthScore);

  const healthDrivers = [
    currentBalance >= 0 ? 'Kasa/banka bakiyesi pozitif.' : 'Kasa/banka bakiyesi negatif bölgede.',
    monthlyProfitLoss >= 0 ? 'Bu ay kârlılık pozitif veya dengede.' : 'Bu ay giderler gelirlerin üzerinde.',
    overdueReceivables > 0
      ? 'Vadesi geçen alacaklar skoru aşağı çekiyor.'
      : 'Vadesi geçen alacak baskısı görünmüyor.',
    lowStockItems.length > 0
      ? `${lowStockItems.length} stok kalemi minimum seviyede.`
      : 'Stok alarmı düşük seviyede.',
  ];

  const risks: SmartInsight[] = [];
  const recommendations: SmartInsight[] = [];
  const anomalies: SmartInsight[] = [];

  if ((forecast[0]?.projectedBalance ?? 0) < 0) {
    risks.push({
      id: 'cash-gap-30',
      title: '30 günlük nakit açığı riski',
      description: 'Beklenen giriş/çıkışlara göre kısa vadede kasa bakiyesi negatife dönebilir.',
      severity: 'critical',
      route: '/kasa-banka',
      action: 'Nakit planı yap',
    });
  }

  if (overdueReceivables > 0) {
    risks.push({
      id: 'overdue-receivables',
      title: 'Tahsilat baskısı',
      description: 'Vadesi geçen alacaklar nakit akışını yavaşlatıyor.',
      severity: 'warning',
      route: '/faturalar',
      action: 'Faturaları incele',
    });
    recommendations.push({
      id: 'payment-link',
      title: 'Ödeme linki/QR tahsilat akışı',
      description: 'Geciken faturalar için ödeme linki gönderme akışı öncelikli entegrasyon adayı.',
      severity: 'info',
      route: '/faturalar',
      action: 'Tahsilata git',
    });
  }

  if (overduePayables > 0) {
    risks.push({
      id: 'overdue-payables',
      title: 'Geciken ödeme yükü',
      description: 'Vadesi geçmiş alış faturaları tedarikçi ilişkilerinde risk oluşturabilir.',
      severity: 'warning',
      route: '/faturalar',
      action: 'Ödemeleri gör',
    });
  }

  if (lowStockItems.length > 0) {
    risks.push({
      id: 'low-stock',
      title: 'Stok sürekliliği riski',
      description: `${lowStockItems.length} ürün minimum stok seviyesinin altında veya sınırında.`,
      severity: 'warning',
      route: '/stok',
      action: 'Stokları kontrol et',
    });
    recommendations.push({
      id: 'supplier-check',
      title: 'Tedarikçi karşılaştırma modülü',
      description: 'Düşük stoklu ürünlerde tedarikçi fiyatlarını karşılaştıran öneri motoru değer yaratır.',
      severity: 'info',
      route: '/stok',
      action: 'Stok planla',
    });

    // AI Stock Forecasting logic
    stock.forEach(item => {
      const itemMovements = movements.filter(m => m.stockCode === item.code && m.movementType === 'Çıkış');
      if (itemMovements.length >= 3) {
        const totalOut = sum(itemMovements.map(m => m.quantity));
        const firstMovement = itemMovements[itemMovements.length - 1];
        const daysDiff = daysFromToday(firstMovement.date, todayKey);
        const velocity = totalOut / Math.abs(daysDiff || 1);
        
        if (velocity > 0) {
          const daysRemaining = Math.floor(item.quantity / velocity);
          if (daysRemaining <= 7 && daysRemaining >= 0) {
            risks.push({
              id: `stock-out-${item.code}`,
              title: `Stok Tükenme Alarmı: ${item.name}`,
              description: `Satış hızına göre bu ürün ${daysRemaining} gün içinde tükenecek.`,
              severity: 'critical',
              route: '/stok',
              action: 'Sipariş ver'
            });
          } else if (daysRemaining <= 15 && daysRemaining > 7) {
            recommendations.push({
              id: `stock-predict-${item.code}`,
              title: `Stok Öngörüsü: ${item.name}`,
              description: `Mevcut tempoda stok 15 gün içinde kritik seviyeye düşecek.`,
              severity: 'warning',
              route: '/stok',
              action: 'Planlama yap'
            });
          }
        }
      }
    });
  }

  if (monthlyProfitLoss < 0) {
    recommendations.push({
      id: 'expense-review',
      title: 'Gider kırılımını gözden geçirin',
      description: 'Bu ay giderler gelirleri geçti; kategori bazlı limit ve uyarı eklemek faydalı olur.',
      severity: 'warning',
      route: '/gelir-gider',
      action: 'Giderlere bak',
    });
  }

  if (recordCount < 5) {
    recommendations.push({
      id: 'data-depth',
      title: 'Analiz kalitesini artırın',
      description: 'İlk fatura, kasa/banka ve gelir-gider kayıtlarını girince skor daha isabetli çalışır.',
      severity: 'info',
      route: '/faturalar',
      action: 'İlk kayıtları gir',
    });
  }

  const last7Expense = sum(
    finance
      .filter((record) => record.type === 'Gider' && isWithinLastDays(record.date, 7, todayKey))
      .map((record) => record.amount)
  );
  const previousExpense = sum(
    finance
      .filter((record) => {
        const diff = daysFromToday(record.date, todayKey);
        return record.type === 'Gider' && Number.isFinite(diff) && diff <= -7 && diff > -30;
      })
      .map((record) => record.amount)
  );
  const previousDailyExpense = previousExpense / 23;
  if (previousDailyExpense > 0 && last7Expense / 7 > previousDailyExpense * 1.75) {
    anomalies.push({
      id: 'expense-spike',
      title: 'Gider temposu yükseldi',
      description: 'Son 7 günlük gider ortalaması önceki dönemin belirgin üzerinde.',
      severity: 'warning',
      route: '/gelir-gider',
      action: 'Kategorileri incele',
    });
  }

  const outgoingCash = cashBank.filter((record) => record.transactionType === 'Çıkış');
  const averageCashOut = outgoingCash.length
    ? sum(outgoingCash.map((record) => record.amount)) / outgoingCash.length
    : 0;
  const largeRecentOut = outgoingCash.find(
    (record) =>
      isWithinLastDays(record.date, 7, todayKey) &&
      averageCashOut > 0 &&
      record.amount > averageCashOut * 2.5 &&
      record.amount >= 1000
  );
  if (largeRecentOut) {
    anomalies.push({
      id: 'large-cash-out',
      title: 'Olağandışı yüksek çıkış',
      description: `${largeRecentOut.accountName} hesabında tipik işlemlerin üzerinde bir çıkış var.`,
      severity: 'warning',
      route: '/kasa-banka',
      action: 'İşlemi kontrol et',
    });
  }

  const salesInLast7 = getSalesTotal(invoices, todayKey, 7, 0);
  const salesInPrevious7 = getSalesTotal(invoices, todayKey, 14, 7);
  if (salesInPrevious7 > 0 && salesInLast7 < salesInPrevious7 * 0.5) {
    anomalies.push({
      id: 'sales-drop',
      title: 'Satış ivmesi düştü',
      description: 'Son 7 günlük satış hacmi önceki haftanın yarısından az.',
      severity: 'warning',
      route: '/raporlar',
      action: 'Raporları aç',
    });
  }

  if (!risks.length) {
    risks.push({
      id: 'stable-risk',
      title: 'Kritik risk görünmüyor',
      description: 'Mevcut verilerde acil müdahale gerektiren bir finansal sinyal yakalanmadı.',
      severity: 'success',
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      id: 'growth-automation',
      title: 'Bir sonraki akıllı adım',
      description: 'Ödeme linki, banka hareketi ve e-ticaret entegrasyonları operasyon yükünü azaltır.',
      severity: 'info',
      route: '/ayarlar',
      action: 'Yol haritası',
    });
  }

  if (!anomalies.length) {
    anomalies.push({
      id: 'no-anomaly',
      title: 'Anomali saptanmadı',
      description: 'Son dönem gider, tahsilat ve satış hareketleri olağan aralıkta.',
      severity: 'success',
    });
  }

  return {
    healthScore,
    healthLabel,
    healthSummary,
    healthDrivers,
    forecast,
    risks: risks.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
    anomalies: anomalies.slice(0, 3),
    generatedAt: todayKey,
  };
}

function getSalesTotal(invoices: InvoiceRecord[], todayKey: string, fromDaysAgo: number, toDaysAgo: number) {
  return sum(
    invoices
      .filter((invoice) => {
        if (getInvoiceDirection(invoice) !== 'inflow') return false;
        const diff = daysFromToday(invoice.dueDate, todayKey);
        return Number.isFinite(diff) && diff <= -toDaysAgo && diff > -fromDaysAgo;
      })
      .map((invoice) => invoice.amount)
  );
}
