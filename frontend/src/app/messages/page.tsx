"use client";

import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Send, Phone, Video, MoreHorizontal, Paperclip, Smile, Check, CheckCheck } from "lucide-react";
import clsx from "clsx";
import { usePreferences } from "@/context/PreferencesContext";

// ── Mock Data ─────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  text: string;
  time: string;
  from: "me" | "them";
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
}

const CONTACTS: Contact[] = [
  { id: "1", name: "Sarah Mitchell", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4", role: "Property Agent", lastMsg: "The Villa Del Lago is still available!", time: "2m", unread: 2, online: true },
  { id: "2", name: "James Harlow", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james&backgroundColor=d1d4f9", role: "NFT Broker", lastMsg: "I sent you the contract for Roma Avenue.", time: "14m", unread: 0, online: true },
  { id: "3", name: "Elena Park", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena&backgroundColor=c0aede", role: "Investor", lastMsg: "Have you seen the new Germanrin listing?", time: "1h", unread: 1, online: false },
  { id: "4", name: "PropChain Support", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=support&backgroundColor=ffd5dc", role: "Support Agent", lastMsg: "Your ticket has been resolved.", time: "3h", unread: 0, online: true },
  { id: "5", name: "Michael Torres", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael&backgroundColor=c1f4cd", role: "Real Estate Dev", lastMsg: "Check the new commercial listings.", time: "1d", unread: 0, online: false },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "m1", text: "Hi! I noticed you've been looking at luxury villas on PropChain.", from: "them", time: "10:02 AM", read: true },
    { id: "m2", text: "The Villa Del Lago has a stunning view and was recently renovated.", from: "them", time: "10:03 AM", read: true },
    { id: "m3", text: "That sounds incredible! What's the current asking price?", from: "me", time: "10:05 AM", read: true },
    { id: "m4", text: "It's listed at $875K with a projected 14.2% ROI annually.", from: "them", time: "10:06 AM", read: true },
    { id: "m5", text: "Very compelling. Is there any flexibility in the price?", from: "me", time: "10:08 AM", read: true },
    { id: "m6", text: "The Villa Del Lago is still available!", from: "them", time: "10:09 AM", read: false },
  ],
  "2": [
    { id: "m1", text: "Hey! I saw you purchased some NFT properties recently.", from: "them", time: "9:30 AM", read: true },
    { id: "m2", text: "Yes, expanding the portfolio. What do you have in mind?", from: "me", time: "9:32 AM", read: true },
    { id: "m3", text: "I sent you the contract for Roma Avenue.", from: "them", time: "9:45 AM", read: true },
  ],
  "3": [
    { id: "m1", text: "The Germanrin Heights listing looks very promising!", from: "them", time: "Yesterday", read: true },
    { id: "m2", text: "Have you seen the new Germanrin listing?", from: "them", time: "Yesterday", read: false },
  ],
  "4": [
    { id: "m1", text: "Hello! How can we help you today?", from: "them", time: "2d ago", read: true },
    { id: "m2", text: "I had a question about my recent transaction.", from: "me", time: "2d ago", read: true },
    { id: "m3", text: "Your ticket has been resolved.", from: "them", time: "3h ago", read: true },
  ],
  "5": [
    { id: "m1", text: "Check the new commercial listings.", from: "them", time: "1d ago", read: true },
  ],
};

// ── Messages Page ─────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { t } = usePreferences();
  const [activeId, setActiveId] = useState("1");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [contacts] = useState(CONTACTS);
  const [input, setInput] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find((c) => c.id === activeId)!;
  const activeMessages = messages[activeId] ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      text: input.trim(),
      from: "me",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), newMsg] }));
    setInput("");

    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = [
        "That's a great point! Let me check on that.",
        "I'll get back to you shortly with more details.",
        "Absolutely! PropChain has some great deals right now.",
        "Thanks for reaching out. I'll follow up soon.",
      ];
      const reply: Message = {
        id: `r${Date.now()}`,
        text: replies[Math.floor(Math.random() * replies.length)],
        from: "them",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };
      setMessages((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), reply] }));
    }, 1500);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle={t("notifications")}>
      <div className="bg-white dark:bg-slate-800 rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex h-[calc(100vh-180px)] min-h-[500px] transition-colors">

        {/* ── Contacts Sidebar ──────────────────────────────────────────── */}
        <div className="w-80 border-r border-slate-100 dark:border-slate-700 flex flex-col shrink-0 hidden sm:flex">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-extrabold text-slate-800 dark:text-white text-lg mb-4">{t("notifications")}</h2>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="messages-search"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-2xl text-sm text-slate-700 dark:text-white placeholder-slate-400 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#8B5CF6]/20 border border-transparent focus:border-[#8B5CF6]/30 transition-all"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((c) => (
              <button
                key={c.id}
                id={`contact-${c.id}`}
                onClick={() => setActiveId(c.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-slate-700/50",
                  activeId === c.id && "bg-purple-50 dark:bg-slate-700 border-l-4 border-l-[#8B5CF6]"
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img src={c.avatar} alt={c.name} className="w-11 h-11 rounded-full object-cover bg-slate-100 dark:bg-slate-900" />
                  {c.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{c.name}</p>
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] shrink-0 ml-2">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-slate-400 dark:text-slate-500 text-[12px] truncate">{c.lastMsg}</p>
                    {c.unread > 0 && (
                      <span className="ml-2 w-5 h-5 bg-[#8B5CF6] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat Area ────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover bg-slate-100 dark:bg-slate-900" />
                {activeContact.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-800" />
                )}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">{activeContact.name}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs flex items-center gap-1">
                  <span className={clsx("w-1.5 h-1.5 rounded-full", activeContact.online ? "bg-emerald-400" : "bg-slate-300")} />
                  {activeContact.online ? "Online" : "Offline"} · {activeContact.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#8B5CF6] transition-colors" title="Voice call">
                <Phone size={17} />
              </button>
              <button className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#8B5CF6] transition-colors" title="Video call">
                <Video size={17} />
              </button>
              <button className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#8B5CF6] transition-colors" title="More options">
                <MoreHorizontal size={17} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-[#F8F9FB]">
            {activeMessages.map((msg) => (
              <div
                key={msg.id}
                className={clsx("flex items-end gap-2", msg.from === "me" ? "justify-end" : "justify-start")}
              >
                {msg.from === "them" && (
                  <img src={activeContact.avatar} alt={activeContact.name} className="w-7 h-7 rounded-full object-cover bg-slate-100 shrink-0 mb-1" />
                )}
                 <div className={clsx(
                  "max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-colors",
                  msg.from === "me"
                    ? "bg-[#8B5CF6] text-white rounded-br-sm shadow-[#8B5CF6]/20"
                    : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-sm border border-slate-100 dark:border-slate-600"
                )}>
                  {msg.text}
                  <div className={clsx("flex items-center justify-end gap-1 mt-1", msg.from === "me" ? "text-white/50" : "text-slate-400 dark:text-slate-500")}>
                    <span className="text-[10px]">{msg.time}</span>
                    {msg.from === "me" && (
                      msg.read ? <CheckCheck size={12} /> : <Check size={12} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <button className="text-slate-400 dark:text-slate-500 hover:text-[#8B5CF6] transition-colors p-2 shrink-0" title="Attach file">
                <Paperclip size={18} />
              </button>
              <button className="text-slate-400 dark:text-slate-500 hover:text-[#8B5CF6] transition-colors p-2 shrink-0" title="Emoji">
                <Smile size={18} />
              </button>
              <input
                id="message-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:bg-white dark:focus:bg-slate-900/50 focus:ring-2 focus:ring-[#8B5CF6]/20 border border-transparent focus:border-[#8B5CF6]/30 transition-all"
              />
              <button
                id="send-message-btn"
                onClick={sendMessage}
                disabled={!input.trim()}
                className="w-11 h-11 bg-[#8B5CF6] text-white rounded-2xl flex items-center justify-center hover:bg-[#7C3AED] transition-all active:scale-95 shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
