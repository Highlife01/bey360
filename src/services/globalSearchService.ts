import { getCustomers } from './customerService';
import { getInvoices } from './invoiceService';
import { getStockItems } from './stockService';

export interface SearchResult {
  id: string;
  type: 'Cari' | 'Fatura' | 'Stok' | 'Modül';
  title: string;
  subtitle: string;
  path: string;
}

export async function performGlobalSearch(uid: string, query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();

  const [customers, invoices, stocks] = await Promise.all([
    getCustomers(uid),
    getInvoices(uid),
    getStockItems(uid)
  ]);

  const results: SearchResult[] = [];

  // Search Customers
  customers.forEach(c => {
    if (c.name.toLowerCase().includes(lowerQuery) || c.taxId?.includes(lowerQuery)) {
      results.push({
        id: c.id!,
        type: 'Cari',
        title: c.name,
        subtitle: `${c.type} - ${c.taxOffice || ''}`,
        path: '/cariler'
      });
    }
  });

  // Search Invoices
  invoices.forEach(inv => {
    if (inv.invoiceNumber.toLowerCase().includes(lowerQuery) || inv.customerName.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: inv.id!,
        type: 'Fatura',
        title: inv.invoiceNumber,
        subtitle: `${inv.customerName} - ${inv.grandTotal.toLocaleString('tr-TR')} ₺`,
        path: '/faturalar'
      });
    }
  });

  // Search Stocks
  stocks.forEach(s => {
    if (s.name.toLowerCase().includes(lowerQuery) || s.code.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: s.id!,
        type: 'Stok',
        title: s.name,
        subtitle: `${s.code} - Stok: ${s.quantity} ${s.unit}`,
        path: '/stoklar'
      });
    }
  });

  return results.slice(0, 10); // Limit results for UI
}
