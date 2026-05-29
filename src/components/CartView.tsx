import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductIllustration } from './ProductIllustration';
import { Trash2, ShoppingBag, ArrowLeft, Sparkles, Wind, HelpCircle, Gift, Archive, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    navigateTo,
    isCalmMode,
    products,
    addToCart,
    triggerPageTrack
  } = useShop();

  const [optimizerLoading, setOptimizerLoading] = useState(false);
  const [advice, setAdvice] = useState<{ text: string; recommendedItemId?: string; discountCode?: string } | null>(null);

  // Trigger AI cart optimizer
  useEffect(() => {
    if (cart.length === 0) return;

    const runOptimizer = async () => {
      setOptimizerLoading(true);
      try {
        const itemIds = cart.map(item => item.product.id);
        const res = await fetch('/api/ai/optimize-cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemIds, total: cartTotal })
        });
        
        if (res.ok) {
          const data = await res.json();
          setAdvice(data);
        }
      } catch (err) {
        // Fallback optimizer logic
        setTimeout(() => {
          if (cartTotal < 60) {
            setAdvice({
              text: "To fully anchor your quiet rituals, the curator suggests adding the Basalt Aroma Diffuser Set. Together, they create a beautifully synchronized air-water space, and your order crosses the studio's $60 threshold for a complimentary cedarwood preservation oil.",
              recommendedItemId: "diffuser"
            });
          } else {
            setAdvice({
              text: "A beautiful balance of textures. Your selections hold a matching natural material tone. We have automatically applied a 'SLOWNESS' curation wrapper to your basket, packaging everything in raw flax tissue and hand-pressed local mulch at no extra charge.",
              discountCode: "SLOWNESS"
            });
          }
        }, 800);
      } finally {
        setOptimizerLoading(false);
      }
    };

    runOptimizer();
  }, [cart, cartTotal]);

  const handleApplyRecommended = () => {
    if (!advice?.recommendedItemId) return;
    const targetProduct = products.find(p => p.id === advice.recommendedItemId);
    if (targetProduct) {
      addToCart(targetProduct, 1);
      triggerPageTrack('ai-optimize-apply', `Accepted AI optimizer recommendation "${targetProduct.name}"`);
      // clear advice
      setAdvice(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-6" id="empty-cart-container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center text-charcoal-400">
            <ShoppingBag className="w-5 h-5 stroke-[1.25]" />
          </div>
          <p className="font-serif italic text-lg text-charcoal-800">Your basket is currently unoccupied.</p>
          <p className="text-xs text-stone-500 leading-relaxed max-w-[280px] font-sans">
            There is no commercial rush. Take code-free pauses to browse through our unhurried objects and acquire only what you feel drawn toward.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs tracking-widest text-[#C07F5F] hover:text-charcoal-900 border-b border-[#C07F5F]/60 pb-0.5 pt-4 uppercase cursor-pointer font-medium font-sans"
            id="empty-cart-back-btn"
          >
            Explore Objects
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 font-sans" id="cart-view-container">
      {/* Title */}
      <div className="py-8 text-center md:text-left">
        <h2 className="font-serif text-2xl text-charcoal-900 tracking-wide font-normal">Your Basket</h2>
        <p className="font-sans text-[9px] text-[#4A5D4E] uppercase tracking-widest mt-1 font-medium bg-[#EAE8E1]/30 inline-block px-2.5 py-0.5">
          {isCalmMode ? 'Visual Silence Curation Active' : 'Un-rushed secure holdings'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: List of items */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item) => {
            if (!item || !item.product) return null;
            const { product, quantity } = item;
            
            // Stock warning bounds
            const isAtStockLimit = product.stock !== undefined && quantity >= product.stock;

            return (
              <motion.div
                layout
                key={product.id}
                className="flex items-center space-x-6 pb-6 border-b border-[#ECE7DF] last:border-0"
                id={`cart-row-${product.id}`}
              >
                {/* Product Visual */}
                <div
                  onClick={() => navigateTo('detail', product.id)}
                  className={`w-20 h-20 rounded-none ${product.bgClass || 'bg-stone-100'} flex items-center justify-center p-3 cursor-pointer shrink-0 border border-charcoal-900/5 hover:opacity-95`}
                >
                  <ProductIllustration id={product.id} accentClass={product.accentClass} className="w-full h-full" />
                </div>

                {/* Informational core */}
                <div className="flex-1 min-w-0">
                  <span className="font-sans text-[8px] uppercase tracking-widest text-[#4A5D4E] font-medium bg-[#EAE8E1]/40 px-2 py-0.5 border border-[#ECE7DF]">
                    {product.category}
                  </span>
                  
                  <h4
                    onClick={() => navigateTo('detail', product.id)}
                    className="font-serif text-base text-charcoal-900 hover:text-stone-600 font-normal transition-opacity cursor-pointer mt-1.5 truncate"
                  >
                    {product.name}
                  </h4>

                  {/* Stock limit warning cues */}
                  {product.stock !== undefined && (
                    <span className="text-[9px] text-stone-400 block font-serif mt-0.5">
                      Studio stockpile: {product.stock} pieces
                    </span>
                  )}

                  {!isCalmMode && (
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="font-mono text-xs text-charcoal-900 font-semibold">${product.price}</span>
                      <span className="text-[10px] text-charcoal-405">/ each</span>
                    </div>
                  )}
                </div>

                {/* Action and adjustments */}
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-4">
                    {/* Quantity adjustments */}
                    <div className="flex items-center border border-charcoal-900/10 rounded-none bg-[#EDEADF] select-none">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-1.5 text-charcoal-700 hover:text-charcoal-900 text-xs transition-colors cursor-pointer"
                        id={`qty-minus-${product.id}`}
                      >
                        —
                      </button>
                      <span className="px-2 font-mono text-xs text-charcoal-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (product.stock !== undefined && quantity >= product.stock) {
                            return; // prevent overselling!
                          }
                          updateQuantity(product.id, quantity + 1);
                        }}
                        disabled={isAtStockLimit}
                        className={`px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                          isAtStockLimit ? 'text-stone-300 cursor-not-allowed' : 'text-charcoal-700 hover:text-charcoal-900'
                        }`}
                        id={`qty-plus-${product.id}`}
                      >
                        +
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-charcoal-450 hover:text-charcoal-900 transition-colors cursor-pointer focus:outline-none"
                      title="Remove item"
                      id={`remove-item-${product.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                  </div>

                  {isAtStockLimit && (
                    <span className="text-[8.5px] uppercase tracking-wider text-amber-700 font-medium">
                      Maximum studio stock limit reached
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* AI CART OPTIMIZER BOARD */}
          {!isCalmMode && (
            <div className="mt-8 bg-[#FAF8F5] border border-[#4A5D4E]/10 p-5 space-y-4" id="ai-cart-optimizer-space">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C07F5F] animate-pulse" />
                <h4 className="font-serif text-sm tracking-wide text-charcoal-900 font-medium">AI Custom Basket Harmony</h4>
              </div>

              {optimizerLoading ? (
                <div className="space-y-2">
                  <div className="h-3 bg-charcoal-900/5 animate-pulse w-full rounded-none" />
                  <div className="h-3 bg-charcoal-900/5 animate-pulse w-4/5 rounded-none" />
                </div>
              ) : advice ? (
                <div className="text-xs space-y-3">
                  <p className="text-stone-600 font-serif leading-relaxed italic">
                    “{advice.text}”
                  </p>
                  
                  {advice.recommendedItemId && (
                    <div className="flex items-center justify-between bg-white border border-[#4A5D4E]/10 p-3">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-sans">Curator Recommendation:</span>
                        <span className="font-serif text-xs font-semibold text-charcoal-800">
                          {products.find(p => p.id === advice.recommendedItemId)?.name || "Complementary Goods"}
                        </span>
                      </div>
                      <button
                        onClick={handleApplyRecommended}
                        className="bg-charcoal-900 hover:bg-charcoal-850 text-sand-50 px-3.5 py-2 text-[9px] uppercase tracking-widest cursor-pointer transition-colors"
                        id="apply-harmony-btn"
                      >
                        Harmonize Bag
                      </button>
                    </div>
                  )}

                  {advice.discountCode && (
                    <div className="bg-[#4A5D4E]/5 border border-[#4A5D4E]/20 p-2.5 text-center text-[#4A5D4E] font-mono font-medium tracking-widest text-xs uppercase select-all">
                      Custom Voucher Code: {advice.discountCode}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-stone-450 italic font-sans">Curator optimizer is satisfied with your basket's geometric rhythm.</p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Grounded Bill Summary */}
        <div className="lg:col-span-4 bg-[#EBE8E0] p-6 rounded-none border border-charcoal-900/5 flex flex-col space-y-6" id="cart-summary-card">
          <h3 className="font-serif text-sm text-charcoal-900 uppercase tracking-widest border-b border-[#ECE7DF] pb-3 font-semibold">Curation Summation</h3>
          
          <div className="space-y-3 text-xs text-stone-700">
            <div className="flex justify-between">
              <span>Items Total</span>
              {!isCalmMode ? (
                <span className="font-mono font-medium text-charcoal-900">${cartTotal}</span>
              ) : (
                <span className="italic font-serif font-medium text-stone-500">Unveils at checkout</span>
              )}
            </div>
            <div className="flex justify-between">
              <span>Cura Wrapper (Eco-Linen)</span>
              <span className="font-sans text-[9px] text-[#4A5D4E] uppercase tracking-wider font-semibold">Complimentary</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery (Carbon-Matched)</span>
              <span className="font-sans text-[9px] text-[#4A5D4E] uppercase tracking-wider font-semibold">Free curation</span>
            </div>
          </div>

          <div className="h-px bg-charcoal-900/10" />

          <div className="flex justify-between items-baseline py-1">
            <span className="font-serif text-sm font-medium text-charcoal-900">Total Obligation</span>
            {!isCalmMode ? (
              <span className="font-mono text-lg text-charcoal-900 font-semibold">${cartTotal}</span>
            ) : (
              <span className="font-serif italic text-sm text-[#4A5D4E] font-medium">Un-rushed flow</span>
            )}
          </div>

          <button
            onClick={() => {
              triggerPageTrack('checkout-step-initiate', `Initiated checkout process for total $${cartTotal}`);
              navigateTo('checkout');
            }}
            className="w-full bg-charcoal-900 hover:bg-charcoal-850 text-sand-50 py-3.5 text-xs uppercase font-medium tracking-[0.25em] rounded-none transition-colors duration-300 cursor-pointer text-center focus:outline-none mt-4 font-sans"
            id="proceed-to-checkout-btn"
          >
            Unhurry to checkout
          </button>
          
          <button
            onClick={() => navigateTo('shop')}
            className="w-full text-center text-[10px] uppercase tracking-widest text-[#C07F5F] hover:text-charcoal-900 transition-colors pt-2 cursor-pointer focus:outline-none font-medium font-sans"
          >
            ← Add other objects
          </button>
        </div>

      </div>
    </div>
  );
};
