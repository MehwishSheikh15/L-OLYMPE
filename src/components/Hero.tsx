import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';

interface HeroProps {
  onScrollTo: (elementId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollTo }) => {
  const { settings } = useApp();

  return (
    <section id="hero" className="relative flex min-h-[92vh] items-center justify-center overflow-hidden py-16">
      
      {/* Background Cinematic Shading */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-950/60 via-luxury-950/80 to-luxury-950 z-10" />
        <img 
          src={settings.heroImageUrl} 
          alt="L'Olympe Paris Luxury Dining"
          className="h-full w-full object-cover object-center scale-102 filter brightness-[0.4] transition-all duration-1000"
        />
      </div>

      {/* Floating Sparkles Vector Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-35">
        <div className="absolute top-1/4 left-1/5 h-1.5 w-1.5 rounded-full bg-gold-400 animate-ping" />
        <div className="absolute top-2/3 right-1/4 h-2 w-2 rounded-full bg-gold-500 animate-pulse" />
        <div className="absolute bottom-1/5 left-1/3 h-1 w-1 rounded-full bg-gold-300 animate-ping" />
      </div>

      {/* Content Columns */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        
        {/* Dynamic Badge - matches style and padding of production tag badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#F27D26] font-semibold mb-8">
          <Sparkles className="h-3 w-3 animate-spin text-[#F27D26]" />
          Production Ready Three-Star Luxury Venue
        </div>

        {/* Cinematic Title - structured directly after Dark Luxury text-[84px] tracking-tighter layout */}
        <h1 className="mx-auto max-w-5xl text-5xl sm:text-7xl lg:text-[84px] leading-[0.95] font-light tracking-tighter text-white mb-8">
          The New Standard <br />
          <span className="italic font-serif text-[#C5A059] block sm:inline">{settings.heroTitle}</span>
        </h1>

        {/* Subtitle description */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-white/40 font-light leading-relaxed mb-10">
          {settings.heroSubtitle}
        </p>

        {/* Dual Premium CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={() => onScrollTo('featured')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#F27D26] text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-[0_4px_30px_rgba(242,125,38,0.35)] transition-all cursor-pointer"
          >
            Explore Menus
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => onScrollTo('reserve')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-[#C5A059]" />
            Book Private Salon
          </button>
        </div>

        {/* Multi-Credential Ribbon Widget (Editorial design with thin-borders) */}
        <div className="mx-auto max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-px lg:bg-white/10 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="p-4 rounded-xl lg:rounded-none">
            <span className="block text-3xl sm:text-4xl font-light text-white">III Stars</span>
            <span className="block mt-1 text-[10px] uppercase tracking-wider text-[#F27D26]">Michelin Guide 2026</span>
          </div>
          <div className="p-4 rounded-xl lg:rounded-none lg:border-l border-white/10">
            <span className="block text-3xl sm:text-4xl font-light text-white">14.2%</span>
            <span className="block mt-1 text-[10px] uppercase tracking-wider text-[#C5A059]">Growth Standard</span>
          </div>
          <div className="p-4 rounded-xl lg:rounded-none lg:border-l border-white/10">
            <span className="block text-3xl sm:text-4xl font-light text-white">12 Tables</span>
            <span className="block mt-1 text-[10px] uppercase tracking-wider text-white/40">Exclusive Privacy</span>
          </div>
          <div className="p-4 rounded-xl lg:rounded-none lg:border-l border-white/10">
            <span className="block text-3xl sm:text-4xl font-light text-white">99.1%</span>
            <span className="block mt-1 text-[10px] uppercase tracking-wider text-[#F27D26]">Retention SLA</span>
          </div>
        </div>

      </div>

      {/* Decorative luxury frame lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute top-0 bottom-0 left-8 w-px bg-white/5 hidden lg:block" />
      <div className="absolute top-0 bottom-0 right-8 w-px bg-white/5 hidden lg:block" />
    </section>
  );
};
