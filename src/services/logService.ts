import { collection, addDoc, query, orderBy, getDocs, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface AuditLog {
  id?: string;
  action: string;
  module: string;
  details: string;
  createdAt: any;
}

const getLogsCollection = (uid: string) => collection(db, 'users', uid, 'audit_logs');

export async function logAction(uid: string, action: string, module: string, details: string) {
  try {
    await addDoc(getLogsCollection(uid), {
      action,
      module,
      details,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error('Logging failed:', err);
  }
}

export async function getRecentLogs(uid: string, count = 10): Promise<AuditLog[]> {
  try {
    const q = query(
      getLogsCollection(uid),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AuditLog));
  } catch (err) {
    console.error('Failed to fetch logs:', err);
    return [];
  }
}
