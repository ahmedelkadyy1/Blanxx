import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { ProductIllustration } from './ProductIllustration';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, toggleWishlist, isWishlisted, isCalmMode } = useShop();
  const saved = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="group flex flex-col w-full text-left"
      id={`product-card-${product.id}`}
    >
      {/* Visual Canvas Block with Geometric Tonal Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand-100 border border-charcoal-900/5">
        {/* Subtle geometric auxiliary lines in the background of each card */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-700">
          {/* Centered balance circle */}
          <div className="absolute inset-4 rounded-full border border-dashed border-charcoal-900/10 scale-90 group-hover:scale-100 transition-transform duration-1000 ease-out" />
          {/* Diagonal hairline balance indicators */}
          <div className="absolute top-0 left-1/2 w-px h-full bg-charcoal-900/5" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-charcoal-900/5" />
        </div>

        <div
          onClick={() => navigateTo('detail', product.id)}
          className={`w-full h-full ${product.bgClass} flex items-center justify-center p-8 cursor-pointer transition-all duration-700 ease-out group-hover:bg-[#EDEADF]`}
          id={`product-image-container-${product.id}`}
        >
          <ProductIllustration
            id={product.id}
            accentClass={product.accentClass}
            className="w-[70%] h-[70%] transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
          />
        </div>

        {/* Quiet Bookmark Pin */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 p-2 bg-sand-50/80 backdrop-blur-md rounded-full shadow-sm hover:bg-sand-50 text-charcoal-700 hover:text-charcoal-900 transition-all duration-300 cursor-pointer focus:outline-none"
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          id={`wishlist-btn-${product.id}`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors duration-500 ${
              saved ? 'fill-[#8C8C80] stroke-[#8C8C80]' : 'stroke-[1.25]'
            }`}
          />
        </button>
      </div>

      {/* Meta Text details with airy vertical offsets */}
      <div className="mt-4 flex flex-col space-y-1.5 px-1">
        <div className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.18em] text-charcoal-400">
          <span>{product.category}</span>
          {!isCalmMode && (
            <span className="font-mono text-xs text-charcoal-900 font-medium">${product.price}</span>
          )}
        </div>

        <button
          onClick={() => navigateTo('detail', product.id)}
          className="font-serif text-base text-charcoal-900 hover:opacity-75 text-left transition-opacity duration-300 focus:outline-none cursor-pointer leading-tight mt-0.5 line-clamp-1"
          id={`product-title-btn-${product.id}`}
        >
          {product.name}
        </button>

        <p className="font-sans text-xs text-charcoal-700/80 line-clamp-1 leading-relaxed">
          {product.tagline}
        </p>

        {/* Dynamic slow inventory indications */}
        {!isCalmMode && (
          <div className="pt-1 select-none">
            {product.stock === 0 ? (
              <span className="text-[9px] uppercase tracking-wider text-rose-750 font-medium bg-rose-50/50 px-2 py-0.5 border border-rose-100">
                All curated copies claimed
              </span>
            ) : product.stock !== undefined && product.stock <= 3 ? (
              <span className="text-[9px] uppercase tracking-wider text-amber-800 font-medium bg-amber-50/50 px-2 py-0.5 border border-amber-100 animate-pulse">
                Only {product.stock} items remain in studio
              </span>
            ) : product.stock !== undefined && product.stock <= 10 ? (
              <span className="text-[8.5px] uppercase tracking-wider text-stone-500">
                Studio stockpile: {product.stock} pieces
              </span>
            ) : null}
          </div>
        )}
      </div>
    </motion.div>
  );
};
