import React from 'react';
import { motion } from 'motion/react';
import { Layers, ArrowRight, Flame, Sparkles, Utensils } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';

export const CategoriesView: React.FC = () => {
  const { categories, products, setCurrentView, setSelectedCategoryId, logCategoryView, language } = useStore();

  const activeCategories = [...categories]
    .filter((c) => c.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const handleCategorySelect = (cat: Category) => {
    logCategoryView(cat.id);
    setSelectedCategoryId(cat.id);
    setCurrentView('category-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10" id="categories-view-page">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'منيو مطعم العمدة الشامل' : 'AL OMDA Full Menu Portals'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-['Cairo'] text-stone-100">
          {language === 'ar' ? 'أقسام المأكولات والمشويات' : 'Menu Categories'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-['Cairo']">
          {language === 'ar'
            ? 'اختر القسم لتغوص في تجربة نكهات فريدة مع أشهى المشويات والصواني والطواجن الساخنة'
            : 'Explore each culinary portal to discover our flame-roasted delicacies, banquets, and heritage tagines.'}
        </p>
      </div>

      {/* Dynamic Grid of Categories - 2 columns on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {activeCategories.map((cat, idx) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              whileHover={{ y: -6 }}
              onClick={() => handleCategorySelect(cat)}
              className="group relative h-60 sm:h-80 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-stone-800 hover:border-amber-500/60 shadow-2xl transition-all duration-300 flex flex-col justify-between p-3.5 sm:p-6 select-none bg-stone-900"
            >
              {/* Category Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Atmospheric Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20 group-hover:via-stone-950/40 transition-colors" />

              {/* Top Row: Badge & Count */}
              <div className="relative z-10 flex items-center justify-between">
                {cat.badge ? (
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] sm:text-xs font-black font-['Cairo'] shadow-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>{cat.badge}</span>
                  </span>
                ) : (
                  <span />
                )}

                <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-stone-900/80 border border-stone-700/80 text-stone-300 text-[10px] sm:text-xs font-bold font-['Cairo'] backdrop-blur-md">
                  {productCount} {language === 'ar' ? 'أصناف' : 'Dishes'}
                </span>
              </div>

              {/* Bottom Info & Enter Arrow */}
              <div className="relative z-10 space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-2xl font-black font-['Cairo'] text-stone-100 group-hover:text-amber-300 transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-amber-500/20 group-hover:bg-amber-500 text-amber-400 group-hover:text-stone-950 border border-amber-500/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 rtl:rotate-180" />
                  </div>
                </div>

                {cat.nameEn && (
                  <p className="text-[10px] sm:text-xs text-stone-400 font-['Outfit'] -mt-0.5 sm:-mt-1 font-semibold truncate">
                    {cat.nameEn}
                  </p>
                )}

                <p className="text-[11px] sm:text-xs text-stone-300/90 line-clamp-1 sm:line-clamp-2 leading-relaxed font-['Cairo'] hidden xs:block">
                  {cat.description}
                </p>

                <div className="pt-1 sm:pt-2 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-400">
                  <span>{language === 'ar' ? 'استكشف أصناف القسم' : 'Enter Category'}</span>
                  <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
