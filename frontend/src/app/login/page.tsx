"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  AuthInput,
  AuthButton,
  AuthDivider,
  EtherIcon,
} from "@/components/auth/AuthComponents";

// ─── Social Provider Config ───────────────────────────────────────────────────
const SOCIAL_PROVIDERS = [
  {
    id: "google",
    label: "Google",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  {
    id: "metamask",
    label: "MetaMask",
    logo: (
      <svg viewBox="0 0 40 40" className="w-5 h-5" aria-hidden>
        <path fill="#E2761B" stroke="#E2761B" strokeWidth="0.5" d="M33.87 3L21.73 12.05l2.27-5.36L33.87 3z" />
        <path fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" d="M6.13 3l12.03 9.13-2.16-5.44L6.13 3z" />
        <path fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.5" d="M29.23 27.63l-3.23 4.95 6.91 1.9 1.98-6.73-5.66-.12z" />
        <path fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.5" d="M5.13 27.75l1.97 6.73 6.91-1.9-3.23-4.95-5.65.12z" />
        <path fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" d="M13.59 18.3l-1.93 2.91 6.88.31-.23-7.4-4.72 4.18z" />
        <path fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" d="M26.41 18.3l-4.77-4.26-.16 7.48 6.87-.31-1.94-2.91z" />
        <path fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" d="M14.01 32.58l4.13-2-3.57-2.78-.56 4.78z" />
        <path fill="#E4761B" stroke="#E4761B" strokeWidth="0.5" d="M21.86 30.58l4.13 2-.55-4.78-3.58 2.78z" />
      </svg>
    ),
  },
];

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await authApi.login({ email, password });
      if (res.data) {
        login(res.data.token, res.data.user);
        router.push("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8F9FB]">

      {/* ── Left Panel (decorative, visible on lg+) ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative overflow-hidden flex-col">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6D28D9] via-[#8A74F9] to-[#A78BFA]" />

        {/* Floating orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full bg-[#4C1D95]/40 blur-3xl" />
        <div className="absolute top-[45%] left-[60%] w-52 h-52 rounded-full bg-white/5 blur-2xl" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <EtherIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">PropChain</span>
          </div>

          {/* Hero copy */}
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
                Your Real Estate
                <br />
                <span className="text-white/70">on the Blockchain.</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed max-w-md">
                Invest in tokenised properties, earn passive income, and manage your NFT portfolio — all from one dashboard.
              </p>
            </div>

            {/* Stats strip */}
            <div className="flex gap-8">
              {[
                { value: "2,400+", label: "Listed Properties" },
                { value: "$1.2B", label: "Total Value Locked" },
                { value: "18K+", label: "Active Investors" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-white/50 text-sm mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Testimonial card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 max-w-sm">
              <p className="text-white/80 text-sm leading-relaxed italic">
                &ldquo;PropChain completely changed how I think about real estate investing. The returns are exceptional.&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=testimonial1"
                  alt="Reviewer"
                  className="w-9 h-9 rounded-full bg-white/20"
                />
                <div>
                  <p className="text-white text-sm font-semibold">Sarah K.</p>
                  <p className="text-white/50 text-xs">NFT Portfolio Holder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} PropChain Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right Panel (form) ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px] flex flex-col gap-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#8A74F9] flex items-center justify-center">
              <EtherIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-800 font-bold text-lg tracking-tight">PropChain</span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Sign in to your PropChain account to continue your investment journey.
            </p>
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-3">
            {SOCIAL_PROVIDERS.map((p) => (
              <AuthButton
                key={p.id}
                id={`social-login-${p.id}`}
                variant="social"
                type="button"
                onClick={() => setError(`${p.label} OAuth coming soon.`)}
              >
                {p.logo}
                <span>Continue with {p.label}</span>
              </AuthButton>
            ))}
          </div>

          <AuthDivider />

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3"
            >
              <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-rose-600 text-[13px] font-medium leading-snug">{error}</p>
            </div>
          )}

          {/* Form */}
          <form
            id="login-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            <AuthInput
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
            />

            <AuthInput
              id="login-password"
              label="Password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={16} />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <div className="flex justify-end -mt-2">
              <Link
                href="/forgot-password"
                className="text-xs text-[#8A74F9] font-semibold hover:text-[#7864dd] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <AuthButton
              id="login-submit"
              type="submit"
              isLoading={isLoading}
            >
              Sign in
              <ArrowRight size={16} />
            </AuthButton>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#8A74F9] font-semibold hover:text-[#7864dd] transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
