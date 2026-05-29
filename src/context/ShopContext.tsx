import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ActiveTab, Review } from '../types';
import { PRODUCTS } from '../data';

interface ShopContextType {
  activeTab: ActiveTab;
  selectedProductId: string | null;
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  searchQuery: string;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  latestOrder: Order | null;
  
  // Dynamic parameters
  sorting: string;
  priceRange: [number, number];
  selectedColor: string;
  selectedMaterial: string;
  isCalmMode: boolean;
  currentUser: { fullName: string; email: string } | null;
  analytics: { activeSessions: number; conversionRate: number; visitorLogs: any[]; coordinateHeatmap: any } | null;
  aiSearchState: { semanticAnalysis: string | null; active: boolean; matchedIds: string[] } | null;

  // State controls
  setSorting: (sort: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSelectedColor: (color: string) => void;
  setSelectedMaterial: (material: string) => void;
  setIsCalmMode: (calm: boolean) => void;
  setCurrentUser: (user: { fullName: string; email: string } | null) => void;
  setAiSearchState: (state: any) => void;
  
  // Navigation
  navigateTo: (tab: ActiveTab, productId?: string | null) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  
  // Order placement
  placeOrder: (shipping: Order['shippingAddress']) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  
  // Review submission
  submitReview: (productId: string, author: string, rating: number, comment: string) => Promise<{ success: boolean; error?: string }>;
  
  // Admin Operations
  addProduct: (productData: any) => Promise<Product | null>;
  editProduct: (productId: string, productData: any) => Promise<Product | null>;
  deleteProduct: (productId: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
  triggerPageTrack: (elementId?: string, action?: string) => void;
  
  // Semantic AI Search Actions
  runAISemiSearch: (searchPhrase: string) => Promise<void>;
  clearAISearch: () => void;

  // Computed values
  cartCount: number;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('slow_store_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && item.product && typeof item.product.id === 'string' && typeof item.product.price === 'number');
        }
      }
    } catch (e) {
      console.error('Error loading slow_store_cart from localStorage', e);
    }
    return [];
  });
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('slow_store_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(id => typeof id === 'string');
        }
      }
    } catch (e) {
      console.error('Error loading slow_store_wishlist from localStorage', e);
    }
    return [];
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('slow_store_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(order => order && typeof order.id === 'string');
        }
      }
    } catch (e) {
      console.error('Error loading slow_store_orders from localStorage', e);
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // New Filters & Aesthetic Settings State
  const [sorting, setSorting] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150]);
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [isCalmMode, setIsCalmMode] = useState<boolean>(() => {
    return localStorage.getItem('slow_store_calm_mode') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<{ fullName: string; email: string } | null>(() => {
    const saved = localStorage.getItem('slow_store_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [analytics, setAnalytics] = useState<any>(null);
  const [aiSearchState, setAiSearchState] = useState<any>(null);

  // Sync users & states to localStorage
  useEffect(() => {
    localStorage.setItem('slow_store_calm_mode', String(isCalmMode));
  }, [isCalmMode]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('slow_store_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('slow_store_user');
    }
  }, [currentUser]);

  // Load products from API, falling back to static PRODUCTS array elegantly
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Re-map format
          const mapped = data.map((p: any) => ({
            ...p,
            reviews: p.reviews || [],
            stock: p.stock !== undefined ? p.stock : 10
          }));
          setProducts(mapped);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to contact /api/products, fallback to static dataset', e);
    }

    // Default Fallback
    const staticMapped = PRODUCTS.map(p => ({
      ...p,
      reviews: p.reviews || [],
      stock: p.id === 'obj-04' ? 4 : 10 // Mock low stock triggers
    }));
    setProducts(staticMapped);
  };

  const refreshAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.warn('Analytics API unavailable');
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshAnalytics();
    // Refresh analytics periodically
    const interval = setInterval(refreshAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  // Update localStorage states
  useEffect(() => {
    localStorage.setItem('slow_store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('slow_store_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('slow_store_orders', JSON.stringify(orders));
  }, [orders]);

  // Navigation tracking
  const triggerPageTrack = async (elementId?: string, action?: string) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elementId,
          action,
          path: window.location.pathname
        })
      });
      refreshAnalytics();
    } catch (e) {
      // Sloped silent fail
    }
  };

  const navigateTo = (tab: ActiveTab, productId: string | null = null) => {
    setActiveTabState(tab);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Telemetry tracking
    const trackerLabel = `Navigated to ${tab.toUpperCase()} Tab` + (productId ? ` (Product: ${productId})` : '');
    triggerPageTrack(tab, trackerLabel);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    
    triggerPageTrack(`product-grid-${product.id}`, `Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(c => c.product.id === productId);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (item) {
      triggerPageTrack(`remove-item-${productId}`, `Removed "${item.product.name}" from cart`);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const matched = products.find(p => p.id === productId);
    setWishlist((prev) => {
      const isSaving = !prev.includes(productId);
      triggerPageTrack(`wishlist-item-${productId}`, `${isSaving ? 'Favorited' : 'Removed'} "${matched?.name || productId}"`);
      return isSaving ? [...prev, productId] : prev.filter((id) => id !== productId);
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Sync order placement to Express server
  const placeOrder = async (shipping: Order['shippingAddress']) => {
    const total = cartTotal;
    
    const payload = {
      items: cart,
      total,
      shippingAddress: shipping
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newOrder = await res.json();
        setOrders(prev => [newOrder, ...prev]);
        setLatestOrder(newOrder);
        clearCart();
        navigateTo('confirmation');
        refreshProducts(); // Refresh stock inventory counts!
        return;
      }
    } catch (e) {
      console.error('Order post error, placing locally', e);
    }

    // Local Fallback
    const localOrder: Order = {
      id: `SLW-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      total,
      shippingAddress: shipping,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      deliveryStatus: 'processing',
      trackingCode: `TRK-SLW-${Math.floor(1000 + Math.random() * 9000)}`,
      carrier: 'Compostable Freight Lines'
    };

    // Mock stock reduction locally
    setProducts(prev => prev.map(p => {
      const match = cart.find(c => c.product.id === p.id);
      if (match) {
        return { ...p, stock: Math.max(0, p.stock - match.quantity) };
      }
      return p;
    }));

    setOrders((prev) => [localOrder, ...prev]);
    setLatestOrder(localOrder);
    clearCart();
    navigateTo('confirmation');
  };

  // Admin order status update
  const updateOrderStatus = async (orderId: string, deliveryStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      }
    } catch (e) {
      console.error('Order status status update failed API');
      // Mock local update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryStatus: deliveryStatus as any } : o));
    }
  };

  // Submit product review
  const submitReview = async (productId: string, author: string, rating: number, comment: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, rating, comment })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Reload products of the system 
        await refreshProducts();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'AI moderation reject.' };
      }
    } catch (e: any) {
      console.error('Failed to submit review');
      return { success: false, error: 'Review submission error connection.' };
    }
  };

  // CRUD API for Admins
  const addProduct = async (productData: any): Promise<Product | null> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (res.ok) {
        const created = await res.json();
        await refreshProducts();
        return created;
      }
    } catch (e) {
      console.error('Product add error', e);
    }
    return null;
  };

  const editProduct = async (productId: string, productData: any): Promise<Product | null> => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (res.ok) {
        const updated = await res.json();
        await refreshProducts();
        return updated;
      }
    } catch (e) {
      console.error('Product edit error', e);
    }
    return null;
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await refreshProducts();
        return true;
      }
    } catch (e) {
      console.error('Product delete error', e);
    }
    return false;
  };

  // Semantic Search handler
  const runAISemiSearch = async (searchPhrase: string) => {
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchPhrase })
      });

      if (res.ok) {
        const result = await res.json();
        setAiSearchState({
          semanticAnalysis: result.semanticAnalysis || 'Grounding semantic visual results',
          active: true,
          matchedIds: result.matchedProductIds || []
        });
        return;
      }
    } catch (e) {
      console.error('AI Search failed');
    }
    
    // Clear state on failure
    clearAISearch();
  };

  const clearAISearch = () => {
    setAiSearchState(null);
  };


  // Computed state
  const cartCount = cart.reduce((acc, item) => {
    if (!item || typeof item.quantity !== 'number') return acc;
    return acc + item.quantity;
  }, 0);

  const cartTotal = cart.reduce((acc, item) => {
    if (!item || !item.product || typeof item.product.price !== 'number' || typeof item.quantity !== 'number') {
      return acc;
    }
    return acc + item.product.price * item.quantity;
  }, 0);

  return (
    <ShopContext.Provider
      value={{
        activeTab,
        selectedProductId,
        products,
        cart,
        wishlist,
        orders,
        searchQuery,
        selectedCategory,
        setSelectedCategory,
        latestOrder,
        sorting,
        priceRange,
        selectedColor,
        selectedMaterial,
        isCalmMode,
        currentUser,
        analytics,
        aiSearchState,
        setSorting,
        setPriceRange,
        setSelectedColor,
        setSelectedMaterial,
        setIsCalmMode,
        setCurrentUser,
        setAiSearchState,
        navigateTo,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        placeOrder,
        updateOrderStatus,
        submitReview,
        addProduct,
        editProduct,
        deleteProduct,
        refreshProducts,
        triggerPageTrack,
        runAISemiSearch,
        clearAISearch,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

