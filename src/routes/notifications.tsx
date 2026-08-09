import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Pill } from "@/components/fund/primitives";
import { notifications } from "@/lib/fund-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Makan Fund Portal" },
      { name: "description", content: "Material fund events: defaults, valuation drops, capital calls and statements." },
      { property: "og:title", content: "Notifications — Makan Fund Portal" },
      { property: "og:description", content: "Material events only — no operational noise." },
    ],
  }),
  component: Notifications,
});

const tabs = ["All", "Material Events", "Statements"] as const;

function Notifications() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const rows = notifications.filter((n) =>
    tab === "All"
      ? true
      : tab === "Statements"
        ? n.kind === "New statement"
        : n.kind !== "New statement",
  );

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Notifications" />
      <div className="mb-4 flex gap-1.5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "press rounded-full border px-3.5 py-1.5 text-[13px] font-bold",
              tab === t ? "border-info bg-info-wash text-info" : "border-border bg-card text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        {rows.map((n) => (
          <Link key={n.id} to={n.to} className="block px-5 py-4 transition-colors duration-300 hover:bg-sand">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="font-bold">{n.title}</span>
                {n.unread ? <Pill tone="info">New</Pill> : null}
              </span>
              <span className="micro">{n.time}</span>
            </div>
            <p className="mt-0.5 text-muted-foreground">{n.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
