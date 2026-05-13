import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface StockRecord {
  id?: string;
  name: string;
  code: string;
  barcode: string;
  category: string;
  brand: string;
  purchasePrice: number;
  salePrice: number;
  vatRate: number;
  unit: string;
  quantity: number;
  minStock: number;
  createdAt?: unknown;
}

const getStockCollection = (uid: string) => collection(db, 'users', uid, 'stock');

export async function addStockItem(uid: string, stock: Omit<StockRecord, 'id' | 'createdAt'>) {
  const docRef = await addDoc(getStockCollection(uid), {
    ...stock,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...stock };
}

export async function getStockItems(uid: string) {
  const stockQuery = query(getStockCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(stockQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as StockRecord) }));
}

export async function getLowStockCount(uid: string) {
  const snapshot = await getDocs(getStockCollection(uid));
  return snapshot.docs
    .map((doc) => doc.data() as StockRecord)
    .filter((item) => item.quantity <= (item.minStock || 5)).length;
}

export async function getStockItemCount(uid: string) {
  const snapshot = await getDocs(getStockCollection(uid));
  return snapshot.size;
}

export async function updateStockItem(uid: string, itemId: string, updates: Partial<StockRecord>) {
  const docRef = doc(getStockCollection(uid), itemId);
  await updateDoc(docRef, updates);
}

export async function deleteStockItem(uid: string, itemId: string) {
  const docRef = doc(getStockCollection(uid), itemId);
  await deleteDoc(docRef);
}
