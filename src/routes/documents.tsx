import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Eye } from "lucide-react";
import { EmptyState, PageHeader, Table, Td, Th } from "@/components/fund/primitives";
import { documentCategories, documents } from "@/lib/fund-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Makan Fund Portal" },
      {
        name: "description",
        content: "Fund agreement, quarterly statements, tax documents and compliance certificates.",
      },
      { property: "og:title", content: "Documents — Makan Fund Portal" },
      { property: "og:description", content: "The fund's document vault, searchable by category." },
    ],
  }),
  component: Documents,
});

function Documents() {
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const rows = documents.filter(
    (d) => (!cat || d.type === cat) && d.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Documents" subtitle="Everything Makan has filed for this fund." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCat(null)}
          className={cn(
            "press rounded-full border px-3.5 py-1.5 text-[13px] font-bold",
            cat === null ? "border-info bg-info-wash text-info" : "border-border bg-card text-muted-foreground",
          )}
        >
          All
        </button>
        {documentCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "press rounded-full border px-3.5 py-1.5 text-[13px] font-bold",
              cat === c ? "border-info bg-info-wash text-info" : "border-border bg-card text-muted-foreground",
            )}
          >
            {c}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search documents…"
          className="ml-auto w-full max-w-xs rounded-full border border-border bg-card px-4 py-1.5 outline-none focus:border-info"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No documents match this search." body="Try a different category or keyword." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Document</Th>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.name} className="transition-colors duration-300 hover:bg-sand">
                <Td>
                  <span className="font-bold">{d.name}</span>
                </Td>
                <Td>{d.date}</Td>
                <Td>{d.type}</Td>
                <Td align="right">
                  <span className="inline-flex justify-end gap-3">
                    <button className="press inline-flex items-center gap-1 font-bold text-info" onClick={() => toast.success(`Opening ${d.name}.`)}>
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                    <button className="press inline-flex items-center gap-1 font-bold text-info" onClick={() => toast.success(`${d.name} downloaded.`)}>
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
