import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ArrowLeft, ArrowRight, Calendar, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import SEO from '../components/SEO';

export default function BlogDetail() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <SEO 
        path={`/blog/${post.id}`}
        title={`${post.title} | Bey360 Blog`}
        description={post.summary}
      />

      <div className="max-w-4xl mx-auto px-6">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black text-xs uppercase tracking-widest mb-10 transition-colors"
        >
          <ArrowLeft size={16} /> Blog Listesine Dön
        </Link>

        <article className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="aspect-video overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8 md:p-16">
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full">
                {post.category}
              </span>
              <div className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</div>
              <div className="ml-auto flex items-center gap-4">
                <button className="hover:text-indigo-600 transition-colors"><Twitter size={16} /></button>
                <button className="hover:text-indigo-600 transition-colors"><Facebook size={16} /></button>
                <button className="hover:text-indigo-600 transition-colors"><Linkedin size={16} /></button>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
              {post.title}
            </h1>

            <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed space-y-6">
              {post.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('###')) {
                  return <h3 key={i} className="text-2xl font-black text-slate-900 pt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.includes('1. ') || paragraph.includes('- ')) {
                  return (
                    <ul key={i} className="space-y-3 list-none pl-0">
                      {paragraph.split('\n').map((line, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2.5 shrink-0" />
                          <span>{line.replace(/^\d\. |- /, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{paragraph}</p>;
              })}
            </div>

            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-1">Paylaşın</h4>
                <p className="text-xs text-slate-400 font-medium">Bu içeriği çevrenizle paylaşarak faydalanmalarını sağlayın.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-slate-800 transition-all">
                  <Share2 size={14} /> Bağlantıyı Kopyala
                </button>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-20 bg-indigo-600 rounded-[40px] p-12 text-white text-center relative overflow-hidden">
          <div className="absolute -left-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <h2 className="text-3xl font-black mb-4 relative z-10">Bey360 ile İşletmenizi Dijitalleştirin</h2>
          <p className="text-indigo-100 font-medium mb-8 max-w-xl mx-auto relative z-10">
            Fatura, stok ve cari takiplerinizi profesyonelce yönetmek için hemen ücretsiz hesabınızı oluşturun.
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black shadow-2xl hover:scale-105 transition-all relative z-10"
          >
            Ücretsiz Başla <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
