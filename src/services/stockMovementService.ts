import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface StockMovementRecord {
  id?: string;
  stockCode: string;
  stockName: string;
  movementType: 'Giriş' | 'Çıkış';
  quantity: number;
  date: string;
  note: string;
  createdAt?: unknown;
}

const getStockMovementsCollection = (uid: string) => collection(db, 'users', uid, 'stockMovements');

export async function addStockMovement(uid: string, movement: Omit<StockMovementRecord, 'id' | 'createdAt'>) {
  const docRef = await addDoc(getStockMovementsCollection(uid), {
    ...movement,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...movement };
}

export async function getStockMovements(uid: string) {
  const movementsQuery = query(getStockMovementsCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(movementsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as StockMovementRecord) }));
}
