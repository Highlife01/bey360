import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface CashBankRecord {
  id?: string;
  accountType: 'Kasa' | 'Banka';
  transactionType: 'Giriş' | 'Çıkış';
  amount: number;
  accountName: string;
  date: string;
  description: string;
  createdAt?: unknown;
}

const getCashBankCollection = (uid: string) => collection(db, 'users', uid, 'cashBank');

export async function addCashBankRecord(uid: string, record: Omit<CashBankRecord, 'id' | 'createdAt'>) {
  const docRef = await addDoc(getCashBankCollection(uid), {
    ...record,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...record };
}

export async function getCashBankRecords(uid: string) {
  const cashBankQuery = query(getCashBankCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(cashBankQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as CashBankRecord) }));
}

export async function updateCashBankRecord(uid: string, recordId: string, updates: Partial<CashBankRecord>) {
  const docRef = doc(getCashBankCollection(uid), recordId);
  await updateDoc(docRef, updates);
}

export async function deleteCashBankRecord(uid: string, recordId: string) {
  const docRef = doc(getCashBankCollection(uid), recordId);
  await deleteDoc(docRef);
}
