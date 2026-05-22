import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Image as ImageIcon, Camera } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery } = useApp();
  const [filter, setFilter] = useState<'all' | 'dishes' | 'ambiance' | 'actions'>('all');

  const filteredItems = gallery.filter(item => filter === 'all' || item.category === filter);

  return (
    <section id="gallery" className="py-24 bg-[#050505] border-b border-white/5 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Head */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.25em] text-[#F27D26] uppercase block mb-3">ATMOSPHERIC REPOSITORY</span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-4">
            Step Into the <span className="font-serif italic text-[#C5A059]">Visual Sanctuary</span>
          </h2>
          <div className="mx-auto h-0.5 w-16 bg-gradient-to-r from-transparent via-[#F27D26] to-transparent" />
        </div>

        {/* Gallery Filters (Pill shaped buttons) */}
        <div className="flex justify-center gap-3 mb-10 overflow-x-auto pb-2">
          {['all', 'dishes', 'ambiance', 'actions'].map((cat: any) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border whitespace-nowrap transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#F27D26] border-[#F27D26] text-white shadow-[0_4px_10px_rgba(242,125,38,0.2)]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Atmospheres' : cat}
            </button>
          ))}
        </div>

        {/* Gilded Mosaic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="group relative h-72 rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-lg hover:border-[#F27D26]/30 hover:shadow-xl transition-all"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="h-full w-full object-cover group-hover:scale-103 duration-700 transition-all filter brightness-[0.8] saturate-[0.85] group-hover:brightness-100"
              />
              
              {/* Blur Glassmorphic Overlay Description */}
              <div className="absolute inset-x-4 bottom-4 p-4 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span className="text-[8px] font-bold text-[#F27D26] tracking-widest uppercase block mb-1">
                  {item.category}
                </span>
                <p className="text-xs text-white tracking-wide font-sans font-light">
                  {item.title}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
