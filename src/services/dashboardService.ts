import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { getLowStockCount } from './stockService';
import { InvoiceRecord } from './invoiceService';

interface DashboardResult {
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

const getCollection = (uid: string, collectionName: string) => collection(db, 'users', uid, collectionName);

function formatCurrency(value: number) {
  const sign = value < 0 ? '-' : '';
  return `${sign}₺${Math.abs(Math.round(value)).toLocaleString('tr-TR')}`;
}

function isIncomeInvoice(invoice: InvoiceRecord) {
  return invoice.invoiceType !== 'Alış' && invoice.invoiceType !== 'İade';
}

function getDateAfter(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export async function getDashboardStats(uid: string): Promise<DashboardResult> {
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);

  const invoicesQuery = query(getCollection(uid, 'invoices'));
  const invoicesSnapshot = await getDocs(invoicesQuery);
  const invoices = invoicesSnapshot.docs.map((doc) => doc.data() as InvoiceRecord);

  const cashBankQuery = query(getCollection(uid, 'cashBank'));
  const cashBankSnapshot = await getDocs(cashBankQuery);
  const cashBank = cashBankSnapshot.docs.map((doc) => doc.data() as any);

  const financeQuery = query(getCollection(uid, 'finance'));
  const financeSnapshot = await getDocs(financeQuery);
  const finance = financeSnapshot.docs.map((doc) => doc.data() as any);

  const dailySalesTotal = invoices
    .filter((invoice) => isIncomeInvoice(invoice) && invoice.dueDate === today)
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const dailyCollectionTotal = cashBank
    .filter((record) => record.transactionType === 'Giriş' && record.date === today)
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const dailyExpenseTotal = cashBank
    .filter((record) => record.transactionType === 'Çıkış' && record.date === today)
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const cashBalance = cashBank
    .filter((record) => record.accountType === 'Kasa')
    .reduce((sum, item) => sum + (item.transactionType === 'Giriş' ? item.amount || 0 : -(item.amount || 0)), 0);

  const bankBalance = cashBank
    .filter((record) => record.accountType === 'Banka')
    .reduce((sum, item) => sum + (item.transactionType === 'Giriş' ? item.amount || 0 : -(item.amount || 0)), 0);

  const pendingReceivablesTotal = invoices
    .filter((invoice) => invoice.status === 'Beklemede' && isIncomeInvoice(invoice) && invoice.dueDate >= today)
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const overdueDebtsTotal = invoices
    .filter((invoice) => invoice.status === 'Beklemede' && !isIncomeInvoice(invoice) && invoice.dueDate < today)
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const invoicesIssuedCount = invoices.filter(isIncomeInvoice).length;
  const invoicesReceivedCount = invoices.filter((invoice) => !isIncomeInvoice(invoice)).length;

  const lowStockCount = await getLowStockCount(uid);
  const upcomingPaymentsCount = invoices.filter(
    (invoice) => invoice.status === 'Beklemede' && !isIncomeInvoice(invoice) && invoice.dueDate >= today && invoice.dueDate <= getDateAfter(7)
  ).length;

  const financeProfitLoss = finance
    .filter((record) => record.date.startsWith(currentMonth))
    .reduce((sum, item) => sum + (item.type === 'Gelir' ? item.amount || 0 : -(item.amount || 0)), 0);

  const invoiceProfitLoss = invoices
    .filter((invoice) => invoice.dueDate?.startsWith(currentMonth))
    .reduce((sum, item) => sum + (isIncomeInvoice(item) ? item.amount || 0 : -(item.amount || 0)), 0);

  const monthlyProfitLoss = financeProfitLoss + invoiceProfitLoss;

  return {
    dailySales: formatCurrency(dailySalesTotal),
    dailyCollection: formatCurrency(dailyCollectionTotal),
    dailyExpense: formatCurrency(dailyExpenseTotal),
    cashBalance: formatCurrency(cashBalance),
    bankBalance: formatCurrency(bankBalance),
    pendingReceivables: formatCurrency(pendingReceivablesTotal),
    overdueDebts: formatCurrency(overdueDebtsTotal),
    invoicesIssued: invoicesIssuedCount.toString(),
    invoicesReceived: invoicesReceivedCount.toString(),
    stockAlerts: `${lowStockCount} ürün`,
    upcomingPayments: `${upcomingPaymentsCount} adet`,
    monthlyProfitLoss: formatCurrency(monthlyProfitLoss),
  };
}
