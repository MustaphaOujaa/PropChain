"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Check,
} from "lucide-react";

import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  AuthInput,
  AuthButton,
  AuthDivider,
  EtherIcon,
} from "@/components/auth/AuthComponents";

// ─── Password Strength ────────────────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)            score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;

  const levels = [
    { label: "Too short",  color: "bg-slate-300" },
    { label: "Weak",       color: "bg-rose-400" },
    { label: "Fair",       color: "bg-orange-400" },
    { label: "Good",       color: "bg-yellow-400" },
    { label: "Strong",     color: "bg-emerald-400" },
  ];
  return { score, ...levels[score] };
}

const PW_RULES = [
  { test: (pw: string) => pw.length >= 8,          label: "At least 8 characters" },
  { test: (pw: string) => /[A-Z]/.test(pw),        label: "One uppercase letter" },
  { test: (pw: string) => /[0-9]/.test(pw),        label: "One number" },
  { test: (pw: string) => /[^A-Za-z0-9]/.test(pw), label: "One special character" },
];

// ─── Social Provider Config (same as login) ───────────────────────────────────
const SOCIAL_PROVIDERS = [
  {
    id: "google",
    label: "Google",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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

// ─── Sign Up Page ─────────────────────────────────────────────────────────────
export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCpw, setShowCpw]     = useState(false);
  const [agreed, setAgreed]       = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);

  const strength = getStrength(password);

  // ── Field-level validation ─────────────────────────────────────────────────
  const nameError    = name    && name.length < 2         ? "Name must be at least 2 characters." : "";
  const emailError   = email   && !/^\S+@\S+\.\S+$/.test(email)  ? "Please enter a valid email."    : "";
  const confirmError = confirm && confirm !== password     ? "Passwords do not match."             : "";

  const isFormValid =
    name.length >= 2 &&
    /^\S+@\S+\.\S+$/.test(email) &&
    password.length >= 8 &&
    confirm === password &&
    agreed;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Please complete all fields correctly.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await authApi.register({ name, email, password });
      if (res.data) {
        setSuccess(true);
        login(res.data.token, res.data.user);
        setTimeout(() => router.push("/"), 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8F9FB]">

      {/* ── Right decorative panel (on xl+ it sits on the right) ─────────── */}
      <div className="hidden xl:flex xl:w-[44%] relative overflow-hidden flex-col order-last">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81]" />

        {/* Orbs */}
        <div className="absolute top-[-100px] right-[-80px] w-[420px] h-[420px] rounded-full bg-[#8B5CF6]/20 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-60px] w-80 h-80 rounded-full bg-[#6D28D9]/30 blur-3xl" />
        <div className="absolute top-[40%] right-[30%] w-64 h-64 rounded-full bg-[#A78BFA]/10 blur-2xl" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-14">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <EtherIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">PropChain</span>
          </div>

          {/* Middle content */}
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
                Start earning
                <br />
                <span className="text-[#A78BFA]">passive income</span>
                <br />
                <span className="text-white/60">from real estate.</span>
              </h1>
              <p className="text-white/50 text-base leading-relaxed mt-4 max-w-xs">
                Join thousands of investors tokenising property without the traditional barriers.
              </p>
            </div>

            {/* Benefit checklist */}
            <ul className="flex flex-col gap-4">
              {[
                "Zero-fee property tokenisation",
                "Fractional ownership from $50",
                "Real-time blockchain settlements",
                "Verified & insured properties",
              ].map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-[#8B5CF6]/30 flex items-center justify-center shrink-0">
                    <Check size={13} className="text-[#A78BFA]" />
                  </div>
                  <span className="text-white/70 text-sm">{b}</span>
                </li>
              ))}
            </ul>

            {/* Avatar cluster */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[10, 20, 30, 40].map((seed) => (
                  <img
                    key={seed}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                    alt="Investor avatar"
                    className="w-10 h-10 rounded-full border-2 border-[#1E1B4B] bg-slate-700"
                  />
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">18,000+ investors</p>
                <p className="text-white/40 text-xs">joined in the last 30 days</p>
              </div>
            </div>
          </div>

          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} PropChain Inc.
          </p>
        </div>
      </div>

      {/* ── Left / main form panel ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[440px] flex flex-col gap-7 py-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 xl:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
              <EtherIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-800 font-bold text-lg tracking-tight">PropChain</span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Create your account
            </h2>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Free forever. No credit card required. Start investing in minutes.
            </p>
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-3">
            {SOCIAL_PROVIDERS.map((p) => (
              <AuthButton
                key={p.id}
                id={`signup-social-${p.id}`}
                variant="social"
                type="button"
                onClick={() => setError(`${p.label} OAuth coming soon.`)}
              >
                {p.logo}
                <span>Sign up with {p.label}</span>
              </AuthButton>
            ))}
          </div>

          <AuthDivider label="or sign up with email" />

          {/* Success banner */}
          {success && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <p className="text-emerald-700 text-[13px] font-medium">
                Account created! Redirecting to your dashboard…
              </p>
            </div>
          )}

          {/* Error banner */}
          {error && !success && (
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
            id="signup-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            <AuthInput
              id="signup-name"
              label="Full name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={16} />}
              error={nameError}
            />

            <AuthInput
              id="signup-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              error={emailError}
            />

            <div className="flex flex-col gap-2">
              <AuthInput
                id="signup-password"
                label="Password"
                type={showPw ? "text" : "password"}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
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

              {/* Strength meter */}
              {password && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PW_RULES.map((rule) => {
                      const passed = rule.test(password);
                      return (
                        <p
                          key={rule.label}
                          className={`text-[11px] flex items-center gap-1 transition-colors ${
                            passed ? "text-emerald-500" : "text-slate-400"
                          }`}
                        >
                          <Check
                            size={10}
                            className={passed ? "opacity-100" : "opacity-30"}
                          />
                          {rule.label}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <AuthInput
              id="signup-confirm-password"
              label="Confirm password"
              type={showCpw ? "text" : "password"}
              placeholder="Repeat your password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              icon={<Lock size={16} />}
              error={confirmError}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowCpw((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showCpw ? "Hide" : "Show"}
                >
                  {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Terms checkbox */}
            <label
              htmlFor="signup-terms"
              className="flex items-start gap-3 cursor-pointer select-none"
            >
              <div className="relative mt-0.5">
                <input
                  id="signup-terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${
                    agreed
                      ? "bg-[#8B5CF6] border-[#8B5CF6]"
                      : "border-slate-300 bg-white hover:border-[#8B5CF6]"
                  }`}
                >
                  {agreed && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
              </div>
              <span className="text-sm text-slate-600 leading-snug">
                I agree to PropChain&apos;s{" "}
                <Link href="/terms" className="text-[#8B5CF6] font-semibold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#8B5CF6] font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <AuthButton
              id="signup-submit"
              type="submit"
              isLoading={isLoading}
              disabled={!isFormValid || success}
            >
              Create account
              <ArrowRight size={16} />
            </AuthButton>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#8B5CF6] font-semibold hover:text-[#7C3AED] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
