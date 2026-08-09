import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/lib/fund-data";

/* ---------- Page scaffolding ---------- */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string | undefined;
  actions?: ReactNode | undefined;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="mt-1 text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "info" | "success" | "warning" | "critical" | "pending";
}) {
  const tones: Record<string, string> = {
    default: "bg-card border-border",
    info: "bg-info-wash border-info/25",
    success: "bg-success-wash border-success/25",
    warning: "bg-warning-wash border-warning/25",
    critical: "bg-critical-wash border-critical/25",
    pending: "bg-pending-wash border-pending/25",
  };
  return (
    <div className={cn("rounded-2xl border p-5 shadow-soft", tones[tone], className)}>{children}</div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="section-label mb-3">{children}</div>;
}

/* ---------- Status ---------- */

const statusTone: Record<PaymentStatus, "success" | "pending" | "critical" | "warning"> = {
  current: "success",
  late: "pending",
  arrears: "critical",
  default: "critical",
  "valuation-gap": "warning",
  flagged: "warning",
};

const toneClass: Record<string, string> = {
  success: "bg-success-wash text-success",
  pending: "bg-pending-wash text-pending",
  warning: "bg-warning-wash text-warning",
  critical: "bg-critical-wash text-critical",
  info: "bg-info-wash text-info",
  neutral: "bg-sand text-muted-foreground",
};

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "success" | "pending" | "warning" | "critical" | "info" | "neutral";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-bold whitespace-nowrap",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, detail }: { status: PaymentStatus; detail?: string | undefined }) {
  const label =
    detail ??
    ({
      current: "Current",
      late: "Late",
      arrears: "Arrears",
      default: "Default",
      "valuation-gap": "Valuation gap",
      flagged: "Flagged",
    } as Record<PaymentStatus, string>)[status];
  return <Pill tone={statusTone[status]}>{label}</Pill>;
}

/* ---------- Data display ---------- */

export function Sparkline({
  data,
  tone = "info",
}: {
  data: number[];
  tone?: "info" | "success" | "critical";
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${28 - ((d - min) / span) * 24 - 2}`)
    .join(" ");
  const stroke = {
    info: "var(--info)",
    success: "var(--success)",
    critical: "var(--critical)",
  }[tone];
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="h-7 w-full" aria-hidden>
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  sub,
  trend,
  tone = "info",
  to,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: number[];
  tone?: "info" | "success" | "critical";
  to?: string;
}) {
  const body = (
    <div className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 ease-out hover:shadow-lift">
      <div>
        <div className="section-label">{label}</div>
        <div className="mt-2 text-2xl font-bold tracking-tight tabular-nums">{value}</div>
        {sub ? <div className="micro mt-0.5">{sub}</div> : null}
      </div>
      {trend ? <Sparkline data={trend} tone={tone} /> : null}
    </div>
  );
  if (to)
    return (
      <Link to={to} className="press block h-full">
        {body}
      </Link>
    );
  return body;
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sand text-soft">•••</div>
      <p className="font-bold">{title}</p>
      {body ? <p className="mt-1 max-w-sm text-muted-foreground">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-critical/25 bg-critical-wash px-6 py-10 text-center">
      <p className="font-bold text-critical">{message}</p>
      <button
        onClick={onRetry}
        className="press mt-3 rounded-full border border-critical/30 px-4 py-1.5 text-[13px] font-bold text-critical"
      >
        Retry
      </button>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-sand", className)} />;
}

/* ---------- Table ---------- */

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}

export function Th({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={cn(
        "section-label border-b border-border px-4 py-3 whitespace-nowrap",
        align === "right" && "text-right",
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  align = "left",
  className,
}: {
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-b border-border/70 px-4 py-3 align-middle",
        align === "right" && "num",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function Btn({
  children,
  variant = "primary",
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline" | "warning";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    warning: "bg-warning text-primary-foreground hover:opacity-90",
    outline: "border border-border bg-card text-foreground hover:bg-sand",
    ghost: "text-muted-foreground hover:bg-sand",
  };
  return (
    <button
      {...rest}
      className={cn(
        "press inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
