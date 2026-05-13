import { collection, addDoc, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface ContactMessageInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactMessage extends ContactMessageInput {
  id?: string;
  source?: string;
  page?: string;
  status?: 'new' | 'read' | 'archived';
  userAgent?: string;
  createdAt?: string;
}

function normalizeContactMessage(message: ContactMessageInput): ContactMessageInput {
  return {
    name: message.name.trim().slice(0, 80),
    email: message.email.trim().toLowerCase().slice(0, 120),
    phone: message.phone.trim().slice(0, 32),
    message: message.message.trim().slice(0, 1000),
  };
}

function validateContactMessage(message: ContactMessageInput) {
  if (message.name.length < 2) {
    throw new Error('Lütfen adınızı girin.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.email)) {
    throw new Error('Lütfen geçerli bir e-posta adresi girin.');
  }

  if (message.phone.length < 1) {
    throw new Error('Lütfen geçerli bir telefon numarası girin.');
  }

  if (message.message.length < 1) {
    throw new Error('Lütfen mesajınızı yazın.');
  }
}

function getClientMeta() {
  if (typeof window === 'undefined') {
    return {
      page: '/',
      userAgent: 'server',
    };
  }

  return {
    page: window.location.pathname.slice(0, 120),
    userAgent: window.navigator.userAgent.slice(0, 240),
  };
}

export const submitContactMessage = async (message: ContactMessageInput) => {
  const payload = normalizeContactMessage(message);
  validateContactMessage(payload);

  const docRef = await addDoc(collection(db, 'messages'), {
    ...payload,
    ...getClientMeta(),
    source: 'landing-contact',
    status: 'new',
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
