import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface CompanyRecord {
  id?: string;
  name: string;
  taxId: string;
  taxOffice: string;
  address?: string;
  phone?: string;
  email?: string;
  mersisNo?: string;
  tradeRegistryNo?: string;
  logoUrl?: string;
  createdAt?: unknown;
}

const getCompaniesCollection = (uid: string) => collection(db, 'users', uid, 'companies');

export async function addCompany(uid: string, company: Omit<CompanyRecord, 'id' | 'createdAt'>) {
  const docRef = await addDoc(getCompaniesCollection(uid), {
    ...company,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...company };
}

export async function getCompanies(uid: string) {
  const companiesQuery = query(getCompaniesCollection(uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(companiesQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as CompanyRecord) }));
}
