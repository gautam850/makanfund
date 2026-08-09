import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Map as MapIcon, Rows3 } from "lucide-react";
import {
  EmptyState,
  PageHeader,
  StatusBadge,
  Table,
  Td,
  Th,
} from "@/components/fund/primitives";
import { units, sar, type Unit } from "@/lib/fund-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Makan Fund Portal" },
      {
        name: "description",
        content:
          "Every property the fund's capital owns, with tenant-level payment status and current valuations.",
      },
      { property: "og:title", content: "Portfolio — Makan Fund Portal" },
      {
        property: "og:description",
        content: "Asset-level and tenant-level health across all funded units.",
      },
    ],
  }),
  component: Portfolio,
});

type TabKey = "all" | "current" | "late" | "year5";

function Portfolio() {
  const [tab, setTab] = useState<TabKey>("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"table" | "map">("table");

  const counts = {
    all: units.length,
    current: units.filter((u) => u.status === "current").length,
    late: units.filter((u) => u.status === "late" || u.status === "arrears" || u.status === "default").length,
    year5: 1,
  };

  const rows = useMemo(() => {
    let list: Unit[] = units;
    if (tab === "current") list = list.filter((u) => u.status === "current");
    if (tab === "late")
      list = list.filter((u) => ["late", "arrears", "default"].includes(u.status));
    if (tab === "year5") list = list.slice(0, 1);
    if (q.trim())
      list = list.filter(
        (u) =>
          u.tenant.toLowerCase().includes(q.toLowerCase()) ||
          u.property.toLowerCase().includes(q.toLowerCase()),
      );
    return list;
  }, [tab, q]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: `All Units (${counts.all})` },
    { key: "current", label: `Current (${counts.current})` },
    { key: "late", label: `Late / Arrears (${counts.late})` },
    { key: "year5", label: `Year-5 Due (${counts.year5})` },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Portfolio"
        subtitle="Full visibility of every unit and tenant, per the fund's covenants."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "press rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition-colors duration-300",
                tab === t.key
                  ? "border-info bg-info-wash text-info"
                  : "border-border bg-card text-muted-foreground hover:bg-sand",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by property or tenant name…"
          className="ml-auto w-full max-w-xs rounded-full border border-border bg-card px-4 py-1.5 outline-none focus:border-info"
        />
        <div className="flex rounded-full border border-border bg-card p-0.5">
          <button
            onClick={() => setView("table")}
            className={cn(
              "press flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-bold",
              view === "table" ? "bg-info-wash text-info" : "text-muted-foreground",
            )}
          >
            <Rows3 className="h-3.5 w-3.5" /> Table
          </button>
          <button
            onClick={() => setView("map")}
            className={cn(
              "press flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-bold",
              view === "map" ? "bg-info-wash text-info" : "text-muted-foreground",
            )}
          >
            <MapIcon className="h-3.5 w-3.5" /> Map
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No units match these filters."
          action={
            <button
              className="press font-bold text-info"
              onClick={() => {
                setTab("all");
                setQ("");
              }}
            >
              Clear filters
            </button>
          }
        />
      ) : view === "table" ? (
        <Table>
          <thead>
            <tr>
              <Th>Property</Th>
              <Th>Tenant</Th>
              <Th align="right">Locked Price</Th>
              <Th align="right">Current Value</Th>
              <Th>Payment Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="transition-colors duration-300 hover:bg-sand">
                <Td>
                  <Link to="/portfolio/$unitId" params={{ unitId: u.id }} className="block">
                    {u.property}
                    <span className="micro block">{u.city}</span>
                  </Link>
                </Td>
                <Td>
                  <Link
                    to="/portfolio/$unitId"
                    params={{ unitId: u.id }}
                    className="font-bold hover:text-info"
                  >
                    {u.tenant}
                  </Link>
                </Td>
                <Td align="right">{sar(u.lockedPrice)}</Td>
                <Td align="right">{sar(u.currentValue)}</Td>
                <Td>
                  <StatusBadge status={u.status} detail={u.statusDetail} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <MapView rows={rows} />
      )}
    </div>
  );
}

function MapView({ rows }: { rows: Unit[] }) {
  const [hover, setHover] = useState<Unit | null>(null);
  const lats = rows.map((r) => r.lat);
  const lngs = rows.map((r) => r.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const pos = (u: Unit) => ({
    left: `${((u.lng - minLng) / (maxLng - minLng || 1)) * 92 + 4}%`,
    top: `${(1 - (u.lat - minLat) / (maxLat - minLat || 1)) * 86 + 7}%`,
  });
  const colour = (u: Unit) =>
    u.status === "current"
      ? "bg-success"
      : u.status === "late" || u.status === "valuation-gap" || u.status === "flagged"
        ? "bg-pending"
        : "bg-critical";

  return (
    <div className="relative h-[520px] overflow-hidden rounded-2xl border border-border bg-sand shadow-soft">
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px]" />
      {rows.map((u) => (
        <Link
          key={u.id}
          to="/portfolio/$unitId"
          params={{ unitId: u.id }}
          style={pos(u)}
          onMouseEnter={() => setHover(u)}
          onMouseLeave={() => setHover(null)}
          className={cn(
            "absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card transition-transform duration-300 hover:scale-150",
            colour(u),
          )}
          aria-label={`${u.tenant} — ${u.property}`}
        />
      ))}
      {hover ? (
        <div className="pointer-events-none absolute top-4 left-4 w-64 rounded-xl border border-border bg-card p-3 shadow-lift">
          <p className="font-bold">{hover.tenant}</p>
          <p className="micro">{hover.property}</p>
          <p className="mt-1 tabular-nums">{sar(hover.currentValue)}</p>
          <div className="mt-2">
            <StatusBadge status={hover.status} detail={hover.statusDetail} />
          </div>
        </div>
      ) : null}
      <p className="micro absolute right-4 bottom-3">
        Pins across Riyadh, Jeddah, Dammam and Khobar — coloured by payment status.
      </p>
    </div>
  );
}
