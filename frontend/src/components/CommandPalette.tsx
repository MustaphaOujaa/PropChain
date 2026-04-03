"use client";

import { useState, useEffect } from "react";
import { Search, Home, Briefcase, Calendar, PieChart, Settings, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/context/PreferencesContext";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { t } = usePreferences();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const menu = [
    { name: "dashboard",        icon: Home,       href: "/" },
    { name: "marketplace",      icon: ShoppingBag,href: "/marketplace" },
    { name: "my_portfolio",     icon: Briefcase,  href: "/portfolio" },
    { name: "houses",           icon: PieChart,   href: "/inventory" },
    { name: "analytics",        icon: PieChart,   href: "/analytics" },
    { name: "schedule",         icon: Calendar,   href: "/calendar" },
    { name: "settings",         icon: Settings,   href: "/settings" },
  ];

  const filtered = menu.filter((item) =>
    t(item.name as any).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-white/20 dark:border-slate-700 ring-1 ring-black/5"
            >
              <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-700">
                <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                <input
                  autoFocus
                  placeholder={t("search_placeholder" as any)}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 dark:text-white focus:outline-none placeholder:text-slate-400 font-medium"
                />
                <div className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-400 font-bold px-2 py-1 rounded-md shrink-0 uppercase tracking-widest">
                  Esc
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="py-14 text-center text-sm font-semibold text-slate-400">
                    {t("no_results" as any) || "No results found."}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {filtered.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => {
                          setOpen(false);
                          router.push(item.href);
                        }}
                        className="flex items-center w-full px-4 py-3 rounded-2xl text-left hover:bg-[#8A74F9]/5 dark:hover:bg-[#8A74F9]/10 hover:text-[#8A74F9] text-slate-600 dark:text-slate-300 font-bold text-sm transition-colors group"
                      >
                        <item.icon className="w-4 h-4 mr-3 opacity-50 group-hover:opacity-100" />
                        {t(item.name as any)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
