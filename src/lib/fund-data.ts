// Mock fund data for the Makan Fund Portal.
// Everything is scoped to a single active fund; a real deployment would
// fetch this per-fund and honour the fund's visibility covenant.

export type Fund = {
  id: string;
  name: string;
  netYield: number | null;
  comingSoon?: boolean;
  visibilityCovenant: "full" | "aggregate";
};

export const FUNDS: Fund[] = [
  {
    id: "arf-1",
    name: "Al Rajhi Finance — Fund I",
    netYield: 9.1,
    visibilityCovenant: "full",
  },
  { id: "arf-2", name: "Fund II", netYield: null, comingSoon: true, visibilityCovenant: "aggregate" },
];

export const activeFund = FUNDS[0]!;

export const currentUser = {
  name: "Yara Al-Mutairi",
  initials: "YA",
  role: "Portfolio Analyst",
  isAdmin: true,
  email: "yara@alrajhi.com",
};

export const asOfDate = "9 Aug 2026";

export type PaymentStatus =
  | "current"
  | "late"
  | "arrears"
  | "default"
  | "valuation-gap"
  | "flagged";

export type Unit = {
  id: string;
  property: string;
  city: string;
  tenant: string;
  lockedPrice: number;
  currentValue: number;
  status: PaymentStatus;
  statusDetail?: string | undefined;
  ownershipPct: number;
  equityAccrued: number;
  nextPaymentAmount: number;
  nextPaymentDate: string;
  overdue?: boolean | undefined;
  deployedDate: string;
  yearFiveDate: string;
  arrearsMonth?: number | undefined;
  flagText?: string | undefined;
  lastMaintenance?: { date: string; note: string } | undefined;
  history: ("paid" | "missed" | "upcoming")[];
  lat: number;
  lng: number;
};

function history(paid: number, missed = 0, total = 24): Unit["history"] {
  const out: Unit["history"] = [];
  for (let i = 0; i < total; i++) {
    if (i < paid) out.push("paid");
    else if (i < paid + missed) out.push("missed");
    else out.push("upcoming");
  }
  return out;
}

const names = [
  "Khalid Ibrahim",
  "Noura Al-Dossari",
  "Faisal Al-Harbi",
  "Sara Al-Qahtani",
  "Omar Bin Zayed",
  "Layla Al-Ghamdi",
  "Turki Al-Otaibi",
  "Hessa Al-Suwaidi",
  "Majed Al-Shehri",
  "Reem Al-Anazi",
  "Bandar Al-Malki",
  "Dana Al-Faisal",
  "Yousef Al-Amri",
  "Amal Al-Zahrani",
  "Salem Al-Rashid",
  "Huda Al-Balawi",
  "Ziad Al-Nasser",
  "Maha Al-Sulaiman",
  "Rakan Al-Juhani",
  "Lina Al-Hamdan",
];

const streets = [
  ["King Fahd Road", "Riyadh", 24.7136, 46.6753],
  ["Al Olaya District", "Riyadh", 24.6944, 46.6853],
  ["Prince Sultan Street", "Jeddah", 21.5433, 39.1728],
  ["Al Rawdah District", "Jeddah", 21.5852, 39.1636],
  ["King Abdulaziz Road", "Dammam", 26.4207, 50.0888],
  ["Al Faisaliyah", "Khobar", 26.2794, 50.208],
] as const;

