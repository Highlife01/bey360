import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export interface AdminUserRow {
  uid: string;
  email: string;
  createdAt: string;
  customers: number;
  invoices: number;
  cashBank: number;
  finance: number;
  stock: number;
}

async function countCollection(uid: string, name: string): Promise<number> {
  try {
    const snap = await getDocs(collection(db, 'users', uid, name));
    return snap.size;
  } catch {
    return 0;
  }
}

export async function listAllUsers(): Promise<AdminUserRow[]> {
  const usersSnap = await getDocs(collection(db, 'users'));
  const rows: AdminUserRow[] = [];

  for (const userDoc of usersSnap.docs) {
    const data = userDoc.data() as { email?: string; createdAt?: { toDate?: () => Date } };
    const [customers, invoices, cashBank, finance, stock] = await Promise.all([
      countCollection(userDoc.id, 'customers'),
      countCollection(userDoc.id, 'invoices'),
      countCollection(userDoc.id, 'cashBank'),
      countCollection(userDoc.id, 'finance'),
      countCollection(userDoc.id, 'stock'),
    ]);

    rows.push({
      uid: userDoc.id,
      email: data.email ?? '—',
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString('tr-TR') : '—',
      customers,
      invoices,
      cashBank,
      finance,
      stock,
    });
  }

  return rows;
}
