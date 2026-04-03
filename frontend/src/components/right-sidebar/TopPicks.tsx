"use client";

import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/context/PreferencesContext";

interface TopPickProperty {
  _id: string;
  title: string;
  priceUSD: number;
  priceETH: number;
}

const STATIC_PICKS: TopPickProperty[] = [
  { _id: "s1", title: "Roma Avenue",  priceUSD: 400000, priceETH: 0.0000345 },
  { _id: "s2", title: "Atlas Shack",  priceUSD: 500000, priceETH: 0.0000678 },
  { _id: "s3", title: "Germanrin",    priceUSD: 786000, priceETH: 0.0000887 },
  { _id: "s4", title: "Heavens",      priceUSD: 667000, priceETH: 0.0000761 },
  { _id: "s5", title: "Heretho",      priceUSD: 348000, priceETH: 0.0000302 },
];

const ACCENT_COLORS = [
  "bg-rose-400",
  "bg-orange-400",
  "bg-[#00D3A2]",
  "bg-[#3B82F6]",
  "bg-[#8A74F9]",
];

export default function TopPicks() {
  const { t } = usePreferences();
  const [selected, setSelected] = useState<string | null>(null);
  const [picks, setPicks] = useState<TopPickProperty[]>(STATIC_PICKS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPicks() {
      try {
        const { data } = await api.get("/properties/top-picks");
        if (Array.isArray(data) && data.length > 0) setPicks(data);
      } catch {
        // Keep static fallback silently
      }
    }
    fetchPicks();
  }, []);

  const handleBid = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await api.post("/user/purchase", { propertyId: id });
      toast.success("Bid placed successfully!");
    } catch (error: any) {
      const msg = error.response?.data?.message ?? "Please log in to place a bid.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      {picks.map((item, idx) => (
        <motion.div
          key={item._id}
          layout
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelected(selected === item._id ? null : item._id)}
          className={`flex justify-between items-center group cursor-pointer p-3 -mx-3 rounded-[20px] transition-all duration-300 ${
            selected === item._id
              ? "bg-[#8A74F9]/5 dark:bg-[#8A74F9]/10 shadow-sm ring-1 ring-[#8A74F9]/20"
              : "hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-1 rounded-full shrink-0 transition-all duration-300 ${ACCENT_COLORS[idx % ACCENT_COLORS.length]} ${
                selected === item._id ? "h-11" : "h-7 group-hover:h-9"
              }`}
            />
            <div className="flex flex-col gap-0.5">
              <motion.p
                layout="position"
                className={`font-bold text-[15px] tracking-tight transition-colors ${
                  selected === item._id
                    ? "text-[#8A74F9]"
                    : "text-slate-800 dark:text-white group-hover:text-[#8A74F9]"
                }`}
              >
                {item.title}
              </motion.p>
              <motion.p layout="position" className="text-[13px] text-slate-400 dark:text-slate-500 font-medium">
                ${(item.priceUSD || 0).toLocaleString()}
              </motion.p>
              <AnimatePresence>
                {selected === item._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 mt-2 overflow-hidden"
                  >
                    <p className="text-[12px] text-[#8A74F9] font-bold">
                      {item.priceETH} ETH
                    </p>
                    <button
                      disabled={loading}
                      onClick={(e) => handleBid(item._id, e)}
                      className="bg-slate-900 dark:bg-[#8A74F9] hover:bg-[#8A74F9] dark:hover:bg-[#7864dd] disabled:opacity-60 text-white text-xs font-bold py-1.5 px-4 rounded-full transition-all shadow-sm"
                    >
                      {loading ? "..." : t("confirm_bid" as any)}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {selected !== item._id && (
              <p className="text-[12px] font-bold text-slate-400">
                {item.priceETH} ETH
              </p>
            )}
            <motion.div
              animate={{ rotate: selected === item._id ? 90 : 0 }}
              className="text-slate-300 group-hover:text-[#8A74F9]"
            >
              <ChevronRight size={18} />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
