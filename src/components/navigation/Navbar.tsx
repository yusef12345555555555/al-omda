import React from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Search, 
  Heart, 
  Globe, 
  LayoutGrid, 
  Home, 
  Award, 
  PhoneCall,
  ShoppingCart
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PageView } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    setSelectedCategoryId,
    favorites, 
    language, 
    setLanguage, 
    setIsSearchOpen,
    settings,
    cartCount,
    setIsCartOpen
  } = useStore();

  const handleNavClick = (view: PageView) => {
    setSelectedCategoryId(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { id: PageView; labelAr: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: Home },
    { id: 'categories', labelAr: 'الأقسام', labelEn: 'Categories', icon: LayoutGrid },
    { id: 'best', labelAr: 'الأصناف الأفضل', labelEn: 'Best Products', icon: Award },
    { id: 'favorites', labelAr: 'المفضلة', labelEn: 'Favorites', icon: Heart },
  ];

  return (
    <>
      {/* Announcement Bar if configured in Admin */}
      {settings.announcementActive && settings.announcement && currentView !== 'admin' && (
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-b border-amber-500/20 py-1.5 px-4 text-center text-xs text-amber-200/90 font-medium relative z-40 overflow-hidden flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{settings.announcement}</span>
        </div>
      )}

      {/* Floating Header */}
      <header className="sticky top-0 z-40 w-full transition-all duration-300 backdrop-blur-xl bg-stone-950/80 border-b border-amber-500/15" id="main-app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo & Branding */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-start focus:outline-none"
            id="brand-logo-button"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-stone-900 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.restaurantName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 group-hover:text-amber-400 animate-pulse" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black font-['Cairo'] text-amber-400 tracking-tight group-hover:text-amber-300 transition-colors">
                  {language === 'ar' ? settings.restaurantName : settings.restaurantNameEn}
                </span>
                {(settings.navBadgeText || settings.navBadgeTextEn) && (
                  <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold uppercase tracking-wider">
                    {language === 'ar' ? settings.navBadgeText : settings.navBadgeTextEn}
                  </span>
                )}
              </div>
              {(settings.navSubtitle || settings.navSubtitleEn) && (
                <span className="text-[10px] sm:text-xs text-stone-400 font-['Outfit'] tracking-wider hidden sm:inline">
                  {language === 'ar' ? settings.navSubtitle : settings.navSubtitleEn}
                </span>
              )}
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-900/60 p-1.5 rounded-full border border-stone-800/80 shadow-inner">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-bold font-['Cairo'] transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-amber-600/30 border border-amber-500/50"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span className="relative z-10">{language === 'ar' ? item.labelAr : item.labelEn}</span>

                  {item.id === 'favorites' && favorites.length > 0 && (
                    <span className="relative z-10 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                      {favorites.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Search, Audio, Lang, Admin Lock */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center gap-1.5 text-xs transition"
              title={language === 'ar' ? 'بحث في المنيو' : 'Search Menu'}
              id="search-trigger-button"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-medium">
                {language === 'ar' ? 'بحث' : 'Search'}
              </span>
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center gap-1.5 text-xs transition"
              title={language === 'ar' ? 'سلة الطلبات' : 'Cart'}
              id="cart-trigger-button"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-medium">{language === 'ar' ? 'السلة' : 'Cart'}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-black flex items-center justify-center border border-stone-950">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-300 hover:text-amber-300 flex items-center gap-1 transition"
              title="تغيير اللغة / Switch Language"
              id="language-toggle-button"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
