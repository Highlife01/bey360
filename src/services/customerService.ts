import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { logAction } from './logService';

export interface CustomerRecord {
  id?: string;
  name: string;
  type: 'Firma' | 'Şahıs';
  taxId: string;
  taxOffice: string;
  phone: string;
  email: string;
  address: string;
  iban: string;
  createdAt?: unknown;
}

const getCustomersCollection = (uid: string) => collection(db, 'users', uid, 'customers');

export async function addCustomer(uid: string, customer: Omit<CustomerRecord, 'id' | 'createdAt'>) {
  const docRef = await addDoc(getCustomersCollection(uid), {
    ...customer,
    createdAt: serverTimestamp(),
  });
  await logAction(uid, 'Cari Hesap Oluşturuldu', 'Cariler', customer.name);
  return { id: docRef.id, ...customer };
}

export async function getCustomers(uid: string) {
  const customersQuery = query(getCustomersCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(customersQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as CustomerRecord) }));
}

export async function updateCustomer(uid: string, customerId: string, updates: Partial<CustomerRecord>) {
  const docRef = doc(getCustomersCollection(uid), customerId);
  await updateDoc(docRef, updates);
  await logAction(uid, 'Cari Hesap Güncellendi', 'Cariler', updates.name || `ID: ${customerId}`);
}

export async function deleteCustomer(uid: string, customerId: string) {
  const docRef = doc(getCustomersCollection(uid), customerId);
  await deleteDoc(docRef);
  await logAction(uid, 'Cari Hesap Silindi', 'Cariler', `ID: ${customerId}`);
}
