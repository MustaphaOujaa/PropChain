"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Store,
  Building2,
  BarChart2,
  Wallet,
  CalendarDays,
  Settings,
  Power,
} from "lucide-react";
import clsx from "clsx";

type NavKey = keyof typeof import("@/context/PreferencesContext").translations["en"];

const navItems: { icon: any; href: string; labelKey: string }[] = [
  { icon: LayoutDashboard, href: "/",            labelKey: "dashboard"   },
  { icon: Store,           href: "/marketplace", labelKey: "marketplace" },
  { icon: Building2,       href: "/inventory",   labelKey: "houses"      },
  { icon: BarChart2,       href: "/analytics",   labelKey: "analytics"   },
  { icon: Wallet,          href: "/portfolio",   labelKey: "portfolio"   },
  { icon: CalendarDays,    href: "/calendar",    labelKey: "schedule"    },
  { icon: Settings,        href: "/settings",    labelKey: "settings"    },
];

import { usePreferences } from "@/context/PreferencesContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { t } = usePreferences();

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <aside className="w-20 bg-[#1E293B] flex-col items-center py-8 z-10 hidden md:flex shrink-0">
        {/* Logo mark */}
        <div className="mb-10">
          <div className="w-10 h-10 bg-[#8A74F9]/20 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#8A74F9] stroke-[#8A74F9]" strokeWidth={2}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        </div>

        {/* Nav icons */}
        <nav className="flex-1 flex flex-col gap-2 w-full items-center" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={t(item.labelKey as any)}
                aria-label={t(item.labelKey as any)}
                className={clsx(
                  "w-12 h-12 rounded-2xl flex items-center justify-center relative transition-all duration-200 group",
                  isActive
                    ? "bg-[#8A74F9] text-white shadow-lg shadow-[#8A74F9]/30"
                    : "text-slate-400 hover:bg-slate-700/60 hover:text-white"
                )}
              >
                {/* Active left indicator */}
                {isActive && (
                  <span className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-1 h-7 bg-[#8A74F9] rounded-r-full" />
                )}
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {/* Tooltip */}
                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-semibold px-2.5 py-1 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-slate-700 z-50">
                  {t(item.labelKey as any)}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <button
            onClick={logout}
            title={t("logout")}
            aria-label={t("logout")}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 group relative"
          >
            <Power size={20} strokeWidth={2} />
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-semibold px-2.5 py-1 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-slate-700 z-50">
              {t("logout")}
            </span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation ─────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E293B] border-t border-slate-700/50 flex md:hidden justify-around items-center h-16 px-2 shadow-lg"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={t(item.labelKey as any)}
              className={clsx(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors",
                isActive ? "text-[#8A74F9]" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t(item.labelKey as any)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
