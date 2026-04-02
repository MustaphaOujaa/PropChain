"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { propertyApi, userApi, Property } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Search, SlidersHorizontal, Bed, Bath, Maximize2,
  MapPin, TrendingUp, Star, ShoppingCart, X, CheckCircle,
  AlertCircle, Crown, Building2, Home, Landmark, Store,
} from "lucide-react";
import clsx from "clsx";

// ── Category Config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "All", value: "", icon: Store },
  { label: "Mansion", value: "Mansion", icon: Crown },
  { label: "Villa", value: "Villa", icon: Home },
  { label: "Apartment", value: "Apartment", icon: Building2 },
  { label: "Commercial", value: "Commercial", icon: Landmark },
  { label: "Penthouse", value: "Penthouse", icon: Star },
];

// ── Category Colors ───────────────────────────────────────────────────────────
const CATEGORY_COLOR: Record<string, string> = {
  Mansion: "bg-purple-100 text-purple-700",
  Villa: "bg-emerald-100 text-emerald-700",
  Apartment: "bg-blue-100 text-blue-700",
  Commercial: "bg-orange-100 text-orange-700",
  Penthouse: "bg-rose-100 text-rose-700",
};

function formatUSD(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${(n / 1_000).toFixed(0)}K`;
}

// ── Property Card ─────────────────────────────────────────────────────────────
function PropertyCard({
  property,
  onBuy,
  buying,
}: {
  property: Property;
  onBuy: (p: Property) => void;
  buying: boolean;
}) {
  const categoryColor = CATEGORY_COLOR[property.category] ?? "bg-slate-100 text-slate-600";
  const isAvailable = property.status === "Market";

  return (
    <article className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-slate-100 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Status Badge */}
        <div className={clsx(
          "absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide",
          isAvailable ? "bg-emerald-500 text-white" :
          property.status === "Pending" ? "bg-amber-400 text-white" : "bg-slate-400 text-white"
        )}>
          {property.status}
        </div>
        {property.isTopPick && (
          <div className="absolute top-3 left-3 bg-[#8B5CF6] text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
            <Star size={10} fill="white" /> Top Pick
          </div>
        )}
        {/* ROI Overlay */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1">
          <TrendingUp size={11} /> {property.roi}% ROI
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Category + Location */}
        <div className="flex items-center justify-between">
          <span className={clsx("text-[11px] font-bold px-2.5 py-1 rounded-full", categoryColor)}>
            {property.category}
          </span>
          <span className="text-slate-400 text-[12px] flex items-center gap-1">
            <MapPin size={11} /> {property.location}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-[17px] leading-tight">{property.title}</h3>

        {/* Specs */}
        <div className="flex items-center gap-4 text-slate-400 text-[12px]">
          {property.beds > 0 && (
            <span className="flex items-center gap-1 font-medium">
              <Bed size={13} /> {property.beds} Beds
            </span>
          )}
          {property.baths > 0 && (
            <span className="flex items-center gap-1 font-medium">
              <Bath size={13} /> {property.baths} Bath
            </span>
          )}
          <span className="flex items-center gap-1 font-medium">
            <Maximize2 size={13} /> {property.sqft.toLocaleString()} sqft
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-slate-100">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Price</p>
            <p className="text-[22px] font-extrabold text-slate-800 leading-tight">
              {formatUSD(property.priceUSD)}
            </p>
            <p className="text-[12px] text-slate-400 font-medium">{property.priceETH.toFixed(2)} ETH</p>
          </div>

          <button
            id={`buy-${property._id}`}
            disabled={!isAvailable || buying}
            onClick={() => onBuy(property)}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200",
              isAvailable
                ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/40 active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <ShoppingCart size={15} />
            {isAvailable ? "Buy Now" : property.status}
          </button>
        </div>
      </div>
    </article>
  );
}

// ── Top Picks Section ─────────────────────────────────────────────────────────
function TopPicksBar({ picks, onBuy, buying }: { picks: Property[]; onBuy: (p: Property) => void; buying: boolean }) {
  return (
    <div className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-[28px] p-6 mb-8 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Star size={18} fill="white" />
          <h2 className="text-xl font-extrabold tracking-tight">Top Picks for You</h2>
        </div>
        <p className="text-white/60 text-sm mb-6">Hand-curated high-ROI properties from our analysts</p>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {picks.map((p) => (
            <div
              key={p._id}
              className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 w-56 hover:bg-white/20 transition-all"
            >
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-28 object-cover rounded-xl mb-3"
              />
              <p className="font-bold text-white text-sm leading-tight mb-1">{p.title}</p>
              <p className="text-white/60 text-[11px] flex items-center gap-1 mb-3">
                <MapPin size={10} /> {p.location}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-base font-extrabold">{formatUSD(p.priceUSD)}</p>
                  <p className="text-emerald-300 text-[11px] font-bold flex items-center gap-0.5">
                    <TrendingUp size={10} /> {p.roi}% ROI
                  </p>
                </div>
                <button
                  disabled={buying}
                  onClick={() => onBuy(p)}
                  id={`top-buy-${p._id}`}
                  className="bg-white text-[#8B5CF6] text-[11px] font-extrabold px-3 py-1.5 rounded-xl hover:bg-white/90 transition-colors active:scale-95"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={clsx(
      "fixed bottom-24 md:bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold animate-in slide-in-from-right",
      type === "success" ? "bg-emerald-500" : "bg-rose-500"
    )}>
      {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={16} /></button>
    </div>
  );
}

// ── Marketplace Page ──────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [topPicks, setTopPicks] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<"priceAsc" | "priceDesc" | "roi" | "newest">("newest");
  const [buying, setBuying] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const [propsRes, topRes] = await Promise.all([
        propertyApi.getAll({ category: category || undefined, search: search || undefined }),
        propertyApi.getTopPicks(),
      ]);
      setProperties(propsRes.data);
      setTopPicks(topRes.data);
    } catch {
      setToast({ message: "Failed to load properties. Is the backend running?", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = setTimeout(fetchProperties, 300);
    return () => clearTimeout(timer);
  }, [fetchProperties]);

  const handleBuy = async (p: Property) => {
    if (!user) {
      setToast({ message: "Please log in to purchase properties.", type: "error" });
      return;
    }
    setBuying(true);
    try {
      await userApi.purchase(p._id);
      setToast({ message: `🎉 Successfully purchased "${p.title}"!`, type: "success" });
      fetchProperties();
    } catch (err: any) {
      setToast({ message: err?.response?.data?.message ?? "Purchase failed.", type: "error" });
    } finally {
      setBuying(false);
    }
  };

  // Client-side sort
  const sorted = [...properties].sort((a, b) => {
    if (sortBy === "priceAsc") return a.priceUSD - b.priceUSD;
    if (sortBy === "priceDesc") return b.priceUSD - a.priceUSD;
    if (sortBy === "roi") return b.roi - a.roi;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <DashboardLayout pageTitle="Marketplace">
      <div className="pb-20 md:pb-0 max-w-[1400px] mx-auto">

        {/* Top Picks */}
        {topPicks.length > 0 && (
          <TopPicksBar picks={topPicks} onBuy={handleBuy} buying={buying} />
        )}

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="marketplace-search"
              type="text"
              placeholder="Search properties…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              id="marketplace-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none pl-11 pr-6 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 font-medium outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="roi">Highest ROI</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                id={`cat-${cat.value || "all"}`}
                onClick={() => setCategory(cat.value)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0",
                  category === cat.value
                    ? "bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/25"
                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                )}
              >
                <Icon size={15} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-500 text-sm font-medium">
            {isLoading ? "Loading…" : `${sorted.length} propert${sorted.length === 1 ? "y" : "ies"} found`}
          </p>
          {category && (
            <button
              onClick={() => setCategory("")}
              className="text-[#8B5CF6] text-sm font-semibold flex items-center gap-1 hover:text-[#7C3AED]"
            >
              <X size={14} /> Clear filter
            </button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[24px] h-96 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Store size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No properties found</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              Try a different search term or category. Make sure the backend is seeded.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map((p) => (
              <PropertyCard key={p._id} property={p} onBuy={handleBuy} buying={buying} />
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </DashboardLayout>
  );
}
