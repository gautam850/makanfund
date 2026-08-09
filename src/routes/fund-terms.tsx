import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { Btn, Card, PageHeader, Pill, SectionLabel, Table, Td, Th } from "@/components/fund/primitives";
import { currentUser, fundTerms } from "@/lib/fund-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fund-terms")({
  head: () => ({
    meta: [
      { title: "Fund Terms & Covenants — Makan Fund Portal" },
      {
        name: "description",
        content:
          "Tenant eligibility, sub-leasing policy, visibility basis and termination protection agreed at fund initiation.",
      },
      { property: "og:title", content: "Fund Terms & Covenants — Makan Fund Portal" },
      { property: "og:description", content: "What was agreed at fund initiation, on the record." },
    ],
  }),
  component: FundTermsPage,
});

function FundTermsPage() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState(false);
  const [term, setTerm] = useState(fundTerms[0]!.term);
  const [change, setChange] = useState("");

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Fund Terms & Covenants"
        subtitle="The record of what was agreed with Makan at fund initiation."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <SectionLabel>Tenant Eligibility</SectionLabel>
          <p className="font-bold">Saudi National, Resident Expat, Non-Resident</p>
          <p className="micro mt-1">Min. income SAR 10,000/mo · DBR ≤ 50%.</p>
        </Card>
        <Card>
          <SectionLabel>Sub-leasing</SectionLabel>
          <p className="font-bold">Prohibited</p>
          <p className="micro mt-1">Grounds for cause-only termination.</p>
        </Card>
        <Card tone="success">
          <SectionLabel>Full Visibility</SectionLabel>
          <p className="font-bold text-success">Agreed</p>
          <p className="micro mt-1">Set 12 Jan 2026 · Al Rajhi Finance &amp; Makan.</p>
        </Card>
      </div>

      <div className="mt-6">
        <SectionLabel>Full terms</SectionLabel>
        <Table>
          <thead>
            <tr>
              <Th>Term</Th>
              <Th>Description</Th>
              <Th>Set On</Th>
              <Th>Set By</Th>
            </tr>
          </thead>
          <tbody>
            {fundTerms.map((t) => (
              <tr key={t.term} className="transition-colors duration-300 hover:bg-sand">
                <Td>
                  <span className="font-bold">{t.term}</span>
                </Td>
                <Td>{t.description}</Td>
                <Td>{t.setOn}</Td>
                <Td>{t.setBy}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {currentUser.isAdmin ? (
        <Card className="mt-6">
          <SectionLabel>Amendments</SectionLabel>
          {open ? (
            <div className="space-y-3">
              <label className="block">
                <span className="section-label">Term to amend</span>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info"
                >
                  {fundTerms.map((t) => (
                    <option key={t.term}>{t.term}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="section-label">Proposed change</span>
                <textarea
                  rows={4}
                  value={change}
                  onChange={(e) => setChange(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info"
                />
              </label>
              <p className="micro">
                Amendments affect existing tenants and require Makan's review — you'll hear back within 5
                business days.
              </p>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Btn>
                <Btn
                  disabled={change.trim().length < 5}
                  onClick={() => {
                    setOpen(false);
                    setChange("");
                    toast.success(`Amendment request sent to Makan for "${term}".`);
                  }}
                >
                  Submit request
                </Btn>
              </div>
            </div>
          ) : (
            <Btn variant="outline" onClick={() => setOpen(true)}>
              Request Amendment
            </Btn>
          )}
        </Card>
      ) : null}

      <div className="mt-6 rounded-2xl border border-border bg-card shadow-soft">
        <button
          onClick={() => setHistory((v) => !v)}
          className="press flex w-full items-center gap-2 px-5 py-4 text-left font-bold"
        >
          <ChevronRight className={cn("h-4 w-4 transition-transform duration-300", history && "rotate-90")} />
          Version history
        </button>
        {history ? (
          <div className="space-y-3 border-t border-border px-5 py-4">
            <div className="flex items-center justify-between">
              <span>
                <Pill tone="success">Current</Pill>{" "}
                <span className="ml-2">12 Jan 2026 — present</span>
              </span>
              <button className="font-bold text-info">View this version</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">4 Nov 2025 — 11 Jan 2026 (pre-initiation draft)</span>
              <button className="font-bold text-info">View this version</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
