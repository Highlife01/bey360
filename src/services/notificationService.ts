import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface NotificationRecord {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read?: boolean;
  createdAt?: unknown;
}

const getNotificationsCollection = (uid: string) => collection(db, 'users', uid, 'notifications');

export async function addNotification(uid: string, notification: Omit<NotificationRecord, 'id' | 'createdAt'>) {
  const docRef = await addDoc(getNotificationsCollection(uid), {
    ...notification,
    read: notification.read ?? false,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...notification };
}

export async function getNotifications(uid: string) {
  const notifQuery = query(getNotificationsCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(notifQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as NotificationRecord) }));
}