function makeUnits(): Unit[] {
  const units: Unit[] = [];
  for (let i = 0; i < 48; i++) {
    const s = streets[i % streets.length]!;
    const locked = 620000 + ((i * 37) % 22) * 15000;
    const unit: Unit = {
      id: `U-${1001 + i}`,
      property: `${1200 + i * 3} ${s[0]}`,
      city: s[1],
      tenant: names[i % names.length]! + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ""),
      lockedPrice: locked,
      currentValue: Math.round(locked * (1 + ((i % 9) - 2) * 0.012)),
      status: "current",
      ownershipPct: 6 + ((i * 5) % 34),
      equityAccrued: Math.round(locked * (0.06 + ((i * 5) % 34) / 100) * 0.5),
      nextPaymentAmount: 4200 + ((i * 13) % 9) * 150,
      nextPaymentDate: "1 Sep 2026",
      deployedDate: `${1 + (i % 27)} ${["Feb", "Mar", "Apr", "May", "Jun", "Jul"][i % 6]!} 2022`,
      yearFiveDate: `${1 + (i % 27)} ${["Feb", "Mar", "Apr", "May", "Jun", "Jul"][i % 6]!} 2027`,
      history: history(14 + (i % 8)),
      lat: s[2] + ((i % 7) - 3) * 0.012,
      lng: s[3] + ((i % 5) - 2) * 0.014,
      lastMaintenance:
        i % 3 === 0
          ? { date: `${4 + (i % 20)} Jun 2026`, note: "AC servicing — resolved same week." }
          : undefined,
    };
    units.push(unit);
  }

  // Distressed / flagged units
  units[0] = {
    ...units[0]!,
    tenant: "Khalid Ibrahim",
    status: "arrears",
    statusDetail: "Arrears — Month 4 of 6",
    arrearsMonth: 4,
    overdue: true,
    nextPaymentDate: "1 May 2026",
    flagText:
      "Four consecutive payments missed. Equity accrual was frozen at Month 2. Forfeit is reached at Month 6 unless payments restart.",
    history: history(16, 4),
  };
  units[1] = {
    ...units[1]!,
    status: "arrears",
    statusDetail: "Arrears — Month 2 of 6",
    arrearsMonth: 2,
    overdue: true,
    nextPaymentDate: "1 Jul 2026",
    flagText: "Two consecutive payments missed. Equity accrual is now frozen.",
    history: history(18, 2),
  };
  units[2] = { ...units[2]!, status: "late", statusDetail: "Late — 12 days", overdue: true };
  units[3] = { ...units[3]!, status: "late", statusDetail: "Late — 6 days", overdue: true };
  units[4] = { ...units[4]!, status: "late", statusDetail: "Late — 21 days", overdue: true };
  units[5] = {
    ...units[5]!,
    status: "valuation-gap",
    statusDetail: "Valuation gap",
    currentValue: Math.round(units[5]!.lockedPrice * 0.87),
    flagText:
      "Current valuation is 13% below the locked price. The gap is carried by the fund at year-5 conversion.",
  };
  units[6] = {
    ...units[6]!,
    status: "flagged",
    statusDetail: "Flagged — leaving KSA",
    flagText:
      "Tenant has indicated they may leave Saudi Arabia before year 5. Exit workflow not yet triggered.",
  };
  units[7] = {
    ...units[7]!,
    status: "default",
    statusDetail: "Default",
    overdue: true,
    flagText: "Tenant defaulted at Month 6. Property is listed for resale; recovery in progress.",
    history: history(11, 6),
  };
  return units;
}

export const units = makeUnits();

export const getUnit = (id: string) => units.find((u) => u.id === id);

export const statusCounts = {
  current: units.filter((u) => u.status === "current" || u.status === "valuation-gap" || u.status === "flagged").length,
  late: units.filter((u) => u.status === "late").length,
  arrears: units.filter((u) => u.status === "arrears").length,
  default: units.filter((u) => u.status === "default").length,
};

export const kpis = {
  capitalDeployed: 32_400_000,
  unitsFunded: 48,
  netYield: 9.1,
  netYieldTarget: 9.0,
  netYieldTrend: [8.4, 8.6, 8.7, 8.9, 9.0, 9.1],
  defaultRate: 2.1,
  defaultTrend: [1.4, 1.5, 1.7, 1.8, 2.0, 2.1],
  delinquencyRate: 10.4,
  delinquencyTrend: [12.8, 12.1, 11.6, 11.0, 10.8, 10.4],
  recoveryRate: 88,
};

