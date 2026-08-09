import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Btn, Card, PageHeader, SectionLabel } from "@/components/fund/primitives";
import { currentUser, notificationEvents } from "@/lib/fund-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Makan Fund Portal" },
      { name: "description", content: "Display preferences, notification rules, bank details and statement delivery." },
      { property: "og:title", content: "Settings — Makan Fund Portal" },
      { property: "og:description", content: "Control how the portal reaches you." },
    ],
  }),
  component: SettingsPage,
});

const tabs = ["General", "Notifications", "Bank Details", "Statement Preferences"] as const;

function SettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("General");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" />

      <div className="mb-4 flex flex-wrap gap-1.5">
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

      {tab === "General" ? (
        <Card>
          <SectionLabel>Profile</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="section-label">Display name</span>
              <input defaultValue={currentUser.name} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info" />
            </label>
            <label className="block">
              <span className="section-label">Timezone</span>
              <select defaultValue="Asia/Riyadh (GMT+3)" className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info">
                <option>Asia/Riyadh (GMT+3)</option>
                <option>Europe/London (GMT+1)</option>
                <option>Asia/Dubai (GMT+4)</option>
              </select>
            </label>
          </div>
          <div className="mt-4">
            <Btn onClick={() => toast.success("Profile updated.")}>Save changes</Btn>
          </div>
        </Card>
      ) : null}

      {tab === "Notifications" ? (
        <Card>
          <SectionLabel>Notify me about</SectionLabel>
          <div className="divide-y divide-border">
            {notificationEvents.map((e) => (
              <div key={e} className="flex items-center justify-between py-2.5">
                <span>{e}</span>
                <span className="flex items-center gap-5">
                  <label className="flex items-center gap-1.5 text-muted-foreground">
                    <input type="checkbox" defaultChecked /> In-app
                  </label>
                  <label className="flex items-center gap-1.5 text-muted-foreground">
                    <input type="checkbox" defaultChecked /> Email
                  </label>
                </span>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === "Bank Details" ? (
        <Card>
          <SectionLabel>Destination account</SectionLabel>
          {currentUser.isAdmin ? (
            <>
              <p className="tabular-nums">Al Rajhi Bank · •••• 4821</p>
              <div className="mt-3">
                <Btn variant="outline" onClick={() => toast.success("Your request has been sent to Makan for verification.")}>
                  Request change
                </Btn>
              </div>
              <p className="micro mt-2">Verified by Makan before any change takes effect.</p>
            </>
          ) : (
            <p className="text-muted-foreground">Bank details are visible to Admin users only.</p>
          )}
        </Card>
      ) : null}

      {tab === "Statement Preferences" ? (
        <Card>
          <SectionLabel>Delivery</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="section-label">Format</span>
              <select defaultValue="PDF" className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info">
                <option>PDF</option>
                <option>Excel</option>
              </select>
            </label>
            <label className="block">
              <span className="section-label">Preferred delivery day</span>
              <select defaultValue="5th" className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info">
                <option>1st</option>
                <option>5th</option>
                <option>10th</option>
                <option>Last day</option>
              </select>
            </label>
          </div>
          <div className="mt-4">
            <Btn onClick={() => toast.success("Statement preferences saved.")}>Save changes</Btn>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
