import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Product, Category, CartItem, PromoCode, Order, 
  Reservation, GalleryItem, StoreSettings, SystemNotif 
} from '../types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  reservations: Reservation[];
  promoCodes: PromoCode[];
  gallery: GalleryItem[];
  settings: StoreSettings;
  notifications: SystemNotif[];
  isLightTheme: boolean;
  
  // Auth Functions
  login: (email: string, role: 'admin' | 'customer', password?: string) => boolean;
  logout: () => void;
  registerCustomer: (name: string, email: string, phone: string, address: string) => void;
  toggleTheme: () => void;
  
  // Store Functions
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'ratingCount'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Category Functions
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => void;
  deleteCategory: (id: string) => void;
  
  // Ecommerce Functions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyPromoCode: (code: string) => PromoCode | null;
  activePromoCode: PromoCode | null;
  placeOrder: (details: { address: string; phone: string; paymentMethod: string }) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Reservation Functions
  bookTable: (details: { userName: string; userEmail: string; phone: string; date: string; time: string; partySize: number; area: Reservation['area']; notes?: string }) => Promise<Reservation>;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  
  // Settings & Banner Functions
  updateSettings: (settings: Partial<StoreSettings>) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  
  // System Alert Hooks
  pushNotification: (type: SystemNotif['type'], message: string) => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
  fetchServerState: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultPromoCodes: PromoCode[] = [
  { code: 'ROYAL20', discountPercent: 20, description: 'Exclusive 20% discount on reservations over $150', minOrderValue: 150 },
  { code: 'GOLDENBITE', discountPercent: 15, description: '15% savings across our signature selection', minOrderValue: 50 },
  { code: 'FIRSTLUXE', discountPercent: 10, description: 'Welcome 10% discount for first-time epicurean clients', minOrderValue: 0 }
];

