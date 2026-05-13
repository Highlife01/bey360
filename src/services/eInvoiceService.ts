import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface EInvoiceRecord {
  id?: string;
  docType: 'e-Fatura' | 'e-Arşiv';
  scenario?: 'TEMELFATURA' | 'TICARIFATURA' | 'EARSIVFATURA' | 'KAMU' | 'IHRACAT' | 'YOLCUBERABER' | 'YATIRIMTESVIK';
  invoiceTypeCode?: 'SATIS' | 'IADE' | 'ISTISNA' | 'TEVKIFAT' | 'OZELMATRAH' | 'IHRACKAYITLI' | 'YTBISTISNA' | 'SARJ' | 'TEKNOLOJIDESTEK' | 'IDIS' | 'DIGER';
  invoiceNumber: string;
  customerName?: string;
  customerTaxId?: string;
  recipientType?: 'e-Fatura Mükellefi' | 'e-Arşiv Alıcısı' | 'Nihai Tüketici';
  status: 'Taslak' | 'Gönderime Hazır' | 'Gönderildi' | 'Başarılı' | 'Başarısız' | 'İptal/İtiraz';
  issueDate: string;
  amount: number;
  vatRate?: number;
  vatAmount?: number;
  grandTotal?: number;
  specialBaseEnabled?: boolean;
  specialBaseAmount?: number;
  specialBaseCode?: string;
  specialBaseNote?: string;
  useVatRateControlException?: boolean;
  vatRateControlCode?: string;
  gibStatusCode?: string;
  eArchiveDelivery?: 'E-Posta' | 'SMS' | 'Kağıt' | 'Yok';
  note: string;
  createdAt?: unknown;
}

const getEInvoiceCollection = (uid: string) => collection(db, 'users', uid, 'eInvoices');

export async function addEInvoice(uid: string, record: Omit<EInvoiceRecord, 'id' | 'createdAt'>) {
  const docRef = await addDoc(getEInvoiceCollection(uid), {
    ...record,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...record };
}

export async function getEInvoices(uid: string) {
  const invoicesQuery = query(getEInvoiceCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(invoicesQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as EInvoiceRecord) }));
}
