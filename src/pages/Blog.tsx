import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import SEO from '../components/SEO';

export default function Blog() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <SEO 
        path="/blog"
        title="Blog | Bey360 | Finans ve Muhasebe Rehberi"
        description="İşletmeniz için yararlı bilgiler, muhasebe ipuçları ve teknoloji haberleri."
      />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Bey360 Blog</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
            Bilgiyle <span className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Büyüyün.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            İşletmenizi bir adım öne taşıyacak güncel muhasebe teknolojileri, 
            finansal yönetim stratejileri ve e-dönüşüm rehberleri.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-2"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                  {post.summary}
                </p>
                <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  Devamını Oku <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
