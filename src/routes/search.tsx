import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState, PageHeader, SectionLabel, StatusBadge } from "@/components/fund/primitives";
import { documents, sar, units } from "@/lib/fund-data";

type SearchParams = { q: string };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Search — Makan Fund Portal" },
      { name: "description", content: "Search tenants, properties and documents within this fund." },
      { property: "og:title", content: "Search — Makan Fund Portal" },
      { property: "og:description", content: "Results scoped strictly to the active fund." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const term = q.trim().toLowerCase();
  const tenants = term ? units.filter((u) => u.tenant.toLowerCase().includes(term)).slice(0, 10) : [];
  const properties = term ? units.filter((u) => u.property.toLowerCase().includes(term)).slice(0, 10) : [];
  const docs = term ? documents.filter((d) => d.name.toLowerCase().includes(term)).slice(0, 10) : [];
  const none = tenants.length + properties.length + docs.length === 0;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Search results" subtitle={q ? `For “${q}” in Al Rajhi Finance — Fund I` : undefined} />

      {none ? (
        <EmptyState title="Nothing matched that search." body="Try a tenant name, a street or a document title." />
      ) : (
        <div className="space-y-8">
          {tenants.length ? (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <SectionLabel>Tenants</SectionLabel>
                <Link to="/portfolio" className="font-bold text-info">View in Portfolio</Link>
              </div>
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {tenants.map((u) => (
                  <Link key={u.id} to="/portfolio/$unitId" params={{ unitId: u.id }} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-sand">
                    <span>
                      <span className="font-bold">{u.tenant}</span>
                      <span className="micro block">{u.property}</span>
                    </span>
                    <StatusBadge status={u.status} detail={u.statusDetail} />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {properties.length ? (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <SectionLabel>Properties</SectionLabel>
                <Link to="/portfolio" className="font-bold text-info">View in Portfolio</Link>
              </div>
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {properties.map((u) => (
                  <Link key={u.id} to="/portfolio/$unitId" params={{ unitId: u.id }} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-sand">
                    <span>
                      <span className="font-bold">{u.property}</span>
                      <span className="micro block">{u.city}</span>
                    </span>
                    <span className="num">{sar(u.currentValue)}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {docs.length ? (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <SectionLabel>Documents</SectionLabel>
                <Link to="/documents" className="font-bold text-info">View in Documents</Link>
              </div>
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {docs.map((d) => (
                  <Link key={d.name} to="/documents" className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-sand">
                    <span className="font-bold">{d.name}</span>
                    <span className="micro">{d.date}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