const defaultGallery: GalleryItem[] = [
  { id: 'gal-1', title: 'A5 Miyazaki Wagyu Sizzle Technique', category: 'actions', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-2', title: 'The Gilded Salon Dining Room', category: 'ambiance', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-3', title: 'Caviar Pearl Spoon Presentation', category: 'dishes', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-4', title: 'Our Private Candlelit Wine Cellar', category: 'ambiance', imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-5', title: 'Pouring Valrhona Gold Chocolate Sauce', category: 'actions', imageUrl: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-6', title: 'Plating the Blue Brittany Lobster', category: 'dishes', imageUrl: 'https://images.unsplash.com/photo-1534080391025-a77c7ec4403e?auto=format&fit=crop&w=800&q=80' }
];

const preloadedUsers: User[] = [
  { id: 'admin-mehwish', name: 'Mehwish', email: 'mehwishsheikh451sheikh@gmail.com', role: 'admin', phone: '+33 605 929 111', joinedDate: '2026-05-22', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'user-cust-1', name: 'Baroness Charlotte DuPont', email: 'charlotte@luxe.com', role: 'customer', phone: '+33 602 444 888', joinedDate: '2025-05-10', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 'user-cust-2', name: 'Sir Alexander Sterling', email: 'alex@sterling.com', role: 'customer', phone: '+1 (310) 555-0192', joinedDate: '2026-02-18', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80' }
];

const defaultNotifs: SystemNotif[] = [
  { id: 'not-1', type: 'info', message: 'Michelin Star renewal verified on Paris gastronome register.', timestamp: '14:32', read: false },
  { id: 'not-2', type: 'success', message: 'New ultra-exclusive VIP table booking: Princess Alexandra of Monaco.', timestamp: '08:05', read: false },
  { id: 'not-3', type: 'warning', message: 'Product inventory alerts: Piedmont Truffle Pasta reached low stock.', timestamp: '2026-05-21', read: true }
];

const defaultCategories: Category[] = [
  { id: "cat-1", name: "Signatures", slug: "signatures", description: "Culinary masterpieces of luxury dining", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
  { id: "cat-2", name: "Appetizers", slug: "appetizers", description: "Curated sensory starters to ignite the journey", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80" },
  { id: "cat-3", name: "Caviar & Seafood", slug: "seafood", description: "Exquisite delicacies harvested from deep waters", image: "https://images.unsplash.com/photo-1534080391025-a77c7ec4403e?auto=format&fit=crop&w=800&q=80" },
  { id: "cat-4", name: "Mains", slug: "mains", description: "Prime selection proteins and luxurious roasts", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
  { id: "cat-5", name: "Desserts", slug: "desserts", description: "Gilded confections and hand-spun chocolates", image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80" },
  { id: "cat-6", name: "Elixirs", slug: "elixirs", description: "Artisanal cocktails, botanical tonics and rare teas", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80" }
];

const defaultProducts: Product[] = [
  {
    id: "prod-1",
    name: "Imperial Golden Osetra Caviar Service",
    description: "Directly sourced premium Caspian Sea Osetra caviar served on ice over hand-carved mother-of-pearl spoons with traditional buckwheat blinis, crême fraîche, and chives.",
    price: 320,
    categoryId: "cat-3",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    status: "available",
    rating: 4.9,
    ratingCount: 42,
    tags: ["Michelin Choice", "Rare Caviar", "Royal Pairings"],
    ingredients: ["Osetra Caviar (50g)", "Warm Blinis", "Egg White Mimosa", "Chives", "Crème Fraîche"],
    preparationTime: 12,
    nutrients: { calories: 240, proteins: "18g", fats: "15g", carbs: "4g" }
  },
  {
    id: "prod-2",
    name: "A5 Miyazaki Wagyu Sirloin Sizzle",
    description: "Ultra-marbleized authentic Japanese Wagyu beef, lightly seared on high-heat volcanic stone. Enhanced with roasted black truffle salt, dynamic shoyu glaze, and fresh wasabi.",
    price: 245,
    categoryId: "cat-4",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    status: "available",
    rating: 5.0,
    ratingCount: 68,
    tags: ["Signature", "Imported Wagyu", "Chef Choice"],
    ingredients: ["Miyazaki Wagyu (200g)", "Volcanic Sea Salt", "Truffle Reduction", "Pickled Lotus Root"],
    preparationTime: 18,
    nutrients: { calories: 580, proteins: "34g", fats: "48g", carbs: "2g" }
  },
  {
    id: "prod-3",
    name: "Brittany Blue Lobster Thermidor",
    description: "Wild Brittany lobster caught off the pristine French coastline, poached in fine Chablis wine, combined with sliced porcini mushrooms and coated in a lavish Gruyère brandy crust.",
    price: 185,
    categoryId: "cat-3",
    image: "https://images.unsplash.com/photo-1534080391025-a77c7ec4403e?auto=format&fit=crop&w=800&q=80",
    status: "available",
    rating: 4.8,
    ratingCount: 31,
    tags: ["Ocean Classic", "Lobster", "Premium Cooked"],
    ingredients: ["French Blue Lobster", "Cognac VSOP", "Wild Porcini", "Aged Gruyère", "Tarragon Butter"],
    preparationTime: 25,
    nutrients: { calories: 420, proteins: "29g", fats: "22g", carbs: "9g" }
  },
  {
    id: "prod-4",
    name: "Piedmont White Truffle Agnolotti",
    description: "Delicate handmade pillows filled with slow-cooked veal breast, drenched in premium pasture butter, finished with heaps of fresh-shaved Autumn Piedmont white truffles.",
    price: 95,
    categoryId: "cat-2",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    status: "available",
    rating: 4.9,
    ratingCount: 54,
    tags: ["Handmade Pasta", "Autumn Truffles", "V"],
    ingredients: ["Agnolotti Pasta", "Veal Filling", "White Truffles", "Parietal Salt", "Eshire Butter"],
    preparationTime: 15,
    nutrients: { calories: 490, proteins: "16g", fats: "28g", carbs: "44g" }
  },
  {
    id: "prod-5",
    name: "Gold Leaf Valrhona Soufflé",
    description: "70% Valrhona Dark Guanaja chocolate soufflé, perfectly baked till billowing, dusted with edible 24-karat gold gold leaf, and injected with cold Grand Marnier crème anglaise.",
    price: 45,
    categoryId: "cat-5",
    image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80",
    status: "available",
    rating: 4.7,
    ratingCount: 89,
    tags: ["Gold Label", "Award Winning", "V"],
    ingredients: ["Valrhona Chocolate 70%", "Organic Eggs", "Grand Marnier liqueur", "24k Gold Leaf", "Tahitian Vanilla"],
    preparationTime: 20,
    nutrients: { calories: 350, proteins: "6g", fats: "18g", carbs: "38g" }
  },
  {
    id: "prod-6",
    name: "Royal Hibiscus Saffron Nectar",
    description: "Sensational mocktail brewed with Egyptian crimson hibiscus petals, organic saffron threads, dynamic botanicals, sparkling volcanic water, finished with a fresh wild mint crown.",
    price: 28,
    categoryId: "cat-6",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    status: "available",
    rating: 4.6,
    ratingCount: 19,
    tags: ["Elixir", "Organic Tonic", "Refreshing"],
    ingredients: ["Dried Hibiscus", "Saffron Strands", "Elderflower essence", "Sparkling Spring Water", "Mint"],
    preparationTime: 5,
    nutrients: { calories: 95, proteins: "0g", fats: "0g", carbs: "23g" }
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading states from LocalStorage or fallback
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('luxebite_session');
    if (saved) return JSON.parse(saved);
    return preloadedUsers[1]; // Logged in as Charlotte DuPont customer by default
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('luxebite_users');
    return saved ? JSON.parse(saved) : preloadedUsers;
  });

  // Server-synced states with default static seed fallbacks and local persistence layers to thrive on serverless cold starts
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxebite_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('luxebite_categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('luxebite_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('luxebite_reservations');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('luxebite_settings');
    return saved ? JSON.parse(saved) : {
      restaurantName: 'L’Olympe Paris',
      logoUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=200&h=200&q=80',
      contactPhone: '+33 (1) 40 55 90 90',
      contactEmail: 'concierge@lolympe-paris.com',
      address: 'Place de la Concorde, 75008 Paris, France',
      heroTitle: 'Culinary Masterpieces Crafting Legendary Legacies',
      heroSubtitle: 'Step into an exquisite sanctuary of sensory wonders, crafted with A5 Wagyu, golden caviar spoonfuls, and autumn Piedmont truffles.',
      heroImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
      aboutNarrative: `Founded by three-starred Michelin legend Chef Alain Gauthier, L'Olympe Paris is a sacred union of contemporary chemistry and classic French culinary heritage. Named after the home of gods, our dining chamber offers grand gold glassmorphism arches, an ancient stone wine repository holding 14,000 vintage bottles, and a personalized tableside fire culinary theatre. Every dish is crafted as an oil painting, engineered for those who seek high-art gastronomy.`,
      bannerText: '✦ MICHELIN STARS 2026: L’OLYMPE RETAINS ITS HISTORIC THREE STAR DISTINCTION ✦',
      seoKeywords: 'Michelin Star Paris, Luxury Fine Dining Paris, A5 Wagyu Caviar Bordeaux, Private Chef Table, Concorde French Restaurant'
    };
  });

  // Client-only states
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('luxebite_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('luxebite_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [promoCodes] = useState<PromoCode[]>(defaultPromoCodes);
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('luxebite_gallery');
    return saved ? JSON.parse(saved) : defaultGallery;
  });

  const [notifications, setNotifications] = useState<SystemNotif[]>(() => {
    const saved = localStorage.getItem('luxebite_notifications');
    return saved ? JSON.parse(saved) : defaultNotifs;
  });

  const [activePromoCode, setActivePromoCode] = useState<PromoCode | null>(null);

  // Light theme support
  const [isLightTheme, setIsLightTheme] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('luxebite_theme');
    return savedTheme === 'light';
  });

  // Core state loader from server
  const fetchServerState = async () => {
    try {
      const response = await fetch('/api/state');
      if (response.ok) {
        const data = await response.json();
        
        // Safeguard for Vercel/serverless environments when Sanity.io is not active
        const isSanityConfigured = data.sanityConfigured;
        if (!isSanityConfigured) {
          const hasCustomEdits = localStorage.getItem('luxebite_has_custom_updates') === 'true';
          const localProductsStr = localStorage.getItem('luxebite_products');
          const localCategoriesStr = localStorage.getItem('luxebite_categories');
          const localOrdersStr = localStorage.getItem('luxebite_orders');
          const localReservationsStr = localStorage.getItem('luxebite_reservations');
          const localSettingsStr = localStorage.getItem('luxebite_settings');

          if (hasCustomEdits) {
            const localProducts = localProductsStr ? JSON.parse(localProductsStr) : [];
            const localCategories = localCategoriesStr ? JSON.parse(localCategoriesStr) : [];
            const localOrders = localOrdersStr ? JSON.parse(localOrdersStr) : [];
            const localReservations = localReservationsStr ? JSON.parse(localReservationsStr) : [];
            const localSettings = localSettingsStr ? JSON.parse(localSettingsStr) : null;

            // Maintain local visual client state
            if (localProducts.length > 0) setProducts(localProducts);
            if (localCategories.length > 0) setCategories(localCategories);
            if (localOrders.length > 0) setOrders(localOrders);
            if (localReservations.length > 0) setReservations(localReservations);
            if (localSettings) setSettings(localSettings);

            // Sync backend to match our client master data
            await fetch('/api/state/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                products: localProducts.length > 0 ? localProducts : data.products,
                categories: localCategories.length > 0 ? localCategories : data.categories,
                orders: localOrders.length > 0 ? localOrders : data.orders,
                reservations: localReservations.length > 0 ? localReservations : data.reservations,
                settings: localSettings || data.settings
              })
            });
            return; // Exit so the server's clean default values do not override
          }
        }
        
        // Standard (or Sanity-synced) loading path
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          localStorage.setItem('luxebite_products', JSON.stringify(data.products));
        }
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          localStorage.setItem('luxebite_categories', JSON.stringify(data.categories));
        }
        
        if (data.orders) {
          setOrders(data.orders);
          localStorage.setItem('luxebite_orders', JSON.stringify(data.orders));
        }

        if (data.reservations) {
          setReservations(data.reservations);
          localStorage.setItem('luxebite_reservations', JSON.stringify(data.reservations));
        }

        if (data.settings && Object.keys(data.settings).length > 0) {
          setSettings(data.settings);
          localStorage.setItem('luxebite_settings', JSON.stringify(data.settings));
        }
      }
    } catch (err) {
      console.error("Failed to fetch state from backend:", err);
    }
  };

  // Keep state synchronized with periodic polling (safe, compatible, no connection pool starvation)
  useEffect(() => {
    fetchServerState();

    const intervalId = setInterval(() => {
      fetchServerState();
    }, 15000); // Poll once every 15 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Set up theme class on body element
  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('luxebite_theme', isLightTheme ? 'light' : 'dark');
  }, [isLightTheme]);

  const toggleTheme = () => {
    setIsLightTheme(prev => !prev);
  };

  // Sync client-side states to localStorage
  useEffect(() => {
    localStorage.setItem('luxebite_session', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('luxebite_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('luxebite_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('luxebite_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('luxebite_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('luxebite_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Authenticate System
  const login = (email: string, role: 'admin' | 'customer', password?: string): boolean => {
    const formattedEmail = email.trim().toLowerCase();
    
    // Check specific credentials requested by user
    if (formattedEmail === 'mehwishsheikh451sheikh@gmail.com') {
      if (password === 'Mehwish.-15') {
        const adminUser: User = {
          id: 'admin-mehwish',
          name: 'Mehwish',
          email: formattedEmail,
          role: 'admin',
          phone: '+33 605 929 111',
          joinedDate: new Date().toISOString().split('T')[0],
          avatar: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&h=150&q=80'
        };
        setUsers(prev => prev.some(u => u.email.toLowerCase() === formattedEmail) ? prev : [...prev, adminUser]);
        setCurrentUser(adminUser);
        fetchServerState();
        pushNotification('success', `Welcome Grand Chef Mehwish! Secured admin access verified.`);
        return true;
      } else {
        pushNotification('warning', `Access Denied: Incorrect credentials for Chef Mehwish.`);
        return false;
      }
    }

    // Otherwise standard Customer log-in
    if (role === 'admin') {
      pushNotification('warning', `Access Denied: Unrecognized administrator email.`);
      return false;
    }

    // Customer Login
    const existing = users.find(u => u.email.toLowerCase() === formattedEmail && u.role === 'customer');
    if (existing) {
      setCurrentUser(existing);
      fetchServerState();
      pushNotification('success', `Welcome back, ${existing.name}! Logged in as VIP Client.`);
      return true;
    }

    // Fast-create beautiful guest profile for other emails
    const name = email.split('@')[0].toUpperCase();
    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email: formattedEmail,
      role: 'customer',
      phone: '+33 600 000 000',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80`
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    fetchServerState();
    pushNotification('success', `Created direct VIP profile: Welcome ${newUser.name}`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePromoCode(null);
    fetchServerState();
    pushNotification('info', 'Securely logged out. Private sessions closed.');
  };

  const registerCustomer = (name: string, email: string, phone: string, address: string) => {
    const formattedEmail = email.trim().toLowerCase();
    
    // Prevent registering admin email as standard customer
    if (formattedEmail === 'mehwishsheikh451sheikh@gmail.com') {
      pushNotification('warning', 'Admin email domain restricted. Please utilize admin login portal.');
      return;
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email: formattedEmail,
      role: 'customer',
      phone,
      address,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    fetchServerState();
    pushNotification('success', `Gilded profile provisioned! Welcome, ${name}.`);
  };

  // Product mutations via REST API
  const addProduct = async (product: Omit<Product, 'id' | 'rating' | 'ratingCount'>) => {
    const newProduct = {
      ...product,
      id: 'prod-' + Date.now(),
      rating: 5.0,
      ratingCount: 1
    };
    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    localStorage.setItem('luxebite_products', JSON.stringify(updatedProducts));
    localStorage.setItem('luxebite_has_custom_updates', 'true');
    pushNotification('success', `Menu Expansion: "${newProduct.name}" deployed to public database.`);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    const updatedProducts = products.map(p => p.id === id ? { ...p, ...updated } : p);
    setProducts(updatedProducts);
    localStorage.setItem('luxebite_products', JSON.stringify(updatedProducts));
    localStorage.setItem('luxebite_has_custom_updates', 'true');
    pushNotification('info', `Menu details refreshed for ID ${id}.`);

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('luxebite_products', JSON.stringify(updatedProducts));
    localStorage.setItem('luxebite_has_custom_updates', 'true');
    pushNotification('warning', `Removed product ID ${id} from public display.`);

    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }
  };

  // Category mutations via REST API
  const addCategory = async (category: Omit<Category, 'id' | 'slug'>) => {
    const newCategory: Category = {
      ...category,
      id: 'cat-' + Date.now(),
      slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('luxebite_categories', JSON.stringify(updatedCategories));
    localStorage.setItem('luxebite_has_custom_updates', 'true');
    pushNotification('success', `Established menu division: "${newCategory.name}".`);

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id: string) => {
    const updatedCategories = categories.filter(c => c.id !== id);
    setCategories(updatedCategories);
    localStorage.setItem('luxebite_categories', JSON.stringify(updatedCategories));
    localStorage.setItem('luxebite_has_custom_updates', 'true');
    pushNotification('warning', `Abolished category section ID ${id}.`);

    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }
  };

  // Ecommerce Core Operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    pushNotification('success', `Added to collection: ${quantity}x ${product.name}`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        pushNotification('info', 'Removed product from private wishlist.');
        return prev.filter(id => id !== productId);
      } else {
        pushNotification('success', 'Affixed product to private wishlist.');
        return [...prev, productId];
      }
    });
  };

  const applyPromoCode = (code: string): PromoCode | null => {
    const matched = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    if (matched) {
      setActivePromoCode(matched);
      pushNotification('success', `Coupon Authenticated! ${matched.discountPercent}% luxury deduction unlocked.`);
      return matched;
    }
    pushNotification('warning', 'Invalid or expired promo code.');
    return null;
  };

  // Order Placement (Server-Synced)
  const placeOrder = async (details: { address: string; phone: string; paymentMethod: string }): Promise<Order | null> => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    const discountAmount = activePromoCode && subtotal >= activePromoCode.minOrderValue
      ? Math.round(subtotal * (activePromoCode.discountPercent / 100))
      : 0;
      
    const tax = Math.round((subtotal - discountAmount) * 0.08 * 10) / 10;
    const deliveryFee = 15;
    const total = subtotal - discountAmount + tax + deliveryFee;

    const newOrder: Order = {
      id: 'ord-' + (1000 + orders.length + 1),
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest Chef',
      userEmail: currentUser?.email || 'guest@dining.com',
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      subtotal,
      discountAmount,
      tax,
      deliveryFee,
      total,
      status: 'pending',
      address: details.address,
      phone: details.phone,
      paymentMethod: details.paymentMethod,
      promoCodeUsed: activePromoCode?.code,
      trackingNumber: 'TRK-' + Math.floor(10000000 + Math.random() * 90000000),
      createdAt: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('luxebite_orders', JSON.stringify(updatedOrders));
    localStorage.setItem('luxebite_has_custom_updates', 'true');
    setCart([]);
    setActivePromoCode(null);
    pushNotification('success', `Checkout Complete! Order ${newOrder.id} dispatched live to L'Olympe master kitchen.`);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updatedOrders);
    localStorage.setItem('luxebite_orders', JSON.stringify(updatedOrders));
    localStorage.setItem('luxebite_has_custom_updates', 'true');
    pushNotification('info', `Order ${orderId} status updated to: ${status.toUpperCase()}`);

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }
  };

  // Table Reservations (Server-Synced)
  const bookTable = async (details: { 
    userName: string; userEmail: string; phone: string; 
    date: string; time: string; partySize: number; 
    area: Reservation['area']; notes?: string 
  }): Promise<Reservation> => {
    const newRes: Reservation = {
      id: 'res-' + (reservations.length + 1),
      userId: currentUser?.id || 'guest',
      userName: details.userName,
      userEmail: details.userEmail,
      phone: details.phone,
      date: details.date,
      time: details.time,
      partySize: details.partySize,
      area: details.area,
      notes: details.notes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedReservations = [newRes, ...reservations];
    setReservations(updatedReservations);
    localStorage.setItem('luxebite_reservations', JSON.stringify(updatedReservations));
    localStorage.setItem('luxebite_has_custom_updates', 'true');
    pushNotification('success', `Reservation Registered: ${details.date} • ${details.time} in ${details.area}. Please await elite review.`);

    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRes)
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }

    return newRes;
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    const updatedReservations = reservations.map(r => r.id === id ? { ...r, status } : r);
    setReservations(updatedReservations);
    localStorage.setItem('luxebite_reservations', JSON.stringify(updatedReservations));
    localStorage.setItem('luxebite_has_custom_updates', 'true');
    pushNotification('success', `Reservation ID ${id} set to: ${status.toUpperCase()}.`);

    try {
      await fetch(`/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }
  };

  // Settings & Media Banners
  const updateSettings = async (updated: Partial<StoreSettings>) => {
    const updatedSettings = { ...settings, ...updated };
    setSettings(updatedSettings);
    localStorage.setItem('luxebite_settings', JSON.stringify(updatedSettings));
    localStorage.setItem('luxebite_has_custom_updates', 'true');
    pushNotification('success', `Gilded values successfully updated.`);

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }
  };

  // Gallery CRUD
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now()
    };
    setGallery(prev => [...prev, newItem]);
    pushNotification('success', 'Gallery expanded with a new frame reference.');
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    pushNotification('warning', `Purged image frame ID ${id} from live media repository.`);
  };

  // Notification utilities
  const pushNotification = (type: SystemNotif['type'], message: string) => {
    const newNotif: SystemNotif = {
      id: 'not-' + Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20));
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, products, categories, cart, wishlist, orders, reservations, promoCodes, gallery, settings, notifications, isLightTheme,
      login, logout, registerCustomer, toggleTheme,
      addProduct, updateProduct, deleteProduct,
      addCategory, deleteCategory,
      addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, applyPromoCode, activePromoCode, placeOrder, updateOrderStatus,
      bookTable, updateReservationStatus,
      updateSettings, addGalleryItem, deleteGalleryItem,
      pushNotification, markNotificationsAsRead, clearNotifications,
      fetchServerState
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be utilized within an AppProvider wrapper');
  }
  return context;
};
