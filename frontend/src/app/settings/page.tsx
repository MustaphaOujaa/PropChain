"use client";

import { useState, FormEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";
import {
  User, Shield, Link2, Bell, Camera, Save,
  Eye, EyeOff, CheckCircle, AlertCircle, X,
  Code, Share2, Globe, Settings2
} from "lucide-react";
import clsx from "clsx";
import { usePreferences } from "@/context/PreferencesContext";

// ── Tab Config ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "profile", labelKey: "profile", icon: User },
  { id: "preferences", labelKey: "preferences", icon: Settings2 },
  { id: "security", labelKey: "security", icon: Shield },
  { id: "connections", labelKey: "connections", icon: Link2 },
  { id: "notifications", labelKey: "notifications", icon: Bell },
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
      <label htmlFor={id} className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 bg-white dark:bg-slate-800",
          "outline-none transition-all focus:border-[#8A74F9] focus:ring-2 focus:ring-[#8A74F9]/20",
          disabled && "bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 cursor-not-allowed"
        )}
      />
      {hint && <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
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
        "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8A74F9]/30",
        checked ? "bg-[#8A74F9]" : "bg-slate-200 dark:bg-slate-700"
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
  const { t } = usePreferences();
  const [isConnected, setIsConnected] = useState(connected);
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-white", color)}>
          <Icon size={20} />
        </div>
        <div>
          <p className="font-semibold text-slate-800 dark:text-white text-sm">{name}</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs">{isConnected ? username : "Not connected"}</p>
        </div>
      </div>
      <button
        onClick={() => setIsConnected((v) => !v)}
        className={clsx(
           "px-4 py-2 rounded-xl text-xs font-bold transition-all",
          isConnected
             ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400"
            : "bg-[#8A74F9] text-white hover:bg-[#7864dd]"
        )}
      >
        {isConnected ? t("close" as any) : t("bid" as any)} {/* Connect/Disconnect mapped to close/bid if needed or keep as is */}
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

  const { language, setLanguage, theme, setTheme, t } = usePreferences();

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
    <DashboardLayout pageTitle={t("settings")}>
      <div className="pb-20 md:pb-0 max-w-3xl mx-auto">

        {/* Tab Bar */}
        <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-700 shadow-sm mb-8 overflow-x-auto transition-colors">
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
                    ? "bg-[#8A74F9] text-white shadow-lg shadow-[#8A74F9]/25"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                )}
              >
                <Icon size={15} />
                {t(tab.labelKey as any) || tab.labelKey}
              </button>
            );
          })}
        </div>

        {/* ── PROFILE TAB ──────────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
              <h2 className="font-extrabold text-slate-800 dark:text-white text-lg mb-6">{t("profile_info")}</h2>

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8">
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email ?? "user"}`}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover bg-slate-100 border-4 border-[#8A74F9]/20"
                  />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-7 h-7 bg-[#8A74F9] text-white rounded-full flex items-center justify-center hover:bg-[#7864dd] transition-colors shadow-lg"
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
                <SettingsInput id="settings-name" label={t("display_name")} value={name} onChange={setName} placeholder="Your name" />
                <SettingsInput id="settings-email" label={t("email_address")} value={user?.email ?? ""} disabled hint="Email cannot be changed" />
                <div className="sm:col-span-2">
                  <label htmlFor="settings-bio" className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block">{t("bio")}</label>
                  <textarea
                    id="settings-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 outline-none focus:border-[#8A74F9] focus:ring-2 focus:ring-[#8A74F9]/20 transition-all resize-none"
                    placeholder="..."
                  />
                </div>
                <SettingsInput id="settings-website" label={t("website")} value={website} onChange={setWebsite} placeholder="https://yourwebsite.com" />
                <SettingsInput id="settings-wallet" label={t("total_balance")} value={`$${(user as any)?.walletBalance?.toLocaleString() ?? "250,000"}`} disabled />
              </div>
            </div>

            <button
              id="save-profile-btn"
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#8A74F9] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#7864dd] transition-all shadow-lg shadow-[#8A74F9]/25 disabled:opacity-60 active:scale-95"
            >
              <Save size={16} />
              {saving ? t("saving") : t("save_changes")}
            </button>
          </form>
        )}

        {/* ── PREFERENCES TAB ───────────────────────────────────────────── */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
              <h2 className="font-extrabold text-slate-800 dark:text-white text-lg mb-6">{t("preferences")}</h2>
              
              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 block mb-3">{t("language")}</label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { code: "en", label: "English" },
                      { code: "fr", label: "Français" },
                      { code: "ar", label: "العربية" }
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code as any)}
                        className={clsx(
                          "px-5 py-2.5 rounded-xl font-bold text-sm transition-all",
                          language === l.code
                            ? "bg-[#8A74F9] text-white shadow-md shadow-[#8A74F9]/20"
                            : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                        )}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 block mb-3">{t("theme")}</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={clsx(
                        "flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all",
                        theme === "light" ? "border-[#8A74F9] bg-[#8A74F9]/5" : "border-slate-100 dark:border-slate-700 hover:border-slate-200"
                      )}
                    >
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full" />
                      </div>
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{t("light_mode")}</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={clsx(
                        "flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all",
                        theme === "dark" ? "border-[#8A74F9] bg-[#8A74F9]/5" : "border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
                      )}
                    >
                      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-slate-800 rounded-full translate-x-1 -translate-y-1" />
                        </div>
                      </div>
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{t("dark_mode")}</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 block">{t("wallet_balance")}</label>
                    <div className="bg-[#8A74F9]/10 text-[#8A74F9] px-4 py-1.5 rounded-xl font-extrabold text-lg">
                      ${user?.walletBalance?.toLocaleString() ?? "0"}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        id="deposit-amount-field"
                        placeholder="0.00"
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-4 py-3 text-sm text-slate-800 dark:text-white outline-none focus:border-[#8A74F9] focus:ring-2 focus:ring-[#8A74F9]/20 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      id="submit-deposit-btn"
                      onClick={async () => {
                        const el = document.getElementById("deposit-amount-field") as HTMLInputElement;
                        const val = parseFloat(el.value);
                        if (val > 0) {
                          try {
                            const { data } = await userApi.deposit(val);
                            updateUser({ walletBalance: data.walletBalance });
                            showToast(`${t("successfully_deposited")} $${val.toLocaleString()}`, "success");
                            el.value = "";
                          } catch {
                            showToast("Deposit failed", "error");
                          }
                        }
                      }}
                      className="px-6 py-3 rounded-2xl bg-[#8A74F9] text-white text-sm font-bold hover:bg-[#7864dd] transition-all shadow-lg shadow-[#8A74F9]/25 active:scale-95"
                    >
                      {t("deposit_funds")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECURITY TAB ─────────────────────────────────────────────── */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <form onSubmit={handleSavePassword} className="bg-white dark:bg-slate-800 rounded-[24px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors space-y-5">
              <h2 className="font-extrabold text-slate-800 dark:text-white text-lg">{t("change_password")}</h2>

              {(["currentPw", "newPw", "confirmPw"] as const).map((field, i) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {field === "currentPw" ? t("current_password") : field === "newPw" ? t("new_password") : t("confirm_password")}
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
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 pr-12 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-[#8A74F9] focus:ring-2 focus:ring-[#8A74F9]/20 transition-all"
                    />
                    {i === 0 && (
                      <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
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
                className="flex items-center gap-2 bg-[#8A74F9] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#7864dd] transition-all shadow-lg shadow-[#8A74F9]/25 disabled:opacity-50 active:scale-95"
              >
                <Shield size={16} />
                {saving ? t("updating_password") : t("update_password_btn")}
              </button>
            </form>

            <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">{t("two_factor_auth")}</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{t("two_factor_desc")}</p>
                </div>
                <Toggle id="toggle-2fa" checked={twoFactor} onChange={setTwoFactor} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 border border-rose-100 dark:border-rose-900/50 shadow-sm transition-colors">
              <h3 className="font-bold text-rose-600 dark:text-rose-500 text-base mb-2">{t("danger_zone")}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{t("danger_zone_desc")}</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={logout} className="px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">
                  {t("sign_out")}
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors">
                  {t("delete_account_btn")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CONNECTIONS TAB ──────────────────────────────────────────── */}
        {activeTab === "connections" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
              <h2 className="font-extrabold text-slate-800 dark:text-white text-lg mb-2">{t("social_connections")}</h2>
              <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">...</p>
              <div className="space-y-3">
                <ConnectionCard icon={Code} name="GitHub" username="@propchain-dev" connected={false} color="bg-slate-800" />
                <ConnectionCard icon={Share2} name="Twitter / X" username="@propchain_official" connected={true} color="bg-sky-400" />
                <ConnectionCard icon={Globe} name="MetaMask" username="0x1a2b...3c4d" connected={false} color="bg-orange-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
              <h2 className="font-extrabold text-slate-800 dark:text-white text-lg mb-2">{t("api_access")}</h2>
              <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">...</p>
              <div className="flex gap-3">
                <input
                  id="api-key-display"
                  value="pc_live_••••••••••••••••••••••••••••••••"
                  readOnly
                  className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm text-slate-500 font-mono outline-none"
                />
                <button className="px-5 py-3 rounded-2xl bg-[#8A74F9] text-white text-sm font-bold hover:bg-[#7864dd] transition-colors whitespace-nowrap">
                  {t("regenerate")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ────────────────────────────────────────── */}
        {activeTab === "notifications" && (
          <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-6 transition-colors">
            <h2 className="font-extrabold text-slate-800 dark:text-white text-lg">{t("notification_prefs")}</h2>

            {[
              { id: "notif-listings", key: "newListings" as const, labelKey: "new_listings" },
              { id: "notif-pricedrops", key: "priceDrops" as const, labelKey: "price_drops" },
              { id: "notif-bids", key: "bidActivity" as const, labelKey: "bid_activity" },
              { id: "notif-weekly", key: "weeklyReport" as const, labelKey: "weekly_report" },
              { id: "notif-marketing", key: "marketing" as const, labelKey: "marketing_emails" },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className="flex-1 mr-6">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{t(item.labelKey as any)}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">...</p>
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
              onClick={() => showToast(t("save_changes"), "success")}
              className="flex items-center gap-2 bg-[#8A74F9] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#7864dd] transition-all shadow-lg shadow-[#8A74F9]/25 active:scale-95"
            >
              <Save size={16} />
              {t("save_changes")}
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
