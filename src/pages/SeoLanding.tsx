import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  HelpCircle,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/SEO';
import PublicLayout from '../components/PublicLayout';
import { type SeoPage } from '../data/seoPages';

interface SeoLandingProps {
  page: SeoPage;
}

export default function SeoLanding({ page }: SeoLandingProps) {
  return (
    <PublicLayout>
      <SEO page={page} />

      <main className="bg-slate-50">
        <section className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-cyan-50 via-indigo-50 to-transparent" />

          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 shadow-sm">
                <Sparkles size={14} className="text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                  {page.eyebrow}
                </span>
              </div>
              <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600">
                {page.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-7 py-4 font-black text-white shadow-2xl shadow-slate-200 transition hover:bg-slate-800"
                >
                  {page.cta} <ArrowRight size={18} />
                </Link>
                <a
                  href="#ozellikler"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-7 py-4 font-black text-slate-900 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  {page.secondaryCta ?? 'Detayları Gör'}
                </a>
              </div>
              <p className="mt-5 text-sm font-semibold text-slate-500">
                Hedef kullanıcı: {page.audience}
              </p>
            </div>

            <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-2xl shadow-indigo-100/70">
              <div className="rounded-lg bg-slate-950 p-5 text-white">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
                      Bey360 Panel
                    </p>
                    <h2 className="mt-2 text-xl font-black">İşletme görünümü</h2>
                  </div>
                  <BarChart3 className="text-cyan-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {page.features.map((feature) => (
                    <div key={feature} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                      <CheckCircle2 size={18} className="mb-3 text-emerald-300" />
                      <p className="text-sm font-bold leading-5 text-slate-200">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ozellikler" className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              Çözüm
            </p>
            <h2 className="text-4xl font-black tracking-tight">Bey360 ile süreçlerinizi tek panelde toplayın.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {page.sections.map((section) => (
              <article key={section.title} className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm">
                <Layers className="mb-5 text-indigo-600" size={28} />
                <h3 className="text-2xl font-black tracking-tight">{section.title}</h3>
                <p className="mt-4 text-sm font-medium leading-7 text-slate-600">{section.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-lg bg-slate-950 p-8 text-white lg:col-span-1">
                <ShieldCheck className="mb-5 text-cyan-200" size={32} />
                <h2 className="text-3xl font-black tracking-tight">Neden Bey360?</h2>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
                  Kolay kullanım, güçlü raporlama, güvenli altyapı ve işletmenin finansal sağlığını gösteren akıllı panel yaklaşımı.
                </p>
                <Link
                  to="/guvenlik"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-slate-950"
                >
                  Güvenliği İncele <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
                {page.features.map((feature) => (
                  <div key={feature} className="rounded-lg border border-slate-100 bg-slate-50 p-6">
                    <FileText className="mb-4 text-indigo-600" size={24} />
                    <p className="font-black text-slate-900">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-8 text-center">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              Sık Sorulan Sorular
            </p>
            <h2 className="text-4xl font-black tracking-tight">{page.h1} hakkında merak edilenler</h2>
          </div>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center gap-3 font-black text-slate-900">
                  <HelpCircle size={20} className="text-indigo-600" />
                  {faq.question}
                </summary>
                <p className="mt-4 pl-8 text-sm font-medium leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-10 text-center text-white md:p-14">
            <h2 className="text-4xl font-black tracking-tight">İşletmenizi 360 derece yönetin.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
              Cari, stok, kasa, banka, gelir-gider, fatura ve rapor süreçlerinizi Bey360 ile tek panelden yönetin.
            </p>
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-black text-indigo-700 shadow-2xl transition hover:scale-[1.02]"
            >
              Bey360’a Ücretsiz Başla <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
