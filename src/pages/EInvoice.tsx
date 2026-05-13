import { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck2,
  KeyRound,
  PlugZap,
  QrCode,
  RefreshCw,
  Send,
  ShieldCheck,
  TableProperties,
} from 'lucide-react';
import { addEInvoice, getEInvoices, EInvoiceRecord } from '../services/eInvoiceService';
import { exportToExcel } from '../services/excelService';
import {
  HIZLI_TECHNOLOGY,
  type HizliTechnologyConnectionResult,
  testHizliTechnologyConnection,
} from '../services/hizliTechnologyService';

interface EInvoiceProps {
  user: User | null;
}

type EInvoiceForm = Omit<EInvoiceRecord, 'id' | 'createdAt'>;
type FormField = keyof EInvoiceForm;

const today = new Date().toISOString().slice(0, 10);

const createEmptyForm = (): EInvoiceForm => ({
  docType: 'e-Fatura',
  scenario: 'TEMELFATURA',
  invoiceTypeCode: 'SATIS',
  invoiceNumber: '',
  customerName: '',
  customerTaxId: '',
  recipientType: 'e-Fatura Mükellefi',
  status: 'Taslak',
  issueDate: today,
  amount: 0,
  vatRate: 20,
  vatAmount: 0,
  grandTotal: 0,
  specialBaseEnabled: false,
  specialBaseAmount: 0,
  specialBaseCode: '',
  specialBaseNote: '',
  useVatRateControlException: false,
  vatRateControlCode: '',
  gibStatusCode: '',
  eArchiveDelivery: 'Yok',
  note: '',
});

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatNumber = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: 2,
  }).format(value || 0);

const getStatusBadge = (status: EInvoiceRecord['status']) => {
  if (['Başarılı', 'Gönderildi'].includes(status)) return 'badge-success';
  if (['Başarısız', 'İptal/İtiraz'].includes(status)) return 'badge-danger';
  return 'badge-warning';
};

