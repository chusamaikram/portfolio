import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Star, Sparkles } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import portfolioService from '../../services/portfolio.service.js';

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const data = await portfolioService.getTestimonials();
        if (isMounted) {
          setTestimonials(data.filter((t) => t.visible !== false));
        }
      } catch (err) {
        console.warn('Testimonials fallback loaded:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isLoading && testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="CLIENT REVIEWS & ENDORSEMENTS"
          title="What Peers & Leaders"
          highlight="Say About Usama"
          subtitle="Testimonials from engineering leaders, tech founders, and designers who have collaborated on frontend architectures and UI replicas."
        />

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <GlassCard
              key={t.id}
              cyberCorners
              glowColor="purple"
              className="p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    5.0 / 5.0
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-200/90 font-light italic leading-relaxed mb-6">
                  "{t.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3.5">
                <img
                  src={
                    t.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={t.name}
                  className="w-11 h-11 rounded-xl object-cover border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.2)] shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {t.name}
                  </h4>
                  <p className="text-xs font-mono text-cyan-300">{t.role}</p>
                  <p className="text-[10px] font-mono text-slate-400">{t.company}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
