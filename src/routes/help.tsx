import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { Card, PageHeader, SectionLabel } from "@/components/fund/primitives";
import { relationshipManager } from "@/lib/fund-data";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — Makan Fund Portal" },
      { name: "description", content: "Reach your named Makan relationship manager, plus answers to common fund questions." },
      { property: "og:title", content: "Help & Support — Makan Fund Portal" },
      { property: "og:description", content: "A person, not a ticket queue." },
    ],
  }),
  component: Help,
});

const faqs = [
  {
    q: "How is the recovery rate calculated?",
    a: "The share of principal recovered when a tenant defaults, after resale of the property, net of selling costs.",
  },
  {
    q: "When are distributions paid?",
    a: "On the 5th of each month, to the account on file. Scheduled and processing payments appear in Distributions.",
  },
  {
    q: "How do I add a colleague?",
    a: "An Admin user invites them from Users & Access. Analysts are view-only and cannot see bank details.",
  },
  {
    q: "What happens when I offer a tenant a discount?",
    a: "The offer is sent to the tenant and logged to Makan OS with your reason, so both sides share one history.",
  },
];

function Help() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Help & Support" />

      <Card tone="info">
        <SectionLabel>Contact your Makan relationship manager</SectionLabel>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card text-lg font-bold text-info">
            {relationshipManager.initials}
          </span>
          <div>
            <p className="font-bold">{relationshipManager.name}</p>
            <p className="micro">{relationshipManager.title}</p>
            <div className="mt-1 flex flex-wrap gap-4">
              <a href={`mailto:${relationshipManager.email}`} className="inline-flex items-center gap-1.5 font-bold text-info">
                <Mail className="h-3.5 w-3.5" /> {relationshipManager.email}
              </a>
              <a href={`tel:${relationshipManager.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 font-bold text-info">
                <Phone className="h-3.5 w-3.5" /> {relationshipManager.phone}
              </a>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 space-y-3">
        {faqs.map((f) => (
          <Card key={f.q}>
            <p className="font-bold">{f.q}</p>
            <p className="mt-1 text-muted-foreground">{f.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
