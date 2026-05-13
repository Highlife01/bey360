import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
}

export async function deleteInvoice(uid: string, invoiceId: string) {
  const docRef = doc(getInvoicesCollection(uid), invoiceId);
  await deleteDoc(docRef);
}
