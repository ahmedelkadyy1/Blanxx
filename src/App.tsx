import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { ConfirmationView } from './components/ConfirmationView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { AIStylistChat } from './components/AIStylistChat';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';

// Main content switcher
const ActiveView: React.FC = () => {
  const { activeTab } = useShop();

  switch (activeTab) {
    case 'home':
    case 'shop':
      return <HomeView />;
    case 'detail':
      return <ProductDetailView />;
    case 'cart':
      return <CartView />;
    case 'checkout':
      return <CheckoutView />;
    case 'confirmation':
      return <ConfirmationView />;
    case 'profile':
      return <ProfileView />;
    case 'admin':
      return <AdminView />;
    default:
      return <HomeView />;
  }
};

const MainLayout: React.FC = () => {
  const { activeTab, selectedProductId } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 selection:bg-sand-300 selection:text-charcoal-900" id="main-app-layout">
      {/* Spacious Sticky Header */}
      <Header />

      {/* Main view container with slow, comforting page change cross-fades */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab + (selectedProductId || '')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-grow w-full"
          id="main-scrolling-content"
        >
          <ActiveView />
        </motion.main>
      </AnimatePresence>

      {/* Sustainable Ethical Footer */}
      <Footer />

      {/* AI Personal Curator Stylist Bot Drawer */}
      <AIStylistChat />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
