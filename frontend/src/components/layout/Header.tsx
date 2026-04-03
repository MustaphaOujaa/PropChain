"use client";

import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { LayoutDashboard, Store, Building2, BarChart2, Wallet, CalendarDays, Settings, Power, BringToFront } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { usePreferences } from "@/context/PreferencesContext";

const navItems = [
  { icon: LayoutDashboard, href: "/",            label: "Dashboard"   },
  { icon: Store,           href: "/marketplace", label: "Marketplace" },
  { icon: Building2,       href: "/inventory",   label: "Houses"      },
  { icon: BarChart2,       href: "/analytics",   label: "Analytics"   },
  { icon: Wallet,          href: "/portfolio",   label: "Portfolio"   },
  { icon: CalendarDays,    href: "/calendar",    label: "Schedule"    },
  { icon: Settings,        href: "/settings",    label: "Settings"    },
];

interface HeaderProps {
  pageTitle?: string;
}

export default function Header({ pageTitle = "Dashboard" }: HeaderProps) {
  const { t } = usePreferences();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const avatarSrc = user
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}&backgroundColor=b6e3f4`
    : "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest&backgroundColor=b6e3f4";

  const displayName = (user as any)?.name ?? user?.email?.split("@")[0] ?? "Guest";

  return (
    <>
      <header className="h-[72px] md:h-[90px] bg-white dark:bg-slate-900 flex items-center justify-between px-5 md:px-10 border-b border-slate-100 dark:border-slate-800 z-30 shrink-0 relative transition-colors duration-300">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors p-1"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight transition-colors duration-300">{pageTitle}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 md:gap-5 relative">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative text-slate-600 hover:text-[#8A74F9] transition-colors p-2 rounded-xl hover:bg-purple-50"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
            </button>

            <AnimatePresence>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <p className="font-bold text-slate-800 dark:text-white text-sm">{t("notifications" as any)}</p>
                      <span className="bg-[#8A74F9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3 new</span>
                    </div>
                    {[
                      { title: "New bid on Roma Avenue", time: "2 min ago", color: "bg-purple-100 text-purple-600" },
                      { title: "Atlas Shack price updated", time: "15 min ago", color: "bg-emerald-100 text-emerald-600" },
                      { title: "Weekly returns deposited", time: "1 hr ago", color: "bg-orange-100 text-orange-600" },
                    ].map((n, i) => (
                      <div key={i} onClick={() => setNotifOpen(false)} className="flex items-start gap-3 px-4 py-3 hover:bg-[#8A74F9]/5 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                        <div className={`w-8 h-8 rounded-full ${n.color} flex items-center justify-center shrink-0 text-xs font-bold`}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{n.title}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 border-t border-slate-100 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <button 
                        onClick={() => {
                          setNotifOpen(false);
                          toast.success("All notifications marked as read");
                        }} 
                        className="text-[#8A74F9] text-xs font-bold w-full h-full"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <Link href="/settings" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-slate-100 shrink-0">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rowena" alt="Rowena Ravenclaw" className="object-cover w-full h-full" />
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-slate-500 text-sm leading-tight group-hover:text-slate-800 transition-colors">Rowena Ravenclaw</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={clsx(
        "fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 z-50 flex flex-col py-8 px-6 shadow-2xl transition-transform duration-300 md:hidden",
        drawerOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 dark:bg-[#8A74F9]/20 rounded-full flex items-center justify-center">
              <BringToFront size={20} className="text-[#8A74F9]" />
            </div>
            <span className="font-bold text-slate-800 dark:text-white text-lg">PropChain</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
            <X size={22} />
          </button>
        </div>

        {/* User summary in drawer */}
        {user && (
          <div className="flex items-center gap-3 mb-6 px-2 py-3 bg-purple-50 rounded-2xl">
            <img src={avatarSrc} alt={displayName} className="w-10 h-10 rounded-full bg-slate-100" />
            <div>
              <p className="font-bold text-slate-800 text-sm">{displayName}</p>
              <p className="text-slate-400 text-xs">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={clsx(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all",
                  isActive ? "bg-[#8A74F9]/10 text-[#8A74F9]" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {t(item.label.toLowerCase() === "dashboard" ? "dashboard" : 
                   item.label.toLowerCase() === "marketplace" ? "marketplace" :
                   item.label.toLowerCase() === "houses" ? "houses" :
                   item.label.toLowerCase() === "analytics" ? "analytics" :
                   item.label.toLowerCase() === "portfolio" ? "portfolio" :
                   item.label.toLowerCase() === "schedule" ? "schedule" :
                   item.label.toLowerCase() === "settings" ? "settings" : item.label as any)}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-semibold text-sm transition-all"
        >
          <Power size={20} />
          {t("logout")}
        </button>
      </div>

      {/* Close notif dropdown on outside click */}
      {notifOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
      )}
    </>
  );
}
