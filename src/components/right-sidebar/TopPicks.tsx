"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

const picks = [
  { name: "Roma Avenue", fiat: "$ 400,000", crypto: "0.0000345 Ether", color: "bg-rose-500" },
  { name: "Atlas Shack", fiat: "$ 500,000", crypto: "0.0000678 Ether", color: "bg-yellow-400" },
  { name: "Germanrin", fiat: "$ 786,000", crypto: "0.0000887 Ether", color: "bg-emerald-400" },
  { name: "Heavens", fiat: "$ 667,000", crypto: "0.0000761 Ether", color: "bg-yellow-400" },
  { name: "Heretho", fiat: "$ 348,000", crypto: "0.0000302 Ether", color: "bg-rose-500" },
];

export default function TopPicks() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6 w-full mt-2">
      {picks.map((item, idx) => (
        <div
          key={idx}
          onClick={() => setSelected(selected === idx ? null : idx)}
          className={`flex justify-between items-center group cursor-pointer p-3 -mx-3 rounded-[20px] transition-all duration-200 ${
            selected === idx ? "bg-[#8B5CF6]/8 scale-[1.01]" : "hover:bg-white hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-5">
            <div className={`w-1 h-7 rounded-full shrink-0 ${item.color} transition-all ${selected === idx ? "h-10" : ""}`} />
            <div className="flex flex-col gap-0.5">
              <p className={`font-bold text-[15px] tracking-tight transition-colors ${selected === idx ? "text-[#8B5CF6]" : "text-slate-800 group-hover:text-[#8B5CF6]"}`}>
                {item.name}
              </p>
              <p className="text-[13px] text-slate-400 font-medium">{item.fiat}</p>
              {selected === idx && (
                <p className="text-[12px] text-[#8B5CF6] font-semibold mt-1 animate-fade-in">{item.crypto}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-5">
            {selected !== idx && <p className="text-[12px] font-medium text-slate-400">{item.crypto}</p>}
            <ChevronRight
              size={18}
              className={`transition-transform duration-200 ${selected === idx ? "rotate-90 text-[#8B5CF6]" : "text-slate-300 group-hover:text-[#8B5CF6]"}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
