import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import SEO from '../components/SEO';
import { signInWithGoogle } from '../services/authService';
import { ensureUserDashboard } from '../services/userService';

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
      setError('Google ile kayıt başarısız. Firebase Google sağlayıcısının aktif olduğundan emin olun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <SEO
        path="/signup"
        title="Kayıt Ol | Bey360"
        description="Bey360 online ön muhasebe paneli için hesap oluşturun."
        noindex
      />
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[150px]" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md p-12 rounded-[40px] shadow-2xl border border-white relative z-10 text-center">
        <div className="mb-8 flex items-center justify-center">
          <img src="/logos/logo_icon.png" alt="Bey360" className="w-20 h-20 drop-shadow-2xl" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Yeni Hesap</h2>
        <p className="text-slate-400 mb-10 font-medium">Bey360 ekosistemine bugün katılın.</p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-4 px-5 bg-white text-slate-700 rounded-2xl font-black border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google ile Devam Et
        </button>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            veya
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                Ad Soyad
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>
            <div className="text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                Telefon
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                placeholder="05xx..."
              />
            </div>
          </div>

          <div className="text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
              Firma Adı
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
              placeholder="Sirketinizin Unvanı"
            />
          </div>

          <div className="text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
              E-posta
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
              placeholder="adiniz@sirket.com"
            />
          </div>

          <div className="text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
              Şifre
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-rose-500 text-sm font-bold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {loading ? 'HESAP OLUŞTURULUYOR...' : 'HESAP OLUŞTUR'}
          </button>
        </form>

        <p className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
