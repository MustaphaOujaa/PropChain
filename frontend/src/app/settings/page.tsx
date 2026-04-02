"use client";

import { useState, FormEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";
import {
  User, Shield, Link2, Bell, Camera, Save,
  Eye, EyeOff, CheckCircle, AlertCircle, X,
  Code, Share2, Globe,
} from "lucide-react";
import clsx from "clsx";

// ── Tab Config ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "connections", label: "Connections", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
];

// ── Input ─────────────────────────────────────────────────────────────────────
function SettingsInput({
  label, id, type = "text", value, onChange, placeholder, disabled, hint,
}: {
  label: string; id: string; type?: string; value: string;
  onChange?: (v: string) => void; placeholder?: string; disabled?: boolean; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-600">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400",
          "outline-none transition-all focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20",
          disabled && "bg-slate-50 text-slate-400 cursor-not-allowed"
        )}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30",
        checked ? "bg-[#8B5CF6]" : "bg-slate-200"
      )}
    >
      <span className={clsx(
        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
        checked ? "translate-x-7" : "translate-x-1"
      )} />
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div className={clsx(
      "fixed bottom-24 md:bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold",
      type === "success" ? "bg-emerald-500" : "bg-rose-500"
    )}>
      {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={16} /></button>
    </div>
  );
}

// ── Connection Card ───────────────────────────────────────────────────────────
function ConnectionCard({ icon: Icon, name, username, connected, color }: {
  icon: any; name: string; username: string; connected: boolean; color: string;
}) {
  const [isConnected, setIsConnected] = useState(connected);
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-white", color)}>
          <Icon size={20} />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{name}</p>
          <p className="text-slate-400 text-xs">{isConnected ? username : "Not connected"}</p>
        </div>
      </div>
      <button
        onClick={() => setIsConnected((v) => !v)}
        className={clsx(
          "px-4 py-2 rounded-xl text-xs font-bold transition-all",
          isConnected
            ? "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-500"
            : "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
        )}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}

