import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, MapPin, Calendar, Compass, Paperclip } from 'lucide-react';
import { motion } from 'motion/react';

export const ConfirmationView: React.FC = () => {
  const { latestOrder, navigateTo } = useShop();

  // Gentle fallback
  if (!latestOrder) {
    return (
      <div className="py-24 text-center max-w-sm mx-auto space-y-4">
        <p className="font-serif italic text-charcoal-800">You haven't placed an order recently.</p>
        <button
          onClick={() => navigateTo('home')}
          className="text-xs tracking-widest text-[#C07F5F] underline uppercase cursor-pointer"
        >
          Explore objects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-center space-y-12" id="confirmation-view-container">
      
      {/* 1. Header Confirmation Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <div className="w-12 h-12 rounded-none bg-transparent flex items-center justify-center text-charcoal-850 mx-auto border border-charcoal-900/10">
          <CheckCircle2 className="w-5 h-5 stroke-[1.25]" />
        </div>
        
        <div className="space-y-1">
          <h2 className="font-serif text-2xl text-charcoal-900 tracking-wide">Placidly Confirmed</h2>
          <p className="font-sans text-[10px] text-charcoal-400 uppercase tracking-widest">
            Your item selection is secured
          </p>
        </div>
      </motion.div>

      {/* 2. Visual Breathing Graphic - Elegant mindfulness placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.2 }}
        className="bg-[#EBE8E0] p-8 rounded-none border border-charcoal-900/5 text-center space-y-5"
        id="breathing-companion-box"
      >
        {/* Soft custom keyframe pulse circle */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-charcoal-900/5 rounded-full animate-breathing" />
          <div className="w-3 h-3 bg-charcoal-900/30 rounded-full" />
        </div>

        <div className="space-y-1.5 max-w-xs mx-auto">
          <h4 className="font-serif text-xs text-charcoal-800 uppercase tracking-widest">Unwind Your Attention</h4>
          <p className="text-[11px] text-charcoal-700 leading-relaxed font-light">
            You have made an intentional choice. Take 3 slow, deep conscious breaths to rebalance before exiting this digital space.
          </p>
        </div>
      </motion.div>

      {/* 3. Tiny Receipt Specs block */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1.0 }}
        className="text-left bg-transparent p-5 rounded-none border border-charcoal-900/10 text-xs space-y-4 text-charcoal-700"
        id="order-receipt-summary"
      >
        <div className="flex items-center justify-between border-b border-charcoal-900/10 pb-3" id="order-receipt-header">
          <div className="flex items-center space-x-2">
            <Paperclip className="w-4 h-4 text-charcoal-450 shrink-0" />
            <span className="font-mono text-charcoal-900 font-medium tracking-wide">
              {latestOrder.id}
            </span>
          </div>
          <span className="font-sans text-[9px] uppercase tracking-widest text-charcoal-400 bg-sand-100 px-2 py-0.5 rounded-none">
            DISPATCH ASSIGNED
          </span>
        </div>

        <div className="space-y-3">
          {/* Dispatch Date Estimation */}
          <div className="flex items-start space-x-3">
            <Calendar className="w-3.5 h-3.5 text-charcoal-400 shrink-0 mt-0.5 stroke-[1.5]" />
            <div className="space-y-0.5">
              <span className="text-charcoal-400 font-serif text-[11px]">Estimated Shipment Packaging</span>
              <p className="text-charcoal-800 leading-normal">
                Dispatched on the upcoming Tuesday. Expected arrival in 4–7 days.
              </p>
            </div>
          </div>

          {/* Delivery destination details */}
          <div className="flex items-start space-x-3 pt-2">
            <MapPin className="w-3.5 h-3.5 text-charcoal-405 shrink-0 mt-0.5 stroke-[1.5]" />
            <div className="space-y-0.5">
              <span className="text-charcoal-400 font-serif text-[11px]">Destination Trace</span>
              <p className="text-charcoal-800 leading-normal">
                {latestOrder.shippingAddress.fullName}<br />
                {latestOrder.shippingAddress.addressLine}, {latestOrder.shippingAddress.city}, {latestOrder.shippingAddress.postalCode}, {latestOrder.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-charcoal-900/10 pt-3 flex justify-between items-baseline">
          <span className="font-serif text-[11px] text-charcoal-400">Summation Total</span>
          <span className="font-mono text-base text-charcoal-900 font-medium">
            ${latestOrder.total}
          </span>
        </div>
      </motion.div>

      {/* Primary exit action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1.0 }}
        className="pt-4"
      >
        <button
          onClick={() => navigateTo('home')}
          className="bg-charcoal-900 hover:bg-charcoal-800 text-sand-50 py-3.5 px-8 text-xs font-semibold uppercase tracking-[0.2em] rounded-none transition-colors cursor-pointer inline-flex items-center space-x-2 focus:outline-none"
          id="exit-to-boutique-btn"
        >
          <Compass className="w-3.5 h-3.5 stroke-[1.75] text-sand-100" />
          <span>Exit to Boutique</span>
        </button>

        <p className="text-[10px] text-charcoal-400 italic mt-3.5 font-light">
          A copy of your order details has been trace-logged locally for security.
        </p>
      </motion.div>

    </div>
  );
};
