"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10";

export type Tone = "slate" | "teal" | "green" | "amber" | "red" | "blue";

const badgeTones: Record<Tone, string> = {
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
};

export function Badge({ tone = "slate", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

export function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}

type ButtonVariant = "primary" | "dark" | "ghost" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-teal-700 text-white shadow-sm shadow-teal-900/20 hover:bg-teal-800 disabled:bg-teal-700/50",
  dark: "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-900/50",
  ghost: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50",
  danger: "bg-white text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed ${buttonVariants[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function Card({
  title,
  subtitle,
  action,
  className = "",
  bodyClassName = "p-5",
  id,
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50 ${className}`}>
      {title && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-display text-[15px] font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs font-medium text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm font-medium text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint, tone = "teal" }: { label: string; value: string | number; hint: string; tone?: Tone }) {
  const accents: Record<Tone, string> = {
    slate: "from-slate-500 to-slate-700",
    teal: "from-teal-500 to-teal-700",
    green: "from-emerald-500 to-emerald-700",
    amber: "from-amber-500 to-amber-600",
    red: "from-rose-500 to-rose-700",
    blue: "from-sky-500 to-sky-700",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accents[tone]}`} />
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-extrabold text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{hint}</p>
    </div>
  );
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <svg className="size-6 text-teal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6" />
          <path d="M10 3v6l-5 8.5A2 2 0 0 0 6.8 21h10.4a2 2 0 0 0 1.8-3.5L14 9V3" />
          <path d="M7.5 15h9" />
        </svg>
      </div>
      <h3 className="mt-4 font-display text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-xs font-medium text-slate-500">{detail}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-[11px] font-medium text-slate-400">{hint}</span>}
    </label>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative flex max-h-[90vh] w-full flex-col rounded-2xl bg-white shadow-2xl ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-display text-base font-bold text-slate-950">{title}</h3>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-100 px-6 py-4">{footer}</footer>}
      </div>
    </div>
  );
}

export function Pipeline({ steps }: { steps: { label: string; state: "done" | "current" | "pending" }[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-2">
      {steps.map((s, i) => (
        <li key={s.label} className="flex items-center">
          <span
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ${
              s.state === "done"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : s.state === "current"
                  ? "bg-teal-700 text-white ring-teal-700"
                  : "bg-white text-slate-400 ring-slate-200"
            }`}
          >
            <span className={`size-1.5 rounded-full ${s.state === "done" ? "bg-emerald-500" : s.state === "current" ? "bg-white" : "bg-slate-300"}`} />
            {s.label}
          </span>
          {i < steps.length - 1 && <span className="mx-1 text-xs font-bold text-slate-300">→</span>}
        </li>
      ))}
    </ol>
  );
}
