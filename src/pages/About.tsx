import PublicLayout from '../components/PublicLayout';
import SEO from '../components/SEO';
import { Target, Heart, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <PublicLayout>
      <SEO 
        path="/hakkimizda"
        title="Hakkımızda | Bey360 Teknoloji Hikayesi"
        description="Beyoğlu Teknoloji'nin 15 yıllık tecrübesi ve Bey360'ın vizyonu hakkında bilgi edinin."
      />

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Biz Kimiz?</p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Dijital Dönüşümün <span className="text-indigo-600">Öncüsüyüz.</span></h1>
              <div className="space-y-6 text-slate-500 text-lg font-medium leading-relaxed">
                <p>Beyoğlu Teknoloji olarak, 15 yılı aşkın bir süredir Türkiye'nin dört bir yanındaki işletmelere yazılım ve teknoloji çözümleri üretiyoruz.</p>
                <p>Adana merkezli ofisimizde, yerel ihtiyaçları global standartlarla birleştirerek Bey360 platformunu hayata geçirdik. Amacımız, en karmaşık muhasebe süreçlerini herkesin kullanabileceği kadar basit bir arayüze sığdırmaktı.</p>
                <p>Bugün binlerce kullanıcı Bey360 ile işletmesini 360 derece kontrol ediyor, kağıt fatura yükünden kurtuluyor ve gerçek zamanlı analizlerle geleceğini planlıyor.</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600/5 rounded-[60px] -rotate-3" />
              <img src="/images/hero3.png" alt="Ekibimiz" className="rounded-[60px] shadow-2xl relative z-10 w-full object-cover h-[600px] rotate-3 hover:rotate-0 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: 'Vizyonumuz', desc: 'Türkiye\'nin en erişilebilir ve en güçlü SaaS ön muhasebe platformu olmak.' },
              { icon: Heart, title: 'Değerlerimiz', desc: 'Müşteri odaklılık, şeffaflık ve sürekli inovasyon ile değer yaratmak.' },
              { icon: Award, title: 'Deneyim', desc: '15+ yıllık sektörel tecrübe ve binlerce başarılı dijital dönüşüm projesi.' },
              { icon: Users, title: 'Ekibimiz', desc: 'Alanında uzman yazılımcılar ve finans danışmanlarından oluşan dinamik kadro.' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-black mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-12">Rakamlarla Bey360</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { val: '10K+', label: 'Aktif Kullanıcı' },
              { val: '1M+', label: 'Kesilen Fatura' },
              { val: '15+', label: 'Yıl Tecrübe' },
              { val: '99.9%', label: 'Uptime' }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl md:text-6xl font-black text-indigo-600 mb-2">{stat.val}</p>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
