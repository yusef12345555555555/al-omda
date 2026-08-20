import React from 'react';
import { motion } from 'motion/react';
import { Flame, MapPin, Phone, MessageCircle, Clock, ShieldCheck, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SocialMediaCards } from './SocialMediaCards';

export const Footer: React.FC = () => {
  const { settings, language, setCurrentView, categories, setSelectedCategoryId } = useStore();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategoryId(catId);
    setCurrentView('category-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-stone-950 border-t border-amber-500/20 text-stone-300 pt-10 pb-28 md:pb-12 overflow-hidden select-none" id="app-footer">
      
      {/* Ambient background light & rising ember effect */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-amber-600/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-red-600/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ============================================================ */}
        {/* SPLIT FOOTER COMPOSITION: RIGHT SIDE (INFO) | LEFT SIDE (CONTACT & SOCIAL) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-stone-800/80">
          
          {/* ------------------------------------------------------------ */}
          {/* RIGHT SIDE (Lg: 6 cols): RESTAURANT BRAND & LOCATION & HOURS */}
          {/* ------------------------------------------------------------ */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Restaurant Brand Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-['Cairo'] text-amber-400">
                  {language === 'ar' ? settings.restaurantName : settings.restaurantNameEn}
                </h3>
                <span className="text-[11px] text-stone-400 font-['Outfit'] uppercase tracking-wider block font-semibold">
                  TRADITIONAL EGYPTIAN CHARCOAL GRILLS
                </span>
              </div>
            </div>

            {/* Restaurant Bio */}
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-['Cairo'] max-w-lg">
              {language === 'ar' ? settings.footerText : (settings.footerTextEn || settings.footerText)}
            </p>

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400 font-bold font-['Cairo']">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'لحوم بلدية طازجة 100% يومياً بأعلى معايير الجودة' : '100% Fresh Local Meat Daily'}</span>
            </div>

            {/* Address & Hours Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Location Card */}
              <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-stone-200 block mb-0.5 font-['Cairo']">
                    {language === 'ar' ? 'العنوان' : 'Location'}
                  </span>
                  <span className="text-stone-400 font-['Cairo'] leading-snug">
                    {language === 'ar' ? settings.address : (settings.addressEn || settings.address)}
                  </span>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-stone-200 block mb-0.5 font-['Cairo']">
                    {language === 'ar' ? 'مواعيد العمل' : 'Working Hours'}
                  </span>
                  <span className="text-stone-400 font-['Cairo'] leading-snug">
                    {language === 'ar' ? settings.workingHours : (settings.workingHoursEn || settings.workingHours)}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Quick Links */}
            <div className="pt-2">
              <div className="text-xs font-bold text-stone-400 mb-2 font-['Cairo']">
                {language === 'ar' ? 'أقسام المنيو السريعة:' : 'Quick Menu Links:'}
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.filter((c) => c.active).slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.id)}
                    className="px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-amber-500/20 border border-stone-800 hover:border-amber-500/40 text-[11px] font-semibold text-stone-300 hover:text-amber-300 transition font-['Cairo']"
                  >
                    {language === 'ar' ? cat.name : (cat.nameEn || cat.name)}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------------ */}
          {/* LEFT SIDE (Lg: 6 cols): DIRECT WHATSAPP & 3 SOCIAL CARDS */}
          {/* ------------------------------------------------------------ */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* WhatsApp Direct Ordering Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-['Cairo'] text-emerald-300">
                      {language === 'ar' ? 'الطلب والتوصيل المباشر' : 'Direct Order & Delivery'}
                    </h4>
                    <span className="text-[10px] text-stone-400">
                      {language === 'ar' ? 'خدمة توصيل سريعة لجميع المناطق' : 'Fast Delivery Service'}
                    </span>
                  </div>
                </div>
                
                <a
                  href={`tel:${settings.phone}`}
                  className="px-3 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-mono font-bold flex items-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{settings.phone}</span>
                </a>
              </div>

              <p className="text-xs text-stone-300 font-['Cairo'] leading-relaxed">
                {language === 'ar'
                  ? 'تواصل معنا مباشرة عبر واتساب لتأكيد طلبك أو حجز العزومات والصواني الملكية.'
                  : 'Contact us via WhatsApp for instant orders or private catering platters.'}
              </p>

              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs font-['Cairo'] shadow-md flex items-center justify-center gap-2 transition active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-stone-950" />
                <span>{language === 'ar' ? `محادثة فورية على واتساب (${settings.whatsappNumber})` : 'Chat on WhatsApp'}</span>
              </a>
            </div>

            {/* Social Media Section: Exactly 3 Side-by-Side Cards on Mobile & Desktop */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black font-['Cairo'] text-stone-200">
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? 'تابعنا على منصات التواصل:' : 'Follow Our Channels:'}</span>
                </div>
                <span className="text-[10px] text-amber-400/80 font-bold font-['Cairo']">
                  {language === 'ar' ? 'عروض ويوميات حصرية' : 'Exclusive Daily Content'}
                </span>
              </div>

              {/* 3 Side-by-Side Cards */}
              <SocialMediaCards />
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-['Cairo']">
          <p>
            © {new Date().getFullYear()} {language === 'ar' ? settings.restaurantName : settings.restaurantNameEn}. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
          </p>
          <span className="text-[11px] text-stone-600 font-['Outfit']">
            AUTHENTIC EGYPTIAN CHARCOAL CUISINE
          </span>
        </div>

      </div>
    </footer>
  );
};
