import { useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import SEO from '../components/SEO';
import { Mail, Phone, MapPin, Instagram, CheckCircle2 } from 'lucide-react';
import { submitContactMessage } from '../services/messageService';

export default function Contact() {
  return (
    <PublicLayout>
      <SEO 
        path="/iletisim"
        title="İletişim | Bey360 Destek ve Satış"
        description="Bizimle iletişime geçin. Adana ofisimiz, telefon ve WhatsApp üzerinden 7/24 yanınızdayız."
      />

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Sizinle Tanışmak <span className="text-indigo-600">İsteriz.</span></h1>
            <p className="text-xl text-slate-500 font-medium">Sorularınız, iş birliği teklifleriniz veya teknik destek talepleriniz için bize dilediğiniz kanaldan ulaşabilirsiniz.</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16">
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">Bizi Arayın</h3>
                  <p className="text-slate-500 font-medium">7/24 Müşteri Hizmetleri</p>
                  <a href="tel:+905375127810" className="text-xl font-black text-indigo-600 hover:underline">+90 537 512 78 10</a>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">E-Posta Gönderin</h3>
                  <p className="text-slate-500 font-medium">Genel Sorular & Destek</p>
                  <a href="mailto:info@beyogluteknoloji.com" className="text-xl font-black text-indigo-600 hover:underline">info@beyogluteknoloji.com</a>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2">Ofisimize Bekleriz</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Reşatbey Mh. Ordu caddesi Ünsal Apt.<br />
                    No 79/B, Adana, Turkey 01122
                  </p>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Sosyal Medya</h4>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/beyogluteknoloji/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all">
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      <div className="h-[500px] w-full bg-slate-200">
        <iframe 
          title="Ofis Konumu"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3184.288283424108!2d35.3216858!3d36.993356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15288f38a79c7481%3A0x7d025b03476251bc!2zUmXFn2F0YmV5LCBPcmR1IENkLiwgMDEzMjAgU2V5aGFuL0FkYW5h!5e0!3m2!1str!2str!4v1715616000000!5m2!1str!2str" 
          className="w-full h-full border-0 grayscale opacity-80" 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </PublicLayout>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '';
      setError(errorMessage || 'Mesaj gönderilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-3xl font-black mb-4">Mesajınız Alındı!</h3>
        <p className="text-slate-500 font-medium mb-10">En kısa sürede size dönüş yapacağız.</p>
        <button onClick={() => setSuccess(false)} className="text-indigo-600 font-black hover:underline">Yeni Mesaj Gönder</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Adınız</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-indigo-500 outline-none transition font-bold" />
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">E-Posta</label>
          <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-indigo-500 outline-none transition font-bold" />
        </div>
      </div>
      <div>
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Telefon</label>
        <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-indigo-500 outline-none transition font-bold" />
      </div>
      <div>
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Mesajınız</label>
        <textarea required rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-indigo-500 outline-none transition font-bold resize-none" />
      </div>
      {error && <p className="text-rose-500 text-sm font-bold">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all hover:scale-[1.02] disabled:opacity-50">
        {loading ? 'GÖNDERİLİYOR...' : 'MESAJ GÖNDER'}
      </button>
    </form>
  );
}
