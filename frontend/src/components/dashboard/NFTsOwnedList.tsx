"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, X } from "lucide-react";
import api from "@/lib/api";
import { usePreferences } from "@/context/PreferencesContext";

type SortKey = "default" | "price_asc" | "price_desc" | "profit";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "price_asc", label: "Price: Low → High" },
  { key: "price_desc", label: "Price: High → Low" },
  { key: "profit", label: "Profitable only" },
];

// Design-spec fallback — always visible even without auth/DB
const STATIC_NFTS = [
  { _id: "1", name: "Roma Avenue",   price: "0.91 Ether", num: 0.91, change: "+10%", isProfit: true,  sparkline: "M0 18 C10 14 20 8  30 12 C40 16 50 6  60 8  L80 4" },
  { _id: "2", name: "Thorian Park",  price: "0.89 Ether", num: 0.89, change: "+19%", isProfit: true,  sparkline: "M0 20 C10 16 20 10 30 14 C40 8  50 4  60 6  L80 2" },
  { _id: "3", name: "Linda Mansion", price: "1.1 Ether",  num: 1.1,  change: "-17%", isProfit: false, sparkline: "M0 4  C10 6  20 10 30 8  C40 14 50 18 60 16 L80 22" },
  { _id: "4", name: "Villa Mary",    price: "0.71 Ether", num: 0.71, change: "+32%", isProfit: true,  sparkline: "M0 22 C10 18 20 12 30 10 C40 6  50 2  60 4  L80 1" },
];

function sortNfts(nfts: typeof STATIC_NFTS, key: SortKey) {
  switch (key) {
    case "price_asc":  return [...nfts].sort((a, b) => a.num - b.num);
    case "price_desc": return [...nfts].sort((a, b) => b.num - a.num);
    case "profit":     return nfts.filter(n => n.isProfit);
    default:           return nfts;
  }
}

export default function NFTsOwnedList() {
  const { t } = usePreferences();
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof STATIC_NFTS)[0] | null>(null);
  const [allNfts, setAllNfts] = useState(STATIC_NFTS);

  useEffect(() => {
    async function fetchOwnedNFTs() {
      try {
        const { data } = await api.get("/user/portfolio");
        if (!data?.ownedNFTs?.length) return;           // keep fallback if empty
        const formatted = data.ownedNFTs.map((nft: any) => ({
          _id: nft._id,
          name: nft.title,
          price: `${nft.priceETH ?? 0} Ether`,
          num: nft.priceETH ?? 0,
          change: (nft.roi ?? 0) >= 0 ? `+${nft.roi}%` : `${nft.roi}%`,
          isProfit: (nft.roi ?? 0) >= 0,
          sparkline: (nft.roi ?? 0) >= 0
            ? "M0 18 C10 14 20 8 30 12 C40 16 50 6 60 8 L80 4"
            : "M0 4 C10 6 20 10 30 8 C40 14 50 18 60 16 L80 22",
        }));
        setAllNfts(formatted);
      } catch {
        // Silently keep static fallback
      }
    }
    fetchOwnedNFTs();
  }, []);

  const nfts = sortNfts(allNfts, sortKey);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t("nfts_owned" as any)}</h2>
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#8A74F9] transition-colors bg-white dark:bg-slate-800 rounded-full px-3 py-1.5 shadow-sm border border-slate-100 dark:border-slate-700"
          >
            <ArrowUpDown size={12} />
            {t("sort" as any)}
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 overflow-hidden">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setSortKey(opt.key); setMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${
                      sortKey === opt.key ? "text-[#8A74F9] bg-[#8A74F9]/10" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {t(("sort_" + opt.key) as any)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* NFT Rows */}
      <div className="flex flex-col gap-4 flex-1">
        {nfts.map((nft) => (
          <div
            key={nft._id}
            onClick={() => setSelected(nft)}
            className="bg-white dark:bg-slate-800 rounded-[24px] p-4 sm:p-5 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-transparent dark:border-slate-700/50"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-[15px] font-bold text-slate-700 dark:text-white tracking-tight">{nft.name}</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px] flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-400">
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                </svg>
                {nft.price}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1.5 w-24">
              <svg className="w-full h-7" viewBox="0 0 80 25" preserveAspectRatio="none">
                <path
                  d={nft.sparkline}
                  fill="none"
                  stroke={nft.isProfit ? "#00D3A2" : "#ef4444"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className={`text-[12px] font-bold ${nft.isProfit ? "text-[#00D3A2]" : "text-rose-500"}`}>
                {nft.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <div className="relative bg-white dark:bg-slate-800 rounded-[32px] p-8 w-full max-w-sm shadow-2xl z-10 border border-slate-100 dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
              <X size={20} />
            </button>
            <div className={`w-12 h-12 rounded-2xl ${selected.isProfit ? "bg-[#00D3A2]/10 text-[#00D3A2]" : "bg-rose-100 text-rose-500"} flex items-center justify-center mb-5`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-1">{selected.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">{selected.price}</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">{t("change" as any)}</p>
                <p className={`text-lg font-bold ${selected.isProfit ? "text-[#00D3A2]" : "text-rose-500"}`}>{selected.change}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">{t("status" as any)}</p>
                <p className={`text-sm font-bold ${selected.isProfit ? "text-[#00D3A2]" : "text-rose-600 dark:text-rose-500"}`}>
                  {selected.isProfit ? t("profitable" as any) : t("at_loss" as any)}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3.5 rounded-2xl bg-[#8A74F9] text-white font-bold text-sm hover:bg-[#7864dd] transition-colors shadow-md shadow-[#8A74F9]/30">
                {t("bid" as any)}
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                {t("close" as any)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
