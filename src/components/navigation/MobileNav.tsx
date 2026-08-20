import React from 'react';
import { motion } from 'motion/react';
import { Home, LayoutGrid, Award, Heart, ShoppingCart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PageView } from '../../types';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, setSelectedCategoryId, favorites, language, cartCount, setIsCartOpen } = useStore();

  if (currentView === 'admin') return null;

  const items: { id: PageView; labelAr: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: Home },
    { id: 'categories', labelAr: 'الأقسام', labelEn: 'Categories', icon: LayoutGrid },
    { id: 'best', labelAr: 'الأفضل', labelEn: 'Best', icon: Award },
    { id: 'favorites', labelAr: 'المفضلة', labelEn: 'Favorites', icon: Heart },
  ];

  const handleSelect = (view: PageView) => {
    setSelectedCategoryId(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40" id="mobile-bottom-nav">
      <div className="bg-stone-900/90 border border-amber-500/25 rounded-2xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center justify-around">
        {items.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`relative flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                isActive ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              id={`mobile-nav-${item.id}`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute inset-0 rounded-xl bg-amber-500/15 border border-amber-500/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400 scale-110' : 'text-stone-400'} transition-transform`} />
                {item.id === 'favorites' && favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-bold">
                    {favorites.length}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-['Cairo'] relative z-10">
                {language === 'ar' ? item.labelAr : item.labelEn}
              </span>
            </button>
          );
        })}

        {/* Cart Button — يفتح مراجعة السلة قبل الإرسال لواتساب */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex-1 flex flex-col items-center py-2 px-1 rounded-xl text-stone-400 hover:text-emerald-400 transition-all"
          id="mobile-nav-cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] px-1 py-0.2 rounded-full bg-emerald-500 text-stone-950 text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-['Cairo']">{language === 'ar' ? 'السلة' : 'Cart'}</span>
        </button>
      </div>
    </div>
  );
};
