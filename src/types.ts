export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  tagline: string;
  description: string;
  details: string[];
  colorName: string;
  bgClass: string; // Tailwind bg class for consistent visual theme
  accentClass: string; // Tailwind text/bg class for accent matching
  dimensions: string;
  material: string;
  stock?: number;
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shippingAddress: {
    fullName: string;
    email: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  status: 'confirmed' | 'dispatched';
  deliveryStatus?: 'processing' | 'shipped' | 'delivered';
  trackingCode?: string;
  carrier?: string;
}

export type ActiveTab = 'home' | 'shop' | 'detail' | 'cart' | 'checkout' | 'confirmation' | 'profile' | 'admin';
