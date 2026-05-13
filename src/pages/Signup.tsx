import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import SEO from '../components/SEO';
import { signInWithGoogle } from '../services/authService';
import { ensureUserDashboard } from '../services/userService';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Phone, Building2, CheckCircle } from 'lucide-react';

const heroLogo = '/images/brand/bey360-command-logo-hero.png';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await ensureUserDashboard(credential.user.uid, credential.user.email ?? '', {
        displayName,
        phone,
        companyName,
      });
      navigate('/');
    } catch {
      setError('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch {
      setError('Google ile kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row overflow-hidden">
      <SEO
        path="/signup"
        title="Kayıt Ol | Bey360"
        description="Bey360 online ön muhasebe paneli için hesap oluşturun."
        noindex
      />

      {/* Left Panel: Visual */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-slate-900 items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-emerald-600 rounded-full blur-[150px]" 
          />
        </div>

        <div className="relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img src={heroLogo} alt="Bey360" className="mb-12 h-20 w-auto object-contain drop-shadow-[0_0_34px_rgba(37,99,235,0.4)]" />
            <h2 className="text-5xl font-black text-white leading-tight mb-8">
              Dakikalar İçinde <br />
              <span className="text-emerald-400">Dijitalleşin.</span>
            </h2>
            
            <div className="space-y-4">
              {[
                "Ücretsiz 14 gün deneme",
                "Kredi kartı gerektirmez",
                "Sınırsız e-fatura gönderimi",
                "Anlık banka entegrasyonu"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle size={18} className="text-emerald-400" />
                  <span className="text-sm font-bold uppercase tracking-wider">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 bg-[#050505] relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-xl relative z-10"
        >
          <div className="bg-white/[0.03] backdrop-blur-3xl p-8 lg:p-12 rounded-[40px] border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-black text-white mb-2">Hesabınızı Oluşturun</h2>
            <p className="text-slate-500 mb-10 font-medium">Bey360 ekosistemine katılmak için formu doldurun.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">AD SOYAD</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-emerald-400/50 outline-none transition-all font-bold text-white text-sm"
                      placeholder="Ahmet Yılmaz"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">TELEFON</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-emerald-400/50 outline-none transition-all font-bold text-white text-sm"
                      placeholder="05XX..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">FİRMA ADI</label>
                <div className="relative group">
                  <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-emerald-400/50 outline-none transition-all font-bold text-white text-sm"
                    placeholder="Şirketinizin Resmi Unvanı"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">E-POSTA ADRESİ</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-emerald-400/50 outline-none transition-all font-bold text-white text-sm"
                    placeholder="adiniz@sirket.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">ŞİFRE BELİRLEYİN</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-emerald-400/50 outline-none transition-all font-bold text-white text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && <p className="text-rose-500 text-sm font-bold text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-2xl font-black shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2 group mt-4"
              >
                {loading ? 'HESAP OLUŞTURULUYOR...' : (
                  <>
                    ÜCRETSİZ BAŞLAT <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">VEYA</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-4 bg-white/[0.03] border border-white/10 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
            >
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile Hızlı Kayıt
            </button>

            <p className="mt-10 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
              Zaten hesabın var mı?{' '}
              <Link to="/login" className="text-emerald-400 hover:underline">GİRİŞ YAP</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
