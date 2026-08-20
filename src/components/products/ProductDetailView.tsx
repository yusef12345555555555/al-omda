import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Heart, Share2, MessageCircle, Clock, Flame, 
  Sparkles, ShieldCheck, Check, ChevronLeft, Award, UtensilsCrossed, ShoppingCart
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';

interface ProductDetailViewProps {
  onOpenProduct?: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = () => {
  const { 
    selectedProductId, 
    products, 
    categories, 
    toggleFavorite, 
    isFavorite, 
    settings, 
    language, 
    setCurrentView,
    setSelectedCategoryId,
    logWhatsAppClick,
    openProductPage,
    addToCart,
    setIsCartOpen
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const category = categories.find((c) => c.id === product?.categoryId);

  const [selectedPortion, setSelectedPortion] = useState<{ name: string; price: number } | null>(
    product?.portionOptions && product.portionOptions.length > 0 ? product.portionOptions[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [customerNotes, setCustomerNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (product?.portionOptions && product.portionOptions.length > 0) {
      setSelectedPortion(product.portionOptions[0]);
    } else {
      setSelectedPortion(null);
    }
    setQuantity(1);
    setCustomerNotes('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product?.id]);

  if (!product) {
    return (
      <div className="py-24 text-center text-stone-400">
        <p>الصنف غير متوفر حالياً</p>
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="mt-4 px-6 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold font-['Cairo']"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const favorited = isFavorite(product.id);
  const currentPrice = selectedPortion ? selectedPortion.price : product.price;
  const totalPrice = currentPrice * quantity;

  // Other dishes from this category (excluding current)
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.available)
    .slice(0, 4);

  const handleBack = () => {
    if (category) {
      setSelectedCategoryId(category.id);
      setCurrentView('category-detail');
    } else {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppOrder = () => {
    logWhatsAppClick();
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    let msg = `مرحباً مطعم العمدة 👑\nأود طلب الصنف التالي:\n\n*الطلب:* ${product.name}\n`;
    if (selectedPortion) {
      msg += `*الحجم/الكمية:* ${selectedPortion.name}\n`;
    }
    msg += `*العدد:* ${quantity}\n*الإجمالي التقريبي:* ${totalPrice} ج.م\n`;
    if (customerNotes.trim()) {
      msg += `*ملاحظات خاصة:* ${customerNotes.trim()}\n`;
    }
    msg += `\nيرجى تأكيد استلام الطلب وتحديد وقت التوصيل / الاستلام. شكراً لكم!`;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    addToCart({ ...product, price: currentPrice }, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleAddToCartAndOpenCart = () => {
    addToCart({ ...product, price: currentPrice }, quantity);
    setIsCartOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${product.name} - مطعم العمدة`,
          text: product.description,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 pb-28 md:pb-20 overflow-hidden select-none" id={`product-page-${product.id}`}>
      
      {/* 1. Dramatic Ambient Lighting & Spotlight Background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb & Back Action */}
        <div className="flex items-center justify-between gap-2 mb-6 sm:mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-400 font-bold text-xs sm:text-sm font-['Cairo'] transition-all shadow-md active:scale-95"
            id="product-back-btn"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
            <span>{category ? (language === 'ar' ? `العودة إلى ${category.name}` : `Back to ${category.nameEn || category.name}`) : (language === 'ar' ? 'العودة للمنيو' : 'Back')}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-400 transition shadow-md active:scale-90"
              title="مشاركة الصنف"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              className={`p-2.5 rounded-2xl border transition-all duration-300 shadow-md active:scale-90 ${
                favorited
                  ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : 'bg-stone-900/90 text-stone-300 hover:text-rose-400 border-stone-800'
              }`}
              title={favorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2. Main Hero Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ============================================================ */}
          {/* Col Left (Lg: 6): REALISTIC SERVING PLATTER HERO PRESENTATION */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[380px] sm:max-w-[460px] aspect-square flex items-center justify-center"
            >
              {/* Radial Base Shadow beneath the Platter */}
              <div className="absolute inset-6 rounded-full bg-stone-950/90 blur-2xl -bottom-4 pointer-events-none transform scale-95" />
              
              {/* Glowing Charcoal Ember Aura */}
              <motion.div
                animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.6, 0.35] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-4 rounded-full bg-gradient-to-tr from-amber-600/20 via-orange-500/15 to-transparent blur-3xl pointer-events-none"
              />

              {/* Cast Iron / Royal Ceramic Serving Platter Outer Rim */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 border-4 sm:border-[6px] border-amber-500/30 p-3 sm:p-4 shadow-[0_25px_50px_rgba(0,0,0,0.95),inset_0_4px_8px_rgba(255,255,255,0.12)] flex items-center justify-center overflow-hidden">
                
                {/* Platter Rim Glint Highlight */}
                <div className="absolute inset-x-8 top-3 h-[3px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent rounded-full pointer-events-none" />

                {/* Inner Food Mask */}
                <div className="relative w-full h-full rounded-full overflow-hidden bg-stone-950 border border-stone-800 shadow-inner">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-full object-cover"
                  />

                  {/* Atmospheric Depth Gradient */}
                  <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none" />

                  {/* Moving Light Glint Sweep */}
                  <motion.div
                    animate={{ x: ['-200%', '300%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                  />
                </div>

                {/* Rising Steam Puffs Animation */}
                <motion.div
                  animate={{ y: [0, -40], opacity: [0, 0.4, 0], scale: [0.8, 1.3] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute top-4 left-1/3 w-16 h-24 bg-gradient-to-t from-stone-200/20 to-transparent blur-md rounded-full pointer-events-none"
                />
              </div>

              {/* Badges on Platter Corner */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
                {product.isBest && (
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 text-xs font-black font-['Cairo'] shadow-lg flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 text-stone-950" />
                    <span>{language === 'ar' ? 'توقيع العمدة' : "Omda's Best"}</span>
                  </motion.span>
                )}
                {product.tag && (
                  <span className="px-3 py-1 rounded-full bg-stone-900/90 border border-amber-500/40 text-amber-300 text-xs font-bold font-['Cairo'] shadow-md flex items-center gap-1 backdrop-blur-md">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{product.tag}</span>
                  </span>
                )}
              </div>
            </motion.div>

            {/* Quick Specs Pill */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
              {product.prepTime && (
                <div className="px-3.5 py-1.5 rounded-xl bg-stone-900/80 border border-stone-800 text-xs font-semibold text-stone-300 flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? `وقت التحضير: ${product.prepTime}` : `Prep: ${product.prepTime}`}</span>
                </div>
              )}
              {product.calories && (
                <div className="px-3.5 py-1.5 rounded-xl bg-stone-900/80 border border-stone-800 text-xs font-semibold text-stone-300 flex items-center gap-1.5 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{product.calories} {language === 'ar' ? 'سعر حراري' : 'kcal'}</span>
                </div>
              )}
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'لحوم بلدية طازجة 100%' : '100% Fresh Local Meat'}</span>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* Col Right (Lg: 6): PRODUCT DETAILS, PORTIONS & WHATSAPP ORDER */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              {/* Category Tag Link */}
              {category && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setCurrentView('category-detail');
                  }}
                  className="text-xs font-black font-['Cairo'] text-amber-400 uppercase tracking-wider mb-2 hover:underline inline-flex items-center gap-1.5"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? category.name : (category.nameEn || category.name)}</span>
                </button>
              )}

              {/* Product Title */}
              <h1 className="text-2xl sm:text-4xl font-black font-['Cairo'] text-stone-100 leading-tight">
                {product.name}
              </h1>

              {product.nameEn && (
                <p className="text-sm sm:text-base text-stone-400 font-['Outfit'] font-medium mt-1">
                  {product.nameEn}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-['Cairo']">
                {product.description}
              </p>
            </div>

            {/* Portion Options Selector (if available) */}
            {product.portionOptions && product.portionOptions.length > 0 && (
              <div>
                <label className="block text-xs font-bold font-['Cairo'] text-amber-400 uppercase tracking-wider mb-2.5">
                  {language === 'ar' ? 'اختر الحجم أو الوزن:' : 'Select Portion / Size:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {product.portionOptions.map((opt) => {
                    const isSelected = selectedPortion?.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setSelectedPortion(opt)}
                        className={`p-3 rounded-2xl border text-right sm:text-center transition-all duration-300 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.02]'
                            : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <span className="text-xs font-black font-['Cairo'] truncate">{opt.name}</span>
                        <span className="text-sm font-black font-['Cairo'] text-amber-400 mt-1">
                          {opt.price} ج.م
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Request / Notes */}
            <div>
              <label className="block text-xs font-bold font-['Cairo'] text-stone-300 mb-1.5">
                {language === 'ar' ? 'ملاحظات خاصة للطلب (اختياري):' : 'Special Notes (Optional):'}
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: تسوية زيادة، طحينة إضافية، بدون بصل...' : 'e.g. well done, extra tahini...'}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50 font-['Cairo']"
              />
            </div>

            {/* Quantity & Grand Total Price Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold font-['Cairo'] text-stone-400">
                  {language === 'ar' ? 'الكمية:' : 'Qty:'}
                </span>
                <div className="flex items-center bg-stone-950 border border-stone-700 rounded-xl overflow-hidden p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-base active:scale-90 transition"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black font-['Cairo'] text-stone-100 text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-base active:scale-90 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="text-center sm:text-left flex flex-col">
                <span className="text-[10px] text-stone-400 font-semibold uppercase">
                  {language === 'ar' ? 'الإجمالي' : 'Total'}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black font-['Cairo'] text-amber-400 text-glow-amber">
                    {totalPrice}
                  </span>
                  <span className="text-xs font-bold text-amber-500">
                    {language === 'ar' ? 'جنيه مصري' : 'EGP'}
                  </span>
                </div>
              </div>

            </div>

            {/* Add to Cart + Direct WhatsApp Order CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <motion.button
                type="button"
                onClick={handleAddToCartAndOpenCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3.5 sm:py-4 px-6 rounded-2xl font-black text-sm sm:text-base font-['Cairo'] shadow-lg flex items-center justify-center gap-2.5 transition-all duration-300 border ${
                  justAdded
                    ? 'bg-amber-500 border-amber-400 text-stone-950'
                    : 'bg-amber-500/10 hover:bg-amber-500 border-amber-500/40 text-amber-400 hover:text-stone-950'
                }`}
                id="product-add-to-cart-btn"
              >
                {justAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                <span>{justAdded ? (language === 'ar' ? 'تمت الإضافة للسلة!' : 'Added to Cart!') : (language === 'ar' ? 'أضف للسلة' : 'Add to Cart')}</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={handleWhatsAppOrder}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-500 text-stone-950 font-black text-sm sm:text-base font-['Cairo'] shadow-[0_10px_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2.5 transition-all duration-300"
                id="product-wa-order-btn"
              >
                <MessageCircle className="w-5 h-5 fill-stone-950" />
                <span>{language === 'ar' ? `اطلب هذا الصنف فقط (${totalPrice} ج.م)` : `Order this only (${totalPrice} EGP)`}</span>
              </motion.button>
            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* 3. RELATED DISHES IN SAME CATEGORY (MANDATORY 2 DISHES ON MOBILE) */}
        {/* ============================================================ */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 border-t border-stone-800 pt-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold font-['Cairo'] text-amber-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'أصناف قد تعجبك' : 'You May Also Like'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-['Cairo'] text-stone-100">
                  {language === 'ar' ? `أشهى أطباق ${category?.name || 'القسم'}` : 'More from this category'}
                </h2>
              </div>

              {category && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setCurrentView('category-detail');
                  }}
                  className="text-xs sm:text-sm font-bold font-['Cairo'] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
                  <span className="rtl:rotate-180">→</span>
                </button>
              )}
            </div>

            {/* Mandatory 2-dish layout on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map((prod, idx) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenDetails={() => openProductPage(prod.id)}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
