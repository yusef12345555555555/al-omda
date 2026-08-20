import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Award, 
  ChefHat, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Heart, 
  MessageCircle, 
  ChevronRight, 
  Utensils 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Product } from '../../types';

interface HomeViewProps {
  onOpenProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenProduct }) => {
  const { categories, products, setCurrentView, setSelectedCategoryId, settings, language } = useStore();
  
  const bestProducts = products.filter((p) => p.isBest).slice(0, 4);
  const activeCategories = categories.filter((c) => c.active);

  // Dynamic rotating hero showcase dish index
  const heroDishes = products.filter((p) => p.isBest).slice(0, 3);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroDishes.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroDishes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroDishes.length]);

  const currentHeroDish = heroDishes[heroIndex] || products[0];

  const handleCategoryClick = (catId: string) => {
    setSelectedCategoryId(catId);
    setCurrentView('category-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12" id="home-view-container">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden select-none">
        
        {/* Living Radial Glow Core */}
        <div className="absolute inset-0 bg-radial-hero pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left/Start Column: Typography & Dynamic CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
              
              {/* Badge: Live Grill Status */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-950/80 to-stone-900 border border-amber-500/40 shadow-lg shadow-amber-500/10 backdrop-blur-md"
              >
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="text-xs sm:text-sm font-bold font-['Cairo'] text-amber-300">
                  {language === 'ar' ? '🔥 الشواية مشتعلة - أسخن المشويات على الفحم' : '🔥 Live Charcoal Grill Fired Up'}
                </span>
              </motion.div>

              {/* Main Headline with High-Contrast Typography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-2"
              >
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-['Cairo'] text-stone-100 tracking-tight leading-[1.15]">
                  {language === 'ar' ? (
                    <>
                      أصل الطعم والمشويات في <span className="text-amber-400 text-glow-gold">مطعم العمدة</span>
                    </>
                  ) : (
                    <>
                      The Master of Grills at <span className="text-amber-400 text-glow-gold">AL OMDA</span>
                    </>
                  )}
                </h1>
                
                <p className="text-sm sm:text-lg text-stone-300 font-medium font-['Cairo'] max-w-2xl leading-relaxed pt-2">
                  {language === 'ar' ? settings.tagline : (settings.taglineEn || settings.tagline)}
                </p>
              </motion.div>

              {/* Key Heritage Highlight Pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2"
              >
                {[
                  { labelAr: 'لحوم بلدية طازجة 100%', labelEn: '100% Prime Meats' },
                  { labelAr: 'فحم طبيعي أصيل', labelEn: 'Natural Charcoal' },
                  { labelAr: 'تتبيلة العمدة الخاصة', labelEn: 'Signature Marinade' },
                  { labelAr: 'طواجن فخار بلدي', labelEn: 'Earthenware Tagines' },
                ].map((pill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-stone-900/90 border border-stone-800 text-xs font-semibold text-stone-300 flex items-center gap-1.5 shadow-sm"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'ar' ? pill.labelAr : pill.labelEn}</span>
                  </span>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('categories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95"
                  id="hero-explore-categories-btn"
                >
                  <Layers className="w-5 h-5 text-stone-950" />
                  <span>{language === 'ar' ? 'استعراض أقسام المنيو' : 'Explore Full Menu'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 text-stone-950" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('best');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-amber-500/30 hover:border-amber-400 text-amber-300 font-bold text-sm sm:text-base shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
                  id="hero-best-products-btn"
                >
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>{language === 'ar' ? 'الأصناف الأكثر طلباً' : 'Best Sellers'}</span>
                </button>
              </motion.div>
            </div>

            {/* Right/End Column: Interactive 3D Showcase Floating Dish */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                
                {/* Glowing Backing Rings */}
                <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-pulse-glow pointer-events-none" />
                <div className="absolute inset-8 rounded-full border border-dashed border-amber-500/30 animate-[spin_40s_linear_infinite] pointer-events-none" />
                <div className="absolute inset-16 rounded-full bg-gradient-to-tr from-amber-600/20 via-orange-600/10 to-transparent blur-2xl pointer-events-none" />

                {/* Animated Showcase Dish with Continuous Float */}
                <AnimatePresence mode="wait">
                  {currentHeroDish && (
                    <motion.div
                      key={currentHeroDish.id}
                      initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => onOpenProduct(currentHeroDish)}
                      className="relative z-10 w-4/5 h-4/5 rounded-full p-2.5 bg-gradient-to-b from-amber-500/30 via-stone-900 to-stone-950 border-2 border-amber-500/50 shadow-[0_20px_50px_rgba(245,158,11,0.35)] cursor-pointer group animate-float-slow"
                    >
                      <div className="w-full h-full rounded-full overflow-hidden relative">
                        <img
                          src={currentHeroDish.image}
                          alt={currentHeroDish.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/20" />

                        {/* Center Dish Badge */}
                        <div className="absolute bottom-6 inset-x-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-xs font-['Cairo'] shadow-md mb-1">
                            {currentHeroDish.tag || (language === 'ar' ? 'صنف مميز' : 'Signature')}
                          </span>
                          <h4 className="font-black text-sm sm:text-base font-['Cairo'] text-stone-100 group-hover:text-amber-300 transition-colors">
                            {currentHeroDish.name}
                          </h4>
                          <span className="text-xs font-black text-amber-400 font-['Cairo']">
                            {currentHeroDish.price} ج.م
                          </span>
                        </div>
                      </div>

                      {/* Click to open badge */}
                      <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-stone-900/90 border border-amber-500/40 text-[10px] font-bold text-amber-300 shadow-md backdrop-blur-md">
                        {language === 'ar' ? 'انقر للتفاصيل والطلب 🔍' : 'Click to View 🔍'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dish Switcher Dots */}
                <div className="absolute -bottom-6 flex items-center gap-2">
                  {heroDishes.map((d, i) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setHeroIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        heroIndex === i ? 'w-8 bg-amber-400' : 'w-2 bg-stone-700 hover:bg-stone-500'
                      }`}
                      aria-label={`Show ${d.name}`}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SHOWCASE PORTAL GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none" id="categories-showcase-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-stone-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold font-['Cairo'] text-amber-400 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'عوالم النكهة الأصيلة' : 'Culinary Portals'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-['Cairo'] text-stone-100">
              {language === 'ar' ? 'أقسام منيو العمدة' : 'Restaurant Categories'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('categories');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold font-['Cairo'] text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition"
          >
            <span>{language === 'ar' ? 'عرض جميع الأقسام' : 'View All Categories'}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* Dynamic Category Cards Grid - Always 2 columns on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {activeCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative h-56 sm:h-72 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-stone-800 hover:border-amber-500/50 shadow-xl transition-all duration-300 flex flex-col justify-end p-3.5 sm:p-5"
            >
              {/* Category Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent group-hover:via-stone-950/40 transition-colors" />

              {/* Category Top Badge */}
              <div className="absolute top-2.5 sm:top-4 inset-x-2.5 sm:inset-x-4 flex items-center justify-between pointer-events-none">
                {cat.badge ? (
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-amber-500/90 text-stone-950 text-[10px] sm:text-[11px] font-black font-['Cairo'] shadow-md">
                    {cat.badge}
                  </span>
                ) : <span />}
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-900/80 border border-stone-700 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rtl:rotate-180" />
                </span>
              </div>

              {/* Category Info */}
              <div className="relative z-10 space-y-1">
                <h3 className="text-base sm:text-xl font-black font-['Cairo'] text-stone-100 group-hover:text-amber-300 transition-colors leading-tight">
                  {cat.name}
                </h3>
                {cat.nameEn && (
                  <p className="text-[10px] sm:text-[11px] text-stone-400 font-['Outfit'] font-medium truncate">
                    {cat.nameEn}
                  </p>
                )}
                <p className="text-[11px] sm:text-xs text-stone-300/90 line-clamp-1 sm:line-clamp-2 leading-relaxed font-['Cairo'] hidden xs:block">
                  {cat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. SIGNATURE BEST PRODUCTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none" id="best-products-preview-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 border-b border-stone-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold font-['Cairo'] text-amber-400 uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'اختيارات الشيف والأعلى تقييماً' : "Chef's Signature Picks"}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-['Cairo'] text-stone-100">
              {language === 'ar' ? 'الأصناف الأفضل والمميزة' : 'Signature Best Sellers'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('best');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold font-['Cairo'] text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition"
          >
            <span>{language === 'ar' ? 'استعراض كل الأصناف المميزة' : 'View All Best Items'}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* Mandatory 2-dish layout on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {bestProducts.map((prod, idx) => (
            <ProductCard key={prod.id} product={prod} onOpenDetails={onOpenProduct} index={idx} />
          ))}
        </div>
      </section>

      {/* 4. HERITAGE & THE ART OF CHARCOAL (قصة العمدة) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none" id="heritage-story-section">
        <div className="relative rounded-3xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border border-amber-500/30 p-6 sm:p-12 overflow-hidden shadow-2xl">
          
          {/* Ambient light glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <ChefHat className="w-4 h-4" />
                <span>{language === 'ar' ? 'سر الشوي على أصوله' : 'The Mastery of Fire & Smoke'}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black font-['Cairo'] text-stone-100 leading-snug">
                {language === 'ar' ? (
                  <>
                    لحوم بلدية طازجة منتقاة بعناية، وتتبيلة معتقة على <span className="text-amber-400">الفحم الطبيعي</span>
                  </>
                ) : (
                  <>
                    Prime fresh meats marinated with ancient heritage over <span className="text-amber-400">natural charcoal</span>
                  </>
                )}
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-['Cairo']">
                {language === 'ar'
                  ? 'في مطعم العمدة، لا نساوم على الجودة. نختار اللحوم البلدية الطازجة يومياً من أفضل المزارع، ونتبلها بمزيج بهاراتنا السرية الخاصة، ثم نشويها على فحم شجر الليمون والبرتقال الطبيعي لتعطيك النكهة المدخنة الأصيلة التي تبقى في الذاكرة.'
                  : 'At AL OMDA, quality is our sacred promise. We handpick fresh prime local meats daily, marinade them in our secret spice formula, and flame-grill them on citrus wood charcoal for an unforgettable smoky flavor.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-800">
                <div className="space-y-1">
                  <div className="text-2xl font-black font-['Cairo'] text-amber-400">100%</div>
                  <div className="text-xs text-stone-400">{language === 'ar' ? 'لحوم بلدية طازجة' : 'Fresh Local Meats'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black font-['Cairo'] text-amber-400">25+</div>
                  <div className="text-xs text-stone-400">{language === 'ar' ? 'سنة خبرة بالشوي' : 'Years Heritage'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black font-['Cairo'] text-amber-400">24/7</div>
                  <div className="text-xs text-stone-400">{language === 'ar' ? 'توصيل ساخن وسريع' : 'Hot & Fresh Delivery'}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
                  alt="AL OMDA Charcoal Grilling"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 inset-x-3 text-center text-xs font-bold text-amber-300 font-['Cairo']">
                  {language === 'ar' ? 'شواء مباشر على الفحم أمام عينك' : 'Live Charcoal Grilling Experience'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
