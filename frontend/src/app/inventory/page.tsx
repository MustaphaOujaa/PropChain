"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { userApi, Property } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Search, MapPin, TrendingUp, Package,
  ArrowUpRight, MoreHorizontal, ExternalLink,
  Bed, Bath, Maximize2, ChevronUp, ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { usePreferences } from "@/context/PreferencesContext";

type SortKey = "name" | "price" | "roi";
type SortDir = "asc" | "desc";

function formatUSD(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${(n / 1_000).toFixed(0)}K`;
}

function SortBtn({
  label, col, active, dir, onClick,
}: { label: string; col: SortKey; active: SortKey; dir: SortDir; onClick: (c: SortKey) => void }) {
  const isActive = col === active;
  return (
    <button
      onClick={() => onClick(col)}
      className={clsx(
        "flex items-center gap-1 text-xs font-semibold transition-colors",
        isActive ? "text-[#8A74F9]" : "text-slate-400 hover:text-slate-600"
      )}
    >
      {label}
      {isActive
        ? dir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
        : <ChevronDown size={13} className="opacity-30" />}
    </button>
  );
}

const STATIC_NFTS: any[] = [
  {
    _id: "m1",
    title: "Roma Avenue",
    location: "Beverly Hills, CA",
    priceUSD: 410000,
    priceETH: 0.91,
    roi: 10,
    beds: 4,
    baths: 3,
    sqft: 3200,
    category: "Villa",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80"
  },
  {
    _id: "m2",
    title: "Thorian Park",
    location: "London, UK",
    priceUSD: 870000,
    priceETH: 2.11,
    roi: -7,
    beds: 5,
    baths: 4,
    sqft: 4500,
    category: "Mansion",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80"
  },
  {
    _id: "m3",
    title: "Apollo Complex",
    location: "Miami, FL",
    priceUSD: 310000,
    priceETH: 0.55,
    roi: 3,
    beds: 2,
    baths: 2,
    sqft: 1800,
    category: "Apartment",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=80"
  }
];

export default function InventoryPage() {
  const { t } = usePreferences();
  const { user } = useAuth();
  const [nfts, setNfts] = useState<any[]>(STATIC_NFTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    userApi.getPortfolio()
      .then((res) => {
        if (res.data.ownedNFTs && res.data.ownedNFTs.length > 0) {
          setNfts(res.data.ownedNFTs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleSort = (col: SortKey) => {
    if (col === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(col); setSortDir("asc"); }
  };

  const filtered = nfts
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let va: string | number, vb: string | number;
      if (sortKey === "name")  { va = a.title;    vb = b.title; }
      else if (sortKey === "price") { va = a.priceUSD; vb = b.priceUSD; }
      else                    { va = a.roi;      vb = b.roi; }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <DashboardLayout pageTitle={t("houses" as any)}>
      <div className="pb-20 md:pb-0 space-y-6">

        {/* Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { labelKey: "total_properties", value: String(nfts.length), color: "bg-purple-100 text-purple-600 dark:bg-[#8A74F9]/10 dark:text-[#8A74F9]" },
            { labelKey: "portfolio_value", value: formatUSD(nfts.reduce((s, p) => s + p.priceUSD, 0)), color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
            { labelKey: "avg_roi_label", value: nfts.length ? `${(nfts.reduce((s, p) => s + p.roi, 0) / nfts.length).toFixed(1)}%` : "—", color: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
            { labelKey: "total_eth", value: `${nfts.reduce((s, p) => s + p.priceETH, 0).toFixed(2)} ETH`, color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
          ].map((s) => (
            <div key={s.labelKey} className="bg-white dark:bg-slate-800 rounded-[24px] p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
              <div className={clsx("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0", s.color)}>
                <ArrowUpRight size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t(s.labelKey as any)}</p>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t("search_properties")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-[#8A74F9] focus:ring-2 focus:ring-[#8A74F9]/20 transition-all shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
          {/* Table head */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40">
            <div className="col-span-4 flex items-center gap-2">
              <SortBtn label={t("property")} col="name" active={sortKey} dir={sortDir} onClick={handleSort} />
            </div>
            <div className="col-span-2 hidden sm:flex items-center"><SortBtn label={t("price")} col="price" active={sortKey} dir={sortDir} onClick={handleSort} /></div>
            <div className="col-span-2 hidden md:flex items-center"><SortBtn label={t("roi")} col="roi" active={sortKey} dir={sortDir} onClick={handleSort} /></div>
            <div className="col-span-2 hidden lg:flex items-center"><span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{t("details")}</span></div>
            <div className="col-span-4 sm:col-span-2 flex justify-end items-center"><span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{t("actions")}</span></div>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-50">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                    <div className="space-y-1.5"><div className="h-3 w-28 bg-slate-100 rounded"/><div className="h-2 w-20 bg-slate-100 rounded"/></div>
                  </div>
                  <div className="col-span-8 flex items-center"><div className="h-3 w-20 bg-slate-100 rounded"/></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Package size={44} className="text-slate-200 dark:text-slate-700 mb-4" />
              <p className="font-bold text-slate-800 dark:text-white mb-1.5 text-lg">
                {nfts.length === 0 ? t("no_properties_owned") : t("no_results")}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm max-w-[240px] leading-relaxed">
                {nfts.length === 0
                  ? "Buy your first property on the Marketplace."
                  : "Try a different search term."}
              </p>
              {nfts.length === 0 && (
                <a href="/marketplace" className="mt-7 bg-[#8A74F9] text-white px-7 py-3 rounded-2xl text-sm font-bold hover:bg-[#7864dd] transition-all shadow-lg shadow-[#8A74F9]/20 active:scale-95">
                  {t("browse_marketplace")}
                </a>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((p) => (
                <div
                  key={p._id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors items-center group"
                >
                  {/* Property */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">{p.title}</p>
                      <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5 truncate">
                        <MapPin size={10} />{p.location}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 hidden sm:block">
                    <p className="font-bold text-slate-800 text-sm">{formatUSD(p.priceUSD)}</p>
                    <p className="text-[11px] text-slate-400">{p.priceETH.toFixed(3)} ETH</p>
                  </div>

                  {/* ROI */}
                  <div className="col-span-2 hidden md:flex items-center gap-1">
                    <TrendingUp size={13} className="text-[#8A74F9]" />
                    <span className="font-bold text-sm text-[#8A74F9]">{p.roi}%</span>
                  </div>

                  {/* Specs */}
                  <div className="col-span-2 hidden lg:flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    {p.beds > 0 && <span className="flex items-center gap-1"><Bed size={11} />{p.beds}bd</span>}
                    {p.baths > 0 && <span className="flex items-center gap-1"><Bath size={11} />{p.baths}ba</span>}
                    <span className="flex items-center gap-1"><Maximize2 size={11} />{p.sqft.toLocaleString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActionId(actionId === p._id ? null : p._id)}
                      className="flex items-center gap-1.5 bg-[#8A74F9]/10 text-[#8A74F9] hover:bg-[#8A74F9] hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                    >
                      <ExternalLink size={12} /> Manage
                    </button>
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">
                {filtered.length} of {nfts.length} properties
              </p>
              <span className="text-xs font-bold text-[#8A74F9]">
                Total: {formatUSD(filtered.reduce((s, p) => s + p.priceUSD, 0))}
              </span>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
