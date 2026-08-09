import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Btn, PageHeader, Pill, Table, Td, Th } from "@/components/fund/primitives";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { currentUser, teamUsers } from "@/lib/fund-data";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Access — Makan Fund Portal" },
      { name: "description", content: "Manage which colleagues can see the fund portal, and at what level." },
      { property: "og:title", content: "Users & Access — Makan Fund Portal" },
      { property: "og:description", content: "Admins can invite, change roles and remove access." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Analyst");
  const [remove, setRemove] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Users & Access"
        subtitle="Admins see bank details and can manage the team. Analysts are view-only."
        actions={currentUser.isAdmin ? <Btn onClick={() => setInvite(true)}>+ Invite</Btn> : undefined}
      />

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Last Active</Th>
            <Th align="right">{currentUser.isAdmin ? "Manage" : ""}</Th>
          </tr>
        </thead>
        <tbody>
          {teamUsers.map((u) => (
            <tr key={u.email} className="transition-colors duration-300 hover:bg-sand">
              <Td><span className="font-bold">{u.name}</span></Td>
              <Td>{u.email}</Td>
              <Td><Pill tone={u.role === "Admin" ? "info" : "neutral"}>{u.role}</Pill></Td>
              <Td>{u.lastActive}</Td>
              <Td align="right">
                {currentUser.isAdmin ? (
                  <span className="inline-flex gap-3">
                    <button className="press font-bold text-info" onClick={() => toast.success(`Role updated for ${u.name}.`)}>
                      Change role
                    </button>
                    <button className="press font-bold text-critical" onClick={() => setRemove(u.name)}>
                      Remove access
                    </button>
                  </span>
                ) : null}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Dialog open={invite} onOpenChange={setInvite}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite a colleague</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block">
              <span className="section-label">Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@alrajhi.com" className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info" />
            </label>
            <label className="block">
              <span className="section-label">Role</span>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info">
                <option>Analyst</option>
                <option>Admin</option>
              </select>
            </label>
          </div>
          <DialogFooter>
            <Btn variant="ghost" onClick={() => setInvite(false)}>Cancel</Btn>
            <Btn
              disabled={!email.includes("@")}
              onClick={() => {
                setInvite(false);
                toast.success(`Invitation sent to ${email}.`);
                setEmail("");
              }}
            >
              Send invitation
            </Btn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={remove !== null} onOpenChange={(o) => !o && setRemove(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove access</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            {remove} will lose access immediately. This can be undone by re-inviting them.
          </p>
          <DialogFooter>
            <Btn variant="ghost" onClick={() => setRemove(null)}>Cancel</Btn>
            <Btn
              onClick={() => {
                toast.success(`${remove} no longer has access.`);
                setRemove(null);
              }}
            >
              Remove access
            </Btn>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
