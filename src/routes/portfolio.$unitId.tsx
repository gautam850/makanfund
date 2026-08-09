import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Btn, Card, SectionLabel, StatusBadge } from "@/components/fund/primitives";
import { getUnit, sar } from "@/lib/fund-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portfolio/$unitId")({
  loader: ({ params }) => {
    const unit = getUnit(params.unitId);
    if (!unit) throw notFound();
    return { unit };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Unavailable — Makan Fund Portal" }, { name: "robots", content: "noindex" }] };
    const { unit } = loaderData;
    const title = `${unit.tenant} — ${unit.property} | Makan Fund Portal`;
    const description = `Ownership, payment history and property detail for ${unit.property}, ${unit.city}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: UnitDetail,
});

function UnitDetail() {
  const { unit } = Route.useLoaderData();
  const [open, setOpen] = useState(false);
  const [pct, setPct] = useState("");
  const [duration, setDuration] = useState("3 months");
  const [reason, setReason] = useState("Encourage restart of payment");
  const [otherReason, setOtherReason] = useState("");

  const valid = Number(pct) > 0 && (reason !== "Other" || otherReason.trim().length > 3);

  const send = () => {
    setOpen(false);
    toast.success(`Discount offer sent to ${unit.tenant}.`, {
      description: "Logged to Makan OS activity for this customer.",
    });
    setPct("");
    setOtherReason("");
  };

  const clock = unit.arrearsMonth;

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/portfolio" className="micro mb-4 inline-flex items-center gap-1.5 hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to portfolio
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-info/25 bg-info-wash p-5">
        <div>
          <h1 className="text-xl font-bold">{unit.tenant}</h1>
          <p className="text-muted-foreground">
            {unit.property}, {unit.city}
          </p>
        </div>
        <StatusBadge status={unit.status} detail={unit.statusDetail} />
      </div>

      {unit.flagText ? (
        <div
          className={cn(
            "mt-4 rounded-2xl border p-4",
            unit.status === "arrears" || unit.status === "default"
              ? "border-critical/25 bg-critical-wash text-critical"
              : "border-warning/25 bg-warning-wash text-warning",
          )}
        >
          <div className="section-label mb-1 text-current">Needs attention</div>
          <p className="text-foreground">{unit.flagText}</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionLabel>Ownership</SectionLabel>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold tabular-nums">{unit.ownershipPct}%</div>
              <div className="micro">Tenant ownership today</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tabular-nums">{sar(unit.equityAccrued)}</div>
              <div className="micro">Equity accrued</div>
            </div>
          </div>
        </Card>

        <Card>
          <SectionLabel>Property</SectionLabel>
          <dl className="grid grid-cols-2 gap-y-2">
            <dt className="text-muted-foreground">Locked price</dt>
            <dd className="num font-bold">{sar(unit.lockedPrice)}</dd>
            <dt className="text-muted-foreground">Current valuation</dt>
            <dd className="num font-bold">{sar(unit.currentValue)}</dd>
            <dt className="text-muted-foreground">Last maintenance call</dt>
            <dd className="text-right">
              {unit.lastMaintenance ? (
                <>
                  {unit.lastMaintenance.date}
                  <span className="micro block">{unit.lastMaintenance.note}</span>
                </>
              ) : (
                "No calls logged"
              )}
            </dd>
          </dl>
        </Card>
      </div>

      <Card className="mt-4">
        <SectionLabel>Payments</SectionLabel>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums">{sar(unit.nextPaymentAmount)}</span>
          <span className={unit.overdue ? "font-bold text-critical" : "text-muted-foreground"}>
            {unit.overdue ? `Overdue — due ${unit.nextPaymentDate}` : `due ${unit.nextPaymentDate}`}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {(unit.history as ("paid" | "missed" | "upcoming")[]).map((h, i: number) => (
            <span
              key={i}
              title={h}
              className={cn(
                "h-4 w-4 rounded-[4px]",
                h === "paid" ? "bg-success" : h === "missed" ? "bg-critical" : "bg-border",
              )}
            />
          ))}
        </div>
        <p className="micro mt-2">Last 24 months · green paid · red missed · grey upcoming</p>

        {clock ? (
          <div className="mt-5 rounded-xl border border-critical/25 bg-critical-wash p-4">
            <div className="section-label mb-2 text-critical">Arrears clock</div>
            <div className="relative h-2.5 w-full rounded-full bg-card">
              <div
                className="h-2.5 rounded-full bg-critical transition-all duration-300"
                style={{ width: `${(clock / 6) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>M0 missed</span>
              <span>M2 — equity frozen</span>
              <span className="font-bold text-critical">M{clock} — now</span>
              <span>M6 — forfeit</span>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="mt-4">
        <SectionLabel>Actions</SectionLabel>
        <Btn variant="warning" onClick={() => setOpen(true)}>
          Offer Payment Discount
        </Btn>
        <p className="micro mt-2">
          Changes to a tenant's terms require a reason and are logged to Makan OS, so both sides share
          one history.
        </p>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Offer Payment Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block">
              <span className="section-label">Discount %</span>
              <input
                type="number"
                value={pct}
                onChange={(e) => setPct(e.target.value)}
                placeholder="e.g. 15"
                className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info"
              />
            </label>
            <label className="block">
              <span className="section-label">Duration</span>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info"
              >
                <option>1 month</option>
                <option>3 months</option>
                <option>6 months</option>
              </select>
            </label>
            <label className="block">
              <span className="section-label">Reason</span>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info"
              >
                <option>Encourage restart of payment</option>
                <option>Retention</option>
                <option>Other</option>
              </select>
            </label>
            {reason === "Other" ? (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Tell Makan why"
                rows={3}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info"
              />
            ) : null}
          </div>
          <DialogFooter>
            <Btn variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Btn>
            <Btn onClick={send} disabled={!valid}>
              Send Offer
            </Btn>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
