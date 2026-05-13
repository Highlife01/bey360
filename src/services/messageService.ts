import { collection, addDoc, query, orderBy, getDocs, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: any;
}

export const submitContactMessage = async (message: ContactMessage) => {
  const docRef = await addDoc(collection(db, 'messages'), {
    ...message,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate()?.toLocaleString() || 'N/A',
    } as ContactMessage;
  });
};