export default function EInvoice({ user }: EInvoiceProps) {
  const [records, setRecords] = useState<EInvoiceRecord[]>([]);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [connectionResult, setConnectionResult] = useState<HizliTechnologyConnectionResult | null>(null);
  const [form, setForm] = useState<EInvoiceForm>(createEmptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const taxableBase = form.specialBaseEnabled ? Number(form.specialBaseAmount || 0) : Number(form.amount || 0);
  const calculatedVat = taxableBase * (Number(form.vatRate || 0) / 100);
  const calculatedGrandTotal = Number(form.amount || 0) + calculatedVat;

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        setRecords(await getEInvoices(user.uid));
      } catch (loadError) {
        console.error(loadError);
        setError('e-Fatura kayıtları alınamadı. Firebase izinlerini ve bağlantıyı kontrol edin.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const summary = useMemo(() => {
    const specialBaseCount = records.filter((record) => record.specialBaseEnabled || record.invoiceTypeCode === 'OZELMATRAH').length;
    const successCount = records.filter((record) => ['Başarılı', 'Gönderildi'].includes(record.status)).length;
    const failedCount = records.filter((record) => ['Başarısız', 'İptal/İtiraz'].includes(record.status)).length;
    const eArchiveCount = records.filter((record) => record.docType === 'e-Arşiv').length;
    const totalAmount = records.reduce((sum, record) => sum + (record.grandTotal || record.amount || 0), 0);
    const totalVat = records.reduce((sum, record) => sum + (record.vatAmount || 0), 0);

    return {
      specialBaseCount,
      successCount,
      failedCount,
      eArchiveCount,
      totalAmount,
      totalVat,
      successRate: records.length ? Math.round((successCount / records.length) * 100) : 0,
    };
  }, [records]);

  const handleChange = <K extends FormField>(field: K, value: EInvoiceForm[K]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === 'docType') {
        const docType = value as EInvoiceForm['docType'];
        next.scenario = docType === 'e-Arşiv' ? 'EARSIVFATURA' : 'TEMELFATURA';
        next.recipientType = docType === 'e-Arşiv' ? 'e-Arşiv Alıcısı' : 'e-Fatura Mükellefi';
        next.eArchiveDelivery = docType === 'e-Arşiv' ? 'E-Posta' : 'Yok';
      }

      if (field === 'invoiceTypeCode') {
        next.specialBaseEnabled = value === 'OZELMATRAH';
      }

      if (field === 'specialBaseEnabled' && value === true) {
        next.invoiceTypeCode = 'OZELMATRAH';
      }

      if (field === 'specialBaseEnabled' && value === false && prev.invoiceTypeCode === 'OZELMATRAH') {
        next.invoiceTypeCode = 'SATIS';
        next.specialBaseAmount = 0;
        next.specialBaseCode = '';
        next.specialBaseNote = '';
      }

      if (field === 'useVatRateControlException' && value === true) {
        next.vatRateControlCode = '555';
      }

      if (field === 'useVatRateControlException' && value === false) {
        next.vatRateControlCode = '';
      }

      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const payload: EInvoiceForm = {
      ...form,
      vatAmount: calculatedVat,
      grandTotal: calculatedGrandTotal,
      specialBaseAmount: form.specialBaseEnabled ? Number(form.specialBaseAmount || 0) : 0,
      specialBaseCode: form.specialBaseEnabled ? form.specialBaseCode : '',
      specialBaseNote: form.specialBaseEnabled ? form.specialBaseNote : '',
      vatRateControlCode: form.useVatRateControlException ? form.vatRateControlCode || '555' : '',
    };

    await addEInvoice(user.uid, payload);
    setForm(createEmptyForm());
    setRecords(await getEInvoices(user.uid));
  };

  const handleConnectionTest = async () => {
    setConnectionLoading(true);
    setConnectionResult(null);
    try {
      setConnectionResult(await testHizliTechnologyConnection());
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleExport = () => {
    exportToExcel(
      records.map((record) => ({
        Belge: record.docType,
        Senaryo: record.scenario || '',
        FaturaTipi: record.invoiceTypeCode || '',
        FaturaNo: record.invoiceNumber,
        Cari: record.customerName || '',
        VKN_TCKN: record.customerTaxId || '',
        Tarih: record.issueDate,
        MalHizmetToplami: record.amount || 0,
        OzelMatrah: record.specialBaseEnabled ? record.specialBaseAmount || 0 : '',
        KDVOrani: record.vatRate || '',
        KDVTutari: record.vatAmount || 0,
        GenelToplam: record.grandTotal || record.amount || 0,
        Durum: record.status,
        GIBDurum: record.gibStatusCode || '',
        Not: record.note || '',
      })),
      'bey360-e-fatura-arsiv',
      'e-Belgeler'
    );
  };

  if (loading) {
    return <div className="page-section">e-Fatura modülü hazırlanıyor...</div>;
  }

  return (
    <div className="page-section">
      <div className="page-header-block">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="badge">e-Belge Kontrol Kulesi</span>
            <h2 className="mt-4">e-Fatura / e-Arşiv</h2>
            <p>
              Hızlı Teknoloji eConnect hazırlığı, GİB senaryo alanları, özel matrah, KDV kontrol kodları ve belge durumlarını tek panelde yönetin.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="button-secondary inline-flex items-center gap-2" onClick={handleExport}>
              <Download size={17} />
              Excel
            </button>
            <button
              type="button"
              onClick={handleConnectionTest}
              disabled={connectionLoading}
              className="button-primary inline-flex items-center gap-2"
            >
              <RefreshCw size={16} className={connectionLoading ? 'animate-spin' : ''} />
              {connectionLoading ? 'Test Ediliyor...' : 'Bağlantı Testi'}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-4 text-sm font-bold text-rose-100">{error}</div>}

      <section className="card">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
                <PlugZap size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Hızlı Teknoloji eConnect</p>
                <h3 className="mb-0">Firma Bazlı Entegrasyon Hazırlığı</h3>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <KeyRound className="mb-3 text-cyan-200" size={20} />
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Kimlik</p>
                <p className="mt-2 text-sm font-black text-white">ApiKey + şifreli kullanıcı</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <ShieldCheck className="mb-3 text-emerald-200" size={20} />
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Gizli Anahtar</p>
                <p className="mt-2 text-sm font-black text-white">Backend güvenli alanı</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <RefreshCw className="mb-3 text-amber-100" size={20} />
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Token</p>
                <p className="mt-2 text-sm font-black text-white">Firma/mükellef bazlı</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <QrCode className="mb-3 text-fuchsia-100" size={20} />
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">GİB Hazırlığı</p>
                <p className="mt-2 text-sm font-black text-white">Karekod + paket takibi</p>
              </div>
            </div>

            {connectionResult && (
              <div
                className={`mt-5 rounded-lg border p-4 ${
                  connectionResult.ok
                    ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100'
                    : 'border-amber-300/20 bg-amber-300/10 text-amber-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  {connectionResult.ok ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                  <div>
                    <p className="font-black">{connectionResult.ok ? 'Bağlantı hazır' : 'Backend proxy gerekli'}</p>
                    <p className="mt-1 text-sm font-semibold leading-6">{connectionResult.message}</p>
                    {connectionResult.tokenExpiresAt && (
                      <p className="mt-2 text-xs font-black uppercase tracking-[0.14em]">
                        Token bitişi: {connectionResult.tokenExpiresAt}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Güncel Kontrol Notları</p>
            <div className="mt-4 space-y-3">
              <article className="list-item">
                <strong>UserList</strong>
                <span>Kapanan/açılan mükellef ve sicil sonuç takibi için kontrol listesine alındı.</span>
              </article>
              <article className="list-item">
                <strong>KDV oran kontrolü</strong>
                <span>Faaliyet kodu karşılığı kontrol ikinci duyuruya kadar beklemede; 555 kod alanı hazır tutuldu.</span>
              </article>
              <article className="list-item">
                <strong>YTB / IDIS / özel tipler</strong>
                <span>Senaryo ve fatura tipi alanları paket güncellemelerine göre genişletildi.</span>
              </article>
            </div>
            <div className="mt-5 grid gap-3">
              <a
                href={HIZLI_TECHNOLOGY.testSwaggerUrl}
                target="_blank"
                rel="noreferrer"
                className="button-secondary inline-flex items-center justify-center gap-2"
              >
                Hızlı Swagger <ExternalLink size={15} />
              </a>
              <a
                href="https://ebelge.gib.gov.tr/duyurular.html"
                target="_blank"
                rel="noreferrer"
                className="button-secondary inline-flex items-center justify-center gap-2"
              >
                GİB Duyuruları <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="cards-grid">
        <article className="stat-card">
          <FileCheck2 className="text-cyan-200" size={22} />
          <span>Belge Sayısı</span>
          <strong>{records.length}</strong>
        </article>
        <article className="stat-card">
          <CheckCircle2 className="text-emerald-200" size={22} />
          <span>Başarı Oranı</span>
          <strong>%{summary.successRate}</strong>
        </article>
        <article className="stat-card">
          <Calculator className="text-amber-200" size={22} />
          <span>Özel Matrah</span>
          <strong>{summary.specialBaseCount} belge</strong>
        </article>
        <article className="stat-card">
          <TableProperties className="text-fuchsia-100" size={22} />
          <span>Toplam KDV</span>
          <strong>{formatCurrency(summary.totalVat)}</strong>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="card form-card">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <span className="badge">UBL Hazırlık</span>
              <h3 className="mt-4">Yeni e-Doküman</h3>
            </div>
            <Send className="text-cyan-200" size={26} />
          </div>

          <form className="dashboard-form" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                Belge Türü
                <select value={form.docType} onChange={(event) => handleChange('docType', event.target.value as EInvoiceForm['docType'])}>
                  <option>e-Fatura</option>
                  <option>e-Arşiv</option>
                </select>
              </label>
              <label>
                Senaryo
                <select value={form.scenario} onChange={(event) => handleChange('scenario', event.target.value as EInvoiceForm['scenario'])}>
                  <option value="TEMELFATURA">TEMELFATURA</option>
                  <option value="TICARIFATURA">TICARIFATURA</option>
                  <option value="EARSIVFATURA">EARSIVFATURA</option>
                  <option value="KAMU">KAMU</option>
                  <option value="IHRACAT">IHRACAT</option>
                  <option value="YOLCUBERABER">YOLCUBERABER</option>
                  <option value="YATIRIMTESVIK">YATIRIMTESVIK</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                Fatura Tipi
                <select
                  value={form.invoiceTypeCode}
                  onChange={(event) => handleChange('invoiceTypeCode', event.target.value as EInvoiceForm['invoiceTypeCode'])}
                >
                  <option value="SATIS">SATIS</option>
                  <option value="IADE">IADE</option>
                  <option value="ISTISNA">ISTISNA</option>
                  <option value="TEVKIFAT">TEVKIFAT</option>
                  <option value="OZELMATRAH">OZELMATRAH</option>
                  <option value="IHRACKAYITLI">IHRACKAYITLI</option>
                  <option value="YTBISTISNA">YTBISTISNA</option>
                  <option value="SARJ">SARJ</option>
                  <option value="TEKNOLOJIDESTEK">TEKNOLOJIDESTEK</option>
                  <option value="IDIS">IDIS</option>
                  <option value="DIGER">DIGER</option>
                </select>
              </label>
              <label>
                Durum
                <select value={form.status} onChange={(event) => handleChange('status', event.target.value as EInvoiceForm['status'])}>
                  <option>Taslak</option>
                  <option>Gönderime Hazır</option>
                  <option>Gönderildi</option>
                  <option>Başarılı</option>
                  <option>Başarısız</option>
                  <option>İptal/İtiraz</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                Fatura No
                <input value={form.invoiceNumber} onChange={(event) => handleChange('invoiceNumber', event.target.value)} required />
              </label>
              <label>
                Tarih
                <input type="date" value={form.issueDate} onChange={(event) => handleChange('issueDate', event.target.value)} required />
              </label>
            </div>

            <label>
              Cari Ünvan
              <input value={form.customerName} onChange={(event) => handleChange('customerName', event.target.value)} required />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                VKN / TCKN
                <input value={form.customerTaxId} onChange={(event) => handleChange('customerTaxId', event.target.value)} />
              </label>
              <label>
                Alıcı Tipi
                <select
                  value={form.recipientType}
                  onChange={(event) => handleChange('recipientType', event.target.value as EInvoiceForm['recipientType'])}
                >
                  <option>e-Fatura Mükellefi</option>
                  <option>e-Arşiv Alıcısı</option>
                  <option>Nihai Tüketici</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>
                Mal/Hizmet Toplamı
                <input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => handleChange('amount', Number(event.target.value))} required />
              </label>
              <label>
                KDV Oranı
                <select value={form.vatRate} onChange={(event) => handleChange('vatRate', Number(event.target.value))}>
                  <option value={0}>%0</option>
                  <option value={1}>%1</option>
                  <option value={10}>%10</option>
                  <option value={20}>%20</option>
                </select>
              </label>
              <label>
                e-Arşiv Gönderim
                <select
                  value={form.eArchiveDelivery}
                  onChange={(event) => handleChange('eArchiveDelivery', event.target.value as EInvoiceForm['eArchiveDelivery'])}
                >
                  <option>Yok</option>
                  <option>E-Posta</option>
                  <option>SMS</option>
                  <option>Kağıt</option>
                </select>
              </label>
            </div>

            <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-4">
              <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-end">
                <label>
                  Özel Matrah
                  <select
                    value={form.specialBaseEnabled ? 'Evet' : 'Hayır'}
                    onChange={(event) => handleChange('specialBaseEnabled', event.target.value === 'Evet')}
                  >
                    <option>Hayır</option>
                    <option>Evet</option>
                  </select>
                </label>
                <label>
                  Özel Matrah Kodu / Açıklaması
                  <input
                    value={form.specialBaseCode}
                    onChange={(event) => handleChange('specialBaseCode', event.target.value)}
                    placeholder="Entegratör/GİB kod listesine göre"
                    disabled={!form.specialBaseEnabled}
                  />
                </label>
              </div>

              {form.specialBaseEnabled && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label>
                    Özel Matrah Tutarı
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.specialBaseAmount}
                      onChange={(event) => handleChange('specialBaseAmount', Number(event.target.value))}
                      required={form.specialBaseEnabled}
                    />
                  </label>
                  <label>
                    Özel Matrah Notu
                    <input value={form.specialBaseNote} onChange={(event) => handleChange('specialBaseNote', event.target.value)} />
                  </label>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-end">
                <label>
                  KDV Kontrol İstisnası
                  <select
                    value={form.useVatRateControlException ? 'Evet' : 'Hayır'}
                    onChange={(event) => handleChange('useVatRateControlException', event.target.value === 'Evet')}
                  >
                    <option>Hayır</option>
                    <option>Evet</option>
                  </select>
                </label>
                <label>
                  Kontrol Kodu
                  <input
                    value={form.vatRateControlCode}
                    onChange={(event) => handleChange('vatRateControlCode', event.target.value)}
                    disabled={!form.useVatRateControlException}
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">KDV Matrahı</span>
                <strong className="mt-2 block text-xl font-black text-cyan-100">{formatCurrency(taxableBase)}</strong>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">KDV Tutarı</span>
                <strong className="mt-2 block text-xl font-black text-cyan-100">{formatCurrency(calculatedVat)}</strong>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Genel Toplam</span>
                <strong className="mt-2 block text-xl font-black text-cyan-100">{formatCurrency(calculatedGrandTotal)}</strong>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                GİB / Entegratör Durum Kodu
                <input value={form.gibStatusCode} onChange={(event) => handleChange('gibStatusCode', event.target.value)} />
              </label>
              <label>
                Not
                <input value={form.note} onChange={(event) => handleChange('note', event.target.value)} />
              </label>
            </div>

            <button type="submit">e-Doküman Kaydet</button>
          </form>
        </section>

        <section className="card list-card">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="badge">Giden Belgeler</span>
              <h3 className="mt-4">e-Fatura / e-Arşiv Listesi</h3>
            </div>
            <div className="text-right text-sm font-bold text-slate-400">
              <div>{formatCurrency(summary.totalAmount)}</div>
              <div>{summary.eArchiveCount} e-Arşiv kaydı</div>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="empty-state">Henüz e-belge kaydı yok.</div>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Belge</th>
                    <th>Cari</th>
                    <th>Senaryo</th>
                    <th>Matrah/KDV</th>
                    <th>Toplam</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id || record.invoiceNumber}>
                      <td>
                        <div className="font-black text-white">{record.invoiceNumber}</div>
                        <div className="text-xs text-slate-500">{record.docType}</div>
                      </td>
                      <td>
                        <div>{record.customerName || 'Cari yok'}</div>
                        <div className="text-xs text-slate-500">{record.customerTaxId || record.issueDate}</div>
                      </td>
                      <td>
                        <div>{record.scenario || '-'}</div>
                        <div className="text-xs text-slate-500">{record.invoiceTypeCode || 'SATIS'}</div>
                      </td>
                      <td>
                        <div>{record.specialBaseEnabled ? `Özel: ${formatCurrency(record.specialBaseAmount || 0)}` : formatCurrency(record.amount || 0)}</div>
                        <div className="text-xs text-slate-500">%{formatNumber(record.vatRate || 0)} KDV: {formatCurrency(record.vatAmount || 0)}</div>
                      </td>
                      <td>{formatCurrency(record.grandTotal || record.amount || 0)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(record.status)}`}>{record.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
