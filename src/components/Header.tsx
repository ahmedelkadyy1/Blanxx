import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Search, X, User, ShieldAlert, Sparkles, Wind } from 'lucide-react';
import { ProductIllustration } from './ProductIllustration';

export const Header: React.FC = () => {
  const {
    activeTab,
    navigateTo,
    cartCount,
    wishlist,
    toggleWishlist,
    addToCart,
    products,
    isCalmMode,
    setIsCalmMode,
    currentUser
  } = useShop();

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Fallback lookup
  const sourceProducts = products.length > 0 ? products : [];
  const wishlistProducts = sourceProducts.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <header className="sticky top-0 z-40 bg-sand-50/95 backdrop-blur-md border-b border-charcoal-900/5 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          
          {/* Left Nav links - Geometric spacing */}
          <div className="flex items-center space-x-5 md:space-x-7 text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-charcoal-900">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:opacity-100 transition-opacity cursor-pointer focus:outline-none ${
                activeTab === 'home' ? 'opacity-100 font-medium' : 'opacity-60'
              }`}
              id="nav-overview-btn"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className={`hover:opacity-100 transition-opacity cursor-pointer focus:outline-none ${
                activeTab === 'shop' ? 'opacity-100 font-medium' : 'opacity-60'
              }`}
              id="nav-objects-btn"
            >
              Products
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className={`hidden sm:flex items-center space-x-1 hover:opacity-100 transition-opacity cursor-pointer focus:outline-none ${
                activeTab === 'admin' ? 'opacity-100 font-medium text-amber-800' : 'opacity-40 text-charcoal-700'
              }`}
              id="nav-atelier-btn"
            >
              <ShieldAlert className="w-3 h-3 text-stone-500" />
              <span>Atelier</span>
            </button>
          </div>

          {/* Centered Brand Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center cursor-pointer group focus:outline-none"
            id="logo-btn"
          >
            <span className="font-serif text-lg md:text-2xl tracking-[0.35em] text-charcoal-900 group-hover:opacity-70 transition-opacity duration-500 uppercase">
              BLANX
            </span>
            <span className="font-sans text-[8px] tracking-[0.25em] text-charcoal-400 mt-0.5 uppercase opacity-60">
              slow goods
            </span>
          </button>

          {/* Right Action indicators - Text centric */}
          <div className="flex items-center space-x-5 md:space-x-7 text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-charcoal-900">
            {/* Calm Mode Toggle */}
            <button
              onClick={() => {
                setIsCalmMode(!isCalmMode);
                // Trigger telemetry page log
                const stateText = !isCalmMode ? "Enabled Calm Mode" : "Disabled Calm Mode";
                try {
                  fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ elementId: 'calm-mode-toggle', action: stateText })
                  });
                } catch(e) {}
              }}
              className={`flex items-center space-x-1 hover:opacity-100 transition-colors cursor-pointer focus:outline-none px-2 py-1 select-none border border-charcoal-900/10 ${
                isCalmMode ? 'bg-[#ECE8E1] text-[#4A5D4E] font-medium border-[#4A5D4E]/30' : 'opacity-65 text-charcoal-500 hover:text-charcoal-900'
              }`}
              id="calm-mode-switch"
              title="Toggle calm visual mode (hides prices, ads breathing partner)"
            >
              <Wind className={`w-3 h-3 ${isCalmMode ? 'animate-pulse' : ''}`} />
              <span className="hidden xs:inline">{isCalmMode ? 'Calm Mode' : 'Slow Mode'}</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={() => navigateTo('profile')}
              className={`hover:opacity-100 transition-opacity cursor-pointer focus:outline-none flex items-center space-x-1 ${
                activeTab === 'profile' ? 'opacity-100 font-medium' : 'opacity-60'
              }`}
              id="profile-btn"
              title="Guest Profile and History"
            >
              <User className="w-3.5 h-3.5 stroke-[1.5] text-stone-500" />
              <span className="hidden md:inline">{currentUser ? currentUser.fullName.split(' ')[0] : 'Profile'}</span>
            </button>

            {/* Saved Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="hover:opacity-100 transition-opacity opacity-60 cursor-pointer focus:outline-none flex items-center space-x-1"
              id="wishlist-btn"
              aria-label="Toggle Saved Items"
            >
              <span>Saved</span>
              <span>({wishlist.length})</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigateTo('cart')}
              className={`hover:opacity-100 transition-opacity cursor-pointer focus:outline-none flex items-center space-x-1 ${
                activeTab === 'cart' ? 'opacity-100 font-medium' : 'opacity-60'
              }`}
              id="cart-btn"
            >
              <span>Basket</span>
              <span>({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-only secondary navigation for Atelier panel */}
      <div className="sm:hidden w-full bg-stone-100/50 border-b border-charcoal-900/5 px-6 py-2 flex justify-start space-x-4">
        <button
          onClick={() => navigateTo('admin')}
          className={`flex items-center space-x-1 text-[9px] uppercase tracking-wider ${
            activeTab === 'admin' ? 'text-amber-800 font-medium' : 'text-charcoal-500 opacity-60'
          }`}
        >
          <ShieldAlert className="w-3 h-3 text-stone-500" />
          <span>Curator Atelier (Admin)</span>
        </button>
      </div>

      {/* Floating Wishlist Drawer Sidebar (Soft and elegant slide-in) */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="wishlist-drawer-wrapper">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal-900/10 backdrop-blur-[2px] transition-opacity duration-500"
            onClick={() => setIsWishlistOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-sand-50 flex flex-col border-l border-charcoal-900/10" id="saved-wishlist-sidebar">
            {/* Header */}
            <div className="p-6 border-b border-charcoal-900/10 flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-serif text-base text-charcoal-900 tracking-wide">Saved Quiet Objects</h3>
                <p className="font-sans text-[10px] text-charcoal-400 uppercase tracking-widest mt-0.5">your peaceful selection</p>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-2 text-charcoal-400 hover:text-charcoal-900 transition-colors cursor-pointer"
                id="close-wishlist-btn"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {wishlistProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 px-4">
                  <p className="font-serif italic text-charcoal-400 text-sm">A quiet, unhurried space.</p>
                  <p className="text-xs text-charcoal-405 leading-relaxed max-w-[240px]">
                    Save items you feel drawn toward while exploring. Browse and inspect without pressure.
                  </p>
                  <button
                    onClick={() => {
                      setIsWishlistOpen(false);
                      navigateTo('shop');
                    }}
                    className="text-xs tracking-widest text-charcoal-700 hover:text-charcoal-900 underline underline-offset-4 uppercase pt-4 cursor-pointer"
                  >
                    Explore objects
                  </button>
                </div>
              ) : (
                wishlistProducts.map((product) => (
                  <div key={product.id} className="flex space-x-4 border-b border-charcoal-900/10 pb-5 last:border-0" id={`wishlist-item-${product.id}`}>
                    <div
                      className={`w-16 h-16 rounded-none border border-charcoal-900/5 ${product.bgClass} flex items-center justify-center p-2 cursor-pointer`}
                      onClick={() => {
                        setIsWishlistOpen(false);
                        navigateTo('detail', product.id);
                      }}
                    >
                      <ProductIllustration id={product.id} accentClass={product.accentClass} className="w-full h-full" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4
                          onClick={() => {
                            setIsWishlistOpen(false);
                            navigateTo('detail', product.id);
                          }}
                          className="font-serif text-sm text-charcoal-900 hover:text-charcoal-650 transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <p className="font-sans text-[11px] text-charcoal-400 line-clamp-1 mt-0.5">{product.tagline}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono text-xs text-charcoal-700">${product.price}</span>
                        <div className="flex space-x-3 text-[11px] uppercase tracking-wider">
                          <button
                            onClick={() => {
                              addToCart(product, 1);
                              setIsWishlistOpen(false);
                              navigateTo('cart');
                            }}
                            className="text-charcoal-700 hover:text-charcoal-900 transition-colors cursor-pointer font-medium"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-charcoal-400 hover:text-charcoal-900 transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