export const portfolioValueSeries = [
  { month: "Aug 25", deployed: 26.2, value: 27.1 },
  { month: "Sep 25", deployed: 27.4, value: 28.4 },
  { month: "Oct 25", deployed: 28.1, value: 29.3 },
  { month: "Nov 25", deployed: 29.0, value: 30.4 },
  { month: "Dec 25", deployed: 29.6, value: 31.2 },
  { month: "Jan 26", deployed: 30.1, value: 31.9 },
  { month: "Feb 26", deployed: 30.6, value: 32.6 },
  { month: "Mar 26", deployed: 31.2, value: 33.4 },
  { month: "Apr 26", deployed: 31.6, value: 34.0 },
  { month: "May 26", deployed: 32.0, value: 34.6 },
  { month: "Jun 26", deployed: 32.2, value: 35.1 },
  { month: "Jul 26", deployed: 32.4, value: 35.6 },
];

export const cashFlowRows = [
  { month: "Aug 2025", rent: 268000, fees: 21440, net: 246560, distributed: 220000, retained: 26560 },
  { month: "Sep 2025", rent: 272000, fees: 21760, net: 250240, distributed: 230000, retained: 20240 },
  { month: "Oct 2025", rent: 279000, fees: 22320, net: 256680, distributed: 240000, retained: 16680 },
  { month: "Nov 2025", rent: 284000, fees: 22720, net: 261280, distributed: 250000, retained: 11280 },
  { month: "Dec 2025", rent: 291000, fees: 23280, net: 267720, distributed: 260000, retained: 7720 },
  { month: "Jan 2026", rent: 297000, fees: 23760, net: 273240, distributed: 270000, retained: 3240 },
  { month: "Feb 2026", rent: 302000, fees: 24160, net: 277840, distributed: 275000, retained: 2840 },
  { month: "Mar 2026", rent: 308000, fees: 24640, net: 283360, distributed: 280000, retained: 3360 },
  { month: "Apr 2026", rent: 314000, fees: 25120, net: 288880, distributed: 300000, retained: -11120 },
  { month: "May 2026", rent: 319000, fees: 25520, net: 293480, distributed: 310000, retained: -16520 },
  { month: "Jun 2026", rent: 326000, fees: 26080, net: 299920, distributed: 320000, retained: -20080 },
  { month: "Jul 2026", rent: 331000, fees: 26480, net: 304520, distributed: 330000, retained: -25480 },
];

export type DistributionStatus = "Paid" | "Scheduled" | "Processing";
export const distributions: {
  date: string;
  amount: number;
  method: string;
  reference: string;
  status: DistributionStatus;
}[] = [
  { date: "5 Aug 2026", amount: 340000, method: "Bank Transfer", reference: "MKN-DIST-0043", status: "Scheduled" },
  { date: "5 Jul 2026", amount: 330000, method: "Bank Transfer", reference: "MKN-DIST-0042", status: "Processing" },
  { date: "5 Jun 2026", amount: 320000, method: "Bank Transfer", reference: "MKN-DIST-0041", status: "Paid" },
  { date: "5 May 2026", amount: 310000, method: "Bank Transfer", reference: "MKN-DIST-0040", status: "Paid" },
  { date: "5 Apr 2026", amount: 300000, method: "Bank Transfer", reference: "MKN-DIST-0039", status: "Paid" },
  { date: "5 Mar 2026", amount: 280000, method: "Bank Transfer", reference: "MKN-DIST-0038", status: "Paid" },
  { date: "5 Feb 2026", amount: 275000, method: "Bank Transfer", reference: "MKN-DIST-0037", status: "Paid" },
];

export const delinquencyTrend = [
  { month: "Feb", current: 39, late: 5, arrears: 3, default: 1 },
  { month: "Mar", current: 40, late: 4, arrears: 3, default: 1 },
  { month: "Apr", current: 40, late: 5, arrears: 2, default: 1 },
  { month: "May", current: 41, late: 4, arrears: 2, default: 1 },
  { month: "Jun", current: 41, late: 3, arrears: 3, default: 1 },
  { month: "Jul", current: 42, late: 3, arrears: 2, default: 1 },
];

