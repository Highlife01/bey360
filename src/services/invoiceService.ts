import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { createWorker } from 'tesseract.js';
import { logAction } from './logService';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

export interface InvoiceRecord {
  id?: string;
  customerName: string;
  customerId?: string;
  invoiceType: 'Satış' | 'Alış' | 'Proforma' | 'İade' | 'Hizmet' | 'Ürün';
  invoiceNumber: string;
  amount: number;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  issueDate: string;
  dueDate: string;
  status: 'Beklemede' | 'Onaylandı' | 'Reddedildi' | 'Ödendi';
  items?: InvoiceItem[];
  note?: string;
  currency?: string;
  createdAt?: unknown;
}

const getInvoicesCollection = (uid: string) => collection(db, 'users', uid, 'invoices');

export async function addInvoice(uid: string, invoice: Omit<InvoiceRecord, 'id' | 'createdAt'>) {
  const docRef = await addDoc(getInvoicesCollection(uid), {
    ...invoice,
    createdAt: serverTimestamp(),
  });
  await logAction(uid, 'Fatura Oluşturuldu', 'Faturalar', `${invoice.invoiceNumber} - ${invoice.customerName}`);
  return { id: docRef.id, ...invoice };
}

export async function getInvoices(uid: string) {
  const invoicesQuery = query(getInvoicesCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(invoicesQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as InvoiceRecord) }));
}

export async function updateInvoice(uid: string, invoiceId: string, updates: Partial<InvoiceRecord>) {
  const docRef = doc(getInvoicesCollection(uid), invoiceId);
  await updateDoc(docRef, updates);
  await logAction(uid, 'Fatura Güncellendi', 'Faturalar', `${updates.invoiceNumber || 'ID: ' + invoiceId}`);
}

export async function deleteInvoice(uid: string, invoiceId: string) {
  const docRef = doc(getInvoicesCollection(uid), invoiceId);
  await deleteDoc(docRef);
  await logAction(uid, 'Fatura Silindi', 'Faturalar', `ID: ${invoiceId}`);
}

export async function performRealOCR(file: File) {
  const worker = await createWorker('tur');
  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();

  // Basic regex parsing for Turkish invoices
  const dateRegex = /(\d{2})[\.\/](\d{2})[\.\/](\d{4})/;
  const amountRegex = /(?:TOPLAM|GENEL TOPLAM|TUTAR).*?(\d+[\.,]\d{2})/i;
  const vknRegex = /(?:VKN|TCKN|VERGİ NO).*?(\d{10,11})/i;

  const dateMatch = text.match(dateRegex);
  const amountMatch = text.match(amountRegex);
  const vknMatch = text.match(vknRegex);

  return {
    success: true,
    text,
    extractedData: {
      date: dateMatch ? `${dateMatch[1]}.${dateMatch[2]}.${dateMatch[3]}` : null,
      amount: amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : null,
      vkn: vknMatch ? vknMatch[1] : null,
    }
  };
}
