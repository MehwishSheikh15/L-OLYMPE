import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Image as ImageIcon, Camera, ShoppingBag } from 'lucide-react';

interface ExtendedGalleryItem {
  id: string;
  title: string;
  category: 'dishes' | 'ambiance' | 'actions';
  imageUrl: string;
  price?: number;
  originalProduct?: any;
}

export const GallerySection: React.FC = () => {
  const { gallery, products, addToCart, pushNotification } = useApp();
  const [filter, setFilter] = useState<'all' | 'dishes' | 'ambiance' | 'actions'>('all');

  // Convert the administrative products (with all edits/updates) into high-fidelity gallery dishes
  const productGalleryItems: ExtendedGalleryItem[] = products.map(prod => ({
    id: `prod-gal-${prod.id}`,
    title: prod.name,
    category: 'dishes' as const,
    imageUrl: prod.image,
    price: prod.price,
    originalProduct: prod
  }));

  // Combine static ambiance/actions categories with the live admin-updated product dishes
  const combinedItems: ExtendedGalleryItem[] = [
    ...gallery.filter(item => item.category !== 'dishes'),
    ...productGalleryItems
  ];

  const filteredItems = combinedItems.filter(item => filter === 'all' || item.category === filter);

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
              <div className="absolute inset-x-4 bottom-4 p-4 rounded-xl border border-white/10 bg-black/75 backdrop-blur-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-bold text-[#F27D26] tracking-widest uppercase block">
                    {item.category}
                  </span>
                  {item.originalProduct && (
                    <span className="text-[7px] font-bold bg-[#C5A059]/15 text-[#C5A059] px-1 py-0.5 rounded tracking-widest uppercase">
                      Live Culinary Masterpiece
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-white tracking-wide font-sans font-medium line-clamp-1">
                  {item.title}
                </p>

                {item.originalProduct && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <span className="font-serif text-[#C5A059] font-bold text-xs">€{item.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item.originalProduct);
                        pushNotification('success', `Added ${item.title} to your gastronomic carriage.`);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F27D26] hover:bg-[#F27D26]/90 text-white text-[8px] font-bold uppercase tracking-wider rounded transition-colors"
                    >
                      <ShoppingBag className="h-2 w-2" />
                      Add to Carriage
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
