"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Store,
  Wallet,
  MessageSquare,
  Settings,
  Power,
  BringToFront,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { icon: LayoutDashboard, href: "/", label: "Dashboard" },
  { icon: Store,           href: "/marketplace", label: "Marketplace" },
  { icon: Wallet,          href: "/portfolio", label: "Portfolio" },
  { icon: MessageSquare,   href: "/messages", label: "Messages" },
  { icon: Settings,        href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-24 bg-white border-r border-slate-100 flex-col items-center py-8 z-10 hidden md:flex shrink-0">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <BringToFront size={22} className="text-[#8B5CF6]" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-9 w-full mt-4" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={clsx(
                  "w-full flex justify-center relative py-2 transition-colors group",
                  isActive ? "text-[#8B5CF6]" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#8B5CF6] rounded-r-md" />
                )}
                <div className="relative">
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {/* Tooltip */}
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <button
            onClick={logout}
            className="text-slate-400 hover:text-rose-500 transition-colors p-2 group relative"
            title="Logout"
            aria-label="Logout"
          >
            <Power size={22} strokeWidth={2} />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 flex md:hidden justify-around items-center h-16 px-2 shadow-lg"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={clsx(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors",
                isActive ? "text-[#8B5CF6]" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
