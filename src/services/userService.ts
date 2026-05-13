import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface DashboardStats {
  dailySales: string;
  dailyCollection: string;
  dailyExpense: string;
  cashBalance: string;
  bankBalance: string;
  pendingReceivables: string;
  overdueDebts: string;
  invoicesIssued: string;
  invoicesReceived: string;
  stockAlerts: string;
  upcomingPayments: string;
  monthlyProfitLoss: string;
}

export const defaultDashboardStats: DashboardStats = {
  dailySales: '₺0',
  dailyCollection: '₺0',
  dailyExpense: '₺0',
  cashBalance: '₺0',
  bankBalance: '₺0',
  pendingReceivables: '₺0',
  overdueDebts: '₺0',
  invoicesIssued: '0',
  invoicesReceived: '0',
  stockAlerts: '0 ürün',
  upcomingPayments: '0 adet',
  monthlyProfitLoss: '₺0',
};

export async function ensureUserDashboard(uid: string, email: string) {
  const userDocRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userDocRef);

  if (!snapshot.exists()) {
    await setDoc(userDocRef, {
      email,
      createdAt: serverTimestamp(),
      dashboard: defaultDashboardStats,
    });
    return defaultDashboardStats;
  }

  const data = snapshot.data();
  return (data.dashboard || defaultDashboardStats) as DashboardStats;
}

export async function getUserDashboard(uid: string) {
  const userDocRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userDocRef);
  if (!snapshot.exists()) {
    throw new Error('Kullanıcı kaydı bulunamadı');
  }

  const data = snapshot.data();
  return (data.dashboard || defaultDashboardStats) as DashboardStats;
}
