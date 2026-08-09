import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  Search,
  LayoutDashboard,
  Building2,
  ArrowLeftRight,
  Banknote,
  ShieldAlert,
  CalendarClock,
  Wallet,
  ScrollText,
  FolderOpen,
  FileBarChart,
  Users,
  Settings as SettingsIcon,
  LifeBuoy,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FUNDS, currentUser, notifications } from "@/lib/fund-data";

const nav = [
  { label: "Overview", to: "/", icon: LayoutDashboard },
  { label: "Portfolio", to: "/portfolio", icon: Building2 },
  { label: "Cash Flow", to: "/cash-flow", icon: ArrowLeftRight },
  { label: "Distributions", to: "/distributions", icon: Banknote },
  { label: "Risk", to: "/risk", icon: ShieldAlert },
  { label: "Buyout Pipeline", to: "/buyout-pipeline", icon: CalendarClock },
  { label: "Capital Activity", to: "/capital-activity", icon: Wallet },
  { label: "Fund Terms & Covenants", to: "/fund-terms", icon: ScrollText },
  { label: "Documents", to: "/documents", icon: FolderOpen },
  { label: "Reports", to: "/reports", icon: FileBarChart },
];

const navSecondary = [
  { label: "Users & Access", to: "/users", icon: Users },
  { label: "Settings", to: "/settings", icon: SettingsIcon },
  { label: "Help & Support", to: "/help", icon: LifeBuoy },
];

function NavItem({
  label,
  to,
  icon: Icon,
  active,
}: {
  label: string;
  to: string;
  icon: typeof Users;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      title={label}
      className={cn(
        "relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] transition-colors duration-300 ease-out",
        active
          ? "bg-info-wash font-bold text-info"
          : "text-muted-foreground hover:bg-sand hover:text-foreground",
      )}
    >
      {active ? (
        <span className="absolute top-1.5 bottom-1.5 -left-2 w-[3px] rounded-full bg-info" />
      ) : null}
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate max-[1100px]:hidden">{label}</span>
    </Link>
  );
}

function FundSwitcher() {
  const [fund, setFund] = useState(FUNDS[0]!);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="press flex items-center gap-1 rounded-full px-2.5 py-1 text-[13.5px] font-bold text-foreground hover:bg-sand">
        {fund.name}
        <ChevronDown className="h-3.5 w-3.5 text-soft" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {FUNDS.map((f) => (
          <DropdownMenuItem
            key={f.id}
            disabled={f.comingSoon === true}
            onSelect={() => !f.comingSoon && setFund(f)}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2">
              {f.id === fund.id ? <Check className="h-3.5 w-3.5 text-info" /> : <span className="w-3.5" />}
              <span>{f.comingSoon ? `${f.name} — coming soon` : f.name}</span>
            </span>
            <span className="micro tabular-nums">{f.netYield ? `${f.netYield}%` : "—"}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationDrawer() {
  const unread = notifications.filter((n) => n.unread).length;
  return (
    <Sheet>
      <SheetTrigger className="press relative rounded-full p-2 hover:bg-sand" aria-label="Notifications">
        <Bell className="h-4.5 w-4.5 text-muted-foreground" />
        {unread > 0 ? (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-critical px-1 text-[10px] font-bold text-primary-foreground">
            {unread}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {notifications.map((n) => (
            <Link
              key={n.id}
              to={n.to}
              className="block rounded-xl border-b border-border/60 px-2 py-3 transition-colors duration-300 hover:bg-sand"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold">{n.title}</span>
                <span className="micro shrink-0">{n.time}</span>
              </div>
              <p className="mt-0.5 text-muted-foreground">{n.body}</p>
            </Link>
          ))}
          <Link to="/notifications" className="mt-3 block text-center font-bold text-info">
            View all notifications
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-card px-4">
        <Link to="/" className="text-[15px] font-bold whitespace-nowrap">
          Makan <span className="text-info">Fund</span>
        </Link>
        <div className="max-md:hidden">
          <FundSwitcher />
        </div>
        <form
          className="relative mx-auto w-full max-w-md max-sm:hidden"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/search", search: { q } });
          }}
        >
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-soft" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search properties or tenants…"
            className="w-full rounded-full border border-border bg-background py-1.5 pr-3 pl-9 text-[13.5px] outline-none focus:border-info"
          />
        </form>
        <div className="ml-auto flex items-center gap-1">
          <NotificationDrawer />
          <DropdownMenu>
            <DropdownMenuTrigger className="press flex items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-sand">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-info-wash text-[12px] font-bold text-info">
                {currentUser.initials}
              </span>
              <span className="text-left max-sm:hidden">
                <span className="block text-[13px] font-bold leading-tight">{currentUser.name}</span>
                <span className="micro block leading-tight">{currentUser.role}</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-soft" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => navigate({ to: "/settings" })}>Profile</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate({ to: "/settings" })}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate({ to: "/welcome" })}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[220px] shrink-0 overflow-y-auto border-r border-border bg-card px-4 py-4 sm:block max-[1100px]:w-[64px]">
          <nav className="flex flex-col gap-0.5">
            {nav.map((n) => (
              <NavItem key={n.to} {...n} active={pathname === n.to} />
            ))}
            <div className="my-3 border-t border-border" />
            {navSecondary.map((n) => (
              <NavItem key={n.to} {...n} active={pathname === n.to} />
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
