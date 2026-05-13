import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface FinanceRecord {
  id?: string;
  type: 'Gelir' | 'Gider';
  category: string;
  amount: number;
  date: string;
  note: string;
  createdAt?: unknown;
}

const getFinanceCollection = (uid: string) => collection(db, 'users', uid, 'finance');

export async function addFinanceRecord(uid: string, record: Omit<FinanceRecord, 'id' | 'createdAt'>) {
  const docRef = await addDoc(getFinanceCollection(uid), {
    ...record,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...record };
}

export async function getFinanceRecords(uid: string) {
  const financeQuery = query(getFinanceCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(financeQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as FinanceRecord) }));
}

export async function updateFinanceRecord(uid: string, recordId: string, updates: Partial<FinanceRecord>) {
  const docRef = doc(getFinanceCollection(uid), recordId);
  await updateDoc(docRef, updates);
}

export async function deleteFinanceRecord(uid: string, recordId: string) {
  const docRef = doc(getFinanceCollection(uid), recordId);
  await deleteDoc(docRef);
}