// ── Settings Page ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);

  // Profile state
  const [name, setName] = useState(user?.email?.split("@")[0] ?? "PropChain User");
  const [bio, setBio] = useState("Real estate NFT investor on PropChain.");
  const [website, setWebsite] = useState("");

  // Security state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState({
    newListings: true,
    priceDrops: true,
    bidActivity: true,
    weeklyReport: false,
    marketing: false,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user) await userApi.updateProfile({ name });
      showToast("Profile updated successfully!", "success");
    } catch {
      showToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { showToast("Passwords do not match.", "error"); return; }
    if (newPw.length < 6) { showToast("New password must be at least 6 characters.", "error"); return; }
    setSaving(true);
    try {
      if (user) await userApi.changePassword({ currentPassword: currentPw, newPassword: newPw });
      showToast("Password changed successfully!", "success");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? "Failed to change password.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Settings">
      <div className="pb-20 md:pb-0 max-w-3xl mx-auto">

        {/* Tab Bar */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm mb-8 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/25"
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── PROFILE TAB ──────────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <h2 className="font-extrabold text-slate-800 text-lg mb-6">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8">
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email ?? "user"}`}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover bg-slate-100 border-4 border-[#8B5CF6]/20"
                  />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-7 h-7 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center hover:bg-[#7C3AED] transition-colors shadow-lg"
                    title="Change avatar"
                  >
                    <Camera size={13} />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-slate-700 text-sm">{user?.email ?? "user@propchain.io"}</p>
                  <p className="text-slate-400 text-xs mt-0.5">Click the camera icon to upload a new photo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SettingsInput id="settings-name" label="Display Name" value={name} onChange={setName} placeholder="Your name" />
                <SettingsInput id="settings-email" label="Email Address" value={user?.email ?? ""} disabled hint="Email cannot be changed" />
                <div className="sm:col-span-2">
                  <label htmlFor="settings-bio" className="text-sm font-semibold text-slate-600 mb-1.5 block">Bio</label>
                  <textarea
                    id="settings-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all resize-none"
                    placeholder="Tell us about yourself…"
                  />
                </div>
                <SettingsInput id="settings-website" label="Website" value={website} onChange={setWebsite} placeholder="https://yourwebsite.com" />
                <SettingsInput id="settings-wallet" label="Wallet Balance" value={`$${(user as any)?.walletBalance?.toLocaleString() ?? "250,000"}`} disabled />
              </div>
            </div>

            <button
              id="save-profile-btn"
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#8B5CF6] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#7C3AED] transition-all shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-60 active:scale-95"
            >
              <Save size={16} />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        )}

        {/* ── SECURITY TAB ─────────────────────────────────────────────── */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <form onSubmit={handleSavePassword} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm space-y-5">
              <h2 className="font-extrabold text-slate-800 text-lg">Change Password</h2>

              {(["currentPw", "newPw", "confirmPw"] as const).map((field, i) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600">
                    {field === "currentPw" ? "Current Password" : field === "newPw" ? "New Password" : "Confirm New Password"}
                  </label>
                  <div className="relative">
                    <input
                      id={`settings-${field}`}
                      type={showPw ? "text" : "password"}
                      value={field === "currentPw" ? currentPw : field === "newPw" ? newPw : confirmPw}
                      onChange={(e) => {
                        if (field === "currentPw") setCurrentPw(e.target.value);
                        else if (field === "newPw") setNewPw(e.target.value);
                        else setConfirmPw(e.target.value);
                      }}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all"
                    />
                    {i === 0 && (
                      <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                id="save-password-btn"
                type="submit"
                disabled={saving || !currentPw || !newPw || !confirmPw}
                className="flex items-center gap-2 bg-[#8B5CF6] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#7C3AED] transition-all shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-50 active:scale-95"
              >
                <Shield size={16} />
                {saving ? "Updating…" : "Update Password"}
              </button>
            </form>

            {/* 2FA */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Two-Factor Authentication</h3>
                  <p className="text-slate-400 text-sm mt-1">Add an extra layer of security to your account.</p>
                </div>
                <Toggle id="toggle-2fa" checked={twoFactor} onChange={setTwoFactor} />
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-[24px] p-6 border border-rose-100 shadow-sm">
              <h3 className="font-bold text-rose-600 text-base mb-2">Danger Zone</h3>
              <p className="text-slate-500 text-sm mb-4">These actions are permanent. Please proceed with caution.</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={logout} className="px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-bold hover:bg-rose-100 transition-colors">
                  Sign Out
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CONNECTIONS TAB ──────────────────────────────────────────── */}
        {activeTab === "connections" && (
          <div className="space-y-6">
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <h2 className="font-extrabold text-slate-800 text-lg mb-2">Social Connections</h2>
              <p className="text-slate-400 text-sm mb-6">Link your accounts to streamline your PropChain experience.</p>
              <div className="space-y-3">
                <ConnectionCard icon={Code} name="GitHub" username="@propchain-dev" connected={false} color="bg-slate-800" />
                <ConnectionCard icon={Share2} name="Twitter / X" username="@propchain_official" connected={true} color="bg-sky-400" />
                <ConnectionCard icon={Globe} name="MetaMask" username="0x1a2b...3c4d" connected={false} color="bg-orange-400" />
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <h2 className="font-extrabold text-slate-800 text-lg mb-2">API Access</h2>
              <p className="text-slate-400 text-sm mb-4">Use your API key to access PropChain data programmatically.</p>
              <div className="flex gap-3">
                <input
                  id="api-key-display"
                  value="pc_live_••••••••••••••••••••••••••••••••"
                  readOnly
                  className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500 font-mono outline-none"
                />
                <button className="px-5 py-3 rounded-2xl bg-[#8B5CF6] text-white text-sm font-bold hover:bg-[#7C3AED] transition-colors whitespace-nowrap">
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ────────────────────────────────────────── */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm space-y-6">
            <h2 className="font-extrabold text-slate-800 text-lg">Notification Preferences</h2>

            {[
              { id: "notif-listings", key: "newListings" as const, label: "New Listings", desc: "Get notified when new properties are listed on the marketplace." },
              { id: "notif-pricedrops", key: "priceDrops" as const, label: "Price Drops", desc: "Alerts when a property you've viewed drops in price." },
              { id: "notif-bids", key: "bidActivity" as const, label: "Bid Activity", desc: "Notifications for bids on your properties or competing bids." },
              { id: "notif-weekly", key: "weeklyReport" as const, label: "Weekly Report", desc: "Receive a summary of your portfolio performance every Monday." },
              { id: "notif-marketing", key: "marketing" as const, label: "Marketing Emails", desc: "Promotional content, feature announcements, and newsletters." },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                <div className="flex-1 mr-6">
                  <p className="font-semibold text-slate-700 text-sm">{item.label}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                </div>
                <Toggle
                  id={item.id}
                  checked={notifs[item.key]}
                  onChange={(v) => setNotifs((prev) => ({ ...prev, [item.key]: v }))}
                />
              </div>
            ))}

            <button
              id="save-notifications-btn"
              onClick={() => showToast("Notification preferences saved!", "success")}
              className="flex items-center gap-2 bg-[#8B5CF6] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#7C3AED] transition-all shadow-lg shadow-[#8B5CF6]/25 active:scale-95"
            >
              <Save size={16} />
              Save Preferences
            </button>
          </div>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </DashboardLayout>
  );
}
