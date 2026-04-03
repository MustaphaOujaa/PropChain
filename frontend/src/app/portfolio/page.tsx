"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { userApi, Property } from "@/lib/api";
import { Building2, TrendingUp, DollarSign, Wallet } from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";
import clsx from "clsx";

export default function PortfolioPage() {
  const { t } = usePreferences();
  const [nfts, setNfts] = useState<Property[]>([]);
  const [stats, setStats] = useState({ totalVal: 0, rois: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const { data } = await userApi.getPortfolio();
        setNfts(data.ownedNFTs || []);
        setStats({
          totalVal: data.portfolio?.totalInvestedUSD || 0,
          rois: data.portfolio?.avgROI || 0,
          count: data.portfolio?.totalProperties || 0,
        });
      } catch (err: any) {
        if (err.response?.status !== 401) {
          console.error("Load portfolio err:", err);
        }
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  return (
    <DashboardLayout pageTitle={t("my_portfolio")}>
      <div className="flex flex-col gap-8 h-full pb-10">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "total_value", value: `$${stats.totalVal.toLocaleString()}`, color: "bg-purple-50 text-[#8A74F9]", icon: Wallet },
            { label: "average_roi", value: `${stats.rois > 0 ? "+" : ""}${stats.rois}%`, color: "bg-emerald-50 text-[#00D3A2]", icon: TrendingUp },
            { label: "properties", value: String(stats.count), color: "bg-orange-50 text-orange-500", icon: Building2 },
            { label: "est_returns", value: `$${(stats.totalVal * (stats.rois / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "bg-sky-50 text-sky-500", icon: DollarSign }
          ].map((item) => (
            <div key={item.label} className="bg-white dark:bg-slate-800 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-5 transition-colors">
              <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", item.color, "dark:bg-slate-900/50")}>
                <item.icon size={26} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-0.5">{t(item.label as any)}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-none truncate">
                  {item.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Owned NFTs Detail */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 sm:p-8 flex-1 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">{t("owned_assets")}</h2>
          
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 w-full bg-slate-100 dark:bg-slate-700 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : nfts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700">
                <Building2 size={44} />
              </div>
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t("portfolio_empty")}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t("portfolio_empty_desc")}</p>
              </div>
              <a href="/marketplace" className="mt-4 bg-[#8A74F9] text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-[#8A74F9]/25 hover:bg-[#7864dd] transition-all active:scale-95">
                {t("explore_marketplace")}
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-hidden">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="pb-5 font-bold text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider">{t("property")}</th>
                    <th className="pb-5 font-bold text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider">{t("location")}</th>
                    <th className="pb-5 font-bold text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider">{t("purchase_price")}</th>
                    <th className="pb-5 font-bold text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider">{t("current_value_est")}</th>
                    <th className="pb-5 font-bold text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider text-right">{t("roi")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                  {nfts.map((n) => (
                    <tr key={n._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <div className="overflow-hidden rounded-xl w-14 h-14 shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
                            <img src={n.imageUrl} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 dark:text-white text-[15px] truncate">{n.title}</p>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{t(n.category.toLowerCase() as any)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-semibold text-slate-600 dark:text-slate-400">{n.location}</td>
                      <td className="py-5 text-sm font-bold text-slate-800 dark:text-white">${n.priceUSD.toLocaleString()}</td>
                      <td className="py-5 text-sm font-bold text-[#8A74F9] transition-all group-hover:pl-1">${(n.priceUSD * (1 + (n.roi || 0)/100)).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                      <td className="py-5 text-right">
                         <span className={clsx(
                           "inline-block px-3 py-1 bg-opacity-10 rounded-full text-xs font-bold",
                           (n.roi || 0) >= 0 ? "bg-[#00D3A2] text-[#00D3A2]" : "bg-rose-500 text-rose-500",
                           "dark:bg-opacity-20"
                         )}>
                           {(n.roi || 0) >= 0 ? "+" : ""}{n.roi || 0}%
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
