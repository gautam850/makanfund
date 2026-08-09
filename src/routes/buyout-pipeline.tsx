import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, Pill, SectionLabel, Table, Td, Th } from "@/components/fund/primitives";
import { buyoutPipeline } from "@/lib/fund-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/buyout-pipeline")({
  head: () => ({
    meta: [
      { title: "Buyout Pipeline — Makan Fund Portal" },
      {
        name: "description",
        content: "Upcoming year-5 decisions so the fund can plan capital recycling.",
      },
      { property: "og:title", content: "Buyout Pipeline — Makan Fund Portal" },
      { property: "og:description", content: "Year-5 dates, ownership today and likely outcomes." },
    ],
  }),
  component: Pipeline,
});

function Pipeline() {
  const [view, setView] = useState<"table" | "timeline">("table");
  const maxDays = Math.max(...buyoutPipeline.map((p) => p.daysRemaining));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Buyout Pipeline"
        subtitle="Year-5 decisions ahead — plan the recycling of capital."
        actions={
          <div className="flex rounded-full border border-border bg-card p-0.5">
            {(["table", "timeline"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "press rounded-full px-3 py-1 text-[12.5px] font-bold capitalize",
                  view === v ? "bg-info-wash text-info" : "text-muted-foreground",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />

      {view === "table" ? (
        <Table>
          <thead>
            <tr>
              <Th>Property</Th>
              <Th>Tenant</Th>
              <Th>Deployed</Th>
              <Th>Year-5 Date</Th>
              <Th align="right">Days Remaining</Th>
              <Th align="right">Ownership %</Th>
              <Th>Likely Outcome</Th>
            </tr>
          </thead>
          <tbody>
            {buyoutPipeline.map((p) => (
              <tr key={p.unitId} className="transition-colors duration-300 hover:bg-sand">
                <Td>
                  <Link to="/portfolio/$unitId" params={{ unitId: p.unitId }}>
                    {p.property}
                  </Link>
                </Td>
                <Td>
                  <span className="font-bold">{p.tenant}</span>
                </Td>
                <Td>{p.deployedDate}</Td>
                <Td>{p.yearFiveDate}</Td>
                <Td align="right">{p.daysRemaining}</Td>
                <Td align="right">{p.ownershipPct}%</Td>
                <Td>
                  <span title="An indicator, not a guarantee.">
                    <Pill
                      tone={
                        p.outcome === "Likely Convert"
                          ? "success"
                          : p.outcome === "Likely Extend"
                            ? "info"
                            : "pending"
                      }
                    >
                      {p.outcome}
                    </Pill>
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card>
          <SectionLabel>Next 24 months</SectionLabel>
          <div className="space-y-2">
            {buyoutPipeline.map((p) => (
              <div key={p.unitId} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-[12.5px] text-muted-foreground">
                  {p.tenant}
                </span>
                <div className="relative h-6 flex-1 rounded-full bg-sand">
                  <span
                    className={cn(
                      "absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
                      p.outcome === "Likely Convert"
                        ? "bg-success"
                        : p.outcome === "Likely Extend"
                          ? "bg-info"
                          : "bg-pending",
                    )}
                    style={{ left: `${(p.daysRemaining / maxDays) * 96 + 2}%` }}
                    title={`${p.yearFiveDate} — ${p.outcome}`}
                  />
                </div>
                <span className="micro w-24 shrink-0 text-right">{p.yearFiveDate}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
