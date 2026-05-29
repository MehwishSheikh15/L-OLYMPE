import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedMenu } from './components/FeaturedMenu';
import { AboutSection } from './components/AboutSection';
import { ChefSection } from './components/ChefSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ReservationsModal } from './components/ReservationsModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AIChatConcierge } from './components/AIChatConcierge';
import { FloatingToasts } from './components/FloatingToasts';
import { Sparkles, Terminal, ShieldAlert } from 'lucide-react';

function AppContent() {
  const { currentUser, login } = useApp();
  const [isAdminActive, setIsAdminActive] = useState(false);

  // Auto-navigate to Admin Dashboard when admin logs in, and auto-close when they logout
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && currentUser.email === 'mehwishsheikh451sheikh@gmail.com') {
      setIsAdminActive(true);
    } else {
      setIsAdminActive(false);
    }
  }, [currentUser]);
  
  // Drawer Toggles
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [reservationsOpen, setReservationsOpen] = useState(false);
  const [reservationTab, setReservationTab] = useState<'book' | 'my-bookings' | 'my-orders'>('book');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const handleOpenReservations = (tab: 'book' | 'my-bookings' | 'my-orders' = 'book') => {
    setReservationTab(tab);
    setReservationsOpen(true);
  };

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  // Smooth scroll helper
  const handleScrollTo = (elementId: string) => {
    setIsAdminActive(false); // Return to site if navigating to visual sections
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white flex flex-col justify-between selection:bg-brand-orange selection:text-white relative overflow-hidden">
      
      {/* Background Subtle Gradient Flares from the Dark Luxury theme */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-[#F27D26] opacity-[0.08] blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#C5A059] opacity-[0.05] blur-[100px] rounded-full pointer-events-none z-0"></div>
      
      {/* Prime Header navigation links */}
      <Navbar 
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenReservations={handleOpenReservations}
        onOpenAuth={handleOpenAuth}
        onToggleAdmin={() => setIsAdminActive(!isAdminActive)}
        isAdminActive={isAdminActive}
        onScrollTo={handleScrollTo}
      />

      {/* Main Core View Switcher */}
      <main className="flex-grow">
        {isAdminActive ? (
          <AdminDashboard />
        ) : (
          <>
            <Hero onScrollTo={handleScrollTo} />
            <FeaturedMenu />
            <AboutSection />
            <ChefSection />
            <GallerySection />
            <ContactSection />
          </>
        )}
      </main>

      {/* Corporate signature footnote references */}
      <Footer />

      {/* Shopping Overlays drawers models */}
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onOpenReservations={() => { setCartOpen(false); handleOpenReservations('book'); }}
      />

      <ReservationsModal 
        isOpen={reservationsOpen} 
        initialTab={reservationTab}
        onClose={() => setReservationsOpen(false)} 
      />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultTab={authModalTab}
      />

      <WishlistDrawer 
        isOpen={wishlistOpen} 
        onClose={() => setWishlistOpen(false)} 
      />

      <FloatingToasts />

      {/* Floating AI Guest Butler Chat agent widget */}
      <AIChatConcierge />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
