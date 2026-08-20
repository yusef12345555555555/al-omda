import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag, Send, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

// ============================================================================
// CART MODAL — يجمع كل الأصناف اللي اختارها العميل، يسمح له يعدّل الكميات،
// ثم يبني رسالة واتساب واحدة مفصّلة بكل الأصناف والإجمالي ويرسلها.
// ============================================================================

export const CartModal: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    settings,
    language,
    logWhatsAppClick,
  } = useStore();

  const [orderType, setOrderType] = useState<'delivery' | 'dinein' | 'takeaway'>('delivery');
  const [locationOrTable, setLocationOrTable] = useState('');
  const [notes, setNotes] = useState('');

  if (!isCartOpen) return null;

  const handleSendOrder = () => {
    if (cart.length === 0) return;
    logWhatsAppClick();

    const cleanNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    let msg = `مرحباً ${settings.restaurantName || 'مطعم العمدة'} 👑\nأود تأكيد الطلب التالي:\n\n`;

    cart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* × ${item.quantity} = ${item.price * item.quantity} ج.م\n`;
    });

    msg += `\n*الإجمالي الكلي:* ${cartTotal} ج.م\n`;

    if (orderType === 'delivery') {
      msg += `\n*نوع الطلب:* توصيل دليفري`;
      if (locationOrTable.trim()) msg += `\n*عنوان التوصيل:* ${locationOrTable.trim()}`;
    } else if (orderType === 'dinein') {
      msg += `\n*نوع الطلب:* داخل الصالة`;
      if (locationOrTable.trim()) msg += `\n*رقم الطاولة:* ${locationOrTable.trim()}`;
    } else {
      msg += `\n*نوع الطلب:* استلام تيك أواي من الفرع`;
    }

    if (notes.trim()) {
      msg += `\n*ملاحظات إضافية:* ${notes.trim()}`;
    }

    msg += `\n\nيرجى تأكيد استلام الطلب وتحديد وقت التوصيل / الاستلام. شكراً لكم!`;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // الطلب اتبعت بالفعل لواتساب، نفضّي السلة ونقفل النافذة
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/85 backdrop-blur-md">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-lg max-h-[88vh] rounded-t-3xl sm:rounded-3xl bg-stone-900 border border-amber-500/25 shadow-2xl text-stone-100 overflow-hidden font-['Cairo'] flex flex-col"
          id="cart-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-100">{language === 'ar' ? 'سلة الطلبات' : 'Your Cart'}</h3>
                <p className="text-[11px] text-stone-400">
                  {cart.length > 0
                    ? language === 'ar'
                      ? `${cart.length} صنف في السلة`
                      : `${cart.length} item(s)`
                    : language === 'ar'
                    ? 'السلة فارغة حالياً'
                    : 'Your cart is empty'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
              id="cart-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2.5">
            {cart.length === 0 ? (
              <div className="py-14 text-center text-stone-500">
                <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">
                  {language === 'ar' ? 'أضف أصنافاً من المنيو لتظهر هنا' : 'Add dishes from the menu to see them here'}
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-950/70 border border-stone-800"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-stone-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-100 truncate">{item.name}</p>
                    <p className="text-[11px] text-amber-400 font-bold mt-0.5">{item.price} ج.م</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center active:scale-90 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center active:scale-90 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                    title={language === 'ar' ? 'إزالة' : 'Remove'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="px-5 pb-5 pt-2 space-y-3 border-t border-stone-800 shrink-0">
              {/* Order Type Tabs */}
              <div className="flex gap-2 pt-3">
                {[
                  { id: 'delivery', labelAr: 'دليفري', labelEn: 'Delivery' },
                  { id: 'takeaway', labelAr: 'تيك أواي', labelEn: 'Takeaway' },
                  { id: 'dinein', labelAr: 'داخل الصالة', labelEn: 'Dine-in' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setOrderType(tab.id as any)}
                    className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold transition ${
                      orderType === tab.id
                        ? 'bg-emerald-500 text-stone-950 shadow-md font-black'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {language === 'ar' ? tab.labelAr : tab.labelEn}
                  </button>
                ))}
              </div>

              {orderType !== 'takeaway' && (
                <input
                  type="text"
                  value={locationOrTable}
                  onChange={(e) => setLocationOrTable(e.target.value)}
                  placeholder={
                    orderType === 'delivery'
                      ? language === 'ar'
                        ? 'عنوان التوصيل بالتفصيل...'
                        : 'Delivery address...'
                      : language === 'ar'
                      ? 'رقم الطاولة...'
                      : 'Table number...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                />
              )}

              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'ar' ? 'ملاحظات إضافية (اختياري)...' : 'Additional notes (optional)...'}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-400"
              />

              {/* Total */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-stone-400 font-semibold">{language === 'ar' ? 'الإجمالي الكلي' : 'Grand Total'}</span>
                <span className="text-xl font-black text-amber-400 text-glow-amber">{cartTotal} ج.م</span>
              </div>

              <motion.button
                type="button"
                onClick={handleSendOrder}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-stone-950 font-black text-sm shadow-[0_10px_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2.5 transition-all"
                id="cart-send-whatsapp-btn"
              >
                <MessageCircle className="w-5 h-5 fill-stone-950" />
                <span>{language === 'ar' ? 'إرسال الطلب عبر واتساب' : 'Send Order via WhatsApp'}</span>
                <Send className="w-4 h-4 rtl:rotate-180" />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
