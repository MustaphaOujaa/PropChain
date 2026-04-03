"use client";

import { useState, useEffect } from "react";
import { userApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { usePreferences } from "@/context/PreferencesContext";

export default function CreditCardUI() {
  const { t } = usePreferences();
  const { user } = useAuth();
  const [active, setActive] = useState(0);

  const walletBalance = user?.walletBalance ?? null;

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  const primaryBalance = walletBalance !== null ? fmt(walletBalance) : "$521,652";
  const primaryProfit =
    walletBalance !== null ? fmt(Math.round(walletBalance * 0.027)) : "$14,225";

  const cards = [
    {
      balance: primaryBalance,
      profit: primaryProfit,
      pct: "+10%",
      from: "from-[#A07CFF]",
      via: "via-[#8B5CF6]",
      to: "to-[#6D28D9]",
    },
    {
      balance: "$312,800",
      profit: "$8,440",
      pct: "+7%",
      from: "from-[#06b6d4]",
      via: "via-[#0891b2]",
      to: "to-[#0e7490]",
    },
    {
      balance: "$98,400",
      profit: "$2,120",
      pct: "+3%",
      from: "from-[#f59e0b]",
      via: "via-[#d97706]",
      to: "to-[#b45309]",
    },
  ];

  const card = cards[active];

  return (
    <div className="flex flex-col gap-4">
      {/* Card face */}
      <motion.div
        layout
        className={`w-full min-h-[220px] sm:min-h-[260px] rounded-[32px] p-6 sm:p-8 bg-gradient-to-br ${card.from} ${card.via} ${card.to} text-white shadow-xl shadow-purple-900/10 relative overflow-hidden flex flex-col justify-between transition-transform duration-500 hover:scale-[1.02] hover:-translate-y-1 group`}
      >
        {/* Dynamic glare effect hidden on normal, visible on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full duration-1000 transition-all -translate-x-full pointer-events-none" />
        
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />

        <div className="relative z-10 mt-2">
          <p className="text-white/80 font-medium text-sm mb-2 drop-shadow-sm">{t("total_balance" as any)}</p>
          <motion.h2 
            key={card.balance}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none drop-shadow-sm"
          >
            {card.balance}
          </motion.h2>
        </div>

        <div className="relative z-10 flex items-end justify-between mb-2">
          <div>
            <p className="text-white/80 font-medium text-sm mb-1 drop-shadow-sm">{t("monthly_profit" as any)}</p>
            <motion.p 
              key={card.profit}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl sm:text-2xl font-bold tracking-tight"
            >
              {card.profit}
            </motion.p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/25 backdrop-blur-md px-4 py-1.5 rounded-2xl text-sm font-extrabold shadow-sm border border-white/10 whitespace-nowrap"
          >
            {card.pct}
          </motion.div>
        </div>
      </motion.div>

      {/* Dot pagination */}
      <div className="flex gap-3 justify-center">
        {cards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            aria-label={`Card ${idx + 1}`}
            className={`rounded-full transition-all duration-300 ${
              idx === active
                ? "w-6 h-2.5 bg-[#8A74F9]"
                : "w-2.5 h-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
