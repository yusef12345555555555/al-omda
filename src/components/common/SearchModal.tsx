import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Flame, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Product } from '../../types';

interface SearchModalProps {
  onOpenProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onOpenProduct }) => {
  const { isSearchOpen, setIsSearchOpen, products, language } = useStore();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === ''
    ? []
    : products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q))
        );
      });

  const handleSelectProduct = (product: Product) => {
    setIsSearchOpen(false);
    setQuery('');
    onOpenProduct(product);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-stone-950/85 backdrop-blur-xl overflow-y-auto pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-4xl bg-stone-900 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden text-stone-100 my-auto"
        >
          {/* Header & Input */}
          <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
            <Search className="w-6 h-6 text-amber-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'ابحث عن وجبة، كباب، طرب، ريش، صينية، أو سندوتش...'
                  : 'Search for kebabs, tarb, lamb chops, platters, sandwiches...'
              }
              className="w-full bg-transparent text-sm sm:text-lg text-amber-100 placeholder-stone-500 focus:outline-none font-['Cairo']"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-white p-1 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setQuery('');
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold font-['Cairo'] transition shrink-0"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>

          {/* Search suggestions when empty */}
          {query.trim() === '' && (
            <div className="py-6">
              <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                {language === 'ar' ? 'الأكثر بحثاً في مطعم العمدة:' : 'Popular Searches:'}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'ريش ضاني',
                  'طرب العمدة',
                  'صينية ملوك العمدة',
                  'حواوشي ع الفحم',
                  'طاجن عكاوي',
                  'كفتة حاتي',
                  'شيش طاووق',
                ].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-amber-500/20 border border-stone-700/60 hover:border-amber-500/40 text-xs text-stone-300 hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results - 2 products per row on mobile */}
          {query.trim() !== '' && (
            <div className="py-4 max-h-[65vh] overflow-y-auto">
              <div className="text-xs font-bold text-stone-400 mb-3">
                <span>{language === 'ar' ? 'النتائج:' : 'Results:'}</span>{' '}
                <span className="text-amber-400 font-black">{filteredProducts.length}</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <div className="w-12 h-12 mx-auto rounded-full bg-stone-800 flex items-center justify-center text-stone-500 mb-2">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm">
                    {language === 'ar'
                      ? `لم نجد نتائج مطابقة لـ "${query}"`
                      : `No dishes found for "${query}"`}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {language === 'ar' ? 'جرب البحث بكلمة أخرى مثل: كفتة، كباب، طاجن' : 'Try searching for: kebab, kofta, tarb'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {filteredProducts.map((p, idx) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOpenDetails={handleSelectProduct}
                      index={idx}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
