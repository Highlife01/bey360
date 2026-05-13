import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import SEO from '../components/SEO';
import { signInWithGoogle } from '../services/authService';
import { ensureUserDashboard } from '../services/userService';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

const brandVisual = '/images/brand/bey360-command-visual.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await ensureUserDashboard(credential.user.uid, credential.user.email ?? '');
      navigate('/');
    } catch {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
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
      setError('Google ile giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row overflow-hidden">
      <SEO
        path="/login"
        title="Giriş Yap | Bey360"
        description="Bey360 paneline güvenli giriş yapın."
        noindex
      />

      {/* Left Panel: Visual & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-20 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 opacity-30">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1.2, 1, 1.2], x: [0, -80, 0], y: [0, 60, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-cyan-600 rounded-full blur-[120px]" 
          />
        </div>

        <div className="relative z-10 w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-10 overflow-hidden rounded-[32px] border border-cyan-300/20 bg-slate-950/60 shadow-[0_0_80px_rgba(37,99,235,0.28)]">
              <img
                src={brandVisual}
                alt="Bey360 gelişmiş çözümler tek platform"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
            <h1 className="text-5xl font-black text-white leading-tight mb-8">
              Yeni Nesil <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Ön Muhasebe</span>
            </h1>
            
            <div className="space-y-6">
              {[
                { icon: ShieldCheck, title: "Güvenli Altyapı", text: "Verileriniz 256-bit SSL ve bulut güvencesiyle korunur." },
                { icon: Zap, title: "Hızlı Operasyon", text: "Saniyeler içinde fatura kesin, raporları anlık izleyin." },
                { icon: Globe, title: "Her Yerden Erişim", text: "İşletmenizi dilediğiniz cihazdan, dilediğiniz yerden yönetin." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 bg-[#050505] relative">
        {/* Mobile blobs */}
        <div className="lg:hidden absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden mb-8 mx-auto max-w-xs overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-950/70 shadow-2xl shadow-blue-500/20">
             <img
               src={brandVisual}
               alt="Bey360 gelişmiş çözümler tek platform"
               className="aspect-[3/2] w-full object-cover"
             />
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl p-8 lg:p-12 rounded-[40px] border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-black text-white mb-2">Hoş Geldiniz</h2>
            <p className="text-slate-500 mb-10 font-medium">Lütfen bilgilerinizi kullanarak giriş yapın.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">E-POSTA ADRESİ</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-cyan-400/50 outline-none transition-all font-bold text-white"
                    placeholder="adiniz@sirket.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ŞİFRE</label>
                  <Link to="#" className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:underline">Şifremi Unuttum</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-cyan-400/50 outline-none transition-all font-bold text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-sm font-bold text-center">{error}</motion.p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? 'GİRİŞ YAPILIYOR...' : (
                  <>
                    PANEL'E ERİŞİM SAĞLA <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
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
              className="w-full py-4 bg-white/[0.03] border border-white/10 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-white/5 transition-all active:scale-95"
            >
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile Oturum Aç
            </button>

            <p className="mt-10 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
              Hesabın yok mu?{' '}
              <Link to="/signup" className="text-cyan-400 hover:underline">ÜCRETSİZ KAYIT OL</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
