import React from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Star, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    wishlist, 
    products, 
    addToCart, 
    toggleWishlist 
  } = useApp();

  // Map product IDs in wishlist to actual product objects
  const wishlistedItems = products.filter(p => wishlist.includes(p.id));

  // Recommend 3 premium products that are NOT currently in the wishlist
  const recommendedItems = products
    .filter(p => !wishlist.includes(p.id) && p.status !== 'out-of-stock')
    .slice(0, 3);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        id="wishlist-overlay"
      />

      {/* Drawer Container Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-md h-full bg-[#020202] border-l border-gold-500/15 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
        id="wishlist-drawer-panel"
      >
        {/* Upper Segment: Scrollable Content */}
        <div className="flex-grow flex flex-col min-h-0">
          
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-gold-900/15 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Heart className="h-4.5 w-4.5 text-gold-500 fill-gold-500" />
              <h3 className="text-xs font-semibold text-white uppercase tracking-widest font-sans">
                Masterpiece Registry
              </h3>
              <span className="text-[10px] bg-gold-950 text-gold-400 px-2 py-0.5 rounded-full border border-gold-500/20 font-bold">
                {wishlist.length}
              </span>
            </div>
            <button 
              id="wishlist-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List items or Empty state container */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-5 scrollbar-thin">
            {wishlistedItems.length > 0 ? (
              <div className="space-y-4">
                {wishlistedItems.map(item => (
                  <motion.div 
                    key={item.id}
                    layoutId={`wish-item-${item.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl border border-gold-900/10 bg-luxury-950/40 hover:bg-[#080706] hover:border-gold-500/20 transition-all flex gap-3 relative group"
                  >
                    {/* Floating Remove Button */}
                    <button
                      id={`wishlist-remove-${item.id}`}
                      onClick={() => toggleWishlist(item.id)}
                      className="absolute top-2 right-2 p-1 rounded-full text-zinc-500 hover:text-rose-400 hover:bg-rose-950/35 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {/* Image Block */}
                    <div className="h-16 w-16 rounded-lg overflow-hidden border border-gold-900/15 shrink-0 bg-zinc-900">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover transition-transform duration-550 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Meta Info Block */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 wrap">
                          <h4 className="text-xs font-semibold text-white truncate pr-4">{item.name}</h4>
                        </div>
                        
                        {/* Rating Display */}
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="h-2.5 w-2.5 text-gold-500 fill-gold-500" />
                          <span className="text-[9px] text-zinc-400 font-medium">{item.rating.toFixed(1)}</span>
                          <span className="text-[8px] text-zinc-650">({item.ratingCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Price Tag */}
                        <span className="font-serif text-xs font-bold text-gold-400">
                          €{item.price.toFixed(2)}
                        </span>

                        {/* Stock and Move to Cart */}
                        <div className="flex items-center gap-2">
                          {item.status === 'out-of-stock' ? (
                            <span className="text-[8px] uppercase tracking-wider text-rose-500 font-bold bg-rose-950/20 px-1.5 py-0.5 rounded border border-rose-900/10">
                              Out of Stock
                            </span>
                          ) : (
                            <button
                              id={`wishlist-add-to-cart-${item.id}`}
                              onClick={() => {
                                handleAddToCart(item);
                                // Optional delete from wishlist when added to cart, but we can also keep it!
                              }}
                              className="px-2.5 py-1 rounded bg-[#F27D26] hover:bg-[#ff8f3c] text-white text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer shadow-sm shadow-[#F27D26]/10"
                            >
                              <ShoppingBag className="h-2.5 w-2.5" />
                              Basket
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* High visual elegant Empty State */
              <div className="py-12 px-4 text-center flex flex-col items-center justify-center h-full">
                <div className="h-14 w-14 rounded-full border border-gold-500/10 bg-gold-500/[0.02] flex items-center justify-center text-gold-500/40 mb-4">
                  <Heart className="h-6 w-6 stroke-[1.25]" />
                </div>
                <h4 className="font-serif text-sm font-medium text-white tracking-widest uppercase">
                  Registry holds no desires
                </h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-light mt-2 max-w-xs">
                  Affix items from our masterpiece gastronomy menu to keep them safe in your personal records.
                </p>
                <button
                  id="wishlist-empty-explore-btn"
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      const el = document.getElementById('featured');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                  className="mt-6 px-4 py-2 border border-gold-500/20 rounded-lg text-gold-400 text-[10px] font-bold uppercase tracking-wider hover:bg-gold-500 hover:text-luxury-950 hover:border-gold-500 transition-all cursor-pointer"
                >
                  Discover Culinary Treasures
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lower Segment: Curate Recommendations Drawer Tray */}
        {recommendedItems.length > 0 && (
          <div className="border-t border-gold-900/15 pt-5 mt-6 shrink-0">
            <h5 className="text-[9px] font-bold text-gold-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Recommended Delicacies
            </h5>
            <div className="grid grid-cols-3 gap-2">
              {recommendedItems.map(item => (
                <div 
                  key={item.id}
                  className="p-2 rounded-lg border border-gold-900/5 bg-[#0a0908] hover:border-gold-500/10 transition-all flex flex-col justify-between"
                >
                  <div className="h-12 rounded overflow-hidden mb-1 relative bg-zinc-950">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h6 className="text-[9px] font-bold text-zinc-300 truncate leading-tight mb-1" title={item.name}>
                    {item.name}
                  </h6>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-serif text-gold-400">€{item.price}</span>
                    <button
                      id={`wishlist-add-recommended-${item.id}`}
                      onClick={() => toggleWishlist(item.id)}
                      className="p-1 rounded bg-luxury-900 text-gold-400 hover:text-white transition-all cursor-pointer"
                      title="Add to Wishlist"
                    >
                      <Heart className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
