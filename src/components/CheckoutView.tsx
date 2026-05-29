import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion } from 'motion/react';
import { Shield, ArrowRight, BookOpen } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { cart, cartTotal, placeOrder, navigateTo, currentUser } = useShop();

  // Simple form state
  const [formData, setFormData] = React.useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  // Sync if currentUser loads later
  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || currentUser.fullName,
        email: prev.email || currentUser.email
      }));
    }
  }, [currentUser]);

  const [step, setStep] = useState<1 | 2>(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-filled for testing convenience, keeping it optional but quick
  const fillSampleData = () => {
    setFormData({
      fullName: 'Sven Lindqvist',
      email: 'sven@visualsilence.org',
      addressLine: '42 Sandstone Lane',
      city: 'Portland',
      postalCode: '97201',
      country: 'United States',
    });
    setErrorMsg('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.addressLine || !formData.city || !formData.postalCode) {
      setErrorMsg('Please occupy all fields carefully so we can trace your shipment.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleSubmitOrder = () => {
    placeOrder(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6" id="checkout-view-container">
      {/* Back button */}
      <button
        onClick={() => {
          if (step === 2) setStep(1);
          else navigateTo('cart');
        }}
        className="group flex items-center space-x-2 text-xs tracking-wider text-charcoal-400 hover:text-charcoal-900 transition-colors duration-300 mb-8 cursor-pointer focus:outline-none"
        id="checkout-back-btn"
      >
        <span>←</span>
        <span>{step === 2 ? 'Return to Destination' : 'Return to Basket'}</span>
      </button>

      {/* Title */}
      <div className="text-center md:text-left mb-10">
        <h2 className="font-serif text-2xl text-charcoal-900 tracking-wide">Curation Finalization</h2>
        <p className="font-sans text-[10px] text-charcoal-400 uppercase tracking-widest mt-1">
          {step === 1 ? 'Step 1 of 2: Shipping Destination' : 'Step 2 of 2: Direct Settlement'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Form Core */}
        <div className="lg:col-span-7 bg-transparent p-6 md:p-8 rounded-none border border-charcoal-900/10">
          
          {/* Form Step Status Header */}
          <div className="flex items-center space-x-4 mb-8 text-[11px] uppercase tracking-widest">
            <span className={`pb-1 border-b font-medium transition-all ${step === 1 ? 'border-charcoal-900 text-charcoal-900' : 'border-transparent text-charcoal-400'}`}>
              01. Destination
            </span>
            <span className="text-charcoal-400 opacity-30">—</span>
            <span className={`pb-1 border-b font-medium transition-all ${step === 2 ? 'border-charcoal-900 text-charcoal-900' : 'border-transparent text-charcoal-400 opacity-60'}`}>
              02. Settlement
            </span>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-5" id="shipping-address-form">
              <div className="flex justify-between items-center text-xs">
                <span className="text-charcoal-700 font-serif italic">Provide shipping details</span>
                <button
                  type="button"
                  onClick={fillSampleData}
                  className="text-[9px] uppercase tracking-widest text-charcoal-700 hover:text-charcoal-900 transition-colors bg-sand-100 px-3 py-1.5 rounded-none border border-charcoal-900/10 cursor-pointer"
                  id="fill-sample-btn"
                >
                  Quick Fill Sample
                </button>
              </div>

              {errorMsg && (
                <div className="text-[11px] text-charcoal-800 bg-sand-100 p-4 rounded-none border border-charcoal-900/10 leading-relaxed font-light">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-[10px] uppercase tracking-widest text-charcoal-400 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g., Sven Lindqvist"
                    className="w-full text-xs bg-transparent text-charcoal-900 px-4 py-3 rounded-none border border-charcoal-900/10 hover:border-charcoal-900/20 focus:border-charcoal-900 transition-all duration-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-charcoal-400 mb-1.5">
                    Email for Notifications
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., sven@visualsilence.org"
                    className="w-full text-xs bg-transparent text-charcoal-900 px-4 py-3 rounded-none border border-charcoal-900/10 hover:border-charcoal-900/20 focus:border-charcoal-900 transition-all duration-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="addressLine" className="block text-[10px] uppercase tracking-widest text-charcoal-400 mb-1.5">
                    Physical Address Line
                  </label>
                  <input
                    type="text"
                    id="addressLine"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    placeholder="Street name and number"
                    className="w-full text-xs bg-transparent text-charcoal-900 px-4 py-3 rounded-none border border-charcoal-900/10 hover:border-charcoal-900/20 focus:border-charcoal-900 transition-all duration-300 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-[10px] uppercase tracking-widest text-charcoal-400 mb-1.5">
                      Town / City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., Portland"
                      className="w-full text-xs bg-transparent text-charcoal-900 px-4 py-3 rounded-none border border-charcoal-900/10 hover:border-charcoal-900/20 focus:border-charcoal-900 transition-all duration-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-[10px] uppercase tracking-widest text-charcoal-400 mb-1.5">
                      Postal Code / Zip
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="e.g., 97201"
                      className="w-full text-xs bg-transparent text-charcoal-900 px-4 py-3 rounded-none border border-charcoal-900/10 hover:border-charcoal-900/20 focus:border-charcoal-900 transition-all duration-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-[10px] uppercase tracking-widest text-charcoal-400 mb-1.5">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-transparent text-charcoal-900 px-4 py-3 rounded-none border border-charcoal-900/10 hover:border-charcoal-900/20 focus:border-charcoal-900 transition-all duration-300 focus:outline-none cursor-pointer text-charcoal-900"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Japan">Japan</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-charcoal-900 hover:bg-charcoal-800 text-sand-50 py-3.5 text-xs uppercase font-medium tracking-[0.25em] rounded-none transition-colors duration-350 mt-6 cursor-pointer flex items-center justify-center space-x-2 focus:outline-none"
                id="next-step-btn"
              >
                <span>Proceed to Settlement</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </form>
          ) : (
            <div className="space-y-6" id="settlement-form">
              <div className="flex items-start space-x-4 p-4 bg-sand-100/40 rounded-none border border-charcoal-900/5">
                <Shield className="w-5 h-5 text-charcoal-400 stroke-[1.25] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-serif text-sm text-charcoal-900">Direct Invoiced Checkout</h4>
                  <p className="text-xs text-charcoal-750 leading-relaxed font-light">
                    This is an unhurried, trust-based shopping platform. We do not require digital card entry or capture your micro-credentials today.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-charcoal-700 leading-relaxed">
                <p>
                  To eliminate immediate screen distractions, you will receive a silent physical invoice enclosed inside your shipped crate, printed on recycled hemp cardboard.
                </p>
                <p>
                  Settlement can be settled at your comfort within <strong>14 days</strong> of receiving the items via local bank transfer or paper checking without additional premiums.
                </p>
                
                <div className="rounded-none border border-charcoal-900/10 p-4 space-y-2 mt-4 text-[11px]">
                  <div className="flex justify-between font-serif">
                    <span className="text-charcoal-400">Shipment recipient:</span>
                    <span className="text-charcoal-900">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between font-serif">
                    <span className="text-charcoal-400">Destination:</span>
                    <span className="text-charcoal-900 text-right">{formData.addressLine}, {formData.city}</span>
                  </div>
                  <div className="flex justify-between font-serif">
                    <span className="text-charcoal-400">Assigned dispatch:</span>
                    <span className="text-charcoal-900">Carbon-offset, wood crates</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 border border-charcoal-900/10 text-charcoal-700 hover:text-charcoal-900 text-xs font-medium tracking-widest uppercase rounded-none transition-colors cursor-pointer text-center focus:outline-none"
                  id="prev-step-btn"
                >
                  Adjust Address
                </button>
                <button
                  onClick={handleSubmitOrder}
                  className="flex-1 bg-charcoal-900 hover:bg-charcoal-800 text-sand-50 py-3.5 text-xs uppercase font-medium tracking-[0.25em] rounded-none transition-colors duration-350 cursor-pointer flex items-center justify-center space-x-2 focus:outline-none"
                  id="complete-order-btn"
                >
                  <span>Finalize & Dispatch</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Crate Summary */}
        <div className="lg:col-span-5 bg-[#EBE8E0] p-6 rounded-none border border-charcoal-900/5 space-y-6" id="checkout-crate-summary">
          <h3 className="font-serif text-sm text-charcoal-900 uppercase tracking-widest border-b border-charcoal-900/10 pb-3">Your Crate</h3>
          
          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center space-x-3 text-xs">
                {/* Micro illustration */}
                <span className="w-4 h-4 rounded-full border border-charcoal-400/40 text-charcoal-800 flex items-center justify-center font-mono text-[9px] scale-[0.8] select-none">
                  {quantity}
                </span>
                <span className="font-serif text-charcoal-900 flex-1 truncate">{product.name}</span>
                <span className="font-mono text-charcoal-400">${product.price * quantity}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-charcoal-900/10" />

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-charcoal-705">
              <span>Grounded materials:</span>
              <span className="font-mono">${cartTotal}</span>
            </div>
            <div className="flex justify-between text-charcoal-705">
              <span>Compostable pack & ship:</span>
              <span className="text-charcoal-900 font-medium">Included</span>
            </div>
          </div>

          <div className="h-px bg-charcoal-900/10" />

          <div className="flex justify-between items-baseline pt-2">
            <span className="font-serif text-sm text-charcoal-800">Curation Total</span>
            <span className="font-mono text-base text-charcoal-900 font-semibold">${cartTotal}</span>
          </div>

          {/* Calming text reminder */}
          <div className="p-3 bg-sand-50/40 rounded-none text-[10px] text-charcoal-700 flex space-x-2 border border-charcoal-900/5 leading-relaxed font-light">
            <BookOpen className="w-3.5 h-3.5 stroke-[1.25] text-charcoal-400 shrink-0 mt-0.5" />
            <p>
              Your bundle is treated with personal attention. You can cancel or modify this curation freely prior to Tuesday or Thursday dispatch times by messaging our quiet workspace.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
