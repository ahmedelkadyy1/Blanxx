import React, { useMemo, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, Info, Sparkles, Filter, Check, RotateCcw, HelpCircle, Wind, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HomeView: React.FC = () => {
  const {
    products,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    navigateTo,
    sorting,
    setSorting,
    priceRange,
    setPriceRange,
    selectedColor,
    setSelectedColor,
    selectedMaterial,
    setSelectedMaterial,
    isCalmMode,
    aiSearchState,
    runAISemiSearch,
    clearAISearch,
    triggerPageTrack
  } = useShop();

  const [localSearch, setLocalSearch] = useState('');
  const [styleVibeQuery, setStyleVibeQuery] = useState('');
  const [matchingVibeLoading, setMatchingVibeLoading] = useState(false);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [styleResult, setStyleResult] = useState<{ themeName: string; commentary: string; matchedProductIds: string[] } | null>(null);
  
  // Show advanced filters panel
  const [showFilters, setShowFilters] = useState(false);

  // Pagination count
  const [pageSize, setPageSize] = useState(4);

  // Fallback to static lists if loading API products
  const activeProductsSource = products.length > 0 ? products : [];

  // Semantic unique colors & materials lists inside current DB
  const availableColors = ['All', 'Ochre', 'Basalt', 'Beige', 'Silica', 'Lichen', 'Cypress', 'Brass'];
  const availableMaterials = ['All', 'Clay', 'Basalt', 'Linen', 'Glass', 'Terracotta', 'Cotton', 'Brass'];

  // AI semantic search submission
  const handleAISearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) return;
    setAiSearchLoading(true);
    triggerPageTrack('ai-search-submit', `Executed AI semantic query "${localSearch}"`);
    await runAISemiSearch(localSearch);
    setAiSearchLoading(false);
  };

  // AI Style Matcher Vibe search
  const handleStyleVibeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!styleVibeQuery.trim()) return;

    setMatchingVibeLoading(true);
    triggerPageTrack('ai-style-submit', `Style matcher query "${styleVibeQuery}"`);
    
    try {
      const res = await fetch('/api/ai/style-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase: styleVibeQuery })
      });

      if (res.ok) {
        const data = await res.json();
        setStyleResult(data);
      }
    } catch (e) {
      console.error('Style match failed');
    } finally {
      setMatchingVibeLoading(false);
    }
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedCategory('All');
    setSorting('default');
    setPriceRange([0, 150]);
    setSelectedColor('All');
    setSelectedMaterial('All');
    clearAISearch();
    setStyleResult(null);
    setStyleVibeQuery('');
    setPageSize(4);
    triggerPageTrack('reset-filters', 'Reset search parameters');
  };

  // Filter products based on selected constraints (price, color, material, category, AI semantic lists)
  const filteredProducts = useMemo(() => {
    let result = [...activeProductsSource];

    // AI Semantic filter if active
    if (aiSearchState?.active) {
      result = result.filter(p => aiSearchState.matchedIds.includes(p.id));
    }

    // Category
    if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
      result = result.filter(p => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query text fallback
    if (localSearch && !aiSearchState?.active) {
      const norm = localSearch.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(norm) ||
        p.tagline.toLowerCase().includes(norm) ||
        p.description.toLowerCase().includes(norm) ||
        p.material.toLowerCase().includes(norm)
      );
    }

    // Style query list matching if active
    if (styleResult) {
      result = result.filter(p => styleResult.matchedProductIds.includes(p.id));
    }

    // Price range
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Color option
    if (selectedColor !== 'All') {
      result = result.filter(p => p.colorName.toLowerCase().includes(selectedColor.toLowerCase()));
    }

    // Material option
    if (selectedMaterial !== 'All') {
      result = result.filter(p => p.material.toLowerCase().includes(selectedMaterial.toLowerCase()));
    }

    // Sorting
    if (sorting === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sorting === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sorting === 'popular') {
      // Sort by reviews count or specific weights
      result.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
    } else if (sorting === 'newest') {
      // Reversed default IDs
      result.reverse();
    }

    return result;
  }, [activeProductsSource, selectedCategory, localSearch, priceRange, selectedColor, selectedMaterial, sorting, aiSearchState, styleResult]);

  // Paginated list
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, pageSize);
  }, [filteredProducts, pageSize]);

  // Gentle layout configurations
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6" id="home-view-container">
      
      {/* 1. Calm, Minimal Hero Section */}
      <section className="py-12 md:py-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
          className="font-sans text-[9px] tracking-[0.25em] text-[#4A5D4E] uppercase font-medium bg-[#EAE8E1]/40 px-3 py-1 border border-[#ECE7DF]"
        >
          {isCalmMode ? 'Visual Silence Ritual' : 'Sustainable Living Objects'}
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="font-serif text-2xl md:text-4xl text-charcoal-900 leading-relaxed tracking-wide italic font-light max-w-lg mt-2"
        >
          {isCalmMode 
            ? "“Breathe comfortably. Inspect slowly. You are invited to reflect on natural objects without digital pricing noise.”"
            : "“A silent collection of sustainable, tactile products crafted for slow daily rituals.”"
          }
        </motion.h1>
        
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="w-10 h-px bg-charcoal-400 mt-4"
        />
      </section>

      {/* 2. Visual AI Style Matcher & Semantics Deck (Hides in completely visual-silence Calm mode to avoid busy dashboards) */}
      {!isCalmMode && (
        <section className="mb-10 bg-[#FAF8F5] border border-charcoal-900/5 p-6" id="ai-curation-deck">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-charcoal-900/5">
            
            {/* Column A: AI STYLE MATCHER Vibe Deck */}
            <div className="space-y-3 pb-6 md:pb-0 md:pr-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C07F5F]" />
                <h3 className="font-serif text-sm text-charcoal-900 tracking-wide font-medium">AI Style Matcher Vibe</h3>
              </div>
              <p className="text-[11px] text-charcoal-500 leading-relaxed font-sans">
                Input an abstract styling theme like <span className="italic font-serif">“minimal beige calm outfit”</span> or <span className="italic font-serif">“Japanese tea ceremony sanctuary”</span> to construct outfits.
              </p>
              
              <form onSubmit={handleStyleVibeSubmit} className="flex space-x-2 pt-1" id="style-vibe-builder">
                <input
                  type="text"
                  value={styleVibeQuery}
                  onChange={(e) => setStyleVibeQuery(e.target.value)}
                  placeholder="minimal beige outfit..."
                  className="flex-grow bg-white border border-charcoal-900/10 px-3.5 py-2.5 text-[11.5px] rounded-none focus:outline-none focus:border-charcoal-900/30 text-charcoal-900 placeholder-stone-400 font-sans tracking-wide"
                />
                <button
                  type="submit"
                  disabled={matchingVibeLoading}
                  className="bg-charcoal-900 hover:bg-charcoal-850 text-sand-50 px-4 py-2 text-[10px] uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50 select-none rounded-none"
                >
                  {matchingVibeLoading ? 'Pondering...' : 'Match'}
                </button>
              </form>

              {styleResult && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-white border border-[#4A5D4E]/20 text-[11.5px] space-y-1 bg-[#F2ECE4]/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic text-[#4A5D4E] font-medium">{styleResult.themeName}</span>
                    <button
                      onClick={() => setStyleResult(null)}
                      className="text-[9px] uppercase tracking-widest text-[#C07F5F] hover:text-charcoal-900"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-stone-600 italic font-serif leading-relaxed">{styleResult.commentary}</p>
                </motion.div>
              )}
            </div>

            {/* Column B: AI SEMANTIC SMART SEARCH BAR */}
            <div className="space-y-3 pt-6 md:pt-0 md:pl-6">
              <div className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-[#4A5D4E]" />
                <h3 className="font-serif text-sm text-charcoal-900 tracking-wide font-medium">Aesthetic Intent Scan</h3>
              </div>
              <p className="text-[11px] text-charcoal-500 leading-relaxed font-sans">
                Search using budget parameters or descriptors (e.g. <span className="italic font-serif">“black hoodie under 80$ aesthetic clean”</span> or <span className="italic font-serif">“tea items under 70$”</span>).
              </p>
              
              <form onSubmit={handleAISearchSubmit} className="flex space-x-2 pt-1" id="ai-smart-search-form">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="teapots under 70$..."
                  className="flex-grow bg-white border border-charcoal-900/10 px-3.5 py-2.5 text-[11.5px] rounded-none focus:outline-none focus:border-charcoal-900/30 text-charcoal-900 placeholder-stone-400 font-sans tracking-wide"
                />
                <button
                  type="submit"
                  disabled={aiSearchLoading}
                  className="bg-charcoal-900 hover:bg-charcoal-850 text-sand-50 px-4 py-2 text-[10px] uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50 select-none rounded-none"
                >
                  {aiSearchLoading ? 'Scanning...' : 'Search'}
                </button>
              </form>

              {aiSearchState?.active && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-white border border-charcoal-950/10 text-[11.5px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[9px] uppercase tracking-wider text-charcoal-400">AI semantic intent scan:</span>
                    <button
                      onClick={clearAISearch}
                      className="text-[9px] uppercase tracking-widest text-[#C07F5F] hover:text-charcoal-900 underline underline-offset-2"
                    >
                      Restore All
                    </button>
                  </div>
                  <p className="text-stone-700 italic font-serif leading-relaxed">{aiSearchState.semanticAnalysis}</p>
                </motion.div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* 3. Category Tabs & Advanced Filters Panel Trigger */}
      <section className="mb-8 border-b border-charcoal-900/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Simple grouping */}
        <div className="flex space-x-6 md:space-x-8 overflow-x-auto pb-1 scrollbar-none" id="categories-dock-list">
          {['All', 'Vessels', 'Rituals', 'Textiles', 'Objects'].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  triggerPageTrack('category-tab-click', `Browsed category "${cat}"`);
                }}
                className={`text-[10px] uppercase tracking-[0.2em] py-2 cursor-pointer transition-all duration-300 shrink-0 focus:outline-none leading-none ${
                  isActive
                    ? 'text-charcoal-900 font-medium border-b border-charcoal-900 mt-[1px]'
                    : 'text-charcoal-400 hover:text-charcoal-900 border-b border-transparent'
                }`}
                id={`cat-list-tab-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filters collapse trigger & Sorting buttons (Hidden in Calm mode) */}
        {!isCalmMode ? (
          <div className="flex items-center space-x-4 self-end sm:self-auto text-[10px] uppercase tracking-[0.15em] shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 border border-charcoal-900/10 hover:border-charcoal-900/30 transition-colors cursor-pointer ${
                showFilters ? 'bg-[#ECE8E1] border-charcoal-900/30 font-medium' : 'text-charcoal-600'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3 text-stone-500" />
              <span>Facet Filters</span>
            </button>

            <select
              value={sorting}
              onChange={(e) => {
                setSorting(e.target.value);
                triggerPageTrack('sorting-change', `Changed sort direction to "${e.target.value}"`);
              }}
              className="bg-transparent border border-charcoal-900/10 px-2 py-1.5 hover:border-charcoal-900/30 focus:outline-none uppercase tracking-wider text-[9px] cursor-pointer"
            >
              <option value="default">Inherent Curation</option>
              <option value="price-asc">Price: Low-High</option>
              <option value="price-desc">Price: High-Low</option>
              <option value="popular">Most Calmed (Reviews)</option>
              <option value="newest">Newest Additions</option>
            </select>

            {(showFilters || localSearch || styleResult || aiSearchState || priceRange[0] > 0 || priceRange[1] < 150 || selectedColor !== 'All' || selectedMaterial !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="text-[9px] tracking-widest text-[#C07F5F] hover:text-charcoal-900 flex items-center space-x-1 hover:underline cursor-pointer"
                title="Restore defaults"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        ) : (
          <div className="text-[10px] uppercase tracking-widest text-slate-400 italic">
            Calm Explorer Mode enabled. Price filtering silenced.
          </div>
        )}
      </section>

      {/* Floating Panel: Advanced Facet Filters Board */}
      <AnimatePresence>
        {showFilters && !isCalmMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#ECE8E1]/30 border-b border-charcoal-900/10 mb-8"
            id="facet-filters-board"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
              
              {/* Slider 1: Price Range */}
              <div className="space-y-3">
                <span className="font-sans text-[10px] uppercase tracking-widest text-stone-400 block font-medium">Price Boundary</span>
                <div className="flex items-center justify-between text-stone-700 font-mono text-[11px] mb-1">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-stone-700 bg-stone-300 h-1 rounded-none outline-none cursor-pointer"
                />
                <span className="text-[10px] text-stone-400 block italic">Under ${priceRange[1]} maximum</span>
              </div>

              {/* Slider 2: Colors lists */}
              <div className="space-y-2">
                <span className="font-sans text-[10px] uppercase tracking-widest text-stone-400 block font-medium">Aesthetic Accent</span>
                <div className="flex flex-wrap gap-1.5">
                  {availableColors.map(color => {
                    const active = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-2.5 py-1 text-[9.5px] uppercase tracking-wider border rounded-none cursor-pointer ${
                          active 
                            ? 'bg-charcoal-900 text-sand-50 border-charcoal-900 font-medium' 
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider 3: Materials lists */}
              <div className="space-y-2">
                <span className="font-sans text-[10px] uppercase tracking-widest text-stone-400 block font-medium">Tactile Raw Material</span>
                <div className="flex flex-wrap gap-1.5">
                  {availableMaterials.map(mat => {
                    const active = selectedMaterial === mat;
                    return (
                      <button
                        key={mat}
                        onClick={() => setSelectedMaterial(mat)}
                        className={`px-2.5 py-1 text-[9.5px] uppercase tracking-wider border rounded-none cursor-pointer ${
                          active 
                            ? 'bg-charcoal-900 text-sand-50 border-charcoal-900 font-medium' 
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {mat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column 4: Quick tips on Slow Movement */}
              <div className="bg-sand-50/50 p-4 border border-stone-200/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 font-serif italic text-stone-800 text-[12px] mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                    <span>The BLANX Curation model</span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed font-sans">
                    Each ceramic piece is spun in Kyoto; each brass disk is filed by hand. Buying here is a slow choice to preserve resources.
                  </p>
                </div>
                
                <button
                  onClick={handleResetFilters}
                  className="text-[9.5px] uppercase tracking-widest text-[#C07F5F] hover:text-[#4A5D4E] mt-3 underline underline-offset-4 cursor-pointer text-left"
                >
                  Clear all parameters
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Product Gallery Layout */}
      <div id="product-grid-gallery" className="mt-4">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center max-w-sm mx-auto space-y-4"
          >
            <Info className="w-5 h-5 mx-auto text-stone-400 stroke-[1.25]" />
            <h4 className="font-serif italic text-stone-800 text-sm">No quiet object satisfies this mesh.</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
              Take a comfortable breath and expand your boundaries, clear your searches, or select another category tab above.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 text-[10px] uppercase tracking-widest text-[#C07F5F] hover:text-charcoal-900 font-medium"
              id="empty-results-curator-btn"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-12">
            
            {/* Header statistics bar (Hides in Calm mode) */}
            {!isCalmMode && (
              <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-[#4A5D4E] mb-2 font-medium bg-[#EAE8E1]/20 px-4 py-1.5 border border-charcoal-900/5">
                <span>Displaying Afforded curation: {filteredProducts.length} items</span>
                <span>Un-rushed tracking</span>
              </div>
            )}

            {/* Grid list with beautiful fade layout animation */}
            <motion.div
              variants={gridVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
            >
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            {/* Pagination Load More Controller (Hides if list is fully shown) */}
            {filteredProducts.length > paginatedProducts.length && (
              <div className="pt-10 flex flex-col items-center justify-center" id="pagination-board">
                <button
                  onClick={() => {
                    setPageSize(prev => prev + 4);
                    triggerPageTrack('pagination-reveal-more', `Loaded next pagination chunk (new limit: ${pageSize + 4})`);
                  }}
                  className="bg-transparent hover:bg-charcoal-900 text-charcoal-900 hover:text-sand-50 border border-charcoal-900 px-8 py-3.5 text-[10px] uppercase tracking-[0.25em] transition-all cursor-pointer select-none rounded-none"
                  id="infinite-reveal-btn"
                >
                  Unveil more unhurried objects
                </button>
                <span className="text-[9px] text-[#4A5D4E] uppercase tracking-wider mt-2.5 block font-medium">
                  Showing {paginatedProducts.length} of {filteredProducts.length} objects
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Sustainable Living Breathing Companion */}
      <section className="mt-24 py-16 border-t border-[#ECE7DF]/50 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-5 h-5 rounded-full border border-stone-600/50 animate-breathing" />
        <p className="font-sans text-[9px] tracking-[0.25em] text-[#4A5D4E] uppercase font-medium">Breathing anchor</p>
        <p className="text-[11.5px] text-stone-600 max-w-sm italic font-serif leading-relaxed px-4">
          “Inhale softly as the copper circle swells. Hold. Exhale cleanly as it returns to seed. Curation does not require speed.”
        </p>
      </section>

    </div>
  );
};
