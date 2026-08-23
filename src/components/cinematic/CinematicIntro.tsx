import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CinematicIntroProps {
  onComplete?: () => void;
}

// ============================================================================
// إنترو سينمائي مختصر (≈ 2.6 ثانية) لمطعم العمدة.
// طبقات بصرية متعددة (إضاءة + دخان شواء + جسيمات + خط ذهبي + تايبوجرافي)
// لكن بدون إفراط: انتقالات سلسة، بدون صوت، وبدون أي عملية رسم ثقيلة على المعالج
// (كل الحركة عبار عن transform/opacity فقط لتبقى سريعة وسلسة على الموبايل).
// الاسم والشعار والوسم الفرعي يُقرأون من إعدادات الأدمن (settings) مباشرة.
// ============================================================================

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const { settings, language } = useStore();
  const [stage, setStage] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleFinish = () => {
    setIsVisible(false);
    onComplete?.();
  };

  useEffect(() => {
    // المرحلة 1: استيقاظ بصري — ضوء خافت يدخل المشهد (0.25s)
    const t1 = setTimeout(() => setStage(1), 250);
    // المرحلة 2: دخان الشواء + الشرارات تتصاعد حول الشعار (0.6s)
    const t2 = setTimeout(() => setStage(2), 600);
    // المرحلة 3: ظهور الشعار والاسم (1.1s)
    const t3 = setTimeout(() => setStage(3), 1100);
    // المرحلة 4: خط الضوء الذهبي يعبر الشاشة + الوسم الفرعي (1.9s)
    const t4 = setTimeout(() => setStage(4), 1900);
    // المرحلة 5: تلاشي إلى الموقع (2.6s)
    const t5 = setTimeout(() => handleFinish(), 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.06,
          filter: 'blur(6px)',
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950 overflow-hidden cursor-pointer select-none"
        onClick={handleFinish}
        id="cinematic-intro-screen"
      >
        {/* الطبقة 1: خلفية متدرجة داكنة (عمق) */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/90 to-stone-950 pointer-events-none" />

        {/* الطبقة 2: توهج ناري مركزي نابض (عمق + إضاءة) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: stage >= 1 ? [0.25, 0.6, 0.35] : 0,
            scale: [1, 1.25, 1.1],
          }}
          transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
          className="absolute w-[640px] h-[640px] rounded-full bg-radial from-amber-600/30 via-orange-600/15 to-transparent blur-3xl pointer-events-none"
        />

        {/* الطبقة 3: موجة حرارة خفيفة صاعدة (تُحاكي هواء الشواء الساخن) */}
        <motion.div
          animate={{ y: [0, -14, 0], opacity: stage >= 2 ? [0.15, 0.3, 0.15] : 0 }}
          transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent blur-2xl pointer-events-none"
        />

        {/* الطبقة 4: شرارات ودخان صاعد من أسفل الشعار */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {stage >= 2 &&
            [...Array(18)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `${38 + (i % 6) * 5}%`,
                  y: '105%',
                  opacity: 0,
                  scale: 0.4 + Math.random() * 0.7,
                }}
                animate={{
                  y: '-15%',
                  opacity: [0, 0.9, 0],
                  x: `${38 + (i % 6) * 5 + (Math.random() * 26 - 13)}%`,
                }}
                transition={{
                  duration: 1.6 + (i % 4) * 0.3,
                  delay: i * 0.06,
                  ease: 'easeOut',
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-t from-amber-400 to-red-500 blur-[1px]"
              />
            ))}
        </div>

        {/* الطبقة 5: خط ضوء ذهبي يعبر الشاشة أفقياً مرة واحدة (لمسة سينمائية) */}
        {stage >= 4 && (
          <motion.div
            initial={{ x: '-120%', opacity: 0 }}
            animate={{ x: '120%', opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-300/25 to-transparent skew-x-12 pointer-events-none"
          />
        )}

        {/* الشعار والتايبوجرافي المركزي */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-lg">
          <motion.div
            initial={{ scale: 0.55, opacity: 0, rotate: -18 }}
            animate={stage >= 2 ? { scale: 1, opacity: 1, rotate: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative mb-6"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-gradient-to-b from-stone-900 to-amber-950/60 shadow-[0_0_60px_rgba(245,158,11,0.45)] backdrop-blur-md overflow-hidden">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.restaurantName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Flame className="w-12 h-12 sm:w-14 sm:h-14 text-amber-500 animate-pulse" />
              )}
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
              className="absolute -inset-2 rounded-full border border-dashed border-amber-500/25 pointer-events-none"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
              className="absolute -inset-5 rounded-full border border-amber-500/10 pointer-events-none"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 25, opacity: 0, letterSpacing: '0.12em' }}
            animate={stage >= 3 ? { y: 0, opacity: 1, letterSpacing: '0.02em' } : {}}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl font-black text-amber-400 font-['Cairo'] tracking-tight mb-2 text-glow-gold"
          >
            {language === 'ar' ? settings.restaurantName : settings.restaurantNameEn}
          </motion.h1>

          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={stage >= 4 ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="text-sm sm:text-base font-semibold tracking-[0.25em] text-amber-200/90 font-['Outfit'] uppercase mb-2">
              {language === 'ar' ? settings.restaurantNameEn : settings.restaurantName}
            </div>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent my-1" />
            <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1">
              {language === 'ar' ? settings.tagline : settings.taglineEn}
            </p>
          </motion.div>
        </div>

        {/* فينييت خفيف على الحواف لعمق إضافي */}
        <div className="absolute inset-0 pointer-events-none [box-shadow:inset_0_0_140px_60px_rgba(0,0,0,0.65)]" />

        {/* زر تخطي بسيط وغير مزعج */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          className="absolute bottom-6 left-6 z-20 px-3.5 py-1.5 rounded-full border border-stone-700 bg-stone-900/70 text-xs text-stone-400 hover:text-amber-300 hover:border-amber-500/50 transition backdrop-blur-sm"
        >
          تخطي المقدمة (Skip) ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

