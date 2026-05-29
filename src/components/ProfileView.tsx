import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { User, Archive, Key, ShieldCheck, Mail, Sparkles, MapPin, Search } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfileView: React.FC = () => {
  const {
    orders,
    currentUser,
    setCurrentUser,
    navigateTo,
    triggerPageTrack
  } = useShop();

  const [inputEmail, setInputEmail] = useState('');
  const [inputName, setInputName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authMsg, setAuthMsg] = useState('');

  const handleLoginRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;

    if (isRegistering && !inputName.trim()) {
      setAuthMsg('Please supply your full name for clean register logs.');
      return;
    }

    const nameToSet = isRegistering ? inputName : inputEmail.split('@')[0];
    const newUser = {
      fullName: nameToSet.charAt(0).toUpperCase() + nameToSet.slice(1),
      email: inputEmail.toLowerCase()
    };

    setCurrentUser(newUser);
    triggerPageTrack('profile-login', `Logged in as ${newUser.fullName} (${newUser.email})`);
    setAuthMsg('Welcome to BLANX Slow Goods. Session initialized.');
    
    // Clear inputs
    setInputEmail('');
    setInputName('');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setAuthMsg('Profile session cleared.');
    triggerPageTrack('profile-signout', 'Logged out');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 font-sans text-stone-800" id="profile-view-container">
      
      {/* Title */}
      <div className="py-8 text-center md:text-left mb-6 border-b border-[#ECE7DF]">
        <h2 className="font-serif text-2xl text-charcoal-900 tracking-wide">Customer Trace Record</h2>
        <p className="font-sans text-[9px] text-[#4A5D4E] uppercase tracking-widest mt-1 font-medium">Your historical footprints in search of grounding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Identity Form or Active Session Card */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-charcoal-900/5 p-6" id="identity-sec">
          {currentUser ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 pb-4 border-b border-charcoal-900/10">
                <div className="w-10 h-10 rounded-none bg-[#EAE8E1] border border-[#ECE7DF] flex items-center justify-center text-[#4A5D4E]">
                  <User className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-charcoal-900">{currentUser.fullName}</h3>
                  <span className="text-[10px] text-stone-400 font-mono lower-case block">{currentUser.email}</span>
                </div>
              </div>

              <div className="text-xs space-y-2 text-stone-605">
                <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-[#4A5D4E]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Secure Local Anchor</span>
                </div>
                <p className="leading-relaxed">
                  Your identity is locked in local memory. BLANX does not capture passwords or track cross-site tracking cookies.
                </p>
              </div>

              {authMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-[10.5px] border border-emerald-100 italic">
                  {authMsg}
                </div>
              )}

              <button
                onClick={handleSignOut}
                className="w-full bg-transparent hover:bg-stone-100 text-stone-600 border border-stone-300 py-2 text-[9.5px] uppercase tracking-widest transition-colors cursor-pointer"
                id="signout-profile-btn"
              >
                Clear Curation Profile
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2">
                <Key className="w-4 h-4 text-[#C07F5F]" />
                <h3 className="font-serif text-sm text-charcoal-900 font-medium">Session Initialize</h3>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Log in with your email to recall your tracking logs and default checkout fields automatically. No password required.
              </p>

              <form onSubmit={handleLoginRegister} className="space-y-4 pt-1" id="profile-identity-form">
                <div>
                  <label className="block text-[8.5px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Email Coordinates</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-3.5 h-3.5 text-stone-400 stroke-[1.5]" />
                    <input
                      type="email"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="e.g. sven@domain.se"
                      className="w-full bg-white text-xs border border-charcoal-900/10 hover:border-stone-300 focus:outline-none focus:border-stone-400 px-9 py-2.5 rounded-none"
                      required
                    />
                  </div>
                </div>

                {isRegistering && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-[8.5px] uppercase tracking-widest text-[#4A5D4E] font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="e.g. Sven Lindqvist"
                      className="w-full bg-white text-xs border border-charcoal-900/10 hover:border-stone-300 focus:outline-none focus:border-stone-400 px-3.5 py-2.5 rounded-none"
                      required
                    />
                  </motion.div>
                )}

                {authMsg && (
                  <div className="p-2.5 bg-amber-50 text-amber-800 text-[10px] border border-amber-100">
                    {authMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-charcoal-900 hover:bg-charcoal-850 text-sand-50 py-2.5 text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  {isRegistering ? 'Anchor Profile' : 'Initialize Session'}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setAuthMsg('');
                    }}
                    className="text-[9.5px] text-[#C07F5F] hover:text-charcoal-900 tracking-wider uppercase font-semibold"
                  >
                    {isRegistering ? 'Already in ledger? Sign In' : "Don't have an identity logs? Register"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Historical Order Logs & TRACKING PROGRESS BARS */}
        <div className="lg:col-span-8 space-y-6" id="tracking-logs-sec">
          <div className="flex items-center space-x-2.5 mb-2">
            <Archive className="w-4 h-4 text-[#4A5D4E]" />
            <h3 className="font-serif text-lg text-charcoal-900 font-medium">Historical Curation Logs</h3>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center bg-[#FAF8F5] border border-charcoal-900/5 space-y-3">
              <p className="font-serif italic text-stone-400 text-sm">No curation logs registered in this browser.</p>
              <p className="text-[11px] text-stone-500 leading-relaxed max-w-sm mx-auto">
                Once you unveil a checkout settlement on BLANX, your shipment progress and carbon trackers will be anchored in this window.
              </p>
              <button
                onClick={() => navigateTo('shop')}
                className="text-xs uppercase tracking-widest text-[#C07F5F] hover:text-charcoal-900 border-b border-[#C07F5F] pb-0.5 cursor-pointer pt-3 font-semibold"
              >
                Assemble your first crate
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((ord) => {
                const stepInt = 
                  ord.deliveryStatus === 'delivered' ? 4 :
                  ord.deliveryStatus === 'shipped' ? 3 :
                  ord.deliveryStatus === 'pending' ? 1 : 2; // packaging is 2

                return (
                  <div key={ord.id} className="p-6 bg-white border border-charcoal-900/10 space-y-5" id={`order-track-card-${ord.id}`}>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block font-medium">Curation Code {ord.id}</span>
                        <span className="font-serif text-charcoal-900 text-xs mt-0.5 block">Placed on {ord.createdAt}</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-sans text-[8.5px] uppercase tracking-wider text-charcoal-400 block font-medium">Obligation amount</span>
                        <span className="font-mono text-sm text-charcoal-800 font-semibold">${ord.total}</span>
                      </div>
                    </div>

                    {/* Delivery Status tracker metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans py-1">
                      <div>
                        <span className="text-stone-400 text-[9px] uppercase tracking-wider block">Local Carrier</span>
                        <span className="text-[#4A5D4E] font-medium block mt-0.5">{ord.carrier || 'Forest Freight'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[9px] uppercase tracking-wider block">Hemp tracking Code</span>
                        <span className="text-charcoal-900 font-mono font-medium block mt-0.5 select-all">{ord.trackingCode || 'BLANX-8391-CRG'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[9px] uppercase tracking-wider block">Recipient</span>
                        <span className="text-charcoal-900 font-medium block mt-0.5">{ord.shippingAddress.fullName}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[9px] uppercase tracking-wider block">Destination Crate</span>
                        <span className="text-charcoal-900 font-medium block mt-0.5 truncate">{ord.shippingAddress.city}, {ord.shippingAddress.country}</span>
                      </div>
                    </div>

                    {/* Progressive Bar tracker */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-[#4A5D4E] font-bold">
                        <span>Crate Delivery Tracker</span>
                        <span className="px-2 py-0.5 bg-[#EAE8E1] border border-charcoal-900/10">{ord.deliveryStatus}</span>
                      </div>

                      <div className="relative w-full h-1 bg-stone-100">
                        {/* Progress slider bar */}
                        <div 
                          className="absolute h-full bg-[#4A5D4E] transition-all duration-1000" 
                          style={{ width: `${(stepInt / 4) * 100}%` }}
                        />
                        {/* Dots */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between">
                          {[1, 2, 3, 4].map((dotVal) => {
                            const isPassed = dotVal <= stepInt;
                            return (
                              <div 
                                key={dotVal} 
                                className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                                  isPassed ? 'bg-[#4A5D4E] border-[#4A5D4E]' : 'bg-white border-stone-300'
                                }`} 
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="grid grid-cols-4 text-center text-[8.5px] uppercase tracking-wider text-stone-400 pt-0.5 font-sans leading-relaxed">
                        <span className={stepInt >= 1 ? 'text-[#4A5D4E] font-bold' : ''}>01. Selection</span>
                        <span className={stepInt >= 2 ? 'text-[#4A5D4E] font-bold' : ''}>02. Hempling</span>
                        <span className={stepInt >= 3 ? 'text-[#4A5D4E] font-bold' : ''}>03. Transit</span>
                        <span className={stepInt >= 4 ? 'text-[#4A5D4E] font-bold' : ''}>04. Anchored</span>
                      </div>
                    </div>

                    {/* Cancel options */}
                    {ord.deliveryStatus === 'pending' && (
                      <div className="pt-2 text-right">
                        <p className="text-[10px] text-stone-400 italic mb-1">Crate remains in temporary hold. Cancel anytime prior to dispatch.</p>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
