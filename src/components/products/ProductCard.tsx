import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Flame, Sparkles, ShoppingCart, Check, Eye, Clock, XCircle, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails, index = 0 }) => {
  const { toggleFavorite, isFavorite, logProductClick, addToCart, settings, language } = useStore();
  const favorited = isFavorite(product.id);
  const [isTapped, setIsTapped] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Staggered distinct animation settings for Left vs Right dishes
  const isEven = index % 2 === 0;
  const floatDuration = isEven ? 4.2 : 5.1;
  const floatDelay = isEven ? 0.2 : 1.4;

  const handleCardClick = () => {
    setIsTapped(true);
    logProductClick(product.id);
    setTimeout(() => {
      onOpenDetails(product);
      setIsTapped(false);
    }, 160);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={handleCardClick}
      className={`group relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-stone-900/90 via-stone-900/70 to-stone-950/95 border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between select-none ${
        product.isBest
          ? 'border-amber-500/40 shadow-[0_8px_25px_-5px_rgba(245,158,11,0.22)] hover:border-amber-400'
          : 'border-stone-800/90 hover:border-amber-500/40 shadow-xl'
      } ${!product.available ? 'opacity-75 grayscale-[0.25]' : ''}`}
      id={`product-dish-${product.id}`}
    >
      {/* 1. Cinematic Spotlight Ambient Glow behind the Dish */}
      <div 
        className={`absolute -top-12 -inset-x-6 h-36 rounded-full pointer-events-none blur-2xl transition-opacity duration-700 ${
          product.isBest 
            ? 'bg-amber-500/15 group-hover:bg-amber-500/25' 
            : 'bg-stone-700/10 group-hover:bg-amber-500/15'
        }`} 
      />

      {/* 2. Top Bar: Badges & Favorite Button */}
      <div className="relative z-20 pt-2.5 px-2.5 sm:pt-3 sm:px-3 flex items-start justify-between gap-1 pointer-events-none">
        <div className="flex flex-col gap-1">
          {product.isBest && (
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 text-[10px] sm:text-xs font-black font-['Cairo'] shadow-md flex items-center gap-1 leading-tight"
            >
              <Award className="w-3 h-3 text-stone-950 shrink-0" />
              <span className="truncate">{language === 'ar' ? 'الأفضل' : 'Best'}</span>
            </motion.span>
          )}
          {product.tag && (
            <span className="px-2 py-0.5 rounded-full bg-stone-900/90 border border-amber-500/40 text-amber-300 text-[9px] sm:text-[11px] font-bold font-['Cairo'] shadow-sm flex items-center gap-1 backdrop-blur-md">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
              <span className="truncate">{product.tag}</span>
            </span>
          )}
        </div>

        {/* Favorite Heart Button with touch feedback */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`pointer-events-auto p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-300 active:scale-75 shadow-md ${
            favorited
              ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] scale-105'
              : 'bg-stone-900/80 border border-stone-700/60 text-stone-300 hover:text-rose-400 hover:bg-stone-800'
          }`}
          title={favorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          id={`fav-btn-${product.id}`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${favorited ? 'fill-white scale-110' : ''}`} />
        </button>
      </div>

      {/* 3. REALISTIC SERVING DISH / PLATE PRESENTATION STAGE */}
      <div className="relative w-full px-2 sm:px-3 pt-1 pb-2 flex items-center justify-center">
        
        {/* Realistic Plate Outer Rim Shadow */}
        <motion.div
          animate={
            isEven
              ? { y: [0, -4, 0], rotate: [-0.4, 0.4, -0.4] }
              : { scale: [1, 1.02, 1], rotate: [0.4, -0.4, 0.4] }
          }
          transition={{
            duration: floatDuration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: floatDelay,
          }}
          className="relative w-full aspect-[4/3] max-w-[220px] sm:max-w-none flex items-center justify-center"
        >
          {/* Cast Iron / Stoneware Charcoal Platter Rim Base */}
          <div className="absolute inset-1 sm:inset-1.5 rounded-full sm:rounded-[2rem] bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 border border-amber-500/25 shadow-[0_12px_24px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.08)] transform group-hover:scale-[1.03] transition-transform duration-500" />

          {/* Realistic Rim Glint / Lighting Highlight */}
          <div className="absolute inset-x-4 top-2 h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none rounded-full" />

          {/* Food Dish Image Mask with realistic inner shadow */}
          <div className="relative w-[90%] h-[90%] rounded-full sm:rounded-[1.6rem] overflow-hidden bg-stone-950 border border-stone-800/80 shadow-inner">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Cinematic Radial Depth Gradient */}
            <div className="absolute inset-0 bg-radial-vignette opacity-50 group-hover:opacity-30 transition-opacity" />

            {/* Continuous Light Glint across Dish */}
            <motion.div
              animate={{
                x: isEven ? ['-150%', '200%'] : ['200%', '-150%'],
              }}
              transition={{
                duration: isEven ? 6 : 7.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: isEven ? 1 : 3.5,
              }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none"
            />

            {/* Unavailable Overlay */}
            {!product.available && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-[2px] flex items-center justify-center p-2 text-center">
                <span className="px-2 py-1 rounded-lg bg-rose-950/90 border border-rose-500/50 text-rose-300 font-bold text-[10px] font-['Cairo'] flex items-center gap-1">
                  <XCircle className="w-3 h-3 shrink-0" />
                  <span className="truncate">{language === 'ar' ? 'غير متاح' : 'Unavailable'}</span>
                </span>
              </div>
            )}
          </div>

          {/* Prep time badge on plate edge */}
          {product.prepTime && (
            <div className="absolute -bottom-1 inset-x-0 flex justify-center pointer-events-none">
              <span className="px-2 py-0.5 rounded-md bg-stone-950/90 border border-stone-800 text-[9px] sm:text-[10px] text-stone-300 font-medium flex items-center gap-1 shadow-md">
                <Clock className="w-2.5 h-2.5 text-amber-400" />
                <span>{product.prepTime}</span>
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* 4. Product Details & High-Contrast Typography */}
      <div className="p-2.5 sm:p-4 pt-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Dish Name */}
          <h3 className="font-bold text-xs sm:text-base font-['Cairo'] text-stone-100 group-hover:text-amber-400 transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>

          {/* English Name (hidden or tiny on small mobile for density) */}
          {product.nameEn && (
            <p className="text-[10px] sm:text-[11px] text-stone-400 font-['Outfit'] truncate -mt-0.5">
              {product.nameEn}
            </p>
          )}

          {/* Description snippet */}
          <p className="text-[10px] sm:text-xs text-stone-400 line-clamp-1 sm:line-clamp-2 leading-relaxed mt-1 hidden xs:block">
            {product.description}
          </p>
        </div>

        {/* 5. Footer: Price & Direct Actions */}
        <div className="pt-2 sm:pt-3 mt-1.5 sm:mt-2 border-t border-stone-800/80 flex items-center justify-between gap-1">
          {/* Price Tag */}
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] text-stone-400 font-semibold leading-none">
              {language === 'ar' ? 'السعر' : 'Price'}
            </span>
            <div className="flex items-baseline gap-0.5 sm:gap-1 mt-0.5">
              <span className="text-sm sm:text-lg font-black font-['Cairo'] text-amber-400 text-glow-amber leading-none">
                {product.price}
              </span>
              <span className="text-[9px] sm:text-[11px] font-bold text-amber-500 leading-none">
                {language === 'ar' ? 'ج.م' : 'EGP'}
              </span>
            </div>
          </div>

          {/* Action Buttons: Quick WhatsApp & View Details */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.available}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center active:scale-90 ${
                !product.available
                  ? 'bg-stone-800 text-stone-600 cursor-not-allowed border border-stone-800'
                  : justAdded
                  ? 'bg-emerald-500 text-stone-950 border border-emerald-400 shadow-md'
                  : 'bg-emerald-600/20 hover:bg-emerald-500 hover:text-stone-950 text-emerald-400 border border-emerald-500/30 shadow-sm'
              }`}
              title={language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
              id={`cart-add-${product.id}`}
            >
              {justAdded ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            <button
              type="button"
              onClick={handleCardClick}
              className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-stone-950 border border-amber-500/30 text-[10px] sm:text-xs font-bold font-['Cairo'] transition-all duration-300 flex items-center gap-1 active:scale-95"
              id={`details-btn-${product.id}`}
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">{language === 'ar' ? 'التفاصيل' : 'Details'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
