import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { addCompany, CompanyRecord, getCompanies } from '../services/companyService';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { User as UserIcon, Building2, Save, CheckCircle2 } from 'lucide-react';

interface SettingsProps {
  user: User | null;
}

export default function Settings({ user }: SettingsProps) {
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [profile, setProfile] = useState({
    displayName: '',
    phone: '',
    companyName: '',
    email: '',
  });
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
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const [companyRows, userProfile] = await Promise.all([
        getCompanies(user.uid),
        getUserProfile(user.uid)
      ]);
      setCompanies(companyRows);
      if (userProfile) {
        setProfile({
          displayName: userProfile.displayName || '',
          phone: userProfile.phone || '',
          companyName: userProfile.companyName || '',
          email: userProfile.email || user.email || '',
        });
      }
    };
    load();
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await updateUserProfile(user.uid, profile);
    setSuccess('Profil bilgileri başarıyla güncellendi.');
    setTimeout(() => setSuccess(''), 3000);
  };

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
    setSuccess('Yeni firma başarıyla eklendi.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSelectCompany = (id: string) => {
    setActiveCompany(id);
    localStorage.setItem('bey360_active_company', id);
  };

  return (
    <div className="page-section">
      <div className="page-header-block">
        <div className="flex items-center justify-between">
          <div>
            <h2>Ayarlar & Profil</h2>
            <p>Firma profilinizi, kullanıcı bilgilerinizi ve çoklu firma yönetimini buradan düzenleyin.</p>
          </div>
          {success && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 border border-emerald-400/20 rounded-lg text-emerald-400 text-sm font-bold animate-in fade-in zoom-in">
              <CheckCircle2 size={16} /> {success}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <UserIcon className="text-cyan-300" />
              <h3 className="mb-0">Firma & Kullanıcı Profili</h3>
            </div>
            <form className="dashboard-form" onSubmit={handleProfileSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <label>
                  Ad Soyad
                  <input 
                    value={profile.displayName} 
                    onChange={e => setProfile({...profile, displayName: e.target.value})} 
                    required 
                  />
                </label>
                <label>
                  Telefon
                  <input 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})} 
                  />
                </label>
              </div>
              <label>
                Firma Adı (Birincil)
                <input 
                  value={profile.companyName} 
                  onChange={e => setProfile({...profile, companyName: e.target.value})} 
                  required 
                />
              </label>
              <label>
                E-Posta
                <input 
                  type="email" 
                  value={profile.email} 
                  readOnly 
                  className="opacity-50 cursor-not-allowed"
                />
              </label>
              <button type="submit" className="button-primary flex items-center justify-center gap-2">
                <Save size={18} /> Profili Güncelle
              </button>
            </form>
          </section>

          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="text-cyan-300" />
              <h3 className="mb-0">Ek Şube / Firma Ekle</h3>
            </div>
            <form className="dashboard-form" onSubmit={handleSubmit}>
              <label>
                Firma Adı
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <label>
                  Vergi No
                  <input value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} required />
                </label>
                <label>
                  Vergi Dairesi
                  <input value={form.taxOffice} onChange={(e) => setForm({ ...form, taxOffice: e.target.value })} />
                </label>
              </div>
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
              <button type="submit" className="button-secondary">Firma Kaydı Oluştur</button>
            </form>
          </section>
        </div>

        <section className="card h-fit">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="text-cyan-300" />
            <h3 className="mb-0">Kayıtlı Firmalar</h3>
          </div>
          <div className="space-y-3">
            <div className={`list-item border-cyan-300/30 bg-cyan-300/5`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-black">{profile.companyName}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-cyan-200">Ana Firma Profili</p>
                </div>
                <span className="badge">Aktif</span>
              </div>
            </div>
            
            {companies.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-white/10 rounded-xl text-slate-500 text-xs font-bold">
                Henüz ek şube veya firma eklenmemiş.
              </div>
            ) : (
              companies.map((company) => (
                <article
                  key={company.id}
                  className={`list-item cursor-pointer transition-all ${activeCompany === company.id ? 'border-cyan-300/40 bg-cyan-300/10' : 'hover:border-white/20'}`}
                  onClick={() => handleSelectCompany(company.id!)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black">{company.name}</h4>
                      <div className="flex gap-3 text-[10px] text-slate-400 mt-1">
                        <span>VKN: {company.taxId}</span>
                        <span>{company.taxOffice}</span>
                      </div>
                    </div>
                    {activeCompany === company.id && <span className="badge">Seçili</span>}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
