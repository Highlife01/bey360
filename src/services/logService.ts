import { collection, addDoc, query, orderBy, getDocs, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface AuditLog {
  id?: string;
  userId: string;
  userEmail: string;
  action: string;
  module: string;
  details: string;
  createdAt: any;
}

export async function logAction(userId: string, userEmail: string, action: string, module: string, details: string) {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      userId,
      userEmail,
      action,
      module,
      details,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error('Logging failed:', err);
  }
}

export async function getRecentLogs(userId: string): Promise<AuditLog[]> {
  const q = query(
    collection(db, 'audit_logs'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as AuditLog));
}
