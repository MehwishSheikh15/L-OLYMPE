export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone: string;
  address?: string;
  joinedDate: string;
  avatar: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  status: 'available' | 'low-stock' | 'out-of-stock';
  rating: number;
  ratingCount: number;
  tags: string[];
  ingredients: string[];
  preparationTime: number; // in mins
  nutrients?: {
    calories: number;
    proteins: string;
    fats: string;
    carbs: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: string[];
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
  minOrderValue: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discountAmount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';
  address: string;
  phone: string;
  paymentMethod: string;
  promoCodeUsed?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  area: 'Main Salon' | 'Chef\'s Table' | 'Veranda' | 'Wine Cellar';
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'dishes' | 'ambiance' | 'actions';
  imageUrl: string;
}

export interface StoreSettings {
  restaurantName: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutNarrative: string;
  bannerText: string;
  seoKeywords: string;
}

export interface SystemNotif {
  id: string;
  type: 'info' | 'success' | 'warning';
  message: string;
  timestamp: string;
  read: boolean;
}
