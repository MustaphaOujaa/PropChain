"use client";

import { useState } from "react";
import { Star, Camera, Heart, Share2, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/context/PreferencesContext";

export default function NFTMarketplaceCard() {
  const { t } = usePreferences();
  const [liked, setLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAction = (action: string) => {
    setMenuOpen(false);
    if (action === "save") toast.success("Listing saved to your portfolio.");
    if (action === "share") {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard!");
    }
    if (action === "wishlist") toast.success("Added to your wishlist.");
  };

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="flex justify-between items-center px-1 relative">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors">{t("nft_marketplace" as any)}</h2>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-400 font-bold transition-colors hover:text-slate-600 dark:hover:text-slate-200 tracking-widest text-lg leading-none -mt-2 px-2"
            aria-label="Options"
          >
            ...
          </button>
          
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-8 w-48 bg-white dark:bg-slate-800 rounded-[20px] shadow-xl shadow-purple-900/5 border border-slate-100 dark:border-slate-700 z-20 overflow-hidden"
                >
                  <button onClick={() => handleAction("save")} className="flex items-center gap-3 w-full px-4 py-3.5 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-[#8A74F9]/5 hover:text-[#8A74F9] transition-colors border-b border-slate-50 dark:border-slate-700">
                    <BookmarkPlus size={16} /> {t("save_listing" as any)}
                  </button>
                  <button onClick={() => handleAction("share")} className="flex items-center gap-3 w-full px-4 py-3.5 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-[#8A74F9]/5 hover:text-[#8A74F9] transition-colors border-b border-slate-50 dark:border-slate-700">
                    <Share2 size={16} /> {t("share" as any)}
                  </button>
                  <button onClick={() => handleAction("wishlist")} className="flex items-center gap-3 w-full px-4 py-3.5 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-[#8A74F9]/5 hover:text-[#8A74F9] transition-colors">
                    <Heart size={16} /> {t("add_to_wishlist" as any)}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative rounded-[32px] overflow-hidden flex-1 min-h-[260px] sm:min-h-[300px] lg:min-h-[360px] shadow-sm group">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Modern House"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Top Labels */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full bg-white/30 backdrop-blur-md text-white text-xs font-medium">{t("top_picks_label" as any)}</span>
          <span className="px-4 py-1.5 rounded-full bg-[#8B5CF6]/90 text-white text-xs font-medium">{t("featured" as any)}</span>
        </div>

        {/* Like button */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center transition-all"
          aria-label="Like"
        >
          <Heart size={16} className={liked ? "fill-rose-500 text-rose-500" : "text-white"} />
        </button>

        {/* Bottom Content */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{t("house_andromeda" as any)}</h3>
            <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
              <span className="flex items-center gap-1 font-medium bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                </svg>
                1.44 Ether
              </span>
              <div className="flex items-center gap-0.5 text-yellow-400">
                {[1,2,3,4].map(i => <Star key={i} size={13} fill="currentColor" />)}
                <Star size={13} className="text-white/40" />
              </div>
              <span className="text-white/70 text-xs">(24 {t("bidders" as any)})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex -space-x-2">
              {[1,2,3].map(s => (
                <img key={s} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s}`} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-black/30 bg-slate-200" />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-black/30 bg-white flex items-center justify-center text-xs font-bold text-slate-800">+4</div>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center transition-colors text-white">
              <Camera size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
