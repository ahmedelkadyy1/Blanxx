import React from 'react';
import { useShop } from '../context/ShopContext';
import { Leaf, Box, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <footer className="bg-sand-100 border-t border-charcoal-900/5 mt-20 transition-all duration-500">
      {/* Soothing value assertions */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-charcoal-900/5">
        <div className="flex space-x-4 items-start">
          <Leaf className="w-5 h-5 text-charcoal-400 stroke-[1.25] mt-1 shrink-0" />
          <div>
            <h4 className="font-serif text-sm text-charcoal-900">Carbon Neutral Shipping</h4>
            <p className="font-sans text-xs text-charcoal-700/80 leading-relaxed mt-1">
              We aggregate dispatch cycles twice a week to mitigate emissions. Delivery takes 4–7 days—a conscious slowing down.
            </p>
          </div>
        </div>
        <div className="flex space-x-4 items-start">
          <Box className="w-5 h-5 text-charcoal-400 stroke-[1.25] mt-1 shrink-0" />
          <div>
            <h4 className="font-serif text-sm text-charcoal-900">Compostable Packaging</h4>
            <p className="font-sans text-xs text-charcoal-700/80 leading-relaxed mt-1">
              Every parcel uses recycled wood-pulp padding and organic starch ribbons that completely return to natural soil in 90 days.
            </p>
          </div>
        </div>
        <div className="flex space-x-4 items-start">
          <ShieldCheck className="w-5 h-5 text-charcoal-400 stroke-[1.25] mt-1 shrink-0" />
          <div>
            <h4 className="font-serif text-sm text-charcoal-900">Visual Audits</h4>
            <p className="font-sans text-xs text-charcoal-700/80 leading-relaxed mt-1">
              Every curated object is hand-inspected, wrapped in raw acid-free paper, and accompanied by a handwritten trace card.
            </p>
          </div>
        </div>
      </div>

      {/* Directory links */}
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-center md:text-left text-xs text-charcoal-400 tracking-wider">
        <div className="flex flex-col space-y-1 mb-6 md:mb-0">
          <p className="font-serif text-charcoal-800 tracking-[0.3em] uppercase text-[12px] font-medium">O N D A</p>
          <p className="text-[10px]">A quiet e-commerce experiment focused on the weight of physical presence.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 uppercase text-[10px] tracking-widest font-medium">
          <button onClick={() => navigateTo('home')} className="hover:text-charcoal-900 cursor-pointer py-1 transition-colors">Home</button>
          <button onClick={() => navigateTo('shop')} className="hover:text-charcoal-900 cursor-pointer py-1 transition-colors">Products</button>
          <button onClick={() => navigateTo('profile')} className="hover:text-charcoal-900 cursor-pointer py-1 transition-colors">Profile</button>
          <button onClick={() => navigateTo('cart')} className="hover:text-charcoal-900 cursor-pointer py-1 transition-colors">Basket</button>
          <button onClick={() => navigateTo('admin')} className="hover:text-charcoal-900 cursor-pointer py-1 transition-colors">Atelier</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-8 text-center text-[10px] text-charcoal-400 tracking-widest uppercase border-0">
        <p>© 2026 BLANX Store — Crafted for calming sensory space</p>
      </div>
    </footer>
  );
};
