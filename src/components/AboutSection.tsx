import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, ShieldCheck, HeartCrack, Wine } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { settings } = useApp();

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#050505] border-b border-white/5">
      
      {/* Absolute Decorative Graphic */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#F27D26]/5 blur-3xl rounded-full" />
      <div className="absolute right-0 top-1/4 w-80 h-80 bg-[#C5A059]/5 blur-4xl rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Aesthetic Dual-Image Layout for Agency Style */}
          <div className="lg:col-span-5 grid grid-cols-12 gap-4">
            
            <div className="col-span-8 overflow-hidden rounded-2xl border border-white/10 shadow-2xl skew-y-1">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80" 
                alt="Michelin Culinary Gilded Plate" 
                className="h-72 w-full object-cover select-none filter brightness-90 saturate-80 hover:scale-105 transition-all duration-700"
              />
            </div>
            
            <div className="col-span-4 flex flex-col justify-end">
              <div className="aspect-square bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center text-center shadow-lg">
                <Wine className="h-6 w-6 text-[#F27D26] mx-auto mb-1 animate-pulse" />
                <span className="block text-lg font-light text-white leading-none">14K</span>
                <span className="block text-[8px] font-semibold text-white/50 tracking-widest uppercase mt-2">Vintages</span>
              </div>
            </div>

            <div className="col-span-4 flex flex-col justify-start">
              <div className="aspect-square bg-white/5 border border-[#F27D26]/30 rounded-xl p-4 flex flex-col justify-center text-center shadow-lg">
                <Award className="h-6 w-6 text-[#C5A059] mx-auto mb-1" />
                <span className="block text-lg font-light text-[#C5A059] leading-none">No. 3</span>
                <span className="block text-[8px] font-semibold text-[#C5A059] tracking-widest uppercase mt-2">Globally</span>
              </div>
            </div>

            <div className="col-span-8 overflow-hidden rounded-2xl border border-white/10 shadow-2xl -skew-y-1">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80" 
                alt="Elite Dinner Party" 
                className="h-48 w-full object-cover select-none filter brightness-90 saturate-70 hover:scale-105 transition-all duration-700"
              />
            </div>

          </div>

          {/* About Stories Text Content */}
          <div className="lg:col-span-7 space-y-7">
            
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-[#F27D26] uppercase block mb-3.5">ESTABLISHED HERITAGE</span>
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-5 leading-tight">
                Crafting Culinary Chemistry Amid <span className="font-serif italic text-[#C5A059]">Gilded Ruins</span>
              </h2>
              <div className="h-0.5 w-16 bg-[#F27D26]" />
            </div>

            {/* Stories Text Narrative */}
            <div className="text-white/60 text-xs sm:text-sm font-light leading-relaxed space-y-4 tracking-wide font-sans">
              {settings.aboutNarrative.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Quality Highlights Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/15 bg-white/5">
                <ShieldCheck className="h-8 w-8 text-[#F27D26] flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Authentic Sourcing</h4>
                  <p className="text-[11px] text-white/40 font-light leading-relaxed">Direct weekly flyovers importing fresh Alba truffles, Miyazaki wagyu steaks, and Brittany crab.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/15 bg-white/5">
                <Award className="h-8 w-8 text-[#C5A059] flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Michelin Pedigree</h4>
                  <p className="text-[11px] text-white/40 font-light leading-relaxed">A pristine kitchen led exclusively by three-star chefs dedicated to traditional food craftsmanship.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
