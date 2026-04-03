"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChevronLeft, ChevronRight, Clock, MapPin, Gavel, Tag, BellRing } from "lucide-react";
import clsx from "clsx";
import { usePreferences } from "@/context/PreferencesContext";

// ── Types ─────────────────────────────────────────────────────────────────────
interface CalEvent {
  id: string;
  day: number;
  title: string;
  location: string;
  time: string;
  type: "auction" | "payment" | "viewing" | "bid";
  price: string;
}

// ── Mock Events ───────────────────────────────────────────────────────────────
const EVENTS: CalEvent[] = [
  { id: "e1", day: 3,  title: "Villa Del Lago Auction",    location: "Miami, FL",       time: "10:00 AM", type: "auction",  price: "$875,000" },
  { id: "e2", day: 7,  title: "Rent Payment Due",          location: "Roma Avenue",     time: "09:00 AM", type: "payment",  price: "$3,200"   },
  { id: "e3", day: 10, title: "Atlas Penthouse Viewing",   location: "New York, NY",    time: "02:00 PM", type: "viewing",  price: "$2.1M"    },
  { id: "e4", day: 14, title: "Germanrin Heights Bid",     location: "Dallas, TX",      time: "11:30 AM", type: "bid",      price: "$640,000" },
  { id: "e5", day: 14, title: "Mortgage Payment",          location: "Halbert Avenue",  time: "12:00 PM", type: "payment",  price: "$4,100"   },
  { id: "e6", day: 18, title: "Casa Bonita Auction",       location: "Miami Beach, FL", time: "03:30 PM", type: "auction",  price: "$760,000" },
  { id: "e7", day: 21, title: "Weekly ROI Distribution",   location: "Portfolio",       time: "08:00 AM", type: "payment",  price: "$14,225"  },
  { id: "e8", day: 25, title: "Hillside Manor Open Bid",   location: "Nashville, TN",   time: "01:00 PM", type: "bid",      price: "$1.45M"   },
  { id: "e9", day: 28, title: "Cobalt Tower Viewing",      location: "Seattle, WA",     time: "04:00 PM", type: "viewing",  price: "$1.8M"    },
];

const TYPE_CONFIG = {
  auction: { label: "Auction",  bg: "bg-rose-100",    text: "text-rose-600",    dot: "bg-rose-500"    },
  payment: { label: "Payment",  bg: "bg-emerald-100", text: "text-emerald-600", dot: "bg-emerald-500" },
  viewing: { label: "Viewing",  bg: "bg-blue-100",    text: "text-blue-600",    dot: "bg-blue-500"    },
  bid:     { label: "Bid",      bg: "bg-purple-100",  text: "text-purple-600",  dot: "bg-[#8A74F9]"   },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ ev }: { ev: CalEvent }) {
  const cfg = TYPE_CONFIG[ev.type];
  const Icon = ev.type === "auction" ? Gavel
    : ev.type === "payment" ? Tag
    : ev.type === "bid" ? BellRing
    : MapPin;
  return (
    <div className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
      <div className={clsx("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0", cfg.bg, cfg.text)}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="font-bold text-slate-800 text-sm truncate">{ev.title}</p>
          <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", cfg.bg, cfg.text)}>{cfg.label}</span>
        </div>
        <p className="text-slate-400 text-[11px] flex items-center gap-1 mb-1"><MapPin size={10}/>{ev.location}</p>
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1"><Clock size={10}/>{ev.time}</p>
          <p className="font-bold text-[#8A74F9] text-[11px]">{ev.price}</p>
        </div>
      </div>
    </div>
  );
}

// ── Calendar Page ─────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const { t } = usePreferences();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<number | null>(today.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay   = getFirstDayOfMonth(year, month);
  const cells      = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const eventsForDay = (d: number) => EVENTS.filter(e => e.day === d);
  const selectedEvents = selected ? eventsForDay(selected) : [];
  const upcomingEvents = EVENTS.filter(e => {
    const evDate = new Date(year, month, e.day);
    return evDate >= today;
  }).slice(0, 5);

  return (
    <DashboardLayout pageTitle={t("schedule")}>
      <div className="pb-20 md:pb-0">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Calendar Grid ── */}
          <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
            {/* Month Nav */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                {(t("months" as any) as unknown as string[])[month]} {year}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); setSelected(today.getDate()); }}
                  className="px-3 py-1.5 text-xs font-bold text-[#8A74F9] bg-purple-50 dark:bg-[#8A74F9]/10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-500/10 transition-colors"
                >
                  {t("today")}
                </button>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {(t("days_short" as any) as unknown as string[]).map(d => (
                <div key={d} className="text-center text-[11px] font-bold text-slate-400 dark:text-slate-500 py-2 uppercase tracking-wider">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                if (!day) return <div key={`e${idx}`} />;
                const dayEvents = eventsForDay(day);
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = day === selected;
                return (
                  <button
                    key={day}
                    onClick={() => setSelected(day === selected ? null : day)}
                    className={clsx(
                      "relative flex flex-col items-center py-2.5 rounded-2xl transition-all text-sm font-semibold",
                      isSelected   ? "bg-[#8A74F9] text-white shadow-lg shadow-[#8A74F9]/30"
                        : isToday  ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500 ring-1 ring-rose-200 dark:ring-rose-500/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-200"
                    )}
                  >
                    <span>{day}</span>
                    {/* Event dots */}
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <span
                            key={ev.id}
                            className={clsx(
                              "w-1.5 h-1.5 rounded-full",
                              isSelected ? "bg-white/70" : TYPE_CONFIG[ev.type].dot
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-slate-100">
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={clsx("w-2.5 h-2.5 rounded-full", cfg.dot)} />
                  <span className="text-xs font-semibold text-slate-500">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="flex flex-col gap-6">
            {/* Selected day events */}
            <div className="bg-white dark:bg-slate-800 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base mb-4">
                {selected
                  ? `${(t("months" as any) as unknown as string[])[month]} ${selected}`
                  : "Select a day"}
              </h3>
              {selected ? (
                selectedEvents.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {selectedEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                      <Clock size={24} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 dark:text-white font-semibold text-sm">{t("no_events")}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{t("nothing_scheduled")}</p>
                  </div>
                )
              ) : (
                <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-6">Click a day to see its events.</p>
              )}
            </div>

            {/* Upcoming */}
            <div className="bg-white dark:bg-slate-800 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base mb-4">{t("upcoming_events")}</h3>
              <div className="flex flex-col gap-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(ev => (
                    <div
                      key={ev.id}
                      onClick={() => setSelected(ev.day)}
                      className="flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className={clsx("w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 text-white", TYPE_CONFIG[ev.type].dot)}>
                        <span className="text-[13px] font-extrabold leading-none">{ev.day}</span>
                        <span className="text-[8px] font-bold opacity-80">{MONTHS[month].slice(0,3).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-[12px] truncate">{ev.title}</p>
                        <p className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                          <Clock size={8}/> {ev.time} · {ev.price}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm text-center py-4">No upcoming events this month.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
