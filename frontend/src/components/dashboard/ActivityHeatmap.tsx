"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/context/PreferencesContext";

type DayActivity = {
  date: string;
  count: number;
  level: number; // 0 to 4
};

// Helper to generate mock data (last 20 weeks)
const generateMockData = (): DayActivity[][] => {
  const weeks: DayActivity[][] = [];
  const today = new Date();
  
  // 20 weeks
  for (let w = 20; w >= 0; w--) {
    const week: DayActivity[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      
      // Random activity level favoring 0 and 1, but occasional 3-4
      const rand = Math.random();
      let level = 0;
      if (rand > 0.9) level = 4;
      else if (rand > 0.75) level = 3;
      else if (rand > 0.5) level = 2;
      else if (rand > 0.3) level = 1;

      // Ensure no future dates are filled
      if (date > today) level = 0;

      week.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        count: level === 0 ? 0 : Math.floor(Math.random() * (level * 5)) + 1,
        level,
      });
    }
    weeks.push(week);
  }
  return weeks;
};

export default function ActivityHeatmap() {
  const { t } = usePreferences();
  const weeks = useMemo(() => generateMockData(), []);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; data: DayActivity } | null>(null);

  const getColorClass = (level: number) => {
    switch (level) {
      case 1: return "bg-purple-300 dark:bg-purple-900/60 shadow-[0_0_8px_rgba(216,180,254,0.3)] dark:shadow-none";
      case 2: return "bg-purple-400 dark:bg-purple-700/80 shadow-[0_0_10px_rgba(192,132,252,0.4)] dark:shadow-none";
      case 3: return "bg-purple-500 dark:bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)] dark:shadow-none";
      case 4: return "bg-purple-600 dark:bg-purple-400 shadow-[0_0_14px_rgba(147,51,234,0.6)] dark:shadow-none";
      default: return "bg-slate-100 dark:bg-slate-800/60";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-800/50 relative overflow-hidden group">
      {/* Background glow decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700"></div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Activity Graph</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your recent contributions</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-xl leading-none font-bold pb-2 tracking-widest">...</button>
      </div>

      <div className="relative z-10 w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="min-w-max flex gap-1.5" onMouseLeave={() => setHoveredCell(null)}>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day, dIdx) => (
                <motion.div
                  key={dIdx}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: (wIdx * 0.02) + (dIdx * 0.01), 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredCell({ x: rect.left + rect.width / 2, y: rect.top, data: day });
                  }}
                  className={`w-[14px] h-[14px] rounded-[3px] transition-all duration-200 hover:scale-125 cursor-pointer ${getColorClass(day.level)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Tooltip */}
      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-3"
            style={{ left: hoveredCell.x, top: hoveredCell.y }}
          >
            <div className="bg-slate-800 dark:bg-slate-700 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap flex flex-col items-center">
              <span className="font-semibold">{hoveredCell.data.count > 0 ? \`\${hoveredCell.data.count} contributions\` : 'No activity'}</span>
              <span className="text-slate-300 dark:text-slate-400 text-[10px] mt-0.5">{hoveredCell.data.date}</span>
              {/* Tooltip arrow */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 relative z-10">
        <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline-offset-2 hover:underline">Learn how we count contributions</a>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map(l => (
              <div key={l} className={`w-3 h-3 rounded-[2px] ${getColorClass(l)}`}></div>
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