export const recoveryHistory = [
  { tenant: "Nasser Al-Dawood", property: "1084 Al Olaya District, Riyadh", date: "14 Mar 2025", amount: 612000, pct: 91 },
  { tenant: "Ghada Al-Mutlaq", property: "77 Prince Sultan Street, Jeddah", date: "2 Sep 2024", amount: 548000, pct: 86 },
  { tenant: "Ibrahim Al-Saif", property: "412 King Abdulaziz Road, Dammam", date: "19 Feb 2024", amount: 501000, pct: 87 },
];

export type Outcome = "Likely Convert" | "Likely Extend" | "Uncertain";
export const buyoutPipeline = units.slice(0, 14).map((u, i) => ({
  unitId: u.id,
  property: u.property,
  tenant: u.tenant,
  deployedDate: u.deployedDate,
  yearFiveDate: u.yearFiveDate,
  daysRemaining: 40 + i * 46,
  ownershipPct: u.ownershipPct,
  outcome: (u.status === "arrears" || u.status === "default"
    ? "Uncertain"
    : i % 3 === 0
      ? "Likely Extend"
      : "Likely Convert") as Outcome,
}));

export const capitalActivity = [
  { date: "12 Jul 2026", type: "Deployment", amount: -680000, property: "1341 Al Rawdah District, Jeddah", balance: 3600000 },
  { date: "1 Jul 2026", type: "Capital Call", amount: 2000000, property: "—", balance: 4280000 },
  { date: "18 May 2026", type: "Deployment", amount: -710000, property: "1284 King Fahd Road, Riyadh", balance: 2280000 },
  { date: "3 Apr 2026", type: "Deployment", amount: -655000, property: "1230 Al Olaya District, Riyadh", balance: 2990000 },
  { date: "1 Apr 2026", type: "Capital Call", amount: 3000000, property: "—", balance: 3645000 },
  { date: "9 Feb 2026", type: "Deployment", amount: -725000, property: "1215 Prince Sultan Street, Jeddah", balance: 645000 },
];

export const capital = {
  commitment: 36_000_000,
  deployed: 32_400_000,
};

export const fundTerms = [
  {
    term: "Tenant eligibility",
    description: "Saudi National, Resident Expat, Non-Resident. Min. income SAR 10,000/mo · DBR ≤ 50%.",
    setOn: "12 Jan 2026",
    setBy: "Al Rajhi Finance & Makan",
  },
  {
    term: "Sub-leasing policy",
    description: "Prohibited. Grounds for cause-only termination.",
    setOn: "12 Jan 2026",
    setBy: "Al Rajhi Finance & Makan",
  },
  {
    term: "Full visibility",
    description:
      "Tenant names, payment status and property-level detail are shown to the fund in full.",
    setOn: "12 Jan 2026",
    setBy: "Al Rajhi Finance & Makan",
  },
  {
    term: "Termination protection",
    description: "Owner-initiated termination without cause requires full equity refund plus a fee.",
    setOn: "12 Jan 2026",
    setBy: "Al Rajhi Finance & Makan",
  },
];

export const documents = [
  { name: "Fund I — Limited Partnership Agreement", date: "12 Jan 2026", type: "Fund Agreement" },
  { name: "Q2 2026 Quarterly Statement", date: "30 Jun 2026", type: "Quarterly Statements" },
  { name: "Q1 2026 Quarterly Statement", date: "31 Mar 2026", type: "Quarterly Statements" },
  { name: "Distribution Advice MKN-DIST-0041", date: "5 Jun 2026", type: "Distribution Statements" },
  { name: "Distribution Advice MKN-DIST-0040", date: "5 May 2026", type: "Distribution Statements" },
  { name: "Zakat & Tax Certificate 2025", date: "18 Feb 2026", type: "Tax Documents" },
  { name: "SAMA Compliance Certificate", date: "4 Apr 2026", type: "Compliance Certificates" },
  { name: "AML Policy Attestation", date: "4 Apr 2026", type: "Compliance Certificates" },
];

