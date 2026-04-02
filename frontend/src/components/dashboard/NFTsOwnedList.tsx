"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, X } from "lucide-react";
import api from "@/lib/api";

type SortKey = "default" | "price_asc" | "price_desc" | "profit";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "price_asc", label: "Price: Low → High" },
  { key: "price_desc", label: "Price: High → Low" },
  { key: "profit", label: "Profitable only" },
];

function sortNfts(nfts: any[], key: SortKey) {
  switch (key) {
    case "price_asc": return [...nfts].sort((a, b) => a.num - b.num);
    case "price_desc": return [...nfts].sort((a, b) => b.num - a.num);
    case "profit": return nfts.filter(n => n.isProfit);
    default: return nfts;
  }
}

export default function NFTsOwnedList() {
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [allNfts, setAllNfts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOwnedNFTs() {
      try {
        const { data } = await api.get('/user/portfolio');
        const formattedNFTs = data.ownedNFTs.map((nft: any) => ({
          _id: nft._id,
          name: nft.title,
          price: `${nft.priceETH || 0} Ether`,
          num: nft.priceETH || 0,
          change: parseInt(nft.roi || "0") > 0 ? `+${nft.roi}` : nft.roi,
          isProfit: parseInt(nft.roi || "0") > 0,
          sparkline: parseInt(nft.roi || "0") > 0 
            ? "M0 15 Q 15 5, 30 15 T 60 5 T 80 0" 
            : "M0 5 Q 15 15, 30 5 T 60 15 T 80 20"
        }));
        setAllNfts(formattedNFTs);
      } catch (error) {
        console.error("Error fetching owned NFTs:", error);
      }
    }
    fetchOwnedNFTs();
  }, []);

  const nfts = sortNfts(allNfts, sortKey);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">NFTs owned</h2>
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#8A74F9] transition-colors bg-white rounded-full px-3 py-1.5 shadow-sm border border-slate-100"
          >
            <ArrowUpDown size={12} />
            Sort
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setSortKey(opt.key); setMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${
                      sortKey === opt.key ? "text-[#8A74F9] bg-[#8A74F9]/10" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        {nfts.map((nft, idx) => (
          <div
            key={idx}
            onClick={() => setSelected(nft)}
            className="bg-white rounded-[24px] p-4 sm:p-5 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-[15px] font-bold text-slate-700 tracking-tight">{nft.name}</span>
              <span className="text-slate-500 font-medium text-[13px] flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-400">
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                </svg>
                {nft.price}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1.5 w-24">
              <svg className="w-full h-6" viewBox="0 0 80 25" preserveAspectRatio="none">
                <path d={nft.sparkline} fill="none" stroke={nft.isProfit ? "#00D3A2" : "#ef4444"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={`text-[12px] font-bold ${nft.isProfit ? "text-[#00D3A2]" : "text-rose-500"}`}>{nft.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl z-10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1">
              <X size={20} />
            </button>
            <div className={`w-12 h-12 rounded-2xl ${selected.isProfit ? "bg-[#00D3A2]/10 text-[#00D3A2]" : "bg-rose-100 text-rose-500"} flex items-center justify-center mb-5`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">{selected.name}</h3>
            <p className="text-slate-500 font-medium mb-6">{selected.price}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs text-slate-400 font-medium mb-1">Change</p>
                <p className={`text-lg font-bold ${selected.isProfit ? "text-[#00D3A2]" : "text-rose-500"}`}>{selected.change}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs text-slate-400 font-medium mb-1">Status</p>
                <p className={`text-sm font-bold ${selected.isProfit ? "text-[#00D3A2]" : "text-rose-600"}`}>
                  {selected.isProfit ? "Profitable" : "At Loss"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3.5 rounded-2xl bg-[#8A74F9] text-white font-bold text-sm hover:bg-[#7864dd] transition-colors shadow-md shadow-[#8A74F9]/50">
                Bid
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
