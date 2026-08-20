import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Sparkles, Flame, Star, Utensils } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Product } from '../../types';

interface BestProductsViewProps {
  onOpenProduct: (product: Product) => void;
}

export const BestProductsView: React.FC<BestProductsViewProps> = ({ onOpenProduct }) => {
  const { products, categories, language } = useStore();
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');

  const bestProducts = products.filter((p) => {
    if (!p.isBest) return false;
    if (selectedCatFilter !== 'all' && p.categoryId !== selectedCatFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10" id="best-products-page">
      
      {/* Header with Spotlight Atmosphere */}
      <div className="relative text-center space-y-4 max-w-3xl mx-auto py-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-amber-600/30 border border-amber-500/50 text-amber-300 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)]">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{language === 'ar' ? 'توقيع الشيف والأعلى طلباً' : 'Signature Chef Selections'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Cairo'] text-stone-100 text-glow-gold">
          {language === 'ar' ? 'الأصناف الأفضل في مطعم العمدة' : 'Best Products & Signature Grills'}
        </h1>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-['Cairo'] max-w-xl mx-auto">
          {language === 'ar'
            ? 'مجموعة منتقاة من أشهى أطباق المشويات، الصواني الملوكية، والطواجن التي حازت على إعجاب وتقدير ضيوفنا الكرام.'
            : 'A curated ensemble of our most celebrated charcoal-grilled feasts, royal platters, and authentic masterpieces.'}
        </p>

        {/* Category filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setSelectedCatFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Cairo'] border transition-all ${
              selectedCatFilter === 'all'
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {language === 'ar' ? 'جميع الأفضل' : 'All Best Items'}
          </button>
          {categories.filter((c) => c.active).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCatFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Cairo'] border transition-all ${
                selectedCatFilter === cat.id
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Best Products - Mandatory 2-dish layout on mobile */}
      {bestProducts.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-sm font-semibold">{language === 'ar' ? 'لا توجد أصناف في هذا التصنيف حالياً' : 'No items found'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestProducts.map((prod, idx) => (
            <ProductCard key={prod.id} product={prod} onOpenDetails={onOpenProduct} index={idx} />
          ))}
        </div>
      )}

    </div>
  );
};
