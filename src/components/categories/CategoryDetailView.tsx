import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Flame, Sparkles, Filter, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { CategoryAtmosphere } from './CategoryAtmosphere';
import { Product } from '../../types';

interface CategoryDetailViewProps {
  onOpenProduct: (product: Product) => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ onOpenProduct }) => {
  const { categories, products, selectedCategoryId, setCurrentView, setSelectedCategoryId, language } = useStore();
  
  const category = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const [filterMode, setFilterMode] = useState<'all' | 'best' | 'available'>('all');

  const categoryProducts = products.filter((p) => {
    if (p.categoryId !== category.id) return false;
    if (filterMode === 'best') return p.isBest;
    if (filterMode === 'available') return p.available;
    return true;
  });

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setCurrentView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative space-y-8 sm:space-y-12 pb-16 min-h-screen overflow-hidden" id={`category-detail-page-${category?.id}`}>
      
      {/* Category Thematic Animated World (Grills skewers, Sandwiches drifts, Platters depth, Mixes layers) */}
      <CategoryAtmosphere category={category} />

      {/* Category Cinematic Entrance Header */}
      <section className="relative min-h-[40vh] sm:min-h-[48vh] flex items-end pb-8 sm:pb-12 pt-12 rounded-b-3xl overflow-hidden border-b border-amber-500/30 z-10">
        
        {/* Background Image / Atmosphere */}
        <div className="absolute inset-0 z-0">
          <img
            src={category.background || category.image}
            alt={category.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-105 animate-pulse-glow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* Back button */}
          <button
            type="button"
            onClick={handleBackToCategories}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 border border-stone-700/80 text-stone-300 text-xs font-bold font-['Cairo'] transition mb-6 shadow-md backdrop-blur-md"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
            <span>{language === 'ar' ? 'العودة لجميع الأقسام' : 'Back to Categories'}</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              {category.badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-black font-['Cairo'] shadow-md">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{category.badge}</span>
                </span>
              )}

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Cairo'] text-stone-100 text-glow-amber">
                {category.name}
              </h1>

              {category.nameEn && (
                <p className="text-sm sm:text-base text-stone-400 font-['Outfit'] font-semibold">
                  {category.nameEn}
                </p>
              )}

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-['Cairo'] pt-1">
                {category.description}
              </p>
            </div>

            {/* Quick Switch to other categories */}
            <div className="flex flex-wrap gap-2">
              {categories.filter((c) => c.active).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Cairo'] border transition-all ${
                    c.id === category.id
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar & Product Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-400">
            <span>{language === 'ar' ? 'عرض الأصناف:' : 'Showing Dishes:'}</span>
            <span className="text-amber-400 font-black">{categoryProducts.length}</span>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All Dishes' },
              { id: 'best', labelAr: 'الأكثر تميزاً ⭐', labelEn: 'Best Sellers' },
              { id: 'available', labelAr: 'المتاح للطلب فوراً', labelEn: 'Available Now' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterMode(f.id as typeof filterMode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Cairo'] border transition-all ${
                  filterMode === f.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {language === 'ar' ? f.labelAr : f.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid or Empty State - 2 dishes on mobile */}
        {categoryProducts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-stone-900/40 border border-dashed border-stone-800 p-8 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
              <Flame className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold font-['Cairo'] text-stone-200">
              {language === 'ar' ? 'قريبًا... نجهز لكم شيئًا مميزًا' : 'Coming Soon... Preparing Something Special'}
            </h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed font-['Cairo']">
              {language === 'ar'
                ? ' مطعم العمدة يعمل حالياً على تجهيز هذه الوصفات وإضافتها للمنيو بأعلى مقاييس الجودة.'
                : 'Our master chefs are currently preparing these signature recipes to add to the menu.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {categoryProducts.map((prod, idx) => (
              <ProductCard key={prod.id} product={prod} onOpenDetails={onOpenProduct} index={idx} />
            ))}
          </div>
        )}

      </section>

    </div>
  );
};
