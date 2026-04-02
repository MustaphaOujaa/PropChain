"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { userApi, PortfolioData, Property } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  TrendingUp, Wallet, BarChart2, Home,
  MapPin, ArrowUpRight, Clock, ShoppingBag,
  Activity,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import clsx from "clsx";

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DIST_COLORS = ["#8B5CF6", "#00D3A2", "#F59E0B", "#3B82F6"];

function formatUSD(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K` : `$${n.toFixed(0)}`;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, color,
}: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className={clsx("bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow")}>
      <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", color)}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</p>
        {sub && <p className="text-emerald-500 text-[12px] font-semibold flex items-center gap-0.5 mt-1"><ArrowUpRight size={12} />{sub}</p>}
      </div>
    </div>
  );
}

// ── NFT Card ──────────────────────────────────────────────────────────────────
function OwnedNFTCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-[20px] flex gap-4 p-4 border border-slate-100 hover:shadow-md transition-all group">
      <img
        src={property.imageUrl}
        alt={property.title}
        className="w-20 h-20 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 text-sm leading-tight">{property.title}</h3>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">Owned</span>
        </div>
        <p className="text-slate-400 text-[12px] flex items-center gap-1 mt-1">
          <MapPin size={10} /> {property.location}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-slate-800 font-extrabold text-base">
            {property.priceUSD >= 1_000_000
              ? `$${(property.priceUSD / 1_000_000).toFixed(2)}M`
              : `$${(property.priceUSD / 1_000).toFixed(0)}K`}
          </p>
          <span className="text-[#8B5CF6] text-[12px] font-bold flex items-center gap-0.5">
            <TrendingUp size={11} /> {property.roi}% ROI
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Custom Pie Label ──────────────────────────────────────────────────────────
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const rad = (Math.PI / 180);
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * rad);
  const y = cy + radius * Math.sin(-midAngle * rad);
  if (percent < 0.08) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[11px] font-bold" fontSize={11} fontWeight={700}>
      {name}
    </text>
  );
};

// ── Portfolio Page ────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    userApi.getPortfolio()
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load portfolio. Please check your connection."))
      .finally(() => setIsLoading(false));
  }, [user]);

  const weeklyChartData = data?.portfolio.weeklyData.map((val, i) => ({
    day: WEEK_LABELS[i],
    value: val,
  })) ?? [];

  const distData = data?.portfolio.distributionData ?? [];

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Portfolio">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[24px] h-28 animate-pulse border border-slate-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[24px] h-72 animate-pulse border border-slate-100" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout pageTitle="Portfolio">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Wallet size={32} className="text-[#8B5CF6]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sign in to view your portfolio</h2>
          <p className="text-slate-500 max-w-xs">Your NFT collection and investment returns will appear here once you&apos;re logged in.</p>
          <a href="/login" className="mt-6 bg-[#8B5CF6] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#7C3AED] transition-colors">
            Sign In
          </a>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Portfolio">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-rose-500 font-semibold">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  const p = data!.portfolio;
  const profile = data!.profile;

  return (
    <DashboardLayout pageTitle="Portfolio">
      <div className="pb-20 md:pb-0 space-y-8">

        {/* Profile Banner */}
        <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-[28px] p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 flex items-center gap-5">
            <img
              src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`}
              alt={profile.name}
              className="w-16 h-16 rounded-full border-4 border-white/30 object-cover"
            />
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">{profile.name}</h2>
              <p className="text-white/60 text-sm">{profile.email}</p>
              <p className="text-white font-bold text-lg mt-1">
                Wallet: <span className="text-emerald-300">${profile.walletBalance.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={Wallet} label="Total Invested" value={formatUSD(p.totalInvestedUSD)} sub={`${p.avgROI}% avg ROI`} color="bg-purple-100 text-purple-600" />
          <StatCard icon={TrendingUp} label="Est. Returns" value={formatUSD(p.estimatedReturns)} sub="Projected annual" color="bg-emerald-100 text-emerald-600" />
          <StatCard icon={Home} label="Properties Owned" value={String(p.totalProperties)} color="bg-blue-100 text-blue-600" />
          <StatCard icon={BarChart2} label="Avg ROI" value={`${p.avgROI}%`} sub="Across portfolio" color="bg-orange-100 text-orange-600" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Weekly Performance */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Weekly Performance</h3>
                <p className="text-slate-400 text-sm mt-0.5">Portfolio value trend this week</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Activity size={18} className="text-[#8B5CF6]" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyChartData}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                  formatter={(v: any) => [`${v}%`, "Performance"]}
                />
                <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#portfolioGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Portfolio Distribution</h3>
                <p className="text-slate-400 text-sm mt-0.5">Breakdown by property type</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <BarChart2 size={18} className="text-emerald-600" />
              </div>
            </div>
            {distData.every((d) => d.value === 0) ? (
              <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No data yet</div>
            ) : (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="60%" height={200}>
                  <PieChart>
                    <Pie
                      data={distData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      labelLine={false}
                      label={PieLabel}
                    >
                      {distData.map((_, i) => (
                        <Cell key={i} fill={DIST_COLORS[i % DIST_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [v, "Properties"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-3 flex-1">
                  {distData.map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: DIST_COLORS[i % DIST_COLORS.length] }} />
                      <span className="text-slate-500 text-sm flex-1">{entry.name}</span>
                      <span className="font-bold text-slate-800 text-sm">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Owned NFTs + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Owned NFTs */}
          <div className="lg:col-span-2 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-slate-800 text-lg tracking-tight flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#8B5CF6]" /> My NFT Collection
              </h3>
              <span className="text-[#8B5CF6] text-sm font-bold bg-purple-50 px-3 py-1 rounded-full">
                {data!.ownedNFTs.length} items
              </span>
            </div>
            {data!.ownedNFTs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Home size={36} className="text-slate-200 mb-3" />
                <p className="text-slate-400 text-sm">No properties owned yet. Visit the Marketplace to invest!</p>
                <a href="/marketplace" className="mt-4 bg-[#8B5CF6] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#7C3AED] transition-colors">
                  Browse Marketplace
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                {data!.ownedNFTs.map((nft) => (
                  <OwnedNFTCard key={nft._id} property={nft} />
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-lg tracking-tight flex items-center gap-2 mb-5">
              <Clock size={18} className="text-slate-400" /> Recent Activity
            </h3>
            {data!.activityLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Clock size={30} className="text-slate-200 mb-2" />
                <p className="text-slate-400 text-sm">No activity yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {data!.activityLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <ArrowUpRight size={14} className="text-[#8B5CF6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 text-sm font-semibold leading-tight">{log.action}</p>
                      {log.amount > 0 && (
                        <p className="text-emerald-500 text-xs font-bold mt-0.5">-${log.amount.toLocaleString()}</p>
                      )}
                      <p className="text-slate-400 text-xs mt-0.5">
                        {new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart — Investment by Category */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-lg tracking-tight mb-6">Investment Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={distData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]}>
                {distData.map((_, i) => (
                  <Cell key={i} fill={DIST_COLORS[i % DIST_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </DashboardLayout>
  );
}
