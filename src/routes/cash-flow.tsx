import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Btn, Card, PageHeader, SectionLabel, Table, Td, Th } from "@/components/fund/primitives";
import { cashFlowRows, sar } from "@/lib/fund-data";

export const Route = createFileRoute("/cash-flow")({
  head: () => ({
    meta: [
      { title: "Cash Flow — Makan Fund Portal" },
      {
        name: "description",
        content: "Rent received, fees deducted and distributions paid, month by month.",
      },
      { property: "og:title", content: "Cash Flow — Makan Fund Portal" },
      { property: "og:description", content: "Exactly how money has moved: rent in, distributions out." },
    ],
  }),
  component: CashFlow,
});

function CashFlow() {
  const rentTotal = cashFlowRows.reduce((a, r) => a + r.rent, 0);
  const distTotal = cashFlowRows.reduce((a, r) => a + r.distributed, 0);
  let cum = 0;
  const chart = cashFlowRows.map((r) => {
    cum += r.net - r.distributed;
    return { month: r.month.slice(0, 3), rent: r.rent, distributed: r.distributed, cumulative: cum };
  });

  const exportCsv = () => {
    const header = "Month,Rent Received,Fees Deducted,Net to Fund,Distributed,Retained";
    const body = cashFlowRows
      .map((r) => [r.month, r.rent, r.fees, r.net, r.distributed, r.retained].join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([`${header}\n${body}`], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "makan-fund-cash-flow.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Cash Flow" subtitle="Rent in, distributions out — the full movement of money." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <SectionLabel>Rent Received to Date</SectionLabel>
          <div className="text-2xl font-bold tabular-nums">{sar(rentTotal)}</div>
        </Card>
        <Card>
          <SectionLabel>Distributions Paid to Date</SectionLabel>
          <div className="text-2xl font-bold tabular-nums">{sar(distTotal)}</div>
        </Card>
        <Card tone="success">
          <SectionLabel>Net Position</SectionLabel>
          <div className="text-2xl font-bold text-success tabular-nums">{sar(rentTotal - distTotal)}</div>
        </Card>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <SectionLabel>Monthly rent vs distributions</SectionLabel>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chart} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12, background: "var(--card)" }}
                formatter={(v: number) => sar(v)}
              />
              <Bar dataKey="rent" name="Rent Received" fill="var(--info)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="distributed" name="Distributed" fill="var(--success)" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="cumulative" name="Cumulative retained" stroke="var(--pending)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-5 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-info" /> Rent received</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Distributed</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-pending" /> Cumulative retained</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <SectionLabel>Monthly detail</SectionLabel>
        <Btn variant="outline" onClick={exportCsv}>
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Btn>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Month</Th>
            <Th align="right">Rent Received</Th>
            <Th align="right">Fees Deducted</Th>
            <Th align="right">Net to Fund</Th>
            <Th align="right">Distributed</Th>
            <Th align="right">Retained</Th>
          </tr>
        </thead>
        <tbody>
          {cashFlowRows.map((r) => (
            <tr key={r.month} className="transition-colors duration-300 hover:bg-sand">
              <Td>{r.month}</Td>
              <Td align="right">{sar(r.rent)}</Td>
              <Td align="right">{sar(r.fees)}</Td>
              <Td align="right">{sar(r.net)}</Td>
              <Td align="right">{sar(r.distributed)}</Td>
              <Td align="right" className={r.retained < 0 ? "text-critical" : ""}>
                {sar(r.retained)}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
