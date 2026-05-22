import React from 'react';
import { Star, Award, ShieldCheck } from 'lucide-react';

const masterChefs = [
  {
    name: 'Chef Executive Alain Gauthier',
    role: 'Founder & Grand Master Chef',
    philosophy: '“Culinary craft is not a mere compilation of spices; it is the physical chemistry of the soul painted directly onto the plate.”',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
    stars: 3,
    signature: 'Imperial Caspian Osetra Caviar'
  },
  {
    name: 'Master Pâtissier Jean-Luc Moreau',
    role: 'Grand Pastry Chef Specialist',
    philosophy: '“Sugar and gold are architectural tools. A truly magnificent dessert must defy gravity and please the intellect before the mouth.”',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
    stars: 2,
    signature: '24k Gold leaf Valrhona Chocolate'
  }
];

export const ChefSection: React.FC = () => {
  return (
    <section id="chefs" className="py-24 border-b border-white/5 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.25em] text-[#F27D26] uppercase block mb-3">THE CULINARY COMMANDERS</span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-4">
            Meet the Masters <span className="font-serif italic text-[#C5A059]">of Taste</span>
          </h2>
          <div className="mx-auto h-0.5 w-16 bg-gradient-to-r from-transparent via-[#F27D26] to-transparent" />
        </div>

        {/* Dual Chef Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {masterChefs.map((chef, index) => (
            <div 
              key={index}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col sm:flex-row gap-6 hover:border-[#F27D26]/30 transition-all group"
            >
              {/* Chef Portrait */}
              <div className="relative aspect-square sm:w-44 w-full h-44 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/10">
                <img 
                  src={chef.image} 
                  alt={chef.name} 
                  className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500 filter saturate-90 saturate-contrast brightness-90"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Chef Copy */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  
                  {/* Rating Stars based on Star Tier */}
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: chef.stars }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#F27D26] text-[#F27D26]" />
                    ))}
                    <span className="text-[9px] font-bold text-[#F27D26] tracking-wider uppercase ml-1.5">{chef.stars} Michelin Stars</span>
                  </div>

                  <h3 className="text-base font-medium text-white mb-0.5 group-hover:text-[#C5A059] transition-colors">
                    {chef.name}
                  </h3>
                  
                  <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase block mb-3.5">
                    {chef.role}
                  </span>

                  <p className="font-sans text-xs font-light text-white/50 leading-relaxed mb-4">
                    {chef.philosophy}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="text-[9px] font-bold tracking-widest text-white/30 uppercase">signature masterpiece</span>
                  <span className="text-[10px] font-semibold text-[#C5A059]">{chef.signature}</span>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
