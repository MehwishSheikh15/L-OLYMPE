import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Heart, Calendar, ShieldCheck, User as UserIcon, LogOut, Menu, X, Bell, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenReservations: (tab?: 'book' | 'my-bookings' | 'my-orders') => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onToggleAdmin: () => void;
  isAdminActive: boolean;
  onScrollTo: (elementId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenReservations,
  onOpenAuth,
  onToggleAdmin,
  isAdminActive,
  onScrollTo
}) => {
  const { cart, wishlist, currentUser, logout, login, notifications, markNotificationsAsRead, pushNotification, isLightTheme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const wishlistCount = wishlist.length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onScrollTo(id);
  };

  const toggleAuthMode = () => {
    if (currentUser) {
      logout();
    } else {
      onOpenAuth('login');
    }
    setShowProfileDropdown(false);
  };

  const handleAdminModeToggle = () => {
    if (currentUser && currentUser.email === 'mehwishsheikh451sheikh@gmail.com' && currentUser.role === 'admin') {
      onToggleAdmin();
    } else {
      onOpenAuth('login');
      pushNotification('warning', 'Administrator credentials are required to open Admin Portal.');
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/95 backdrop-blur-md">
      {/* Mini Elegant Banner */}
      <div className="relative overflow-hidden bg-[#0c0c0c] border-b border-white/5 py-1.5 text-center text-[10px] font-medium tracking-[0.2em] text-[#F27D26] uppercase">
        ✦ MICHELIN GUIDES 2026: THREE STARS SECURED ✦ PREFERRED TABLE BOOKINGS LIVE 
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Brand Logo Identity styled exactly like Lumière in the Design HTML */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onScrollTo('hero')}>
            <div className="w-10 h-10 bg-[#F27D26] rounded-lg flex items-center justify-center shadow-[0_4px_20px_rgba(242,125,38,0.25)]">
              <div className="w-5 h-5 border-2 border-white rotate-45"></div>
            </div>
            <div>
              <span className="block font-sans text-sm font-light tracking-[0.25em] text-white uppercase">L’OLYMPE</span>
              <span className="block text-[8px] font-medium tracking-[0.25em] text-white/40 uppercase">GASTRONOMIE PARIS</span>
            </div>
          </div>

          {/* Core Desktop Navigation */}
          {!isAdminActive && (
            <div className="hidden lg:flex items-center gap-6 xl:gap-10 text-xs font-medium uppercase tracking-widest text-white/60">
              <button onClick={() => handleLinkClick('hero')} className="hover:text-white transition-colors cursor-pointer">Salon</button>
              <button onClick={() => handleLinkClick('featured')} className="hover:text-white transition-colors cursor-pointer">Our Menu</button>
              <button onClick={() => handleLinkClick('about')} className="hover:text-white transition-colors cursor-pointer">Our Story</button>
              <button onClick={() => handleLinkClick('chefs')} className="hover:text-white transition-colors cursor-pointer">The Masters</button>
              <button onClick={() => handleLinkClick('gallery')} className="hover:text-white transition-colors cursor-pointer">Gallery</button>
              <button 
                onClick={() => handleLinkClick('reserve')} 
                className="group flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-white hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5 text-[#F27D26]" />
                Reserve Table
              </button>
            </div>
          )}

          {isAdminActive && (
            <div className="hidden lg:flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold tracking-widest text-[#C5A059] uppercase">
              <ShieldCheck className="h-4 w-4 text-[#F27D26]" />
              SaaS Admin Panel Activated
            </div>
          )}

          {/* Utility Tools */}
          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4">
            
            {/* Elegant Sign In / Join Buttons or Profile */}
            {!currentUser && (
              <div className="hidden sm:flex items-center gap-1.5 md:gap-2">
                <button
                  onClick={() => { onOpenAuth('login'); }}
                  className="px-3 md:px-4 py-1.5 md:py-2 hover:text-[#F27D26] text-white/80 rounded-full text-[11px] md:text-xs font-semibold tracking-widest uppercase transition-all duration-300 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onOpenAuth('register'); }}
                  className="bg-[#F27D26] hover:bg-[#F27D26]/90 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[11px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_4px_12px_rgba(242,125,38,0.2)] hover:scale-[1.02] cursor-pointer"
                >
                  Join VIP
                </button>
              </div>
            )}

            {/* Notifications System */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  markNotificationsAsRead();
                }}
                className="relative p-1.5 sm:p-2 rounded-full border border-gold-900/30 bg-luxury-900 text-gold-400 hover:text-gold-500 transition-colors cursor-pointer"
              >
                <Bell className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-amber-600 text-[8px] font-bold text-white shadow-sm">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div id="notif-dropdown" className="absolute right-0 mt-3 w-72 sm:w-80 rounded-xl border border-gold-900/40 bg-luxury-900 p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between border-b border-gold-900/30 pb-2 mb-2">
                    <span className="text-[10px] sm:text-xs font-bold tracking-wider text-gold-400 uppercase">Concièrge Live Logs</span>
                    <span className="text-[9px] text-zinc-500">Live events stream</span>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-center text-zinc-500 py-4">No events registered.</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div key={n.id} className="text-xs border-b border-gold-900/10 pb-2 last:border-0">
                          <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
                            <span className={`uppercase font-semibold ${
                              n.type === 'success' ? 'text-amber-500' : n.type === 'warning' ? 'text-rose-500' : 'text-blue-400'
                            }`}>{n.type}</span>
                            <span>{n.timestamp}</span>
                          </div>
                          <p className="text-zinc-300 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon Button */}
            <button 
              onClick={onOpenWishlist}
              className="relative p-1.5 sm:p-2 rounded-full border border-gold-900/30 bg-luxury-900 text-gold-400 hover:text-gold-500 transition-colors cursor-pointer"
            >
              <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-gold-500 text-[8px] sm:text-[9px] font-bold text-luxury-950">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button 
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 rounded-full border border-gold-900/30 bg-luxury-900 text-gold-400 hover:text-gold-500 transition-colors cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-gold-500 text-[8px] sm:text-[9px] font-bold text-luxury-950">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button (hidden on mobile, accessible inside drawer drawer) */}
            <button 
              onClick={toggleTheme}
              className="hidden sm:flex relative p-2 rounded-full border border-gold-900/30 bg-luxury-900 text-gold-400 hover:text-gold-500 transition-colors cursor-pointer"
              title={isLightTheme ? "Dark Theme" : "Light Theme"}
            >
              {isLightTheme ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            {/* User Profile / Auth Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-1.5 border border-gold-900/30 rounded-full px-2 py-1 sm:px-2.5 sm:py-1.5 bg-luxury-900 hover:border-gold-500/50 transition-all cursor-pointer"
              >
                {currentUser ? (
                  <>
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover border border-gold-500/40" />
                    <span className="hidden lg:inline text-[10px] font-semibold tracking-wider text-gold-300 uppercase max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
                  </>
                ) : (
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-zinc-800 text-gold-400">
                    <UserIcon className="h-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                )}
              </button>

              {showProfileDropdown && (
                <div id="profile-dropdown" className="absolute right-0 mt-3 w-56 rounded-xl border border-gold-900/40 bg-luxury-900 p-3 shadow-xl z-50">
                  {currentUser ? (
                    <div className="space-y-2">
                      <div className="border-b border-gold-900/20 pb-2 mb-1.5 transition-all">
                        <span className="font-serif text-xs font-semibold text-gold-300 block">{currentUser.name}</span>
                        <span className="text-[9px] text-zinc-500 block truncate">{currentUser.email}</span>
                        <span className="mt-1 inline-block text-[8px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 uppercase">{currentUser.role} Account</span>
                      </div>
                      
                      {currentUser.role === 'admin' && (
                        <button 
                          onClick={() => { setShowProfileDropdown(false); onToggleAdmin(); }}
                          className="w-full text-left text-[11px] text-[#F27D26] hover:text-[#F27D26]/80 font-bold tracking-wider uppercase block py-1.5 transition-all border-b border-gold-900/10 pb-2 mb-1"
                        >
                          {isAdminActive ? '👁️ View Storefront' : '⚡ Open Dashboard'}
                        </button>
                      )}
                      
                      <button 
                        onClick={() => { setShowProfileDropdown(false); onOpenReservations('my-bookings'); }}
                        className="w-full text-left text-[11px] hover:text-gold-400 text-zinc-300 tracking-wider uppercase block py-1.5 transition-all"
                      >
                        Bookings & Tables
                      </button>

                      <button 
                        onClick={() => { setShowProfileDropdown(false); onOpenReservations('my-orders'); }}
                        className="w-full text-left text-[11px] text-[#F27D26] hover:text-[#F27D26]/80 font-bold tracking-wider uppercase block py-1.5 transition-all"
                      >
                        My Order History
                      </button>
                      
                      <button 
                        onClick={toggleAuthMode}
                        className="w-full text-left text-[11px] text-red-500 hover:text-red-400 tracking-wider uppercase flex items-center gap-1 py-1.5 transition-all border-t border-white/5 pt-2"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Terminate Session
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[10px] text-zinc-400 leading-snug">Authorized credentials required for instant VIP concierge orders.</p>
                      
                      {/* Customer Login trigger opens modal */}
                      <button 
                        onClick={() => { setShowProfileDropdown(false); onOpenAuth('login'); }}
                        className="w-full text-center text-[10px] bg-[#F27D26] hover:brightness-110 font-bold text-white tracking-wider uppercase py-2 rounded-lg transition-all cursor-pointer"
                      >
                        Sign In / Join
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Icon Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 lg:hidden border border-gold-900/30 rounded-full text-gold-300 hover:text-gold-500 transition-all cursor-pointer"
              aria-label="Toggle Mobile Sidebar Menu"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Modern Responsive Sidebar Navigation Drawer */}
      {/* Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Drawer container */}
      <div 
        className={`fixed top-0 right-0 h-full w-[310px] max-w-[85vw] bg-[#020202] border-l border-[#C5A059]/15 z-50 lg:hidden flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ease-out transform ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <span className="text-[9px] font-bold text-[#F27D26] tracking-widest uppercase block mb-0.5">L’Olympe Paris</span>
              <h4 className="font-serif text-[13px] font-bold text-white uppercase tracking-wider">VIP Conciergerie</h4>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4 text-xs font-semibold tracking-widest text-[#C5A059] uppercase">
            <button onClick={() => handleLinkClick('hero')} className="text-left py-1.5 hover:text-white transition-colors">Salon</button>
            <button onClick={() => handleLinkClick('featured')} className="text-left py-1.5 hover:text-white transition-colors">Our Menu</button>
            <button onClick={() => handleLinkClick('about')} className="text-left py-1.5 hover:text-white transition-colors">Our Story</button>
            <button onClick={() => handleLinkClick('chefs')} className="text-left py-1.5 hover:text-white transition-colors">The Masters</button>
            <button onClick={() => handleLinkClick('gallery')} className="text-left py-1.5 hover:text-white transition-colors">Gallery</button>
            
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenReservations('book'); }}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-full border border-[#F27D26] bg-[#F27D26]/15 py-3 text-white hover:bg-[#F27D26] transition-all text-xs font-bold leading-none tracking-widest uppercase cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-[#F27D26]" />
              Reserve VIP Table
            </button>
          </div>

          <div className="h-px bg-white/5 my-3" />

          {/* Authentication inside sidebar */}
          {!currentUser ? (
            <div className="grid grid-cols-2 gap-2 text-xs uppercase tracking-widest">
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                className="py-3 border border-white/10 rounded-xl text-white font-medium hover:bg-white/5 transition"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}
                className="py-3 bg-[#F27D26] rounded-xl text-white font-bold hover:brightness-110 transition"
              >
                Join VIP
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="block text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Authenticated Account</span>
                <span className="block font-serif text-xs font-semibold text-gold-300">{currentUser.name}</span>
                <span className="block text-[10px] text-zinc-400 truncate mt-0.5">{currentUser.email}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                {currentUser.role === 'admin' && (
                  <button 
                    onClick={() => { onToggleAdmin(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gold-500 text-luxury-950 rounded-lg text-xs font-bold tracking-widest uppercase cursor-pointer transition hover:brightness-110"
                  >
                    {isAdminActive ? '👁️ View Storefront' : '⚡ Open Dashboard'}
                  </button>
                )}

                <button 
                  onClick={() => { onOpenReservations('my-orders'); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2 border border-white/10 hover:border-[#F27D26]/40 text-white rounded-lg text-xs font-semibold uppercase tracking-widest transition"
                >
                  My Order History
                </button>

                <button 
                  onClick={() => { onOpenReservations('my-bookings'); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2 border border-white/10 hover:border-gold-500/40 text-zinc-300 rounded-lg text-xs font-semibold uppercase tracking-widest transition"
                >
                  My Reservations
                </button>
              </div>

              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-center py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 uppercase tracking-widest transition"
              >
                Terminate Session
              </button>
            </div>
          )}

        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/5 pt-4 space-y-4">
          {/* Theme Switcher option */}
          <button 
            type="button"
            onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-center gap-1.5 py-3 border border-white/5 rounded-xl text-zinc-400 hover:bg-white/5 text-xs font-semibold tracking-widest uppercase cursor-pointer"
          >
            {isLightTheme ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            {isLightTheme ? "Switch to Dark Theme" : "Switch to Light Theme"}
          </button>
          
          <p className="text-[8px] text-zinc-650 text-center uppercase tracking-widest leading-relaxed">
            Imperial Concierge. Paris, France. All Rights Reserved.
          </p>
        </div>

      </div>

    </nav>
  );
};
