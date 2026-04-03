"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { dashboardApi, DashboardData } from "@/lib/api";
import TotalDistributionsChart from "@/components/dashboard/TotalDistributionsChart";
import {
  BarChart2, TrendingUp, DollarSign, Home,
  ArrowUpRight, Download, Calendar, ChevronDown,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { usePreferences } from "@/context/PreferencesContext";
import clsx from "clsx";

const RANGES = ["Last 7 Days", "Last Month", "Last Year"] as const;
type Range = typeof RANGES[number];

const BAR_COLORS = ["#8A74F9", "#00D3A2", "#F59E0B", "#3B82F6", "#F43F5E"];

function KpiCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", color)}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-semibold mb-0.5">{label}</p>
        <p className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">{value}</p>
        {sub && (
          <p className="text-emerald-500 text-[11px] font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight size={11} />{sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { t } = usePreferences();
  const [range, setRange] = useState<Range>("Last 7 Days");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.get()
      .then(r => setData(r.data))
      .catch(() => {/* backend may be offline – use null */})
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;

  // Breakdown bar-chart data derived from API
  const breakdownData = stats
    ? [
        { name: "Total Properties", value: stats.totalProperties },
        { name: "On Market",        value: stats.marketProperties },
        { name: "Owned",            value: stats.ownedProperties  },
      ]
    : [];

  // Distribution table rows
  const tableRows = data?.distributions.map(d => ({
    day: d.label,
    value: d.value,
    change: d.value >= 200 ? `+${((d.value - 200) / 200 * 100).toFixed(0)}%` : `-${((200 - d.value) / 200 * 100).toFixed(0)}%`,
    positive: d.value >= 200,
  })) ?? [];

  return (
    <DashboardLayout pageTitle={t("analytics")}>
      <div className="pb-20 md:pb-0 space-y-8">

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">{t("investment_overview")}</h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm">...</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl">
              {RANGES.map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={clsx(
                    "px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                    range === r ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <Calendar size={14} className="text-[#8A74F9]" />
              {t("custom")}
              <ChevronDown size={13} className="text-slate-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#8A74F9]/10 text-[#8A74F9] text-sm font-bold hover:bg-[#8A74F9]/20 transition-all">
              <Download size={14} />
              {t("export")}
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[24px] h-28 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={BarChart2}   label={t("avg_roi")}          value={`${stats?.avgROI ?? 0}%`}                            sub="..."    color="bg-purple-100 text-purple-600 dark:bg-[#8A74F9]/10 dark:text-[#8A74F9]" />
            <KpiCard icon={DollarSign}  label={t("total_investment")} value={`${stats?.totalInvestmentETH ?? 0.56} ETH`}          sub="..."         color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" />
            <KpiCard icon={TrendingUp}  label={t("weekly_returns")}   value={`${stats?.weeklyReturnsETH ?? 0.005} ETH`}            sub="..." color="bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" />
            <KpiCard icon={Home}        label={t("total_properties")} value={String(stats?.totalProperties ?? 0)}                  sub="..." color="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" />
          </div>
        )}

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Distribution Chart (large) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-[28px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-lg tracking-tight">{t("total_distributions" as any)}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-0.5">{t("weekly_portfolio_curve")}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-[#8A74F9]/10 rounded-2xl flex items-center justify-center transition-colors">
                <BarChart2 size={18} className="text-[#8A74F9]" />
              </div>
            </div>
            <div className="h-72">
              <TotalDistributionsChart />
            </div>
          </div>

          {/* Breakdown Bar chart (small) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[28px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-lg tracking-tight">{t("property_breakdown")}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-0.5">{t("listings_by_status")}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Home size={18} className="text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={breakdownData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {breakdownData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Data Table ── */}
        <div className="bg-white dark:bg-slate-800 rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">{t("daily_distribution_log")}</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{tableRows.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/60 dark:bg-slate-900/40">
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{t("daily")}</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{t("total_distributions" as any)} ($)</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{t("vs_baseline")}</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{t("status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(loading ? Array.from({ length: 5 }) : tableRows).map((row: any, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    {loading ? (
                      <><td colSpan={4} className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" /></td></>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200">{row.day || "—"}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-extrabold text-slate-800 dark:text-white">${row.value}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={clsx("text-xs font-bold", row.positive ? "text-emerald-500" : "text-rose-500")}>
                            {row.change}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={clsx(
                            "text-[10px] font-bold px-2.5 py-1 rounded-full",
                            row.positive ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          )}>
                            {row.positive ? t("above_target") : t("below_target")}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer summary */}
          {!loading && stats && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-slate-400 font-medium">
                Total market value: <strong className="text-slate-700">${stats.totalValueUSD.toLocaleString()}</strong>
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Expenses: <strong className="text-rose-500">{stats.expensesETH} ETH</strong> &nbsp;·&nbsp;
                Avg ROI: <strong className="text-emerald-600">{stats.avgROI}%</strong>
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
