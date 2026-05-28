import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Search, Heart, Info, ShoppingBag, Flame, Clock, Plus, Minus, X, SlidersHorizontal, Star, Euro, RefreshCw } from 'lucide-react';

export const FeaturedMenu: React.FC = () => {
  const { products, categories, addToCart, wishlist, toggleWishlist } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  
  // Advanced filters state
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  
  // Custom multi-quantities map to allow selecting quantities before adding to cart!
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  const handleQtyChange = (prodId: string, delta: number) => {
    setItemQuantities(prev => {
      const current = prev[prodId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [prodId]: next };
    });
  };

  // Pre-configured suggestions
  const suggestionChips = [
    { label: '✦ Truffle', val: 'truffle' },
    { label: '✦ Caviar', val: 'caviar' },
    { label: '✦ A5 Wagyu', val: 'wagyu' },
    { label: '✦ Gold Foil', val: 'gold' },
    { label: '✦ Foie Gras', val: 'foie' },
    { label: '✦ Soufflé', val: 'soufflé' }
  ];

  // Reset all filters to default
  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
    setMaxPrice(1000);
    setMinRating(0);
  };

  // 1. Filter Foods
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPrice = p.price <= maxPrice;
    const matchesRating = p.rating >= minRating;
    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });

  // 2. Sort Foods
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default
  });

  const handleAddToCart = (product: Product) => {
    const qty = itemQuantities[product.id] || 1;
    addToCart(product, qty);
    // Reset quantity display back to 1 after adding
    setItemQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <section id="featured" className="py-24 border-b border-white/5 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Sections Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.25em] text-[#F27D26] uppercase block mb-3">CONCIÈRGE GASTRONOME</span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-4">
            Browse our <span className="font-serif italic text-[#C5A059]">Masterpiece Menu</span>
          </h2>
          <div className="mx-auto h-0.5 w-16 bg-gradient-to-r from-transparent via-[#F27D26] to-transparent" />
        </div>

        {/* Search, Filter, & Sort Controls Panel */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Realtime Search Bar with clear button */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input 
                type="text"
                placeholder="Search truffle, caviar, wagyu steak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#F27D26] focus:ring-1 focus:ring-[#F27D26]/30 transition-all duration-300"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Filter and Sort Deck Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Show Filters Button with indicator */}
              <button 
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  showFiltersPanel || maxPrice < 1000 || minRating > 0
                    ? 'border-[#F27D26] bg-[#F27D26]/10 text-white shadow-[0_4px_12px_rgba(242,125,38,0.15)]'
                    : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#C5A059]" />
                <span>Filters &amp; Price Range</span>
                {(maxPrice < 1000 || minRating > 0) && (
                  <span className="w-2 h-2 rounded-full bg-[#F27D26] inline-block animate-ping" />
                )}
              </button>

              {/* Reset Filters Shortcut if anything changed */}
              {(searchQuery || selectedCategory !== 'all' || sortBy !== 'default' || maxPrice < 1000 || minRating > 0) && (
                <button
                  onClick={resetAllFilters}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 hover:bg-[#C5A059]/20 text-xs font-bold text-[#C5A059] cursor-pointer transition-all"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Reset Filters</span>
                </button>
              )}

              {/* Luxury Sort Select Box */}
              <div className="flex items-center gap-2.5 flex-1 md:flex-initial">
                <span className="text-xs text-white/50 font-medium tracking-wide whitespace-nowrap hidden sm:inline">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-white/10 bg-luxury-950 text-xs text-white/90 font-semibold focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 transition-all cursor-pointer hover:border-white/20"
                >
                  <option value="default">Default Curated Selection</option>
                  <option value="price-asc">Price &bull; Low to High</option>
                  <option value="price-desc">Price &bull; Majestic High to Low</option>
                  <option value="rating">Critic Rating Points (&ge; 4.8)</option>
                </select>
              </div>

            </div>

          </div>

          {/* Collapsible Fine Filters Deck */}
          {showFiltersPanel && (
            <div className="p-5 sm:p-6 rounded-2xl border border-[#C5A059]/25 bg-gradient-to-br from-[#0f0e0d] to-[#070606] shadow-2xl animate-fadeIn space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Max Price Range Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/70 tracking-widest uppercase flex items-center gap-1.5">
                      <Euro className="h-3.5 w-3.5 text-[#C5A059]" />
                      Max Budget Ceiling
                    </span>
                    <span className="text-xs font-mono font-bold text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded">
                      &le; €{maxPrice === 1000 ? '1,000+' : maxPrice}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="1000" 
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F27D26] hover:accent-[#F27D26]/90 focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1.5">
                    <span>€30</span>
                    <span>€250</span>
                    <span>€500</span>
                    <span>€750</span>
                    <span>€1,000+ (No Limit)</span>
                  </div>
                </div>

                {/* Minimum Critic Score Rating */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/70 tracking-widest uppercase flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-[#F27D26]" />
                      Minimum Gastronomic Score
                    </span>
                    <span className="text-xs font-mono font-bold text-[#F27D26] bg-[#F27D26]/10 px-2 py-0.5 rounded">
                      {minRating === 0 ? 'All Scores' : `★ ${minRating.toFixed(1)}+`}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 4.5, 4.7, 4.9].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          minRating === rating
                            ? 'bg-[#F27D26]/10 border-[#F27D26] text-white font-black'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {rating === 0 ? 'Show All' : `★ ${rating.toFixed(1)}+`}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Fast Reset and Filters Info Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5 items-center justify-between">
                <p className="text-[10px] text-white/45 tracking-wide italic">
                  * Showing recipes containing fresh Piedmont white truffles, Imperial Caspian Osetra caviar, and A5 Miyazaki Kobe.
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setMaxPrice(1000); setMinRating(0); }}
                    className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold tracking-widest text-[#C5A059] uppercase transition-colors"
                  >
                    Clear Filter Locks
                  </button>
                  <button 
                    onClick={() => setShowFiltersPanel(false)}
                    className="px-4 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 rounded-lg text-[10px] font-bold tracking-widest text-white uppercase transition-colors"
                  >
                    Confirm selection
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Quick Suggestions Tags & Metric Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            
            {/* suggestion search tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[9px] font-bold text-white/40 tracking-widest uppercase mr-1">Trending:</span>
              {suggestionChips.map(chip => (
                <button
                  key={chip.val}
                  onClick={() => setSearchQuery(chip.val)}
                  className={`px-3 py-1 rounded-full text-[9px] font-semibold tracking-wider transition-all border cursor-pointer ${
                    searchQuery.toLowerCase() === chip.val.toLowerCase()
                      ? 'bg-[#C5A059] border-[#C5A059] text-luxury-950 font-bold'
                      : 'bg-[#151311] border-white/5 text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* found counter */}
            <span className="text-[10px] sm:text-xs font-mono font-semibold text-zinc-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              Refined Menu Results: <span className="text-[#C5A059] font-bold">{sortedProducts.length}</span> / <span className="text-white/60">{products.length}</span>
            </span>

          </div>

          {/* Slider Category Badges */}
          <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-[#F27D26]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase border whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#F27D26] border-[#F27D26] text-white shadow-[0_4px_15px_rgba(242,125,38,0.25)]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              All Masterpieces ({products.length})
            </button>
            {categories.map(cat => {
              const count = products.filter(p => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase border whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#F27D26] border-[#F27D26] text-white shadow-[0_4px_15px_rgba(242,125,38,0.25)]'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <Search className="h-10 w-10 text-[#C5A059] mx-auto mb-4 animate-pulse" />
            <h3 className="font-serif text-lg text-white/80 mb-2">No masterpieces match your key filters</h3>
            <p className="text-xs text-white/40">Try searching for other fine culinary ingredients or resetting categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map(p => {
              const isWishlisted = wishlist.includes(p.id);
              const qty = itemQuantities[p.id] || 1;
              return (
                <div 
                  key={p.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:border-[#F27D26]/30 hover:shadow-[0_8px_30px_rgba(242,125,38,0.15)] transition-all duration-300"
                >
                  
                  {/* Image Holder with Tags */}
                  <div className="relative aspect-video overflow-hidden bg-zinc-900">
                    <img 
                      src={p.image} 
                      alt={p.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 duration-700 transition-all blur-[0.3px] group-hover:blur-0"
                    />
                    
                    {/* Dark gradient shadow overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent" />

                    {/* Wishlist Heart Icon Toggle */}
                    <button 
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md border border-white/10 bg-black/40 hover:scale-105 transition-all cursor-pointer z-10"
                    >
                      <Heart className={`h-4 w-4 transition-colors ${
                        isWishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-300 hover:text-red-400'
                      }`} />
                    </button>

                    {/* Status Pill Indicator */}
                    {p.status !== 'available' && (
                      <span className={`absolute top-3.5 left-3.5 px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest z-10 ${
                        p.status === 'low-stock' ? 'bg-[#F27D26] text-white' : 'bg-rose-950 text-rose-300 border border-rose-500/20'
                      }`}>
                        {p.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    )}

                    {/* Left Tag list overlay */}
                    <div className="absolute bottom-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
                      {p.tags.slice(0, 2).map((tg, idx) => (
                        <span key={idx} className="bg-white/10 text-white border border-white/10 px-2 py-0.5 rounded text-[8px] font-semibold tracking-wider uppercase">
                          {tg}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Product Specification Copy */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2.5 mb-2">
                        <h3 className="text-base font-medium text-white leading-snug group-hover:text-[#C5A059] transition-colors">
                          {p.name}
                        </h3>
                        <span className="font-serif text-lg font-bold text-[#C5A059]">
                          ${p.price}
                        </span>
                      </div>
                      
                      <p className="text-white/60 text-xs font-light tracking-wide leading-relaxed mb-4 line-clamp-2 font-sans">
                        {p.description}
                      </p>
                    </div>

                    <div>
                      {/* Metric specs */}
                      <div className="flex items-center gap-4 text-[10px] text-white/40 font-semibold mb-5 pb-3.5 border-b border-white/10 uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-[#C5A059]/80" />
                          {p.preparationTime} min prep
                        </span>
                        {p.nutrients && (
                          <span className="flex items-center gap-1">
                            <Flame className="h-3.5 w-3.5 text-[#F27D26]/80" />
                            {p.nutrients.calories} kcal
                          </span>
                        )}
                      </div>

                      {/* Quantity & Order action wrapper */}
                      <div className="flex items-center gap-2.5">
                        
                        {/* Selector Controls */}
                        <div className="flex items-center border border-white/10 rounded-xl bg-white/5 h-10 px-1">
                          <button 
                            onClick={() => handleQtyChange(p.id, -1)}
                            className="p-1 px-2 text-white/50 hover:text-white transition-colors"
                            disabled={p.status === 'out-of-stock'}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold text-white w-5 text-center">{qty}</span>
                          <button 
                            onClick={() => handleQtyChange(p.id, 1)}
                            className="p-1 px-2 text-white/50 hover:text-white transition-colors"
                            disabled={p.status === 'out-of-stock'}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Direct Add to Basket button */}
                        <button 
                          onClick={() => handleAddToCart(p)}
                          disabled={p.status === 'out-of-stock'}
                          className={`flex-1 flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                            p.status === 'out-of-stock'
                              ? 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed'
                              : 'bg-[#F27D26]/10 border border-[#F27D26]/25 text-[#F27D26] hover:bg-[#F27D26] hover:text-white hover:border-[#F27D26]'
                          }`}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Add To Basket
                        </button>

                        {/* Trigger details modal */}
                        <button 
                          onClick={() => setActiveDetailProduct(p)}
                          className="p-2 h-10 w-10 flex items-center justify-center border border-white/10 text-white/70 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <Info className="h-4.5 w-4.5" />
                        </button>

                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Modal for Ingredient Detail */}
        {activeDetailProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm transition-all">
            <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0c0c] p-6 shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
              
              {/* Close out */}
              <button 
                onClick={() => setActiveDetailProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 transition-colors text-white/60 hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="flex gap-4 items-center mb-6">
                <img 
                  src={activeDetailProduct.image} 
                  alt={activeDetailProduct.name} 
                  className="h-20 w-20 rounded-xl object-cover border border-white/10" 
                />
                <div>
                  <span className="text-[9px] font-bold text-[#F27D26] tracking-widest uppercase mb-1 block">Luxury Specification</span>
                  <h3 className="text-xl font-light text-white mb-0.5">{activeDetailProduct.name}</h3>
                  <span className="text-[#C5A059] font-medium text-sm">${activeDetailProduct.price}</span>
                </div>
              </div>

              {/* Composition ingredients */}
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-white/40 uppercase mb-2">Pristine Components</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDetailProduct.ingredients.map((ing, i) => (
                      <span key={i} className="text-xs bg-white/5 px-3 py-1.5 border border-white/5 text-white/80 rounded-lg">
                        ✦ {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {activeDetailProduct.nutrients && (
                  <div>
                    <span className="block text-[10px] font-bold tracking-wider text-white/40 uppercase mb-2">Nutritional Essence</span>
                    <div className="grid grid-cols-4 gap-2 bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
                      <div>
                        <span className="block text-[10px] text-white/40 lowercase">calories</span>
                        <span className="block text-xs font-bold text-[#C5A059]">{activeDetailProduct.nutrients.calories}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-white/40 lowercase">proteins</span>
                        <span className="block text-xs font-bold text-[#C5A059]">{activeDetailProduct.nutrients.proteins}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-white/40 lowercase">fats</span>
                        <span className="block text-xs font-bold text-[#C5A059]">{activeDetailProduct.nutrients.fats}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-white/40 lowercase">carbs</span>
                        <span className="block text-xs font-bold text-[#C5A059]">{activeDetailProduct.nutrients.carbs}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <span className="block text-[10px] font-bold tracking-wider text-white/40 uppercase mb-1">Aesthetic Narrative</span>
                  <p className="text-white/60 text-xs leading-relaxed font-light">{activeDetailProduct.description}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  handleAddToCart(activeDetailProduct);
                  setActiveDetailProduct(null);
                }}
                className="w-full mt-6 py-3.5 rounded-xl bg-[#F27D26] hover:bg-[#F27D26]/90 font-bold text-white text-xs tracking-widest uppercase transition-all cursor-pointer"
              >
                Instantly Add This To My Order Basket
              </button>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
