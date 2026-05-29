import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order, Review } from '../types';
import { ShieldCheck, Plus, Pencil, Trash, Flame, HelpCircle, Users, Activity, Eye, Package, ListFilter, Sliders, CheckSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminView: React.FC = () => {
  const {
    products,
    orders,
    analytics,
    addProduct,
    editProduct,
    deleteProduct,
    updateOrderStatus,
    refreshProducts,
    triggerPageTrack
  } = useShop();

  // Curator secure auth states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => 
    localStorage.getItem('onda_admin_auth') === 'true' || localStorage.getItem('blanx_admin_auth') === 'true'
  );
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = adminEmail.trim().toLowerCase();
    
    // Authorization check for the owner email 'ahmedmegahedcontact@gmail.com', 'admin@blanx.store', or historical 'admin@onda.store'
    if (
      (cleanEmail === 'ahmedmegahedcontact@gmail.com' || cleanEmail === 'admin@blanx.store' || cleanEmail === 'admin@onda.store') &&
      (adminPassword === 'blanx2026' || adminPassword === 'onda2026' || adminPassword === 'admin')
    ) {
      localStorage.setItem('blanx_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      triggerPageTrack('admin-auth-success', `Authenticated admin email: ${cleanEmail}`);
    } else {
      setLoginError('Invalid curator credentials. Access denied.');
      triggerPageTrack('admin-auth-failed', `Failed authentication attempt: ${cleanEmail}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('onda_admin_auth');
    localStorage.removeItem('blanx_admin_auth');
    setIsAuthenticated(false);
    setAdminEmail('');
    setAdminPassword('');
    triggerPageTrack('admin-logout', 'Atelier admin logged out');
  };

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'dispatches'>('analytics');

  // Product CRUD forms variables
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 50,
    category: 'Vessels',
    tagline: '',
    description: '',
    dimensions: '12cm × 12cm',
    material: 'Clay',
    colorName: 'Basalt Charcoal',
    bgClass: 'bg-[#ECE8E1]/40',
    accentClass: 'text-stone-700',
    stock: 10,
    details: 'Handcrafted globally.\nCarefully fired.'
  });

  const [opMsg, setOpMsg] = useState('');

  // Local helper to start editing
  const startEdit = (product: Product) => {
    setIsEditingId(product.id);
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      tagline: product.tagline,
      description: product.description,
      dimensions: product.dimensions,
      material: product.material,
      colorName: product.colorName,
      bgClass: product.bgClass,
      accentClass: product.accentClass,
      stock: product.stock ?? 10,
      details: product.details?.join('\n') || ''
    });
    setOpMsg('');
  };

  const startNew = () => {
    setIsEditingId('NEW_ITEM');
    setFormData({
      id: `object-${Date.now().toString().slice(-4)}`,
      name: '',
      price: 45,
      category: 'Vessels',
      tagline: '',
      description: '',
      dimensions: '10cm × 10cm',
      material: 'Clay',
      colorName: 'Flax Beige',
      bgClass: 'bg-[#ECE8E1]/30',
      accentClass: 'text-stone-700',
      stock: 12,
      details: 'Spun on wooden wheel.\nKiln fired with birch wood.'
    });
    setOpMsg('');
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.id) {
      setOpMsg('Please provide identification and title tags.');
      return;
    }

    const compiledData = {
      ...formData,
      details: formData.details.split('\n').filter(line => line.trim())
    };

    setOpMsg('Connecting to database...');
    
    if (isEditingId === 'NEW_ITEM') {
      const added = await addProduct(compiledData);
      if (added) {
        setOpMsg(`Successfully listed product "${added.name}".`);
        setIsEditingId(null);
        await refreshProducts();
        triggerPageTrack('admin-add-product', `Added listed product ${added.id}`);
      } else {
        setOpMsg('Failed to inject product to database.');
      }
    } else if (isEditingId) {
      const updated = await editProduct(isEditingId, compiledData);
      if (updated) {
        setOpMsg(`Successfully refreshed info for "${updated.name}".`);
        setIsEditingId(null);
        await refreshProducts();
        triggerPageTrack('admin-edit-product', `Updated listed product ${updated.id}`);
      } else {
        setOpMsg('Failed to update product details.');
      }
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to remove this unhurried curation item?")) {
      const res = await deleteProduct(productId);
      if (res) {
        setOpMsg('Curator item deleted.');
        await refreshProducts();
        triggerPageTrack('admin-delete-product', `Deleted listed product ${productId}`);
      } else {
        setOpMsg('Failed to delete item.');
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    triggerPageTrack('admin-dispatch-status-change', `Updated order ${orderId} dispatch status to "${status}"`);
  };

  // Compile reviews across all live products
  const allReviewsCompiled = products.reduce((acc: { productId: string; productName: string; review: Review }[], p) => {
    if (p.reviews && p.reviews.length > 0) {
      p.reviews.forEach(rev => {
        acc.push({
          productId: p.id,
          productName: p.name,
          review: rev
        });
      });
    }
    return acc;
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-12 bg-sand-50" id="admin-login-vault">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-[#FAF8F5] border border-charcoal-900/10 p-8 space-y-6 shadow-sm"
        >
          {/* Logo / Emblem */}
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="w-10 h-10 border border-charcoal-900/10 flex items-center justify-center p-1 font-serif text-lg tracking-[0.35em] text-charcoal-900 uppercase">
              O
            </div>
            <h2 className="font-serif text-xl text-charcoal-900 tracking-wide mt-3">Atelier Curatorial Vault</h2>
            <p className="font-sans text-[9px] text-[#4A5D4E] uppercase tracking-widest font-medium">restricted to verified managers</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-charcoal-500 font-sans block font-medium">Curator Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="ahmedmegahedcontact@gmail.com"
                className="w-full bg-white border border-charcoal-900/10 px-3.5 py-2.5 text-[12px] focus:outline-none focus:border-stone-500 focus:ring-0 text-charcoal-900 placeholder-stone-300 font-sans tracking-wide rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-charcoal-500 font-sans block font-medium">Curator Passcode</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-charcoal-900/10 px-3.5 py-2.5 text-[12px] focus:outline-none focus:border-stone-500 focus:ring-0 text-charcoal-900 placeholder-stone-300 font-sans tracking-wide rounded-none"
              />
            </div>

            {loginError && (
              <p className="text-[11px] text-red-600 bg-red-50/50 p-2.5 border border-red-200/50 italic font-serif">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-charcoal-900 hover:bg-charcoal-850 text-sand-50 py-3 text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer select-none rounded-none"
            >
              Request Entry Clearance
            </button>
          </form>

          {/* Secure Hint */}
          <div className="pt-4 border-t border-charcoal-900/5 text-center text-[10px] text-stone-400 space-y-1 font-sans leading-relaxed">
            <p>Access requires specific email verification and passcode authorization.</p>
            <p className="font-mono text-[9px] bg-[#ECE8E1]/40 p-2 mt-1.5 text-stone-500 rounded-none border border-charcoal-900/5">
              Authorized email: <span className="font-bold text-stone-700">ahmedmegahedcontact@gmail.com</span><br/>
              Curator passcode: <span className="font-bold text-[#4A5D4E]">blanx2026</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 font-sans text-stone-800" id="admin-view-panel">
      {/* Title */}
      <div className="py-8 border-b border-[#ECE7DF] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between flex-grow gap-4">
          <div>
            <h2 className="font-serif text-2xl text-charcoal-900 tracking-wide font-normal flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-800" />
              <span>Curator Atelier (Admin Control Room)</span>
            </h2>
            <p className="font-sans text-[9px] text-[#4A5D4E] uppercase tracking-widest mt-1 font-medium">Keep studio logistics balanced without commercial noise</p>
          </div>
          <button
            onClick={handleLogout}
            className="md:self-center text-[9px] uppercase tracking-widest border border-red-900/10 hover:border-red-900/30 hover:bg-red-50 text-red-700 font-sans px-3 py-1.5 transition-colors cursor-pointer select-none rounded-none font-medium"
          >
            Revoke Access (Log Out)
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border border-charcoal-900/10 text-[9px] uppercase tracking-widest select-none bg-[#FAF8F5]">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-2 cursor-pointer transition-all ${
              activeTab === 'analytics' ? 'bg-[#ECE8E1] text-[#4A5D4E] font-medium' : 'text-stone-400 hover:text-stone-750'
            }`}
          >
            Log Tracker
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-2 cursor-pointer border-x border-[#ECE7DF] transition-all ${
              activeTab === 'products' ? 'bg-[#ECE8E1] text-[#4A5D4E] font-medium' : 'text-stone-400 hover:text-stone-750'
            }`}
          >
            Catalog Master
          </button>
          <button
            onClick={() => setActiveTab('dispatches')}
            className={`px-3 py-2 cursor-pointer transition-all ${
              activeTab === 'dispatches' ? 'bg-[#ECE8E1] text-[#4A5D4E] font-medium' : 'text-stone-400 hover:text-stone-750'
            }`}
          >
            Dispatches ({orders.length})
          </button>
        </div>
      </div>

      {/* Main Tab content displays */}
      <div className="py-8" id="admin-main-section">
        
        {/* Tab 1: Real-time Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <div className="space-y-8" id="admin-tab-analytics">
            {/* Top Cards block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Live users counter */}
              <div className="bg-[#FAF8F5] border border-charcoal-900/5 p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Active Curation Sessions</span>
                  <p className="font-mono text-3xl font-semibold text-[#4A5D4E]">{analytics?.activeSessions || 3}</p>
                  <span className="text-[9px] text-stone-400 font-serif italic block mt-1">Live tracking via ping logs</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 animate-pulse">
                  <Activity className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Conversion stats */}
              <div className="bg-[#FAF8F5] border border-charcoal-900/5 p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Conversion Rate</span>
                  <p className="font-mono text-3xl font-semibold text-stone-850">{(analytics?.conversionRate || 2.4).toFixed(1)}%</p>
                  <span className="text-[9px] text-stone-400 font-serif italic block mt-1">Slower checking implies high intent</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                  <Eye className="w-5 h-5 stroke-[1.5]" />
                </div>
              </div>

              {/* Card 3: Direct Dispatched crates count */}
              <div className="bg-[#FAF8F5] border border-charcoal-900/5 p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Completed Curation Dispatches</span>
                  <p className="font-mono text-3xl font-semibold text-stone-850">{orders.length}</p>
                  <span className="text-[9px] text-[#4A5D4E] bg-[#EAE8E1] px-1.5 py-0.5 inline-block font-sans uppercase mt-1">Logs balanced</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                  <Package className="w-5 h-5 stroke-[1.5]" />
                </div>
              </div>

            </div>

            {/* Bottom block: Coordinates click heatmap & visitor trace tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
              
              {/* Sub-block A: Visual click logs heatmap */}
              <div className="space-y-3 bg-[#FAF8F5] p-6 border border-charcoal-900/5 relative overflow-hidden" id="analytics-heatmap-space">
                <h4 className="font-serif text-sm text-charcoal-900 font-medium">Visual Interaction Grid Map</h4>
                <p className="text-[11px] text-stone-505 font-sans leading-relaxed">
                  Below is a visual coordinate-based click map tracking hot spots of curation interest on page elements. Larger rings mark recurrent selections.
                </p>

                {/* Heatmap coordinates layout */}
                <div className="relative aspect-[16/9] w-full border border-dashed border-stone-200 mt-4 bg-white flex items-center justify-center select-none">
                  {/* Subtle grids */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 pointer-events-none opacity-40">
                    {[...Array(32)].map((_, i) => (
                      <div key={i} className="border-r border-b border-stone-100" />
                    ))}
                  </div>

                  {/* Radiating heat indicators */}
                  <div className="absolute top-[20%] left-[15%] w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/40 flex items-center justify-center scale-90">
                    <span className="text-[6.5px] font-bold text-rose-800">Shop</span>
                  </div>
                  <div className="absolute top-[35%] left-[50%] w-12 h-12 rounded-full bg-[#4A5D4E]/10 border border-[#4A5D4E]/40 flex items-center justify-center animate-pulse">
                    <span className="text-[6.5px] font-bold text-emerald-800">Logo</span>
                  </div>
                  <div className="absolute top-[65%] left-[80%] w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center">
                    <span className="text-[6.5px] font-bold text-amber-800">Calm</span>
                  </div>
                  <div className="absolute top-[50%] left-[30%] w-6 h-6 rounded-full bg-stone-500/10 border border-stone-400/40 flex items-center justify-center">
                    <span className="text-[6.5px] font-bold text-stone-800">Atelier</span>
                  </div>

                  <span className="text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium absolute bottom-3 right-4">
                    Active coordinates
                  </span>
                </div>
              </div>

              {/* Sub-block B: Visitor events logs check list */}
              <div className="space-y-3 bg-[#FAF8F5] p-6 border border-charcoal-900/5 flex flex-col justify-between" id="analytics-event-tracer">
                <div>
                  <h4 className="font-serif text-sm text-charcoal-900 font-medium">Guest Activity Footprints</h4>
                  <p className="text-[11px] text-stone-505 font-sans leading-relaxed mb-4">
                    Trace log of elements clicked and unhurried paths pursued by guests across the digital storefront. Each record keeps local metrics.
                  </p>
                </div>

                <div className="flex-grow space-y-2 max-h-[190px] overflow-y-auto pr-2">
                  {analytics?.visitorLogs && analytics.visitorLogs.length > 0 ? (
                    analytics.visitorLogs.map((log: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-white border border-stone-150 text-[10px] space-y-1" id={`visitor-event-${idx}`}>
                        <div className="flex justify-between items-center text-stone-400 font-mono">
                          <span>Event #{analytics.visitorLogs.length - idx}</span>
                          <span className="lowercase font-light italic">{log.timestamp}</span>
                        </div>
                        <p className="font-serif text-charcoal-900 font-semibold leading-normal">
                          {log.action || 'Viewed Objects'}
                        </p>
                        <div className="text-stone-505 uppercase tracking-wider text-[8px]">
                          Target Identity: {log.elementId || 'anonymous-tracker'} / path: {log.activeTab || 'overview'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-white border border-dashed border-stone-200 italic font-serif text-xs text-stone-400">
                      Telemetry cache waiting for customer selections...
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Visual Catalog Master panel */}
        {activeTab === 'products' && (
          <div className="space-y-6" id="admin-tab-products">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-stone-600 font-serif italic">
                Listed catalog products: {products.length} curated objects in active memory.
              </span>
              <button
                type="button"
                onClick={startNew}
                className="bg-charcoal-900 hover:bg-charcoal-850 text-sand-50 py-2.5 px-4 text-[9.5px] uppercase tracking-widest cursor-pointer flex items-center space-x-1"
                id="create-new-product-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Curate New Object</span>
              </button>
            </div>

            {opMsg && (
              <div className="p-3 bg-stone-100 border border-charcoal-900/10 text-stone-700 text-xs italic select-none">
                {opMsg}
              </div>
            )}

            {/* Create or Edit Form drawer block */}
            {isEditingId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#ECE8E1]/40 border border-charcoal-900/15 p-6 mb-8"
                id="product-curation-form-drawer"
              >
                <div className="flex justify-between items-center pb-4 border-b border-charcoal-900/10 mb-4">
                  <h4 className="font-serif text-charcoal-900 text-sm tracking-wide font-medium">
                    {isEditingId === 'NEW_ITEM' ? 'Curate New slow product' : `Edit properties of "${formData.name}"`}
                  </h4>
                  <button
                    onClick={() => setIsEditingId(null)}
                    className="text-[9px] uppercase tracking-widest text-[#C07F5F] hover:text-[#4A5D4E] font-medium"
                  >
                    Cancel Edit
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Ident Code (ID)</label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleFormInputChange}
                      readOnly={isEditingId !== 'NEW_ITEM'}
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs text-stone-750 focus:outline-none focus:border-stone-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Object Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormInputChange}
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs text-stone-750 focus:outline-none focus:border-stone-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Inherent price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleFormInputChange}
                      min={0}
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs text-stone-750 focus:outline-none focus:border-stone-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Category type</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormInputChange}
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs cursor-pointer focus:outline-none"
                    >
                      <option value="Vessels">Vessels</option>
                      <option value="Rituals">Rituals</option>
                      <option value="Textiles">Textiles</option>
                      <option value="Objects">Objects</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Tactile Raw Material</label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleFormInputChange}
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs text-stone-750 focus:outline-none focus:border-stone-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Aesthetic Color Name</label>
                    <input
                      type="text"
                      name="colorName"
                      value={formData.colorName}
                      onChange={handleFormInputChange}
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs text-stone-750 focus:outline-none focus:border-stone-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Dimensions Code</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleFormInputChange}
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs text-stone-750 focus:outline-none focus:border-stone-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Studio stock level</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleFormInputChange}
                      min={0}
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs text-stone-750 focus:outline-none focus:border-stone-400"
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Sensory Tagline / Poetry Statement</label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleFormInputChange}
                      placeholder="e.g. Fired clay vessel that catches silent sunlight"
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs text-stone-750 focus:outline-none focus:border-stone-400"
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Physical Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormInputChange}
                      rows={3}
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs text-stone-750 focus:outline-none focus:border-stone-400"
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Traceability Ledger notes (Line separated)</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleFormInputChange}
                      rows={3}
                      placeholder="Spun on ceramic wheel&#10;Sealed with organic resin"
                      className="w-full bg-white px-3 py-2 border border-stone-250 text-xs focus:outline-none focus:border-stone-400 font-mono text-[11px]"
                    />
                  </div>

                  <div className="md:col-span-3 pt-4 flex space-x-3">
                    <button
                      type="submit"
                      className="bg-charcoal-900 hover:bg-charcoal-850 text-sand-50 px-6 py-3 text-[10px] uppercase tracking-widest cursor-pointer font-medium"
                    >
                      Commit to Studio database
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingId(null)}
                      className="border border-stone-300 hover:bg-stone-50 text-stone-600 px-6 py-3 text-[10px] uppercase tracking-widest cursor-pointer"
                    >
                      Discard changes
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* List Table of Items */}
            <div className="overflow-x-auto border border-charcoal-900/5 bg-white rounded-none">
              <table className="w-full border-collapse text-left text-xs text-stone-650">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-stone-200 text-[#4A5D4E] uppercase tracking-wider text-[8.5px] font-bold">
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Materiality</th>
                    <th className="p-3.5">Studio stock</th>
                    <th className="p-3.5 text-right">Curation Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50">
                      <td className="p-3.5 font-mono text-[10px] text-stone-400">{p.id}</td>
                      <td className="p-3.5 font-serif font-semibold text-stone-850">{p.name}</td>
                      <td className="p-3.5 font-mono font-medium">${p.price}</td>
                      <td className="p-3.5 uppercase text-[9px] tracking-wider text-[#4A5D4E]">{p.category}</td>
                      <td className="p-3.5 font-light">{p.material}</td>
                      <td className="p-3.5">
                        {p.stock === 0 ? (
                          <span className="font-semibold text-rose-800 bg-rose-55 py-0.5 px-2">depleted</span>
                        ) : p.stock !== undefined && p.stock <= 3 ? (
                          <span className="font-semibold text-amber-800 bg-amber-50 py-0.5 px-2">critical ({p.stock})</span>
                        ) : (
                          <span className="text-stone-500">{p.stock ?? 10} units</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1 px-2.5 text-[9px] uppercase tracking-widest text-[#4A5D4E] bg-stone-100 font-bold hover:bg-stone-200"
                          title="Edit object info"
                        >
                          Revise
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1 px-2.5 text-[9px] uppercase tracking-widest text-rose-800 font-bold bg-rose-50 hover:bg-rose-100"
                          title="Remove item"
                        >
                          Retire
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Order Dispatches Status controller */}
        {activeTab === 'dispatches' && (
          <div className="space-y-6" id="admin-tab-dispatches">
            <span className="text-xs text-stone-600 font-serif italic">
              Dispatched order dispatches: {orders.length} secure parcels in tracking register.
            </span>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[#FAF8F5] border border-charcoal-900/5 italic font-serif text-stone-400">
                No orders have been submitted to coordinate yet.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 bg-white border border-charcoal-900/10 space-y-4" id={`admin-dispatch-card-${ord.id}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-[9.5px] font-mono text-stone-400 block font-bold">DISPATCH CONTRACT {ord.id}</span>
                        <span className="text-[11px] text-stone-500 block mt-0.5">Placed by {ord.shippingAddress.fullName} ({ord.shippingAddress.email}) on {ord.createdAt}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <span className="text-[10px] uppercase font-bold text-stone-400 font-sans">Active Status:</span>
                        <select
                          value={ord.deliveryStatus}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                          className="bg-[#EAE8E1]/80 px-2 py-1 text-[9px] uppercase tracking-widest border border-charcoal-900/10 font-bold cursor-pointer focus:outline-none"
                        >
                          <option value="pending">01. Pending selection</option>
                          <option value="packaging">02. Packaging (hemlings)</option>
                          <option value="shipped">03. Shipped (Carbon transit)</option>
                          <option value="delivered">04. Delivered (Anchored)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <span className="text-[9.5px] uppercase tracking-widest text-[#4A5D4E] font-medium block">Crate Content Selections</span>
                        <div className="space-y-1 pt-1 ml-1 text-[11px] text-stone-650">
                          {ord.cartItems.map((item, id) => (
                            <div key={id} className="flex justify-between max-w-sm">
                              <span>— {item.product.name} (×{item.quantity})</span>
                              <span className="font-mono text-stone-450">${item.product.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#FAF8F5] p-3 border border-stone-200/50">
                        <span className="text-[9.5px] uppercase tracking-widest text-stone-400 font-medium block">Delivery Coordinates</span>
                        <p className="text-[11px] text-stone-600 leading-normal mt-1 italic font-serif">
                          {ord.shippingAddress.addressLine}, {ord.shippingAddress.city}, {ord.shippingAddress.postalCode}, {ord.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
