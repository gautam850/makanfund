import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Info } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, PageHeader, Pill, SectionLabel, StatusBadge, Table, Td, Th } from "@/components/fund/primitives";
import { delinquencyTrend, kpis, recoveryHistory, sar, statusCounts, units } from "@/lib/fund-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "Risk — Makan Fund Portal" },
      {
        name: "description",
        content: "Delinquency breakdown, named arrears list and recovery rate on defaults.",
      },
      { property: "og:title", content: "Risk — Makan Fund Portal" },
      { property: "og:description", content: "Who's paying, who isn't, and what the fund recovers." },
    ],
  }),
  component: Risk,
});

function Risk() {
  const [mode, setMode] = useState<"today" | "trend">("today");
  const total = statusCounts.current + statusCounts.late + statusCounts.arrears + statusCounts.default;
  const flagged = units.filter((u) => u.status !== "current");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Risk" subtitle="Full visibility, as agreed at fund initiation." />

      <Card>
        <div className="mb-3 flex items-center justify-between gap-3">
          <SectionLabel>Delinquency breakdown</SectionLabel>
          <div className="flex rounded-full border border-border p-0.5">
            {(["today", "trend"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "press rounded-full px-3 py-1 text-[12.5px] font-bold",
                  mode === m ? "bg-info-wash text-info" : "text-muted-foreground",
                )}
              >
                {m === "today" ? "Today" : "Last 6 Months"}
              </button>
            ))}
          </div>
        </div>

        {mode === "today" ? (
          <>
            <div className="flex h-4 w-full overflow-hidden rounded-full">
              <div style={{ width: `${(statusCounts.current / total) * 100}%` }} className="bg-success" />
              <div style={{ width: `${(statusCounts.late / total) * 100}%` }} className="bg-pending" />
              <div style={{ width: `${(statusCounts.arrears / total) * 100}%` }} className="bg-warning" />
              <div style={{ width: `${(statusCounts.default / total) * 100}%` }} className="bg-critical" />
            </div>
            <p className="mt-3 text-muted-foreground">
              Current ({statusCounts.current}) · Late ({statusCounts.late}) · Arrears ({statusCounts.arrears}) ·
              Default ({statusCounts.default})
            </p>
          </>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={delinquencyTrend} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12, background: "var(--card)" }} />
                <Area type="monotone" dataKey="current" stackId="1" stroke="var(--success)" fill="var(--success-wash)" />
                <Area type="monotone" dataKey="late" stackId="1" stroke="var(--pending)" fill="var(--pending-wash)" />
                <Area type="monotone" dataKey="arrears" stackId="1" stroke="var(--warning)" fill="var(--warning-wash)" />
                <Area type="monotone" dataKey="default" stackId="1" stroke="var(--critical)" fill="var(--critical-wash)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="mt-6" id="arrears">
        <SectionLabel>Tenants needing attention</SectionLabel>
        <Table>
          <thead>
            <tr>
              <Th>Tenant</Th>
              <Th>Property</Th>
              <Th>Issue</Th>
              <Th>Since</Th>
            </tr>
          </thead>
          <tbody>
            {flagged.map((u) => (
              <tr key={u.id} className="transition-colors duration-300 hover:bg-sand">
                <Td>
                  <Link to="/portfolio/$unitId" params={{ unitId: u.id }} className="font-bold hover:text-info">
                    {u.tenant}
                  </Link>
                </Td>
                <Td>
                  {u.property}
                  <span className="micro block">{u.city}</span>
                </Td>
                <Td>
                  <StatusBadge status={u.status} detail={u.statusDetail} />
                </Td>
                <Td>{u.nextPaymentDate}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-6" id="default">
        <Card tone="success">
          <div className="flex items-center gap-2">
            <div className="section-label text-success">Recovery rate on defaults</div>
            <span
              className="cursor-help text-success"
              title="The share of principal recovered when a tenant defaults, after resale of the property, net of selling costs."
            >
              <Info className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-1 text-4xl font-bold text-success tabular-nums">{kpis.recoveryRate}%</div>
        </Card>

        <div className="mt-4">
          <Table>
            <thead>
              <tr>
                <Th>Tenant / Property</Th>
                <Th>Default Date</Th>
                <Th align="right">Recovery Amount</Th>
                <Th align="right">Recovery %</Th>
              </tr>
            </thead>
            <tbody>
              {recoveryHistory.map((r) => (
                <tr key={r.tenant} className="transition-colors duration-300 hover:bg-sand">
                  <Td>
                    <span className="font-bold">{r.tenant}</span>
                    <span className="micro block">{r.property}</span>
                  </Td>
                  <Td>{r.date}</Td>
                  <Td align="right">{sar(r.amount)}</Td>
                  <Td align="right">
                    <Pill tone="success">{r.pct}%</Pill>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
