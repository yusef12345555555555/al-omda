import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MessageCircle, ArrowRight, Layers, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Product } from '../../types';

interface FavoritesViewProps {
  onOpenProduct: (product: Product) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onOpenProduct }) => {
  const { favorites, products, setCurrentView, logWhatsAppClick, settings, language } = useStore();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const totalFavoritePrice = favoriteProducts.reduce((acc, p) => acc + p.price, 0);

  const handleOrderAllFavorites = () => {
    if (favoriteProducts.length === 0) return;
    logWhatsAppClick();
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    let msg = `❤️ *طلب قائمة المفضلة من منيو مطعم العمدة*\n\n`;
    favoriteProducts.forEach((p, idx) => {
      msg += `${idx + 1}. *${p.name}* - ${p.price} ج.م\n`;
    });
    msg += `\n• *الإجمالي التقديري:* ${totalFavoritePrice} ج.م`;
    msg += `\nيرجى تجهيز وتأكيد الطلب. شكراً لكم!`;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10" id="favorites-page">
      
      {/* Header with Velvet Warmth */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold shadow-lg shadow-rose-500/10">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>{language === 'ar' ? 'قائمة اختياراتك المفضلة' : 'Your Personal Favorites'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-['Cairo'] text-stone-100">
          {language === 'ar' ? 'الأصناف المفضلة لديك' : 'Saved Favorite Dishes'}
        </h1>

        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-['Cairo']">
          {language === 'ar'
            ? 'احفظ أطباقك المفضلة هنا للرجوع إليها سريعاً أو لطلبها معاً دفعة واحدة عبر واتساب.'
            : 'Bookmark your favorite meals here for quick access and multi-item ordering via WhatsApp.'}
        </p>

        {/* Order All Button if favorites exist */}
        {favoriteProducts.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOrderAllFavorites}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 font-['Cairo']"
            >
              <MessageCircle className="w-4 h-4 text-stone-950" />
              <span>
                {language === 'ar'
                  ? `طلب جميع الأصناف المفضلة عبر واتساب (${totalFavoritePrice} ج.م)`
                  : `Order All Favorites on WhatsApp (${totalFavoritePrice} EGP)`}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State - Mandatory 2-dish layout on mobile */}
      {favoriteProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto py-16 px-6 rounded-3xl bg-stone-900/60 border border-stone-800 text-center space-y-4 backdrop-blur-md shadow-2xl"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2">
            <Heart className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold font-['Cairo'] text-stone-200">
            {language === 'ar' ? 'قائمتك المفضلة فارغة حالياً' : 'No Favorites Saved Yet'}
          </h3>

          <p className="text-xs text-stone-400 leading-relaxed font-['Cairo']">
            {language === 'ar'
              ? 'تصفح أقسام المنيو واضغط على علامة القلب ❤️ على أي صنف لإضافته إلى قائمتك الخاصة.'
              : 'Browse our culinary menu and tap the heart icon on any dish to save it here.'}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setCurrentView('categories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs font-['Cairo'] shadow-lg hover:bg-amber-400 transition"
            >
              <Layers className="w-4 h-4" />
              <span>{language === 'ar' ? 'تصفح أقسام المنيو' : 'Explore Categories'}</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <AnimatePresence>
            {favoriteProducts.map((prod, idx) => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: 15, transition: { duration: 0.25 } }}
              >
                <ProductCard product={prod} onOpenDetails={onOpenProduct} index={idx} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
};
