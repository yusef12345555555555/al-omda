import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AmbientBackground } from './components/cinematic/AmbientBackground';
import { CinematicIntro } from './components/cinematic/CinematicIntro';
import { Navbar } from './components/navigation/Navbar';
import { MobileNav } from './components/navigation/MobileNav';
import { SearchModal } from './components/common/SearchModal';
import { WhatsAppWidget } from './components/common/WhatsAppWidget';
import { CartModal } from './components/common/CartModal';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/home/HomeView';
import { CategoriesView } from './components/categories/CategoriesView';
import { CategoryDetailView } from './components/categories/CategoryDetailView';
import { BestProductsView } from './components/best/BestProductsView';
import { FavoritesView } from './components/favorites/FavoritesView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailView } from './components/products/ProductDetailView';
import { Flame } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, settings, openProductPage } = useStore();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col relative selection:bg-amber-500 selection:text-stone-950">
      
      {/* 1. Living Continuous Ambient Canvas Background */}
      <AmbientBackground />

      {/* 2. Brand Cinematic Reveal Intro (Customer Facing) */}
      {currentView !== 'admin' && <CinematicIntro />}

      {/* 3. Top Announcement Ticker (if active) */}
      {settings.announcementActive && settings.announcement && currentView !== 'admin' && (
        <div className="relative z-30 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 py-1.5 px-4 text-center text-xs font-black font-['Cairo'] shadow-md flex items-center justify-center gap-2">
          <Flame className="w-4 h-4 text-stone-950 animate-bounce" />
          <span>{settings.announcement}</span>
          <Flame className="w-4 h-4 text-stone-950 animate-bounce" />
        </div>
      )}

      {/* 4. Top Navigation Bar (Customer Facing) */}
      {currentView !== 'admin' && <Navbar />}

      {/* 5. Main Dynamic Screen Viewport - Dedicated Pages (NO MODALS) */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {currentView === 'home' && <HomeView onOpenProduct={(p) => openProductPage(p.id)} />}
            {currentView === 'categories' && <CategoriesView />}
            {currentView === 'category-detail' && <CategoryDetailView onOpenProduct={(p) => openProductPage(p.id)} />}
            {currentView === 'best' && <BestProductsView onOpenProduct={(p) => openProductPage(p.id)} />}
            {currentView === 'favorites' && <FavoritesView onOpenProduct={(p) => openProductPage(p.id)} />}
            {currentView === 'product-detail' && <ProductDetailView />}
            {currentView === 'admin' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 6. Footer with Left/Right Split Composition & 3 Side-by-Side Social Media Cards */}
      {currentView !== 'admin' && <Footer />}

      {/* 7. Bottom Navigation for Mobile Devices */}
      {currentView !== 'admin' && <MobileNav />}

      {/* 8. Floating WhatsApp Immediate Order Widget */}
      {currentView !== 'admin' && <WhatsAppWidget />}

      {/* 9. Global Search Modal */}
      {currentView !== 'admin' && <SearchModal onOpenProduct={(p) => openProductPage(p.id)} />}

      {/* 10. Cart Review Modal — يجمع الأصناف ويرسلها لواتساب */}
      {currentView !== 'admin' && <CartModal />}

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
