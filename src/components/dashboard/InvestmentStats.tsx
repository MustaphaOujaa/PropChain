"use client";

import { useState } from "react";
import { Target, Calendar, CreditCard } from "lucide-react";

const periods = ["Daily", "Weekly", "Monthly"];

const data: Record<string, { investment: string; returns: string; expenses: string; bars: number[] }> = {
  Daily:   { investment: "0.12 Ether", returns: "0.001 Ether", expenses: "0.002 Ether", bars: [30, 55, 40, 65] },
  Weekly:  { investment: "0.56 Ether", returns: "0.005 Ether", expenses: "0.005 Ether", bars: [40, 85, 60, 75] },
  Monthly: { investment: "2.30 Ether", returns: "0.024 Ether", expenses: "0.018 Ether", bars: [60, 100, 75, 90] },
};

export default function InvestmentStats() {
  const [period, setPeriod] = useState("Weekly");
  const [menuOpen, setMenuOpen] = useState(false);
  const d = data[period];

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Investment Stats</h2>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-400 font-bold transition-colors hover:text-slate-600 tracking-widest text-lg leading-none -mt-2 px-2"
          >
            ...
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden">
                {periods.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${
                      period === p
                        ? "text-[#8B5CF6] bg-purple-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 sm:p-8 flex-1 min-h-[280px] sm:min-h-[360px] shadow-sm flex flex-col relative overflow-hidden">
        {/* Period Pills */}
        <div className="flex gap-2 mb-6">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                period === p
                  ? "bg-[#8B5CF6] text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex-1 flex w-full h-full">
          {/* Stats */}
          <div className="flex flex-col gap-6 justify-center w-[55%]">
            {[
              { Icon: Target, color: "bg-orange-100/50 text-orange-500", label: "Total Investement", value: d.investment, textColor: "text-orange-500" },
              { Icon: Calendar, color: "bg-emerald-100/50 text-emerald-500", label: "Weekly Returns", value: d.returns, textColor: "text-emerald-500" },
              { Icon: CreditCard, color: "bg-rose-100/50 text-rose-500", label: "Expenses", value: d.expenses, textColor: "text-rose-500" },
            ].map(({ Icon, color, label, value, textColor }) => (
              <div key={label} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-sm shrink-0`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-0.5">{label}</p>
                  <p className={`${textColor} font-bold flex items-center gap-1.5 leading-none`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                    </svg>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="w-[45%] flex flex-col justify-between items-end relative h-full py-2">
            <span className="text-[11px] font-medium text-slate-400 absolute top-0 -right-2">Max</span>
            <div className="absolute inset-x-0 top-3 h-[1px] bg-slate-100 w-full" />
            <div className="absolute inset-x-0 bottom-4 h-[1px] bg-slate-100 w-full" />
            <div className="flex items-end justify-between w-full h-full px-6 pb-4 pt-4 z-10 gap-3">
              {d.bars.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`w-3.5 rounded-full shrink-0 transition-all duration-500 ${
                    [" bg-orange-400", "bg-emerald-400", "bg-rose-400", "bg-emerald-400"][i]
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-slate-400 absolute bottom-0 -right-2">Min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
