"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { clsx } from "clsx";

// ─── AuthInput ────────────────────────────────────────────────────────────────
interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, rightElement, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-600 tracking-wide"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={clsx(
              "w-full rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm",
              "px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400",
              "outline-none ring-0 transition-all duration-200",
              "focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 focus:bg-white",
              "hover:border-slate-300",
              icon ? "pl-11" : "",
              rightElement ? "pr-12" : "",
              error ? "border-rose-400 focus:border-rose-400 focus:ring-rose-200" : "",
              className
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              {rightElement}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-rose-500 font-medium mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";

// ─── AuthButton ───────────────────────────────────────────────────────────────
interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "social";
  children: ReactNode;
}

export function AuthButton({
  isLoading,
  variant = "primary",
  children,
  className,
  ...props
}: AuthButtonProps) {
  return (
    <button
      disabled={isLoading || props.disabled}
      className={clsx(
        "relative w-full flex items-center justify-center gap-2.5",
        "rounded-2xl py-3.5 px-6 font-semibold text-sm transition-all duration-200",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "primary"
          ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] active:scale-[0.98] shadow-lg shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/40"
          : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] shadow-sm",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Please wait…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function AuthDivider({ label = "or continue with" }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-1">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

// ─── EtherIcon (inline SVG, no extra dep) ────────────────────────────────────
export function EtherIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
    </svg>
  );
}
