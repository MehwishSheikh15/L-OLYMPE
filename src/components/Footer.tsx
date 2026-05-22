import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { settings } = useApp();

  return (
    <footer className="bg-[#050505] border-t border-white/10 py-16 text-center text-white/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        
        {/* Brand Signatures */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#F27D26]/80 bg-[#0c0c0c] shadow-[0_0_15px_rgba(242,125,38,0.15)]">
            <span className="text-xl font-light tracking-tighter text-white">L’O</span>
          </div>
          <div>
            <span className="block text-sm font-semibold tracking-widest text-[#C5A059] uppercase">L’OLYMPE PARIS</span>
            <span className="block text-[8px] font-medium tracking-widest text-[#F27D26] uppercase">GASTRONOMIE HAUTE DE LUXE</span>
          </div>
        </div>

        {/* Corporate specifications */}
        <p className="max-w-xl mx-auto text-[11px] text-white/30 font-light leading-relaxed tracking-wide">
          © {new Date().getFullYear()} L'Olympe International Gastronomy Corp. All Rights Reserved. Built with premium custom SaaS architecture, optimized performance schemas, and Awwwards-level visual guidelines.
        </p>

        {/* Mini Links bar */}
        <div className="flex items-center justify-center gap-6 text-[9px] font-bold tracking-wider text-white/50 uppercase">
          <a href="#hero" className="hover:text-[#F27D26] transition-colors">Term of Grace</a>
          <span>•</span>
          <a href="#featured" className="hover:text-[#F27D26] transition-colors">Privacy Charter</a>
          <span>•</span>
          <a href="#reserve" className="hover:text-[#F27D26] transition-colors">Concierge Desk</a>
        </div>

      </div>
    </footer>
  );
};
