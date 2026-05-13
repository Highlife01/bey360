import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { addCompany, CompanyRecord, getCompanies } from '../services/companyService';

interface SettingsProps {
  user: User | null;
}

export default function Settings({ user }: SettingsProps) {
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [form, setForm] = useState<Omit<CompanyRecord, 'id' | 'createdAt'>>({
    name: '',
    taxId: '',
    taxOffice: '',
    address: '',
    phone: '',
    email: '',
    mersisNo: '',
    tradeRegistryNo: '',
    logoUrl: '',
  });
  const [activeCompany, setActiveCompany] = useState<string>(() => localStorage.getItem('bey360_active_company') || '');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setCompanies(await getCompanies(user.uid));
    };
    load();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    await addCompany(user.uid, form);
    setForm({
      name: '',
      taxId: '',
      taxOffice: '',
      address: '',
      phone: '',
      email: '',
      mersisNo: '',
      tradeRegistryNo: '',
      logoUrl: '',
    });
    setCompanies(await getCompanies(user.uid));
  };

  const handleSelectCompany = (id: string) => {
    setActiveCompany(id);
    localStorage.setItem('bey360_active_company', id);
  };

  return (
    <div className="page-section">
      <div className="page-header-block">
        <h2>Ayarlar</h2>
        <p>Firma bilgilerini ve çoklu firma yönetimini düzenle.</p>
      </div>

      <div className="grid-two">
        <section className="card form-card">
          <h3>Yeni Firma</h3>
          <form className="dashboard-form" onSubmit={handleSubmit}>
            <label>
              Firma Adı
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Vergi No
              <input value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} required />
            </label>
            <label>
              Vergi Dairesi
              <input value={form.taxOffice} onChange={(e) => setForm({ ...form, taxOffice: e.target.value })} />
            </label>
            <label>
              Adres
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                Telefon
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
              <label>
                E-Posta
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                Mersis No
                <input value={form.mersisNo} onChange={(e) => setForm({ ...form, mersisNo: e.target.value })} />
              </label>
              <label>
                Ticaret Sicil No
                <input value={form.tradeRegistryNo} onChange={(e) => setForm({ ...form, tradeRegistryNo: e.target.value })} />
              </label>
            </div>
            <label>
              Logo URL
              <input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
            </label>
            <button type="submit">Firma Ekle</button>
          </form>
        </section>

        <section className="card list-card">
          <h3>Firmalar</h3>
          {companies.length === 0 ? (
            <p>Henüz firma yok.</p>
          ) : (
            <div className="list-grid">
              {companies.map((company) => (
                <article
                  key={company.id}
                  className={`list-item ${activeCompany === company.id ? 'active' : ''}`}
                  onClick={() => handleSelectCompany(company.id!)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{company.name}</strong>
                  <span>VKN: {company.taxId}</span>
                  <span>{company.taxOffice}</span>
                  {activeCompany === company.id && <span className="badge">Aktif</span>}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