export const documentCategories = [
  "Fund Agreement",
  "Quarterly Statements",
  "Distribution Statements",
  "Tax Documents",
  "Compliance Certificates",
];

export type ExportStatus = "Generating" | "Ready" | "Failed";
export const exportHistory: {
  name: string;
  requestedBy: string;
  date: string;
  status: ExportStatus;
}[] = [
  { name: "Full Quarterly Pack — Q2 2026", requestedBy: "Yara Al-Mutairi", date: "8 Aug 2026", status: "Generating" },
  { name: "Risk Report — YTD 2026", requestedBy: "Yara Al-Mutairi", date: "2 Aug 2026", status: "Ready" },
  { name: "Cash Flow Statement — Q2 2026", requestedBy: "Omar Al-Rasheed", date: "12 Jul 2026", status: "Ready" },
  { name: "Portfolio Summary — Jun 2026", requestedBy: "Omar Al-Rasheed", date: "1 Jul 2026", status: "Failed" },
];

export const teamUsers = [
  { name: "Yara Al-Mutairi", email: "yara@alrajhi.com", role: "Admin", lastActive: "Today, 09:12" },
  { name: "Omar Al-Rasheed", email: "omar@alrajhi.com", role: "Admin", lastActive: "Yesterday, 16:40" },
  { name: "Hind Al-Subaie", email: "hind@alrajhi.com", role: "Analyst", lastActive: "4 Aug 2026" },
  { name: "Tariq Al-Mansour", email: "tariq@alrajhi.com", role: "Analyst", lastActive: "28 Jul 2026" },
];

export type NotificationKind =
  | "New default"
  | "Valuation drop"
  | "Year-5 outcome"
  | "Capital call"
  | "Distribution processed"
  | "New statement"
  | "Discount offer sent";

export const notifications: {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  to: string;
}[] = [
  {
    id: "n1",
    kind: "New default",
    title: "New default recorded",
    body: "Hessa Al-Suwaidi — 1218 Al Rawdah District, Jeddah reached Month 6.",
    time: "2h ago",
    unread: true,
    to: "/risk",
  },
  {
    id: "n2",
    kind: "Valuation drop",
    title: "Valuation drop beyond 10%",
    body: "1215 Al Faisaliyah, Khobar is now 13% below locked price.",
    time: "Yesterday",
    unread: true,
    to: "/portfolio",
  },
  {
    id: "n3",
    kind: "Distribution processed",
    title: "Distribution processed",
    body: "MKN-DIST-0042 — SAR 330,000 is being processed.",
    time: "5 Jul",
    unread: true,
    to: "/distributions",
  },
  {
    id: "n4",
    kind: "New statement",
    title: "New statement available",
    body: "Q2 2026 Quarterly Statement is ready to download.",
    time: "30 Jun",
    unread: false,
    to: "/reports",
  },
  {
    id: "n5",
    kind: "Capital call",
    title: "Capital call issued",
    body: "SAR 2,000,000 called on 1 Jul 2026.",
    time: "1 Jul",
    unread: false,
    to: "/capital-activity",
  },
  {
    id: "n6",
    kind: "Year-5 outcome",
    title: "Year-5 decision outcome",
    body: "Reem Al-Anazi converted to full ownership.",
    time: "22 Jun",
    unread: false,
    to: "/buyout-pipeline",
  },
];

export const notificationEvents: NotificationKind[] = [
  "New default",
  "Valuation drop",
  "Year-5 outcome",
  "Capital call",
  "Distribution processed",
  "New statement",
  "Discount offer sent",
];

export const relationshipManager = {
  name: "Faisal Al-Dakhil",
  title: "Relationship Manager, Makan",
  email: "faisal@makan.sa",
  phone: "+966 55 214 8890",
  initials: "FD",
};

export function sar(n: number, opts: { compact?: boolean } = {}) {
  const abs = Math.abs(n);
  if (opts.compact && abs >= 1_000_000) return `SAR ${(n / 1_000_000).toFixed(1)}M`;
  return `SAR ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
