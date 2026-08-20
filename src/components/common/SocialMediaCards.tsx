import React from 'react';
import { motion } from 'motion/react';
import { Facebook, Instagram, Video, Share2, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SocialMediaCard } from '../../types';

export const SocialMediaCards: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { socialMedia, language } = useStore();

  // Deduplicate and get the top 3 active social media cards
  const uniquePlatforms = new Set<string>();
  const activeCards = socialMedia
    .filter((s) => s.active)
    .filter((s) => {
      if (uniquePlatforms.has(s.platform)) return false;
      uniquePlatforms.add(s.platform);
      return true;
    })
    .slice(0, 3);

  const getPlatformIcon = (platform: SocialMediaCard['platform']) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 sm:w-6 sm:h-6 text-pink-400" />;
      case 'tiktok':
        return <Video className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400" />;
      default:
        return <Share2 className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />;
    }
  };

  const getPlatformGradient = (platform: SocialMediaCard['platform']) => {
    switch (platform) {
      case 'facebook':
        return 'from-blue-950/40 via-stone-900/90 to-stone-900 border-blue-500/30 hover:border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.15)]';
      case 'instagram':
        return 'from-rose-950/40 via-stone-900/90 to-stone-900 border-pink-500/30 hover:border-pink-400/60 shadow-[0_0_20px_rgba(244,63,94,0.15)]';
      case 'tiktok':
        return 'from-cyan-950/40 via-stone-900/90 to-stone-900 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.15)]';
      default:
        return 'from-amber-950/40 via-stone-900/90 to-stone-900 border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
    }
  };

  if (activeCards.length === 0) return null;

  return (
    <div className="w-full" id="social-media-container">
      {/* Three Cards Always Side-by-Side: [ Social 1 ] [ Social 2 ] [ Social 3 ] */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
        {activeCards.map((card, idx) => {
          const cardBg = getPlatformGradient(card.platform);
          return (
            <motion.a
              key={card.id}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className={`relative group p-2.5 sm:p-4 rounded-2xl bg-gradient-to-br ${cardBg} border shadow-lg backdrop-blur-md flex flex-col justify-between transition-all duration-300 overflow-hidden select-none`}
            >
              {/* Continuous Ambient Light Shimmer */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-xl bg-stone-800/90 border border-stone-700/60 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all shrink-0">
                    {getPlatformIcon(card.platform)}
                  </div>
                  <span className="p-1 sm:p-1.5 rounded-lg bg-stone-800/80 group-hover:bg-amber-500 group-hover:text-stone-950 text-stone-400 transition-colors">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                </div>

                <h3 className="text-[11px] sm:text-sm font-black font-['Cairo'] text-stone-100 group-hover:text-amber-300 transition-colors leading-tight line-clamp-1">
                  {language === 'ar' ? card.title : (card.titleEn || card.title)}
                </h3>

                {!compact && (
                  <p className="text-[10px] sm:text-xs text-stone-400 mt-1 line-clamp-1 leading-snug hidden sm:block">
                    {language === 'ar' ? card.description : (card.descriptionEn || card.description)}
                  </p>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-stone-800/60 flex items-center justify-between text-[9px] sm:text-xs font-bold text-amber-400/90">
                <span className="truncate">{language === 'ar' ? 'تابعنا' : 'Follow'}</span>
                <span className="text-stone-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">→</span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};
