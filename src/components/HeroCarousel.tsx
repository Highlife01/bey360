import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: '/images/hero1.png',
    title: 'Finansal Gücünü Keşfet',
    subtitle: 'Bey360 ile tüm gelir ve giderlerini tek panelden, 360 derece kontrol et.',
    badge: 'AKILLI MUHASEBE',
  },
  {
    id: 2,
    image: '/images/hero2.png',
    title: 'Sınır Tanımayan Yönetim',
    subtitle: 'Her yerden, her cihazdan işletmene tam erişim sağla. Bulut tabanlı, her an yanında.',
    badge: 'MOBİL UYUMLU',
  },
  {
    id: 3,
    image: '/images/hero3.png',
    title: 'İşletmeni Birlikte Büyütelim',
    subtitle: 'Akıllı raporlar ve e-fatura entegrasyonu ile zamanın sana kalsın, verimliliğin artsın.',
    badge: 'E-FATURA ENTEGRASYONU',
  },
];

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[600px] md:h-[750px] w-full overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {/* Image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600/20 border border-indigo-500/30 rounded-full mb-6 backdrop-blur-md"
            >
              <span className="text-[10px] font-black tracking-widest uppercase text-indigo-400">
                {slides[current].badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white max-w-4xl"
            >
              {slides[current].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-8 text-xl md:text-2xl text-slate-300 max-w-2xl font-medium leading-relaxed"
            >
              {slides[current].subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black shadow-2xl hover:bg-slate-200 transition-all hover:scale-[1.05] flex items-center gap-2"
              >
                Ücretsiz Başla <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-black hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Giriş Yap
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 right-10 z-20 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="p-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all backdrop-blur-md"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="p-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all backdrop-blur-md"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-10 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              current === i ? 'w-12 bg-indigo-500' : 'w-4 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
