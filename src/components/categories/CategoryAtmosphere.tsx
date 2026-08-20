import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Category } from '../../types';

interface CategoryAtmosphereProps {
  category: Category;
}

export const CategoryAtmosphere: React.FC<CategoryAtmosphereProps> = ({ category }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const theme = category.atmosphereTheme || 'grill';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      
      {/* ============================================================ */}
      {/* 1. GRILLS WORLD (المشويات) - Skewers, Heat, Embers, Smoke */}
      {/* ============================================================ */}
      {(theme === 'grill' || category.name.includes('شوي') || category.name.includes('مشويات')) && (
        <>
          {/* Charcoal fire base ambient glow */}
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-amber-600/15 via-orange-600/10 to-transparent blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-2/3 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />

          {/* Realistic Kofta Skewer 1 (Floating on right background) */}
          <motion.div
            initial={{ y: -100, opacity: 0, rotate: 18 }}
            animate={{
              y: [0, 25, 0],
              rotate: [18, 22, 18],
              opacity: [0.75, 0.9, 0.75],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transform: `translateY(${scrollY * 0.12}px)` }}
            className="absolute top-24 -right-10 sm:right-4 w-32 sm:w-44 h-80 sm:h-96 pointer-events-none opacity-40 lg:opacity-60 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
          >
            {/* Stainless Steel Skewer Needle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-full bg-gradient-to-b from-stone-400 via-stone-200 to-amber-600/80 rounded-full shadow-lg" />
            
            {/* Charcoal-Grilled Kofta Cylinders */}
            <div className="relative z-10 flex flex-col items-center gap-2 pt-10">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-14 sm:w-18 h-14 sm:h-16 rounded-2xl bg-gradient-to-r from-amber-950 via-stone-800 to-amber-900 border-t border-b border-amber-500/30 shadow-[inset_0_2px_4px_rgba(255,180,50,0.3),0_8px_16px_rgba(0,0,0,0.8)] relative overflow-hidden"
                >
                  {/* Grill Charcoal Grate Sear Marks */}
                  <div className="absolute inset-0 flex flex-col justify-around py-1 opacity-70">
                    <div className="h-[2px] w-full bg-stone-950 rotate-3" />
                    <div className="h-[2px] w-full bg-stone-950 -rotate-2" />
                    <div className="h-[2px] w-full bg-stone-950 rotate-1" />
                  </div>
                  {/* Glistening juice shine */}
                  <div className="absolute top-1 left-2 w-2 h-6 bg-white/20 rounded-full blur-[1px] -rotate-12" />
                </div>
              ))}
            </div>

            {/* Rising Heat & Smoke stream */}
            <motion.div
              animate={{ y: [-10, -50], opacity: [0.6, 0], scale: [0.8, 1.4] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-24 bg-gradient-to-t from-stone-400/20 via-amber-200/10 to-transparent blur-md rounded-full"
            />
          </motion.div>

          {/* Realistic Kebab Skewer 2 (Floating on left background) */}
          <motion.div
            initial={{ y: -60, opacity: 0, rotate: -22 }}
            animate={{
              y: [20, -10, 20],
              rotate: [-22, -18, -22],
              opacity: [0.6, 0.85, 0.6],
            }}
            transition={{
              duration: 7.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.2,
            }}
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            className="absolute top-72 -left-8 sm:left-4 w-32 sm:w-44 h-80 sm:h-96 pointer-events-none opacity-40 lg:opacity-60 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
          >
            {/* Stainless Steel Skewer Needle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-full bg-gradient-to-b from-stone-400 via-stone-200 to-amber-600/80 rounded-full shadow-lg" />
            
            {/* Grilled Veal Kebab Cubes */}
            <div className="relative z-10 flex flex-col items-center gap-2 pt-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-14 sm:w-16 h-12 sm:h-14 rounded-xl bg-gradient-to-br from-amber-900 via-stone-900 to-red-950 border border-amber-500/40 shadow-[inset_0_2px_4px_rgba(255,200,100,0.35),0_6px_14px_rgba(0,0,0,0.9)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:6px_6px] opacity-25" />
                  <div className="absolute inset-x-0 top-1/2 h-[3px] bg-stone-950 rotate-12" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating Charcoal Glowing Embers */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={`ember-${i}`}
              animate={{
                y: [0, -120 - i * 20],
                x: [0, (i % 2 === 0 ? 30 : -30) + Math.sin(i) * 20],
                opacity: [0, 0.8, 0],
                scale: [0.6, 1.2, 0.4],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'easeInOut',
              }}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 shadow-[0_0_10px_#f59e0b] pointer-events-none"
              style={{
                top: `${20 + (i * 11)}%`,
                left: `${10 + ((i * 12) % 80)}%`,
              }}
            />
          ))}
        </>
      )}

      {/* ============================================================ */}
      {/* 2. SANDWICHES WORLD (السندوتشات) - Dynamic Drifting Sandwiches */}
      {/* ============================================================ */}
      {(theme === 'sandwiches' || category.name.includes('سندوتش')) && (
        <>
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-amber-500/10 via-amber-700/5 to-transparent blur-3xl" />
          
          {/* Drifting Shawerma Roll 1 */}
          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [-10, 15, -10],
              rotate: [8, 14, 8],
              opacity: [0.4, 0.65, 0.4],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            className="absolute top-20 -right-8 sm:right-6 w-36 sm:w-52 h-24 rounded-full bg-gradient-to-r from-amber-800 via-amber-600 to-amber-700 border-2 border-amber-400/40 shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_2px_6px_rgba(255,255,255,0.4)] flex items-center justify-between px-4 overflow-hidden"
          >
            <div className="w-4 h-full bg-stone-900/30 rotate-12 blur-[1px]" />
            <div className="w-5 h-full bg-amber-950/40 -rotate-12 blur-[1px]" />
            {/* Sesame seeds */}
            <div className="absolute top-3 left-6 w-1.5 h-1 bg-amber-100 rounded-full shadow-sm" />
            <div className="absolute bottom-4 right-10 w-1.5 h-1 bg-amber-100 rounded-full shadow-sm" />
            <div className="absolute top-4 right-6 w-1.5 h-1 bg-amber-100 rounded-full shadow-sm" />
          </motion.div>

          {/* Drifting Grilled Kofta Bun 2 */}
          <motion.div
            animate={{
              y: [20, -15, 20],
              x: [10, -10, 10],
              rotate: [-12, -6, -12],
              opacity: [0.35, 0.6, 0.35],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            style={{ transform: `translateY(${scrollY * 0.14}px)` }}
            className="absolute top-96 -left-6 sm:left-8 w-32 sm:w-48 h-22 rounded-full bg-gradient-to-r from-amber-700 via-stone-800 to-amber-900 border-2 border-amber-500/30 shadow-[0_15px_25px_rgba(0,0,0,0.85)] flex items-center justify-around px-3"
          >
            <div className="w-3 h-full bg-stone-950/40 rotate-6" />
            <div className="w-3 h-full bg-amber-400/20 -rotate-6" />
          </motion.div>

          {/* Floating Fresh Sesame & Herbs */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={`sesame-${i}`}
              animate={{
                y: [0, 60, 0],
                x: [0, (i % 2 === 0 ? 25 : -25), 0],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeInOut',
              }}
              className="absolute w-2 h-1.5 rounded-full bg-amber-200/80 shadow-[0_0_6px_rgba(251,191,36,0.5)]"
              style={{
                top: `${15 + i * 14}%`,
                left: `${15 + (i * 13) % 70}%`,
              }}
            />
          ))}
        </>
      )}

      {/* ============================================================ */}
      {/* 3. PLATTERS WORLD (الصواني) - Royal Banquet Serving Dishes */}
      {/* ============================================================ */}
      {(theme === 'platters' || category.name.includes('صواني') || category.name.includes('صينية')) && (
        <>
          <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-amber-600/15 via-amber-900/10 to-transparent blur-3xl" />

          {/* Large Silver / Brass Royal Platter Rim on Left */}
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [-5, -2, -5],
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
            className="absolute top-28 -left-20 sm:-left-12 w-64 sm:w-96 h-64 sm:h-96 rounded-full border-[10px] sm:border-[16px] border-amber-500/30 bg-gradient-to-br from-stone-900 via-amber-950/40 to-stone-950 shadow-[0_30px_60px_rgba(0,0,0,0.95),inset_0_0_30px_rgba(245,158,11,0.2)] opacity-30 lg:opacity-50"
          >
            {/* Ornate Platter Radial Grooves */}
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-amber-400/30 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500/20 to-transparent blur-sm" />
            </div>
          </motion.div>

          {/* Secondary Platter on Right */}
          <motion.div
            animate={{
              y: [20, -10, 20],
              rotate: [4, 8, 4],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ transform: `translateY(${scrollY * 0.12}px)` }}
            className="absolute top-[450px] -right-24 sm:-right-16 w-60 sm:w-88 h-60 sm:h-88 rounded-full border-[8px] sm:border-[12px] border-amber-400/25 bg-gradient-to-bl from-stone-950 via-stone-900 to-amber-950/50 shadow-[0_25px_50px_rgba(0,0,0,0.9)] opacity-25 lg:opacity-40"
          />
        </>
      )}

      {/* ============================================================ */}
      {/* 4. MIXES WORLD (الميكشات) - Multi-layer Food Palette */}
      {/* ============================================================ */}
      {(theme === 'mixes' || category.name.includes('ميكس')) && (
        <>
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-red-600/10 via-amber-600/10 to-transparent blur-3xl" />
          
          {/* Floating Spiced Golden Fries / Crisps */}
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={`fry-${i}`}
              animate={{
                y: [0, 35, 0],
                rotate: [i * 20, i * 20 + 30, i * 20],
                opacity: [0.35, 0.7, 0.35],
              }}
              transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.6 }}
              className="absolute w-3 h-16 rounded-md bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.4)]"
              style={{
                top: `${18 + i * 15}%`,
                right: `${8 + (i * 16) % 75}%`,
              }}
            />
          ))}

          {/* Floating Garlic & Tahini Sauce Bowls */}
          <motion.div
            animate={{ y: [0, 25, 0], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-44 left-4 sm:left-12 w-20 sm:w-28 h-20 sm:h-28 rounded-full border-4 border-amber-400/30 bg-stone-900 shadow-2xl flex items-center justify-center opacity-40 lg:opacity-60"
          >
            <div className="w-14 sm:w-20 h-14 sm:h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-inner flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-red-600/80 blur-[1px]" />
            </div>
          </motion.div>
        </>
      )}

      {/* ============================================================ */}
      {/* 5. MEALS & TASWEYAT & ADDITIONS WORLDS */}
      {/* ============================================================ */}
      {(theme === 'meal' || theme === 'settlements' || theme === 'additions' || theme === 'custom') && (
        <>
          <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-amber-500/10 via-amber-700/5 to-transparent blur-3xl" />
          
          {/* Earthenware Tajine Rim Silhouette */}
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-28 -right-12 sm:right-6 w-48 sm:w-72 h-48 sm:h-72 rounded-full border-8 border-amber-700/30 bg-gradient-to-b from-amber-950/40 via-stone-900 to-stone-950 shadow-2xl opacity-35 lg:opacity-50"
          />

          {/* Fresh Parsley & Aromatic Herb Sprigs */}
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={`herb-${i}`}
              animate={{
                y: [0, 40, 0],
                rotate: [0, 45, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 7 + i, repeat: Infinity, delay: i * 0.9 }}
              className="absolute w-4 h-4 rounded-tl-xl rounded-br-xl bg-emerald-600/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              style={{
                top: `${22 + i * 18}%`,
                left: `${10 + (i * 20) % 80}%`,
              }}
            />
          ))}
        </>
      )}

    </div>
  );
};
