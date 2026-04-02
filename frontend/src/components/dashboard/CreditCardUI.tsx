"use client";

import { useState } from "react";

const cards = [
  { balance: "$521,652", profit: "$14,225", pct: "+10%", from: "from-[#A07CFF]", via: "via-[#8B5CF6]", to: "to-[#6d28d9]" },
  { balance: "$312,800", profit: "$8,440", pct: "+7%", from: "from-[#06b6d4]", via: "via-[#0891b2]", to: "to-[#0e7490]" },
  { balance: "$98,400", profit: "$2,120", pct: "+3%", from: "from-[#f59e0b]", via: "via-[#d97706]", to: "to-[#b45309]" },
];

export default function CreditCardUI() {
  const [active, setActive] = useState(0);
  const card = cards[active];

  return (
    <div className="flex flex-col gap-4">
      <div className={`w-full min-h-[220px] sm:min-h-[260px] rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${card.from} ${card.via} ${card.to} text-white shadow-lg shadow-purple-200/40 relative overflow-hidden flex flex-col justify-between transition-all duration-500`}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl pointer-events-none" />

        <div className="relative z-10 mt-2">
          <p className="text-white/80 font-medium text-sm mb-2">Balance</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">{card.balance}</h2>
        </div>

        <div className="relative z-10 flex items-end justify-between mb-2">
          <div>
            <p className="text-white/80 font-medium text-sm mb-1">Monthly Profit</p>
            <p className="text-xl sm:text-2xl font-semibold">{card.profit}</p>
          </div>
          <div className="bg-white/25 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
            {card.pct}
          </div>
        </div>
      </div>

      {/* Dot pagination */}
      <div className="flex gap-3 justify-center">
        {cards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            aria-label={`Card ${idx + 1}`}
            className={`rounded-full transition-all duration-300 ${
              idx === active ? "w-6 h-2.5 bg-[#8B5CF6]" : "w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
