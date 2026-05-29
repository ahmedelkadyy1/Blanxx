import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, X, Send, ArrowRight, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const AIStylistChat: React.FC = () => {
  const { products, addToCart, navigateTo } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Welcome to BLANX. I am your quiet curator. Tell me, what kind of sensory atmosphere are you looking to anchor in your room right now? I can recommend outfits, coordinate gift sets under $50, or match the natural materials of our objects to your personal spaces."
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim()) return;

    if (!customText) setInputVal('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const historyPayload = messages.map(m => ({ role: m.role, text: m.text }));
      
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: data.text || "I apologize. My unhurried thoughts are slightly tangled. Let us pause."
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('API offline');
      }
    } catch (e) {
      // Fallback
      setTimeout(() => {
        let text = "Greetings. In this quiet corner, let us consider what brings genuine grounding to your space.\n\n";
        const norm = textToSend.toLowerCase();
        
        if (norm.includes("50") || norm.includes("under") || norm.includes("budget")) {
          text += "Under $50, I highly suggest centering your morning routines around our **Basalt Aroma Diffuser Set ($48)** or stepping away from screens with our **Volcanic Sand Timer ($42)**. Both are completely wireless passive objects designed to clear tension.";
        } else if (norm.includes("outfit") || norm.includes("apparel") || norm.includes("throw") || norm.includes("wear")) {
          text += "For a beautifully restful day, pairing the **Waffle Organic Cotton Throw ($90)** wrapped softly as a sensory layers with our elegant **Undyed Linen Meditation Journal ($36)** brings visual and physical silence.";
        } else if (norm.includes("tea") || norm.includes("cup") || norm.includes("vessel") || norm.includes("clay")) {
          text += "If hot beverages bring you peace, our **Ceramic Brewing Vessel ($64)** hand-forged in Kyoto paired with a singular stem in the study **Terracotta Bud Vase ($38)** forms a wonderful companion study.";
        } else {
          text += "I suggest exploring our volcanic timers, basalt passive stones, raw Belgian flax linens and raw solid unlacquered brasses. Tell me, do you seek wooden forest scents, textile comfort, or single-wildflower visual monuments?";
        }

        setMessages(prev => [...prev, {
          id: `ai-fallback-${Date.now()}`,
          role: 'assistant',
          text
        }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  // Extract products found in text response to suggest shortcuts
  const getProductRecommendationsInResponse = (text: string) => {
    return products.filter(p => 
      text.toLowerCase().includes(p.name.toLowerCase()) || 
      text.toLowerCase().includes(p.id.toLowerCase())
    );
  };

  return (
    <>
      {/* Floating Stylist Toggle Launcher Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-charcoal-900 text-sand-50 px-5 py-3.5 rounded-none shadow-xl hover:bg-charcoal-850 transition-all cursor-pointer focus:outline-none uppercase tracking-[0.2em] text-[10px]"
          id="ai-stylist-launcher"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-200 animate-pulse" />
          <span>Curator Stylist</span>
        </motion.button>
      )}

      {/* Slide-out Sidebar Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end overflow-hidden" id="ai-chat-sidebar-wrapper">
            {/* Soft Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-[1px]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-md bg-[#FAF8F5] h-full flex flex-col border-l border-charcoal-900/10 shadow-2xl z-10"
              id="ai-chat-sidebar"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#ECE7DF] flex items-center justify-between bg-sand-50">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4A5D4E] animate-ping" />
                  <div>
                    <h3 className="font-serif text-sm tracking-wide text-charcoal-900 font-medium">Curator Personal Stylist</h3>
                    <p className="font-sans text-[9px] uppercase tracking-widest text-[#4A5D4E] mt-0.5">Un-rushed semantic recommendations</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-charcoal-900 transition-colors cursor-pointer"
                  id="close-chat-sidebar"
                >
                  <X className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>

              {/* Chat Message Scroll Board */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none" id="chat-messages-board">
                {messages.map((m) => {
                  const isCurator = m.role === 'assistant';
                  const recs = isCurator ? getProductRecommendationsInResponse(m.text) : [];

                  return (
                    <div key={m.id} className={`flex flex-col ${isCurator ? 'items-start' : 'items-end'} space-y-2`}>
                      <span className="font-sans text-[8px] uppercase tracking-widest text-charcoal-400">
                        {isCurator ? 'BLANX Curator' : 'You'}
                      </span>
                      
                      <div className={`p-4 rounded-none max-w-[85%] text-xs leading-relaxed ${
                        isCurator 
                          ? 'bg-sand-50 text-charcoal-800 border border-charcoal-900/5 font-serif' 
                          : 'bg-charcoal-900 text-sand-50 font-sans tracking-wide'
                      }`}>
                        <p className="whitespace-pre-line">{m.text}</p>
                      </div>

                      {/* Associated responsive quick action links */}
                      {isCurator && recs.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1 pl-1">
                          {recs.map(item => (
                            <div key={item.id} className="flex items-center space-x-2 bg-stone-100 border border-charcoal-900/5 px-2.5 py-1 text-[9px] uppercase tracking-wider">
                              <span className="text-stone-500 font-serif lowercase italic">{item.name}</span>
                              <button
                                onClick={() => {
                                  setIsOpen(false);
                                  navigateTo('detail', item.id);
                                }}
                                className="text-[#C07F5F] hover:text-charcoal-900 underline underline-offset-2 cursor-pointer"
                              >
                                View
                              </button>
                              <button
                                onClick={() => addToCart(item, 1)}
                                className="text-stone-800 hover:text-stone-900 font-medium cursor-pointer"
                              >
                                + Bag
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Shimmer loading skeleton - Not a spinner */}
                {isTyping && (
                  <div className="flex flex-col items-start space-y-2">
                    <span className="font-sans text-[8px] uppercase tracking-widest text-charcoal-400">Curator is pondering...</span>
                    <div className="p-4 w-[75%] bg-sand-50/70 space-y-2 border border-charcoal-900/5">
                      <div className="h-2.5 bg-charcoal-900/5 animate-pulse w-full rounded-none" />
                      <div className="h-2.5 bg-charcoal-900/5 animate-pulse w-11/12 rounded-none" />
                      <div className="h-2.5 bg-charcoal-900/5 animate-pulse w-3/4 rounded-none" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Suggestions */}
              <div className="px-6 py-3 border-t border-[#ECE7DF] bg-[#FAF8F5]">
                <p className="font-sans text-[8px] uppercase tracking-widest text-charcoal-400 mb-2">Ponder these avenues:</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSend("What quiet objects should I buy under $50?")}
                    className="text-[9px] uppercase tracking-wider px-2.5 py-1.5 border border-charcoal-900/5 hover:bg-sand-50 hover:border-charcoal-900/20 text-charcoal-700 font-sans transition-colors cursor-pointer rounded-none"
                  >
                    Gifts under $50
                  </button>
                  <button
                    onClick={() => handleSend("Suggest a matching aesthetic beige linen look.")}
                    className="text-[9px] uppercase tracking-wider px-2.5 py-1.5 border border-charcoal-900/5 hover:bg-sand-50 hover:border-charcoal-900/20 text-charcoal-700 font-sans transition-colors cursor-pointer rounded-none"
                  >
                    Beige linen outfit
                  </button>
                  <button
                    onClick={() => handleSend("Tell me how the Volcanic Slabs and Diffuser work.")}
                    className="text-[9px] uppercase tracking-wider px-2.5 py-1.5 border border-charcoal-900/5 hover:bg-sand-50 hover:border-charcoal-900/20 text-charcoal-700 font-sans transition-colors cursor-pointer rounded-none"
                  >
                    Basalt Diffusers
                  </button>
                </div>
              </div>

              {/* Chat Input row */}
              <div className="p-6 border-t border-[#ECE7DF] bg-sand-50 flex items-center space-x-3">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Ask our stylist..."
                  className="flex-1 bg-transparent border border-charcoal-900/10 px-4 py-3 text-xs focus:outline-none focus:border-charcoal-900/30 rounded-none text-charcoal-900 placeholder-stone-400 font-serif"
                />
                <button
                  onClick={() => handleSend()}
                  className="bg-charcoal-900 hover:bg-charcoal-800 text-sand-50 p-3 rounded-none transition-colors cursor-pointer focus:outline-none"
                  aria-label="Send Message"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
