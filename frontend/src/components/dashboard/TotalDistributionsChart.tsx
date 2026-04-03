"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { usePreferences } from "@/context/PreferencesContext";

const datasets: Record<string, { name: string; value: number }[]> = {
  "1W": [
    { name: "Mon", value: 310 }, { name: "Tue", value: 260 }, { name: "Wed", value: 350 },
    { name: "Thu", value: 180 }, { name: "Fri", value: 320 }, { name: "Sat", value: 240 }, { name: "Sun", value: 290 },
  ],
  "1M": [
    { name: "W1", value: 420 }, { name: "W2", value: 380 }, { name: "W3", value: 510 },
    { name: "W4", value: 460 }, { name: "W5", value: 540 },
  ],
  "3M": [
    { name: "Jan", value: 520 }, { name: "Feb", value: 480 }, { name: "Mar", value: 620 },
  ],
  "1Y": [
    { name: "Jan", value: 300 }, { name: "Feb", value: 420 }, { name: "Mar", value: 380 },
    { name: "Apr", value: 510 }, { name: "May", value: 460 }, { name: "Jun", value: 540 },
    { name: "Jul", value: 480 }, { name: "Aug", value: 600 }, { name: "Sep", value: 520 },
    { name: "Oct", value: 580 }, { name: "Nov", value: 640 }, { name: "Dec", value: 700 },
  ],
};

const tabs = ["1W", "1M", "3M", "1Y"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#8A74F9] text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-md">
        ${payload[0].value}
      </div>
    );
  }
  return null;
};

export default function TotalDistributionsChart() {
  const { t } = usePreferences();
  const [activeTab, setActiveTab] = useState("1W");

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors">{t("total_distributions" as any)}</h2>
        {/* Time range tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-full p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#8A74F9] text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-4 sm:p-6 shadow-sm flex-1 flex flex-col w-full min-h-[220px] sm:min-h-[250px] relative border border-transparent dark:border-slate-700/50 transition-colors duration-300">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={datasets[activeTab]} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8A74F9" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#8A74F9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dx={-10} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8A74F9"
              strokeWidth={3.5}
              fillOpacity={1}
              fill="url(#colorValue)"
              activeDot={{ r: 6, fill: "#8A74F9", stroke: "#fff", strokeWidth: 2 }}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
