import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { Btn, Card, PageHeader, Pill, SectionLabel, Table, Td, Th } from "@/components/fund/primitives";
import { exportHistory } from "@/lib/fund-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Makan Fund Portal" },
      { name: "description", content: "Build, schedule and download portfolio, cash flow and risk reports." },
      { property: "og:title", content: "Reports — Makan Fund Portal" },
      { property: "og:description", content: "Generate a statement whenever you need one." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const [type, setType] = useState("Portfolio Summary");
  const [period, setPeriod] = useState("Last Quarter");
  const [format, setFormat] = useState("PDF");
  const [schedule, setSchedule] = useState(false);
  const [email, setEmail] = useState("");
  const [freq, setFreq] = useState("Quarterly");

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Reports" subtitle="Statements and packs, on demand or on a schedule." />

      <Card>
        <SectionLabel>Report builder</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="section-label">Report type</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info">
              <option>Portfolio Summary</option>
              <option>Cash Flow Statement</option>
              <option>Risk Report</option>
              <option>Full Quarterly Pack</option>
            </select>
          </label>
          <label className="block">
            <span className="section-label">Period</span>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info">
              <option>Last Quarter</option>
              <option>YTD</option>
              <option>Custom range</option>
            </select>
          </label>
          <label className="block">
            <span className="section-label">Format</span>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info">
              <option>PDF</option>
              <option>Excel</option>
            </select>
          </label>
        </div>

        {period === "Custom range" ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="section-label">From</span>
              <input type="date" className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info" />
            </label>
            <label className="block">
              <span className="section-label">To</span>
              <input type="date" className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info" />
            </label>
          </div>
        ) : null}

        <label className="mt-4 flex items-center gap-2">
          <input type="checkbox" checked={schedule} onChange={(e) => setSchedule(e.target.checked)} />
          <span className="font-bold">Schedule this report</span>
        </label>

        {schedule ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="section-label">Send to</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@alrajhi.com" className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info" />
            </label>
            <label className="block">
              <span className="section-label">Frequency</span>
              <select value={freq} onChange={(e) => setFreq(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info">
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </label>
          </div>
        ) : null}

        <div className="mt-4">
          <Btn onClick={() => toast.success(`${type} (${period}) is generating — we'll notify you when it's ready.`)}>
            Generate
          </Btn>
        </div>
      </Card>

      <div className="mt-6">
        <SectionLabel>Export history</SectionLabel>
        <Table>
          <thead>
            <tr>
              <Th>Report</Th>
              <Th>Requested by</Th>
              <Th>Date</Th>
              <Th align="right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {exportHistory.map((e) => (
              <tr key={e.name} className="transition-colors duration-300 hover:bg-sand">
                <Td><span className="font-bold">{e.name}</span></Td>
                <Td>{e.requestedBy}</Td>
                <Td>{e.date}</Td>
                <Td align="right">
                  {e.status === "Generating" ? (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating
                    </span>
                  ) : e.status === "Ready" ? (
                    <button className="press inline-flex items-center gap-1.5 font-bold text-info" onClick={() => toast.success(`${e.name} downloaded.`)}>
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Pill tone="critical">Failed</Pill>
                      <button className="press font-bold text-critical" onClick={() => toast.success(`Retrying ${e.name}.`)}>
                        Retry
                      </button>
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
