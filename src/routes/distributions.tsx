import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, FileText } from "lucide-react";
import { Btn, Card, PageHeader, Pill, SectionLabel, Table, Td, Th } from "@/components/fund/primitives";
import { distributions, sar } from "@/lib/fund-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/distributions")({
  head: () => ({
    meta: [
      { title: "Distributions — Makan Fund Portal" },
      { name: "description", content: "The formal register of every distribution paid to the fund." },
      { property: "og:title", content: "Distributions — Makan Fund Portal" },
      { property: "og:description", content: "Amounts, references, statuses and remittance advice." },
    ],
  }),
  component: Distributions,
});

function Distributions() {
  const [openBank, setOpenBank] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const next = distributions[0]!;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Distributions" subtitle="Every payment made to the fund, on the record." />

      <Card tone="info">
        <SectionLabel>Next distribution</SectionLabel>
        <div className="text-2xl font-bold text-info tabular-nums">
          {sar(next.amount)} — {next.date}
        </div>
      </Card>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th align="right">Amount</Th>
              <Th>Method</Th>
              <Th>Reference</Th>
              <Th>Status</Th>
              <Th>Statement</Th>
            </tr>
          </thead>
          <tbody>
            {distributions.map((d) => (
              <tr key={d.reference} className="transition-colors duration-300 hover:bg-sand">
                <Td>{d.date}</Td>
                <Td align="right">{sar(d.amount)}</Td>
                <Td>{d.method}</Td>
                <Td>{d.reference}</Td>
                <Td>
                  <Pill tone={d.status === "Paid" ? "success" : d.status === "Scheduled" ? "info" : "pending"}>
                    {d.status}
                  </Pill>
                </Td>
                <Td>
                  <button
                    className="press inline-flex items-center gap-1.5 font-bold text-info"
                    onClick={() => toast.success(`Remittance advice ${d.reference} downloaded.`)}
                  >
                    <FileText className="h-3.5 w-3.5" /> Statement
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card shadow-soft">
        <button
          onClick={() => setOpenBank((v) => !v)}
          className="press flex w-full items-center gap-2 px-5 py-4 text-left font-bold"
        >
          <ChevronRight className={cn("h-4 w-4 transition-transform duration-300", openBank && "rotate-90")} />
          Bank details on file
        </button>
        {openBank ? (
          <div className="border-t border-border px-5 py-4 duration-300 animate-in fade-in">
            <p className="text-muted-foreground">
              Destination account <span className="font-bold text-foreground tabular-nums">•••• 4821</span> ·
              Al Rajhi Bank
            </p>
            {requesting ? (
              <p className="mt-3 rounded-xl bg-info-wash p-3 text-info">
                Your request has been sent to Makan for verification. You'll be notified once it's
                confirmed.
              </p>
            ) : (
              <div className="mt-3">
                <Btn
                  variant="outline"
                  onClick={() => {
                    setRequesting(true);
                    toast.success("Change request sent to Makan for verification.");
                  }}
                >
                  Request change
                </Btn>
                <p className="micro mt-2">
                  Bank changes are never self-service — Makan verifies every request to prevent fraud.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
