import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Download, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, KpiCard, PageHeader, SectionLabel, Pill } from "@/components/fund/primitives";
import {
  activeFund,
  asOfDate,
  kpis,
  portfolioValueSeries,
  sar,
  statusCounts,
} from "@/lib/fund-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fund Overview — Makan Fund Portal" },
      {
        name: "description",
        content:
          "Net yield, deployed capital, default and delinquency rates for Al Rajhi Finance — Fund I, updated in real time.",
      },
      { property: "og:title", content: "Fund Overview — Makan Fund Portal" },
      {
        property: "og:description",
        content: "Is my capital safe and performing? One screen, always current.",
      },
    ],
  }),
  component: Overview,
});

const tourSteps = [
  {
    text: "These four numbers are what matter most — always current, no need to ask Makan.",
    target: "kpis",
  },
  {
    text: "See exactly who's paying, who isn't, and what we expect to recover — full detail, any time.",
    target: "risk",
  },
  { text: "Download a statement whenever you need one.", target: "reports" },
];

function Overview() {
  const [tourStep, setTourStep] = useState<number | null>(null);
  const atTarget = (t: string) => tourStep !== null && tourSteps[tourStep]?.target === t;
  const above = kpis.netYield >= kpis.netYieldTarget;
  const total = statusCounts.current + statusCounts.late + statusCounts.arrears + statusCounts.default;
  const seg = (n: number) => `${(n / total) * 100}%`;

  return (
    <div className="mx-auto max-w-6xl">
      {/* A. Fund header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[19px] font-bold text-info">{activeFund.name}</h1>
          <p className="micro mt-0.5">as of {asOfDate}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-5 py-3 text-right shadow-soft">
          <div className="section-label">Net Yield</div>
          <div
            className={`flex items-center justify-end gap-1.5 text-3xl font-bold tabular-nums ${above ? "text-success" : "text-critical"}`}
          >
            {above ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            {kpis.netYield}%
          </div>
          <div className={`micro ${above ? "text-success" : "text-critical"}`}>
            vs {kpis.netYieldTarget}% target
          </div>
        </div>
      </div>

      {/* B. KPI row */}
      <div
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${atTarget("kpis") ? "rounded-3xl ring-2 ring-info ring-offset-4 ring-offset-background" : ""}`}
      >
        <KpiCard
          label="Capital Deployed"
          value={sar(kpis.capitalDeployed, { compact: true })}
          sub={`${kpis.unitsFunded} units funded`}
          to="/capital-activity"
        />
        <KpiCard
          label="Net Yield"
          value={`${kpis.netYield}%`}
          sub="6-month trend"
          trend={kpis.netYieldTrend}
          tone="success"
          to="/cash-flow"
        />
        <KpiCard
          label="Default Rate"
          value={`${kpis.defaultRate}%`}
          sub="Rising over 6 months"
          trend={kpis.defaultTrend}
          tone="critical"
          to="/risk"
        />
        <KpiCard
          label="Delinquency Rate"
          value={`${kpis.delinquencyRate}%`}
          sub="Improving over 6 months"
          trend={kpis.delinquencyTrend}
          tone="info"
          to="/risk"
        />
      </div>

      {/* C. Portfolio value chart */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <SectionLabel>Portfolio Value</SectionLabel>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioValueSeries} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}M`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  fontSize: 12,
                  background: "var(--card)",
                }}
                formatter={(v: number, n: string) => [sar(v * 1_000_000), n]}
              />
              <Line
                type="monotone"
                dataKey="deployed"
                name="Deployed"
                stroke="var(--soft)"
                strokeDasharray="5 4"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Current value"
                stroke="var(--info)"
                strokeWidth={2.4}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex gap-5 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-soft" /> Deployed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-info" /> Current value
          </span>
        </div>
      </div>

      {/* D. Risk snapshot */}
      <div
        className={`mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr] ${atTarget("risk") ? "rounded-3xl ring-2 ring-info ring-offset-4 ring-offset-background" : ""}`}
      >
        <Card>
          <SectionLabel>Risk snapshot</SectionLabel>
          <div className="flex h-4 w-full overflow-hidden rounded-full">
            <Link to="/risk" hash="current" style={{ width: seg(statusCounts.current) }} className="bg-success" title="Current" />
            <Link to="/risk" hash="late" style={{ width: seg(statusCounts.late) }} className="bg-pending" title="Late" />
            <Link to="/risk" hash="arrears" style={{ width: seg(statusCounts.arrears) }} className="bg-warning" title="Arrears" />
            <Link to="/risk" hash="default" style={{ width: seg(statusCounts.default) }} className="bg-critical" title="Default" />
          </div>
          <p className="mt-3 text-muted-foreground">
            Current ({statusCounts.current}) · Late ({statusCounts.late}) · Arrears (
            {statusCounts.arrears}) · Default ({statusCounts.default})
          </p>
        </Card>
        <Card tone="success">
          <div className="section-label text-success">
            Recovery rate on defaults — the fund's downside protection
          </div>
          <div className="mt-2 text-4xl font-bold text-success tabular-nums">{kpis.recoveryRate}%</div>
          <Link to="/risk" className="mt-2 inline-flex items-center gap-1 font-bold text-success">
            See default history <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>

      {/* E. Upcoming activity */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link to="/buyout-pipeline" className="press">
          <Card className="h-full transition-shadow duration-300 hover:shadow-lift">
            <SectionLabel>Buyout pipeline</SectionLabel>
            <p className="font-bold">3 units approaching Year-5 →</p>
          </Card>
        </Link>
        <Link to="/distributions" className="press">
          <Card className="h-full transition-shadow duration-300 hover:shadow-lift">
            <SectionLabel>Next distribution</SectionLabel>
            <p className="font-bold">5 Aug — SAR 340,000 →</p>
          </Card>
        </Link>
        <div className={atTarget("reports") ? "rounded-2xl ring-2 ring-info ring-offset-4 ring-offset-background" : ""}>
          <Card className="h-full">
            <SectionLabel>Last statement</SectionLabel>
            <div className="flex items-center justify-between gap-2">
              <Link to="/reports" className="font-bold">
                30 Jun →
              </Link>
              <button
                className="press rounded-full border border-border p-1.5 hover:bg-sand"
                aria-label="Download last statement"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <button className="micro underline" onClick={() => setTourStep(0)}>
          Replay the guided tour
        </button>
      </div>

      {tourStep !== null ? (
        <div className="fixed right-6 bottom-6 z-50 w-80 rounded-2xl border border-border bg-card p-5 shadow-lift duration-300 animate-in fade-in zoom-in-95">
          <p className="font-bold">{tourSteps[tourStep]?.text}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1.5">
              {tourSteps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === tourStep ? "bg-info" : "bg-border"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button className="micro" onClick={() => setTourStep(null)}>
                Skip tour
              </button>
              <button
                className="press rounded-full bg-primary px-4 py-1.5 text-[13px] font-bold text-primary-foreground"
                onClick={() => setTourStep(tourStep + 1 >= tourSteps.length ? null : tourStep + 1)}
              >
                {tourStep + 1 >= tourSteps.length ? "Done" : "Next"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {statusCounts.current < 5 ? (
        <Card tone="info" className="mt-6">
          <Pill tone="info">Early stage</Pill>
          <p className="mt-2">
            Your portfolio is just getting started — trend charts will build up as more data comes in.
          </p>
        </Card>
      ) : null}
    </div>
  );
}
