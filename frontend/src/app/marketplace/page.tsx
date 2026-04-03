"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api, { propertyApi, Property } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Search, Loader2, X, Wallet, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/context/PreferencesContext";
import { toast } from "sonner";
import clsx from "clsx";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function MarketplacePage() {
  const { t } = usePreferences();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { user, updateUser } = useAuth();
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        const res = await propertyApi.getAll({
          status: "Market",
          category: category !== "All" ? category : undefined,
          search: search || undefined,
        });
        setProperties(res.data);
      } catch (error) {
        console.error("Failed to load marketplace:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, [category, search]);

  const handlePurchase = async () => {
    if (!selectedProp) return;
    try {
      setBuying(selectedProp._id);
      const res = await api.post("/user/purchase", { propertyId: selectedProp._id });
      updateUser({ walletBalance: res.data.walletBalance });
      setProperties((prev) => prev.filter((p) => p._id !== selectedProp._id));
      toast.success(`${t("successfully_purchased" as any)} ${selectedProp.title}!`);
      setConfirmOpen(false);
      setSelectedProp(null);
    } catch (e: any) {
      toast.error(e.response?.data?.message || t("purchase_failed" as any));
    } finally {
      setBuying(null);
    }
  };

  return (
    <DashboardLayout pageTitle={t("marketplace")}>
      <div className="flex flex-col gap-6 h-full pb-10">
        
        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-[24px] shadow-sm transition-colors border border-slate-100 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            {["All", "Mansion", "Villa", "Apartment", "Commercial"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  category === cat
                    ? "bg-[#8A74F9] text-white shadow-md shadow-[#8A74F9]/30"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {t(cat.toLowerCase() as any)}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("search_properties")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-full py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-[#8A74F9]/50 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-[24px] p-4 flex flex-col gap-4 animate-pulse">
                  <div className="w-full aspect-[4/3] bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                  <div className="flex flex-col gap-2">
                    <div className="h-5 bg-slate-200 rounded-full w-3/4" />
                    <div className="h-4 bg-slate-200 rounded-full w-1/2" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
                    <div className="h-4 bg-slate-200 rounded-full w-1/3" />
                    <div className="h-4 bg-slate-200 rounded-full w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full min-h-[400px] text-center bg-white dark:bg-slate-800 rounded-[32px] shadow-sm transition-colors border border-slate-100 dark:border-slate-700"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No properties found</h3>
              <p className="text-sm font-medium text-slate-400">Try adjusting your filters or search term.</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {properties.map((p) => (
                <motion.div
                  key={p._id}
                  variants={itemVariants}
                  className="bg-white rounded-[24px] p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group border border-slate-50"
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                      {t(p.category.toLowerCase() as any)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg tracking-tight line-clamp-1">{p.title}</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">{p.location}</p>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-400">Price</span>
                      <span className="font-bold text-[#8A74F9]">{p.priceETH} ETH</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-slate-400">Expected ROI</span>
                      <span className={`font-bold ${p.roi > 0 ? "text-[#00D3A2]" : "text-rose-500"}`}>
                        {p.roi > 0 ? "+" : ""}{p.roi}%
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={buying === p._id}
                    onClick={() => {
                      setSelectedProp(p);
                      setConfirmOpen(true);
                    }}
                    className="w-full mt-2 bg-slate-900 dark:bg-[#8A74F9] hover:bg-[#8A74F9] dark:hover:bg-[#7864dd] text-white font-bold py-3.5 rounded-2xl transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("purchase_nft")}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── PURCHASE CONFIRMATION MODAL ──────────────────────────────── */}
      <AnimatePresence>
        {confirmOpen && selectedProp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">{t("confirm_payment")}</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{t("review_order_desc" as any)}</p>
                  </div>
                  <button onClick={() => setConfirmOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-5 mb-8 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
                    <img src={selectedProp.imageUrl} alt={selectedProp.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 dark:text-white text-base leading-tight">{selectedProp.title}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{selectedProp.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-[#8A74F9] text-base">{selectedProp.priceETH} ETH</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold">${selectedProp.priceUSD.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t("wallet_balance")}</span>
                    <span className="font-bold text-slate-800 dark:text-white">${user?.walletBalance?.toLocaleString() ?? "0"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t("item_price" as any)}</span>
                    <span className="font-bold text-rose-500">-${selectedProp.priceUSD.toLocaleString()}</span>
                  </div>
                  <div className="h-[1px] bg-slate-100 dark:bg-slate-700 w-full" />
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 dark:text-white">{t("remaining" as any)}</span>
                    <span className={clsx(
                      "font-extrabold text-lg",
                      (user?.walletBalance ?? 0) >= selectedProp.priceUSD ? "text-[#00D3A2]" : "text-rose-500"
                    )}>
                      ${((user?.walletBalance ?? 0) - selectedProp.priceUSD).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Insufficient Funds Warning */}
                {(user?.walletBalance ?? 0) < selectedProp.priceUSD && (
                   <div className="bg-rose-50 dark:bg-rose-500/10 p-4 rounded-2xl mb-8 flex gap-3 items-center border border-rose-100 dark:border-rose-500/20">
                     <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                       <Wallet size={14} className="text-rose-600" />
                     </div>
                     <p className="text-[13px] font-bold text-rose-600 dark:text-rose-400">{t("insufficient_funds")}</p>
                     <a href="/settings" className="ml-auto text-[11px] font-bold underline text-rose-600 uppercase tracking-tighter">Top Up</a>
                   </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setConfirmOpen(false)}
                    className="flex-1 py-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    disabled={buying === selectedProp._id || (user?.walletBalance ?? 0) < selectedProp.priceUSD}
                    onClick={handlePurchase}
                    className="flex-[2] py-4 px-6 rounded-2xl bg-[#8A74F9] text-white font-bold hover:bg-[#7864dd] transition-all shadow-xl shadow-[#8A74F9]/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:grayscale"
                  >
                    {buying === selectedProp._id ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        {t("buy_now")}
                        <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>
      </DashboardLayout>
    );
}
