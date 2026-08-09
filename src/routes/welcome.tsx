import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Btn } from "@/components/fund/primitives";
import { FUNDS } from "@/lib/fund-data";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Makan Fund Portal" },
      { name: "description", content: "Set your password and get into your fund's live portfolio view." },
      { property: "og:title", content: "Welcome — Makan Fund Portal" },
      { property: "og:description", content: "Your window into Al Rajhi Finance — Fund I." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");

  const strength = pw.length >= 12 ? "Strong" : pw.length >= 8 ? "Good" : "Too short";
  const valid = pw.length >= 8 && pw === confirm;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lift">
        <p className="text-[15px] font-bold">
          Makan <span className="text-info">Fund</span>
        </p>

        {step === 0 ? (
          <>
            <h1 className="page-title mt-4">Welcome to the Makan Fund Portal</h1>
            <p className="mt-1 text-muted-foreground">
              Your window into Al Rajhi Finance — Fund I, updated in real time.
            </p>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="section-label">Password</span>
                <input
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info"
                />
                <span
                  className={`micro mt-1 block ${pw.length >= 8 ? "text-success" : "text-muted-foreground"}`}
                >
                  {pw ? strength : "8-character minimum"}
                </span>
              </label>
              <label className="block">
                <span className="section-label">Confirm password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 outline-none focus:border-info"
                />
              </label>
              <Btn className="w-full" disabled={!valid} onClick={() => setStep(1)}>
                Continue
              </Btn>
            </div>
          </>
        ) : (
          <>
            <h1 className="page-title mt-4">Your access</h1>
            <div className="mt-4 space-y-2">
              {FUNDS.map((f) => (
                <div
                  key={f.id}
                  className={`flex items-center justify-between rounded-xl border border-border px-4 py-3 ${f.comingSoon ? "opacity-50" : ""}`}
                >
                  <span className="font-bold">{f.comingSoon ? `${f.name} — coming soon` : f.name}</span>
                  <span className="micro tabular-nums">{f.netYield ? `${f.netYield}%` : "—"}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-muted-foreground">
              Access is managed by your fund's Admin user. Contact them to add a colleague.
            </p>
            <Btn className="mt-6 w-full" onClick={() => navigate({ to: "/" })}>
              Continue
            </Btn>
          </>
        )}
      </div>
    </div>
  );
}
