import React, { useState, useEffect, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Review } from '../types';
import { ProductIllustration } from './ProductIllustration';
import { Heart, Check, Users, Sparkles, MessageSquare, Star, ArrowLeft, ShieldCheck, ShoppingBag, Eye, Wind, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo,
    isCalmMode,
    submitReview,
    refreshProducts,
    triggerPageTrack,
    cart
  } = useShop();

  const [addedConfirm, setAddedConfirm] = useState(false);
  
  // Review submission state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Find product from memory list or static PRODUCTS
  const product = useMemo(() => {
    return products.find((p) => p.id === selectedProductId);
  }, [products, selectedProductId]);

  // Track "recently viewed" in localStorage
  useEffect(() => {
    if (product) {
      triggerPageTrack('product-detail-view', `Inspected product detail for "${product.name}"`);
      try {
        const stored = localStorage.getItem('slow_store_recently_viewed');
        let viewedList: string[] = stored ? JSON.parse(stored) : [];
        
        // Remove current product id if exists, and prepend to stay newest
        viewedList = viewedList.filter(id => id !== product.id);
        viewedList.unshift(product.id);
        
        // Keep last 6 items
        localStorage.setItem('slow_store_recently_viewed', JSON.stringify(viewedList.slice(0, 6)));
      } catch (e) {
        console.error('Error tracking recently viewed', e);
      }
    }
  }, [product]);

  // Load recently viewed products list (excluding current)
  const recentlyViewedProducts = useMemo(() => {
    if (!product) return [];
    try {
      const stored = localStorage.getItem('slow_store_recently_viewed');
      if (stored) {
        const list: string[] = JSON.parse(stored);
        return products.filter(p => p.id !== product.id && list.includes(p.id)).slice(0, 3);
      }
    } catch (e) {}
    return [];
  }, [products, product]);

  // Recommendation System: Similar products (same category or raw material source)
  const recommendedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && (p.category === product.category || p.material === product.material))
      .slice(0, 4);
  }, [products, product]);

  // Verify stock limitations
  const cartItem = cart.find(item => item.product.id === product?.id);
  const currentInBag = cartItem?.quantity || 0;
  const isOutOfStock = product?.stock !== undefined && product.stock <= 0;
  const isStockExceeded = product?.stock !== undefined && currentInBag >= product.stock;

  if (!product) {
    return (
      <div className="py-24 text-center max-w-sm mx-auto space-y-4">
        <Wind className="w-6 h-6 text-stone-300 mx-auto animate-pulse" />
        <p className="font-serif italic text-charcoal-800">The requested object has drifted back to the artisan.</p>
        <button
          onClick={() => navigateTo('home')}
          className="text-xs tracking-widest text-[#C07F5F] hover:text-charcoal-900 uppercase border-b border-[#C07F5F] pb-0.5 cursor-pointer mt-2"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const saved = isWishlisted(product.id);

  const handleAddWithStockCheck = () => {
    if (isOutOfStock) return;
    if (isStockExceeded) {
      setReviewMsg({ text: `Cannot exceed available studio stock (${product.stock} units)`, isError: true });
      return;
    }

    addToCart(product, 1);
    setAddedConfirm(true);
    triggerPageTrack('add-to-cart-btn', `Added "${product.name}" to cart`);
    
    // Smooth toast timer
    setTimeout(() => {
      setAddedConfirm(false);
    }, 2800);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      setReviewMsg({ text: 'Please fill out your identity and reflections text.', isError: true });
      return;
    }

    setReviewSubmitting(true);
    setReviewMsg(null);

    try {
      const response = await submitReview(product.id, reviewAuthor, reviewRating, reviewComment);
      if (response.success) {
        setReviewMsg({ text: 'Your reflection has been balanced and placed in review logs.', isError: false });
        setReviewAuthor('');
        setReviewComment('');
        setReviewRating(5);
        await refreshProducts(); // refresh products with lists
        triggerPageTrack('review-submit', `Submitted review for "${product.name}"`);
      } else {
        setReviewMsg({ text: response.error || 'Failed to submit reflections.', isError: true });
      }
    } catch (err: any) {
      setReviewMsg({ text: 'Could not connect to review register.', isError: true });
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Safe reviews list
  const reviewsList = product.reviews || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 md:py-12" id="pdp-wrapper-container">
      {/* Dynamic Back button */}
      <button
        onClick={() => navigateTo('home')}
        className="group flex items-center space-x-2 text-xs tracking-wider text-charcoal-400 hover:text-charcoal-900 transition-colors duration-300 mb-8 md:mb-12 cursor-pointer focus:outline-none"
        id="back-list-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase text-[10px] tracking-[0.2em] font-medium">Unhurried Browsing Overview</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Artwork Canvas Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
          id="product-pdp-display-box"
        >
          <div className={`aspect-[4/5] w-full rounded-none ${product.bgClass} flex items-center justify-center p-10 md:p-16 border border-charcoal-900/5 relative overflow-hidden`}>
            {/* Soft geometric hairline guides */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute inset-8 rounded-full border border-dashed border-charcoal-900/10" />
              <div className="absolute top-0 left-1/2 w-px h-full bg-charcoal-900/5" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-charcoal-900/5" />
            </div>

            <ProductIllustration id={product.id} accentClass={product.accentClass} className="w-[80%] h-[80%] max-w-sm max-h-sm mr-2 z-10" />
            
            {/* Ambient copper tags */}
            <span className="absolute bottom-6 left-8 font-sans text-[8px] tracking-widest text-[#4A5D4E] font-medium opacity-60 uppercase bg-[#EAE8E1] px-2 py-0.5 border border-stone-200">
              {product.material}
            </span>
          </div>
        </motion.div>

        {/* Right Column: Information Shelf */}
        <div className="lg:col-span-5 flex flex-col pt-1" id="product-pdp-text-info">
          {/* Category, Accent and Stock Alerts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-[10px] tracking-[0.25em] text-charcoal-400 uppercase font-sans">
              <span>{product.category}</span>
              <span className="w-1 h-1 bg-charcoal-400/30 rounded-full" />
              <span className="text-[#4A5D4E] font-medium">{product.colorName}</span>
            </div>

            {!isCalmMode && product.stock !== undefined && (
              <div className="text-[10px] font-sans">
                {product.stock <= 0 ? (
                  <span className="text-red-800 font-medium bg-red-50 px-2 py-0.5 border border-red-200">Out of Stock</span>
                ) : product.stock <= 3 ? (
                  <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 border border-amber-200">Only {product.stock} pieces stay</span>
                ) : (
                  <span className="text-[#4A5D4E] font-medium bg-[#EAE8E1]/60 px-2 py-0.5 border border-[#ECE7DF]">{product.stock} curated</span>
                )}
              </div>
            )}
          </div>

          <h1 className="font-serif text-2xl md:text-3.5xl text-charcoal-900 tracking-wide font-normal mt-3">
            {product.name}
          </h1>

          {/* Price or Calm focus */}
          {!isCalmMode ? (
            <div className="font-mono text-sm text-[#4A5D4E] mt-2 bg-[#EAE8E1]/35 self-start px-3 py-1 font-medium border border-charcoal-900/5">
              ${product.price}
            </div>
          ) : (
            <div className="text-[10px] tracking-widest text-[#4A5D4E] uppercase mt-2 font-medium italic">
              Atmosphere Focus Active
            </div>
          )}

          <div className="h-px bg-charcoal-900/10 my-6" />

          {/* Tagline */}
          <p className="font-serif italic text-sm text-[#C07F5F] leading-relaxed mb-4">
            “{product.tagline}”
          </p>

          {/* Description */}
          <p className="font-sans text-xs text-stone-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Specs */}
          <div className="mt-6 grid grid-cols-2 gap-y-3 gap-x-6 py-4 px-4 bg-[#EDEADF]/35 rounded-none border border-charcoal-900/5 text-xs font-sans">
            <div>
              <span className="text-charcoal-400 uppercase tracking-widest text-[9px] block">Materiality</span>
              <span className="text-charcoal-800 font-medium block mt-1">{product.material}</span>
            </div>
            <div>
              <span className="text-charcoal-400 uppercase tracking-widest text-[9px] block">Dimensions</span>
              <span className="text-charcoal-400 font-mono block mt-1">{product.dimensions}</span>
            </div>
          </div>

          {/* Order additions controller */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            
            {/* Primary add button */}
            <button
              onClick={handleAddWithStockCheck}
              disabled={isOutOfStock || isStockExceeded}
              className={`flex-1 flex items-center justify-center space-x-3 py-4 text-xs font-medium tracking-[0.2em] uppercase rounded-none cursor-pointer transition-all duration-700 focus:outline-none ${
                addedConfirm
                  ? 'bg-[#4A5D4E] text-white'
                  : isOutOfStock 
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed border border-stone-200' 
                    : isStockExceeded
                      ? 'bg-amber-100 text-amber-800 cursor-not-allowed border border-amber-200 font-sans'
                      : 'bg-charcoal-900 text-sand-50 hover:bg-charcoal-800'
              }`}
              id="pdp-add-basket-btn"
            >
              {addedConfirm ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2] shrink-0" />
                  <span>Curation Added</span>
                </>
              ) : isOutOfStock ? (
                <span>Completely Claimed</span>
              ) : isStockExceeded ? (
                <span>All available stock in bag</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Acquire Object</span>
                </>
              )}
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="py-4 px-6 flex items-center justify-center border border-charcoal-900/10 rounded-none hover:bg-[#EDEADF]/30 text-charcoal-700 hover:text-charcoal-900 transition-colors duration-500 cursor-pointer focus:outline-none shrink-0"
              title={saved ? "Remove from Saved" : "Save object"}
              id="pdp-wishlist"
            >
              <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-rose-800 stroke-rose-800' : 'stroke-[1.25]'}`} />
            </button>
          </div>

          {currentInBag > 0 && (
            <p className="font-sans text-[10.5px] text-[#4A5D4E] mt-3 tracking-wide text-center sm:text-left font-medium">
              ✓ You currently hold {currentInBag} copy of this object in your unhurried Basket.
            </p>
          )}

          <div className="h-px bg-charcoal-900/10 my-8" />

          {/* Detailed traceability block */}
          <div className="space-y-4" id="artisan-details-list">
            <h4 className="font-serif text-[11px] text-charcoal-400 uppercase tracking-[0.2em] font-medium">Traceability Diary</h4>
            <ul className="space-y-3.5 text-xs text-stone-650 font-light leading-relaxed font-sans">
              {product.details.map((detail, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="text-stone-400 mt-1 text-[9px] font-mono select-none">0{idx + 1}.</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* 5. Dynamic Reviews Board & SUBMIT FORM (Verified Buyers & AI Moderation) */}
      <section className="mt-20 border-t border-charcoal-900/10 pt-16" id="product-reviews-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left panel: Reflections logs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-2.5">
              <MessageSquare className="w-4 h-4 text-[#4A5D4E]" />
              <h3 className="font-serif text-lg text-charcoal-900 tracking-wide font-medium">Artisan Verification Logs</h3>
            </div>
            
            <p className="text-[11.5px] text-stone-500 leading-relaxed font-sans">
              BLANX values emotional grounding stories. Read un-rushed reviews from visitors who anchored these objects in their homes.
            </p>

            <div className="space-y-6 pt-4">
              {reviewsList.length === 0 ? (
                <div className="p-8 text-center bg-white border border-charcoal-900/5 space-y-2">
                  <p className="font-serif italic text-stone-400 text-sm">No reflection logs placed yet.</p>
                  <p className="text-[11px] text-stone-500 font-sans">Be the first to leave a silent note in the register below.</p>
                </div>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="p-5 bg-white border border-charcoal-900/5 flex flex-col justify-between space-y-3" id={`review-card-${rev.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-serif text-xs font-semibold text-charcoal-900">{rev.author}</span>
                        {rev.verified && (
                          <span className="flex items-center space-x-1 text-[8.5px] uppercase tracking-wider text-[#4A5D4E] bg-emerald-50 px-1.5 py-0.5 border border-emerald-100 font-sans font-medium" title="Verified purchase">
                            <ShieldCheck className="w-2.5 h-2.5 text-[#4A5D4E]" />
                            <span>Verified Anchor</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-[2px]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-200'}`} />
                        ))}
                      </div>
                    </div>

                    <p className="font-sans text-xs text-stone-650 italic leading-relaxed whitespace-pre-wrap">
                      “{rev.comment}”
                    </p>

                    <div className="font-mono text-[9px] text-stone-450 uppercase tracking-widest text-right mt-1.5 border-t border-dashed border-stone-100 pt-1.5">
                      {rev.date}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel: Add Reflections register */}
          {!isCalmMode ? (
            <div className="lg:col-span-5 bg-[#FAF8F5] border border-charcoal-900/5 p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C07F5F]" />
                <h4 className="font-serif text-sm text-charcoal-900 tracking-wide font-medium">Add to the quiet register</h4>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
                Place your unhurried thoughts about this object in our guestbook. Your words will be reviewed by the curator.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2" id="write-review-form">
                <div>
                  <label className="block text-[9.5px] uppercase tracking-widest text-stone-400 font-sans font-medium mb-1">Your Identity (Name)</label>
                  <input
                    type="text"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="E.g., Margaret R."
                    className="w-full bg-white border border-charcoal-900/10 px-3.5 py-2.5 text-xs focus:outline-none focus:border-stone-400 font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] uppercase tracking-widest text-stone-400 font-sans font-medium mb-1">Star calibration</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-white border border-charcoal-900/10 px-3.5 py-2.5 text-xs focus:outline-none focus:border-stone-400 uppercase tracking-wider text-[10px] cursor-pointer"
                  >
                    <option value="5">Excellent anchor (5 stars)</option>
                    <option value="4">Serene and grounding (4 stars)</option>
                    <option value="3">Decent atmosphere (3 stars)</option>
                    <option value="2">Somewhat noisy (2 stars)</option>
                    <option value="1">Lacking visual silence (1 star)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9.5px] uppercase tracking-widest text-stone-400 font-sans font-medium mb-1">Review reflections</label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share how this object interacts with light, shadow, and quiet space in your room..."
                    className="w-full bg-white border border-charcoal-900/10 px-3.5 py-2.5 text-xs focus:outline-none focus:border-stone-400 font-sans leading-relaxed text-charcoal-800"
                    maxLength={400}
                    required
                  />
                </div>

                {reviewMsg && (
                  <div className={`p-3 text-[11px] leading-relaxed select-none ${
                    reviewMsg.isError ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {reviewMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full bg-charcoal-900 hover:bg-charcoal-850 text-sand-50 py-3 text-[9.5px] uppercase tracking-[0.22em] transition-colors cursor-pointer disabled:opacity-50 font-medium"
                >
                  {reviewSubmitting ? 'Balancing reflection...' : 'Place in Ledger'}
                </button>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-5 bg-[#FAF8F5]/50 border border-dotted border-charcoal-900/10 p-6 flex flex-col items-center justify-center text-center">
              <Wind className="w-5 h-5 text-stone-400 animate-pulse" />
              <span className="text-[9px] uppercase tracking-widest text-stone-400 font-sans mt-3">Register Silenced</span>
              <p className="text-[11px] text-[#4A5D4E] italic font-serif leading-relaxed max-w-[200px] mt-1">
                Reflections submission forms are minimized in Calm Explorer Mode to prevent intellectual exertion.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 6. Dynamic Recommendation System Row: Similar Items */}
      {recommendedProducts.length > 0 && (
        <section className="mt-20 border-t border-charcoal-900/10 pt-16" id="product-recommendations-row">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-stone-400" />
              <h3 className="font-serif text-lg font-medium text-charcoal-900 tracking-wide">People also Viewed</h3>
            </div>
            <span className="font-sans text-[8.5px] uppercase tracking-[0.25em] text-[#4A5D4E] font-medium pt-1 sm:pt-0">Artisan matches</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => {
                  navigateTo('detail', p.id);
                  // scroll to top gently
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer select-none text-left space-y-3"
                id={`recommended-product-card-${p.id}`}
              >
                <div className={`aspect-[4/5] bg-sand-100 ${p.bgClass} border border-charcoal-900/5 flex items-center justify-center p-6 transition-all group-hover:bg-[#EDEADF]`}>
                  <ProductIllustration id={p.id} accentClass={p.accentClass} className="w-[70%] h-[70%] transition-transform group-hover:scale-105 duration-500" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-[9px] uppercase tracking-wider text-stone-400">
                    <span>{p.category}</span>
                    {!isCalmMode && <span>${p.price}</span>}
                  </div>
                  <h4 className="font-serif text-sm font-medium text-charcoal-900 group-hover:text-stone-600 line-clamp-1">{p.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Continue Browsing State Memory Row (Recently Viewed) */}
      {recentlyViewedProducts.length > 0 && (
        <section className="mt-20 border-t border-charcoal-900/10 pt-16 mb-6" id="recently-viewed-row">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-stone-400" />
              <h3 className="font-serif text-lg font-medium text-charcoal-900 tracking-wide">Continue your unhurried exploration</h3>
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-stone-400">State History memory</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {recentlyViewedProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => {
                  navigateTo('detail', p.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group flex space-x-4 p-4 border border-charcoal-900/5 hover:border-charcoal-900/15 cursor-pointer bg-white transition-all select-none"
                id={`recent-product-card-${p.id}`}
              >
                <div className={`w-16 h-16 shrink-0 bg-sand-100 ${p.bgClass} flex items-center justify-center p-2`}>
                  <ProductIllustration id={p.id} accentClass={p.accentClass} className="w-full h-full" />
                </div>
                <div className="flex-grow flex flex-col justify-center min-w-0">
                  <span className="text-[9px] uppercase tracking-widest text-stone-400 font-sans block">{p.category}</span>
                  <h4 className="font-serif text-xs font-semibold text-charcoal-900 group-hover:text-[#C07F5F] truncate mt-0.5">{p.name}</h4>
                  {!isCalmMode ? (
                    <span className="font-mono text-[11px] text-stone-500 mt-1 block">${p.price}</span>
                  ) : (
                    <span className="text-[9px] text-[#4A5D4E] italic font-medium mt-1 block uppercase">serene trace</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
