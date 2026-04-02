"use client";

import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { LayoutDashboard, Store, Wallet, MessageSquare, Settings, Power, BringToFront } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

const navItems = [
  { icon: LayoutDashboard, href: "/", label: "Dashboard" },
  { icon: Store,           href: "/marketplace", label: "Marketplace" },
  { icon: Wallet,          href: "/portfolio", label: "Portfolio" },
  { icon: MessageSquare,   href: "/messages", label: "Messages" },
  { icon: Settings,        href: "/settings", label: "Settings" },
];

interface HeaderProps {
  pageTitle?: string;
}

export default function Header({ pageTitle = "Dashboard" }: HeaderProps) {
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
      <header className="h-[72px] md:h-[90px] bg-white flex items-center justify-between px-5 md:px-10 border-b border-slate-100 z-30 shrink-0 relative">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-slate-500 hover:text-slate-800 transition-colors p-1"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">{pageTitle}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 md:gap-5 relative">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative text-slate-600 hover:text-[#8B5CF6] transition-colors p-2 rounded-xl hover:bg-purple-50"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-[24px] shadow-xl border border-slate-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <p className="font-bold text-slate-800 text-sm">Notifications</p>
                  <span className="bg-[#8B5CF6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3 new</span>
                </div>
                {[
                  { title: "New bid on Villa Del Lago", time: "2 min ago", color: "bg-purple-100 text-purple-600" },
                  { title: "Roma Avenue price updated", time: "15 min ago", color: "bg-emerald-100 text-emerald-600" },
                  { title: "Weekly returns deposited", time: "1 hr ago", color: "bg-orange-100 text-orange-600" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className={`w-8 h-8 rounded-full ${n.color} flex items-center justify-center shrink-0 text-xs font-bold`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className="p-3 border-t border-slate-100 text-center">
                  <button onClick={() => setNotifOpen(false)} className="text-[#8B5CF6] text-xs font-bold hover:underline">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <Link href="/settings" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-slate-100 border-2 border-[#8B5CF6]/20 shrink-0 group-hover:border-[#8B5CF6]/50 transition-all">
              <img src={avatarSrc} alt={displayName} className="object-cover w-full h-full" />
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-slate-700 text-sm leading-tight">{displayName}</p>
              {user && <p className="text-slate-400 text-xs">{user.email}</p>}
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
        "fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col py-8 px-6 shadow-2xl transition-transform duration-300 md:hidden",
        drawerOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
              <BringToFront size={20} className="text-[#8B5CF6]" />
            </div>
            <span className="font-bold text-slate-800 text-lg">PropChain</span>
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
                  isActive ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 font-semibold text-sm transition-all"
        >
          <Power size={20} />
          Logout
        </button>
      </div>

      {/* Close notif dropdown on outside click */}
      {notifOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
      )}
    </>
  );
}
