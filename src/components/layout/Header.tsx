"use client";

import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { Gauge, Home, PieChart, Briefcase, Calendar, Settings, Power, BringToFront } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const navItems = [
  { icon: Gauge, href: "/", label: "Dashboard" },
  { icon: Home, href: "/home", label: "Home" },
  { icon: PieChart, href: "/analytics", label: "Analytics" },
  { icon: Briefcase, href: "/wallet", label: "Wallet" },
  { icon: Calendar, href: "/calendar", label: "Calendar" },
  { icon: Settings, href: "/settings", label: "Settings" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <header className="h-[72px] md:h-[104px] bg-white flex items-center justify-between px-5 md:px-10 border-b border-slate-100 z-30 shrink-0 relative">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-slate-500 hover:text-slate-800 transition-colors p-1"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 md:gap-6 relative">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative text-slate-600 hover:text-[#8B5CF6] transition-colors p-1"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={2} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-10 w-72 bg-white rounded-[24px] shadow-xl border border-slate-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <p className="font-bold text-slate-800 text-sm">Notifications</p>
                </div>
                {[
                  { title: "New bid on House Andromeda", time: "2 min ago", color: "bg-purple-100 text-purple-600" },
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
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm shrink-0">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rowena&backgroundColor=b6e3f4"
                alt="Rowena Ravenclaw"
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-medium text-slate-500 text-sm hidden sm:block whitespace-nowrap">Rowena Ravenclaw</span>
          </div>
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
            <span className="font-bold text-slate-800 text-lg">NFT Dash</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={clsx(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all",
                  isActive
                    ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 font-semibold text-sm transition-all">
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
