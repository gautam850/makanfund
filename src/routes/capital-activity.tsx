import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill, SectionLabel, Table, Td, Th } from "@/components/fund/primitives";
import { capital, capitalActivity, sar } from "@/lib/fund-data";

export const Route = createFileRoute("/capital-activity")({
  head: () => ({
    meta: [
      { title: "Capital Activity — Makan Fund Portal" },
      {
        name: "description",
        content: "Committed capital, what has been deployed and what remains available.",
      },
      { property: "og:title", content: "Capital Activity — Makan Fund Portal" },
      { property: "og:description", content: "Capital calls and deployments with a running balance." },
    ],
  }),
  component: CapitalActivity,
});

function CapitalActivity() {
  const remaining = capital.commitment - capital.deployed;
  const pct = (capital.deployed / capital.commitment) * 100;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Capital Activity" subtitle="Commitment, deployment and what's left to put to work." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <SectionLabel>Total Commitment</SectionLabel>
          <div className="text-2xl font-bold tabular-nums">{sar(capital.commitment)}</div>
        </Card>
        <Card>
          <SectionLabel>Deployed to Date</SectionLabel>
          <div className="text-2xl font-bold tabular-nums">{sar(capital.deployed)}</div>
          <div className="micro">{pct.toFixed(1)}% of commitment</div>
        </Card>
        <Card>
          <SectionLabel>Remaining</SectionLabel>
          <div className="text-2xl font-bold tabular-nums">{sar(remaining)}</div>
          <div className="micro">{(100 - pct).toFixed(1)}% of commitment</div>
        </Card>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-sand">
          <div className="bg-info transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <p className="micro mt-2">
          {sar(capital.deployed)} deployed · {sar(remaining)} remaining
        </p>
      </div>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th align="right">Amount</Th>
              <Th>Property</Th>
              <Th align="right">Running Balance</Th>
            </tr>
          </thead>
          <tbody>
            {capitalActivity.map((r) => (
              <tr key={`${r.date}-${r.amount}`} className="transition-colors duration-300 hover:bg-sand">
                <Td>{r.date}</Td>
                <Td>
                  <Pill tone={r.type === "Capital Call" ? "info" : "neutral"}>{r.type}</Pill>
                </Td>
                <Td align="right" className={r.amount < 0 ? "text-muted-foreground" : "text-success"}>
                  {sar(r.amount)}
                </Td>
                <Td>{r.property}</Td>
                <Td align="right">{sar(r.balance)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
