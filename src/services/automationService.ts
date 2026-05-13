import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { StockRecord } from './stockService';
import { InvoiceRecord } from './invoiceService';

export async function checkLowStockAlerts(uid: string) {
  const stockRef = collection(db, 'users', uid, 'stock');
  const snapshot = await getDocs(stockRef);
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockRecord));
  
  const lowStockItems = items.filter(item => item.quantity <= (item.minStock || 5));
  
  for (const item of lowStockItems) {
    await sendSystemNotification(uid, 'Stok Uyarısı', `${item.name} stoğu kritik seviyede: ${item.quantity} adet kaldı.`);
  }
}

export async function checkOverdueInvoices(uid: string) {
  const invoicesRef = collection(db, 'users', uid, 'invoices');
  const today = new Date().toISOString().slice(0, 10);
  
  const q = query(invoicesRef, where('status', '==', 'Beklemede'), where('dueDate', '<', today));
  const snapshot = await getDocs(q);
  const overdue = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InvoiceRecord));
  
  for (const inv of overdue) {
    await sendSystemNotification(uid, 'Gecikmiş Fatura', `${inv.customerName} cari hesabına ait ${inv.invoiceNumber} nolu faturanın vadesi geçti.`);
  }
}

async function sendSystemNotification(uid: string, title: string, message: string) {
  const notificationsRef = collection(db, 'users', uid, 'notifications');
  
  // Check if same notification was sent today to avoid spamming
  const today = new Date().toISOString().slice(0, 10);
  const q = query(notificationsRef, where('title', '==', title), where('date', '==', today));
  const existing = await getDocs(q);
  
  if (existing.empty) {
    await addDoc(notificationsRef, {
      title,
      message,
      date: today,
      read: false,
      createdAt: serverTimestamp()
    });
  }
}
