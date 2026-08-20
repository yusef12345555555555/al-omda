import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WhatsAppWidget: React.FC = () => {
  const { settings, logWhatsAppClick, language, currentView, cart, cartCount, setIsCartOpen } = useStore();
  const [bubbleState, setBubbleState] = useState<'hidden' | 'emerging' | 'visible' | 'dissolving'>('hidden');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'dinein' | 'takeaway'>('delivery');
  const [locationOrTable, setLocationOrTable] = useState('');

  // Hide completely inside Admin dashboard
  if (currentView === 'admin') return null;

  const handleMainButtonClick = () => {
    // لو في أصناف بالسلة بالفعل، افتح مراجعة السلة مباشرة (بدل نافذة استفسار عامة)
    if (cart.length > 0) {
      setIsCartOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // 5-Second Water Drop Choreography Loop
  useEffect(() => {
    let timeout1: any;
    let timeout2: any;
    let timeout3: any;

    const runWaterDropCycle = () => {
      // 1. Drop emerges & rises
      setBubbleState('emerging');

      // 2. Drop expands into elegant text bubble "اطلب الآن"
      timeout1 = setTimeout(() => {
        setBubbleState('visible');
      }, 500);

      // 3. Text stays for 2.2 seconds then dissolves
      timeout2 = setTimeout(() => {
        setBubbleState('dissolving');
      }, 2700);

      // 4. Returns to small button
      timeout3 = setTimeout(() => {
        setBubbleState('hidden');
      }, 3200);
    };

    // Run first cycle shortly after load
    const initialTimer = setTimeout(runWaterDropCycle, 2000);
    // Repeat every 5 seconds
    const interval = setInterval(runWaterDropCycle, 5200);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  const handleOpenDirectWhatsApp = (messageOverride?: string) => {
    logWhatsAppClick();
    const cleanNumber = (settings.whatsappNumber || '+201012345678').replace(/[^0-9]/g, '');
    let defaultMsg = `مرحباً مطعم العمدة، أود الاستفسار والطلب من المنيو الرقمي.`;
    
    if (orderType === 'delivery' && locationOrTable) {
      defaultMsg += `\n- نوع الطلب: دليفري توصيل\n- العنوان: ${locationOrTable}`;
    } else if (orderType === 'dinein' && locationOrTable) {
      defaultMsg += `\n- نوع الطلب: داخل الصالة\n- رقم الطاولة: ${locationOrTable}`;
    } else if (orderType === 'takeaway') {
      defaultMsg += `\n- نوع الطلب: استلام تيك أواي من الفرع`;
    }

    if (customNote) {
      defaultMsg += `\n- ملاحظات الطلب: ${customNote}`;
    }

    const textToSend = messageOverride || defaultMsg;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Small, discreet & elegant WhatsApp Button with 5s Liquid Drop */}
      <div
        className="fixed bottom-20 md:bottom-7 start-4 md:start-7 z-40 flex flex-col items-start select-none"
        id="whatsapp-small-widget"
      >
        {/* Emerging Water Drop / Text Bubble */}
        <AnimatePresence>
          {(bubbleState === 'emerging' || bubbleState === 'visible') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.2, y: 15 }}
              animate={
                bubbleState === 'emerging'
                  ? { opacity: 0.9, scale: [0.3, 0.7, 0.9], y: [10, 2, -4] }
                  : { opacity: 1, scale: 1, y: -6 }
              }
              exit={{ opacity: 0, scale: 0.6, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="mb-1.5 ms-1 relative"
            >
              {/* Liquid glowing drop tail */}
              <div className="absolute -bottom-1.5 start-4 w-2.5 h-2.5 bg-emerald-500/90 rotate-45 rounded-xs pointer-events-none" />

              {/* Elegant Text Bubble */}
              <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-black font-['Cairo'] shadow-[0_4px_15px_rgba(16,185,129,0.4)] border border-emerald-300/30 flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>{language === 'ar' ? (settings.whatsappCta || 'اطلب الآن') : (settings.whatsappCtaEn || 'Order Now')}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small Discreet WhatsApp Button */}
        <button
          type="button"
          onClick={handleMainButtonClick}
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.55)] border border-emerald-400/40 hover:scale-108 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer"
          aria-label="WhatsApp Contact"
          title={language === 'ar' ? 'طلب فوري عبر واتساب' : 'WhatsApp Order'}
        >
          {/* Subtle glowing ring */}
          <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm pointer-events-none" />

          {/* Icon */}
          <MessageCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white drop-shadow-sm" />

          {/* Cart items badge (if any items waiting) */}
          {cartCount > 0 ? (
            <span className="absolute -top-1.5 -end-1.5 min-w-[19px] h-[19px] px-1 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black flex items-center justify-center border-2 border-stone-950">
              {cartCount}
            </span>
          ) : (
            <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-amber-400 border border-stone-900 animate-pulse" />
          )}
        </button>
      </div>

      {/* Interactive Quick-Order WhatsApp Tray Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-emerald-500/30 p-6 shadow-2xl text-stone-100 overflow-hidden font-['Cairo']"
            >
              {/* Ambient Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-100 text-sm">
                      {language === 'ar' ? 'طلب مباشر عبر واتساب' : 'Direct WhatsApp Order'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      {language === 'ar' ? 'تواصل فوري مع طاقم خدمة العملاء' : 'Instant connection with support staff'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Options */}
              <div className="py-4 space-y-3.5">
                {/* Order Type Tabs */}
                <div className="flex gap-2">
                  {[
                    { id: 'delivery', labelAr: 'توصيل دليفري', labelEn: 'Delivery' },
                    { id: 'takeaway', labelAr: 'استلام تيك أواي', labelEn: 'Takeaway' },
                    { id: 'dinein', labelAr: 'داخل الصالة', labelEn: 'Dine-in' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setOrderType(tab.id as any)}
                      className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition ${
                        orderType === tab.id
                          ? 'bg-emerald-500 text-stone-950 shadow-md font-black'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {language === 'ar' ? tab.labelAr : tab.labelEn}
                    </button>
                  ))}
                </div>

                {/* Location / Table Input */}
                {orderType !== 'takeaway' && (
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      {orderType === 'delivery'
                        ? language === 'ar' ? 'عنوان التوصيل بالتفصيل:' : 'Delivery Address:'
                        : language === 'ar' ? 'رقم الطاولة في المطعم:' : 'Table Number:'}
                    </label>
                    <input
                      type="text"
                      value={locationOrTable}
                      onChange={(e) => setLocationOrTable(e.target.value)}
                      placeholder={
                        orderType === 'delivery'
                          ? language === 'ar' ? 'مثال: التجمع الخامس، الحي الثاني، عمارة 14' : 'e.g. 5th Settlement, Bldg 14'
                          : language === 'ar' ? 'مثال: طاولة رقم 5' : 'e.g. Table 5'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                )}

                {/* Custom Note */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    {language === 'ar' ? 'الأصناف أو الملاحظات المطلوبة:' : 'Requested Dishes or Notes:'}
                  </label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب ما تشتهيه أو أسماء الأصناف من المنيو...' : 'Write dishes or special requests...'}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-800/90 border border-stone-700 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenDirectWhatsApp()}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <Send className="w-4 h-4 rtl:rotate-180" />
                  <span>{language === 'ar' ? 'إرسال المحادثة لواتساب الآن' : 'Start WhatsApp Chat'}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
