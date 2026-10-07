# Makan Insight Hub

# Makan Fund Portal — Complete Product Specification
### The investor-facing counterpart to Makan OS. 12 months live. Trusted by institutional capital partners (e.g. Al Rajhi Finance) as their daily window into fund performance. Full operational visibility, agreed at fund initiation via covenants — this is not a stripped-down external view, it is a first-class product.

Written to be handed to a designer or AI (Lovable) to rebuild without seeing the original.

---

# 0. DESIGN SYSTEM

**Palette:** cream #FBF8F2 (background), white #FFFFFF (surfaces), ink #262420 (primary text), muted #6F6A61 (secondary text), soft-muted #9A948A (tertiary/placeholder), line #E1D8C7 (borders). Blue #5E7FB5 / wash #EEF2F9 = informational/neutral. Green #4E8B6A / wash #E7F1EA = healthy/on-target/success. Orange #E0602B / wash #FBEEE8 = needs attention. Red #B0463C / wash #FBEBE9 = critical (arrears, default). Amber #C98A2E / wash #FBF3E6 = pending.

**Type:** Calibri (fallback Carlito/Segoe UI/system-ui). Financial figures always tabular and right-aligned in tables. Page titles 21px/700, section labels 11.5px/700/uppercase/tracked, body 13.5-14px/400, micro text 11-12px for metadata.

**Shape:** 12-14px card radius, 999px pills/badges/buttons. Borders 1px in line colour. Shadows soft: 0 1px 2px rgba(38,36,32,.04), 0 8px 24px -12px rgba(38,36,32,.10). Never a hard drop shadow.

**Motion:** 250-350ms ease-out on all transitions. Modals scale 96% to 100% with fade. Toasts slide from top-right, auto-dismiss 4s, manually dismissible. Buttons scale to 97% on press. Skeleton loaders for anything loading more than 200ms. Respects prefers-reduced-motion.

**Tone:** this is a confidence-building, read-mostly surface for a finance professional, not an ops tool. Every screen answers "is my capital safe and performing" before anything else. Language is plain, never operational jargon. Because full visibility was agreed at fund initiation, tenant names and payment detail are shown directly and matter-of-factly, with no defensive hedging in the copy.

**Global rules:** every action that changes a tenant's terms (e.g. offering a discount) requires a confirmation modal with a mandatory reason, logged and visible to Makan OS as well as this portal, so both sides always share one history. Every list has a real empty state and a real error state. Every KPI shows a trend, never a bare snapshot.

---

# GLOBAL SHELL

**Top bar (56px, white, bottom border):**
- Left: "Makan" bold ink + "Fund" in blue, 15px.
- Next to it: a **Fund Switcher**, styled as a text button with a chevron: **"Al Rajhi Finance — Fund I ▾"**. Click opens a small dropdown listing every fund/vehicle this user has access to (for a partner running multiple vehicles with Makan), each row showing the fund name and its net yield as a quick reference, plus a greyed-out **"Fund II — coming soon"** row if applicable. Selecting a fund reloads the portal scoped to that fund only — a hard boundary; this user can never see another fund's data even if Makan manages several.
- Centre: search input, placeholder **"Search properties or tenants…"**, scoped strictly to the active fund.
- Right: notification bell (unread badge, hidden at zero). Click opens the Notification Drawer.
- Far right: avatar (initials) + name + role (e.g. "Yara Al-Mutairi · Portfolio Analyst"), chevron, dropdown: **Profile**, **Settings**, divider, **Log out**.

**Left sidebar (220px, white, right border):**
- **Overview**
- **Portfolio**
- **Cash Flow**
- **Distributions**
- **Risk**
- **Buyout Pipeline**
- **Capital Activity**
- **Fund Terms & Covenants**
- **Documents**
- **Reports**
- divider
- **Users & Access**
- **Settings**
- **Help & Support**

Active item: blue-wash background, blue text, 3px blue left-edge accent. Hover (inactive): sand background. Collapses to icons-only under 1100px, expands on hover with a tooltip.

---

# 1. ONBOARDING (first login, new fund user)

**Purpose:** get a newly invited analyst or partner into a working view of their portfolio in minutes.
**Flow:**
1. **Welcome screen:** centred card, headline **"Welcome to the Makan Fund Portal"**, sub **"Your window into Al Rajhi Finance — Fund I, updated in real time."** Fields: Password, Confirm password (8-character minimum, strength indicator). Button **"Continue"** (disabled until valid).
2. **Access confirmation screen:** shows the fund(s) granted, read-only, copy: **"Access is managed by your fund's Admin user. Contact them to add a colleague."** Button **"Continue."**
3. **Guided tour (3 steps, overlay tooltips on the live Overview page):**
   - **"These four numbers are what matter most — always current, no need to ask Makan."** (highlights KPI row)
   - **"See exactly who's paying, who isn't, and what we expect to recover — full detail, any time."** (highlights the Risk sidebar link)
   - **"Download a statement whenever you need one."** (highlights Reports)
   Each step: **"Next"** button, **"Skip tour"** text link, progress dots.
4. No setup checklist — unlike Makan OS, a fund user configures nothing; the portal is fully populated from first login.

---

# 2. OVERVIEW (Dashboard)

**Purpose:** answer "is my capital safe and performing" in one screen.
**Primary user:** an analyst or partner checking in weekly or monthly, sometimes on a phone.

**Layout, top to bottom:**

**A. Fund header.** Fund name (19px bold, blue), **"as of [date]"** timestamp (auto-updating, muted), and a right-aligned **Net Yield badge**: large figure (e.g. "9.1%") with sub-text **"vs 9.0% target"** in green if at/above target, red if below, plus a small trend arrow.

**B. KPI row.** Four cards: **Capital Deployed** (SAR value + "N units funded" sub-line), **Net Yield** (with 6-month sparkline), **Default Rate** (sparkline, red trend if worsening), **Delinquency Rate** (sparkline). Identical visual treatment to Makan OS KPI cards. Clicking a card navigates to the relevant full page (Default Rate → Risk) rather than opening an internal drawer, since this portal favours full pages over nested detail.

**C. Portfolio Value chart.** Dual-line chart: **Deployed Capital** (dashed, muted tan) vs **Current Portfolio Value** (solid blue), x-axis in months since first deployment. Legend below: **"● Deployed  ● Current value."** Hover shows a tooltip with exact SAR figures for that month.

**D. Risk snapshot panel.** A horizontal stacked bar: Current (green) / Late (amber) / Arrears (orange) / Default (red), each segment clickable, each opening the Risk page pre-scrolled to the named list for that bucket. A legend beneath states exact counts, e.g. **"Current (41) · Late (3) · Arrears (2) · Default (1)."** Below it, a highlighted green box: **"Recovery rate on defaults — the fund's downside protection"** with the figure ("88%") in large bold green.

**E. Upcoming activity strip.** Three cards: **"3 units approaching Year-5 →"** (links to Buyout Pipeline), **"Next distribution: 5 Aug — SAR 340,000 →"** (links to Distributions), **"Last statement: 30 Jun →"** (links to Reports, with a small download icon for the last statement without leaving the page).

**Early-stage empty state:** if fewer than 5 units are deployed, a calm banner replaces the trend charts: **"Your portfolio is just getting started — trend charts will build up as more data comes in."**

**Loading state:** skeleton cards and a skeleton chart shape, never a blank flash.

---

# 3. PORTFOLIO

**Purpose:** see exactly which properties the fund's capital owns and exactly how each tenant is performing — full visibility, per the fund's own covenants.
**Primary user:** analyst reviewing asset-level and tenant-level health.

**Filter bar:** status tabs — **"All Units (48)"**, **"Current (41)"**, **"Late / Arrears (5)"**, **"Year-5 Due (1)"** — live-filtering. Search box **"Search by property or tenant name…"**. View toggle **Table | Map**.

**Table columns:** **Property** (address), **Tenant** (full name, bold, clickable), **Locked Price**, **Current Value**, **Payment Status** (badge: **Current** green / **Late — N days** amber / **Arrears — Month N of 6** red / **Valuation gap** orange / a custom flag label where relevant, e.g. **"Flagged — leaving KSA."**). Row click opens Tenant & Property Detail.

**Map view:** pins on a map of the relevant Saudi cities, coloured by status (green/amber/red), clustering when zoomed out. Hover shows a mini-card: tenant name, property, value, status. Click opens the same Tenant & Property Detail.

**Tenant & Property Detail (full page, reached from any row/pin):**
- **Header band** (blue wash): tenant full name (20px bold), property address beneath (muted), a status badge top-right.
- **Flag panel** (only rendered if a real issue exists — arrears, valuation gap, exit risk): red or amber background, a plain-language description, e.g. *"Tenant has indicated they may leave Saudi Arabia before year 5. Exit workflow not yet triggered."*
- **Ownership panel:** Ownership % today, Equity accrued (SAR).
- **Payments panel:** Next payment due (amount + date, or "Overdue" in red), a compact visual strip of the last 12-24 months' payment history (small coloured squares, green=paid, grey=upcoming, red=missed), and — only where relevant — the **Arrears Clock**: a horizontal progress bar with markers at **"M0 missed,"** **"M2 — equity frozen,"** **"M4 — now,"** **"M6 — forfeit,"** filled in red up to the current month.
- **Property panel:** Locked price, Current valuation, **Last maintenance call** (date + one-line description, or **"No calls logged"**).
- **Actions panel:** a single prominent button, **"Offer Payment Discount"** (orange). Clicking opens a modal:
  - Title: **"Offer Payment Discount"**
  - Field: **Discount %** — number input, placeholder **"e.g. 15"**
  - Field: **Duration** — dropdown: 1 month / 3 months / 6 months
  - Field: **Reason** — dropdown: "Encourage restart of payment" / "Retention" / "Other" (selecting Other reveals a free-text box)
  - Buttons: **"Cancel"** (ghost) and **"Send Offer"** (primary blue)
  - On confirm: modal closes, a toast appears top-right: **"Discount offer sent to [Tenant Name]."** The offer is also logged to Makan OS's activity log for that customer, visible to Makan's own ops team, so the fund's action and Makan's records never diverge.

**Empty state:** (filtered view with no matches) — icon + **"No units match these filters."** + **"Clear filters"** link.

---

# 4. CASH FLOW

**Purpose:** show exactly how money has moved — rent in, distributions out.
**Layout:**
- **Summary strip:** three stat blocks — **Rent Received to Date**, **Distributions Paid to Date**, **Net Position**.
- **Chart:** monthly grouped bar chart (Rent Received / Distributed) with a cumulative line overlay, legend beneath.
- **Table:** Month, Rent Received, Fees Deducted, Net to Fund, Distributed, Retained. **"Export CSV"** button top-right of the table.

---

# 5. DISTRIBUTIONS

**Purpose:** the formal register of every payment made to the fund.
**Layout:**
- **Next distribution card** (blue wash, top of page): **"Next distribution"** label, large figure **"SAR 340,000 — 5 Aug 2026."**
- **Table:** Date, Amount, Method ("Bank Transfer"), Reference (e.g. "MKN-DIST-0042"), Status (**Paid** green / **Scheduled** blue / **Processing** amber), and a **"Statement"** link per row (downloads a PDF remittance advice).
- **Bank details panel** (collapsed by default, "▸ Bank details on file" expandable): shows the destination account (masked, e.g. "•••• 4821"), with a **"Request change"** button — opens a secure request form; the change itself requires Makan-side verification and is never self-service, to prevent fraud. Confirmation copy on submit: **"Your request has been sent to Makan for verification. You'll be notified once it's confirmed."**

---

# 6. RISK

**Purpose:** the page a sophisticated fund reads most carefully.
**Layout:**
- **Delinquency breakdown:** horizontal stacked bar with a **trend toggle** (Today / Last 6 Months as a stacked area chart), so the fund can see direction of travel, not just a snapshot.
- **Named list:** a table beneath — **Tenant**, **Property**, **Issue** (badge), **Since** (date) — every currently arrears/flagged tenant, each row clickable through to their Tenant & Property Detail. This is deliberately not de-identified; full visibility is the agreed covenant.
- **Recovery Rate panel:** large highlighted green box, **"Recovery rate on defaults"** with the figure ("88%"), and beneath it a running history table of every past default: Tenant/Property (named), Default Date, Recovery Amount, Recovery %. A **"How we calculate this"** info icon opens a tooltip: *"The share of principal recovered when a tenant defaults, after resale of the property, net of selling costs."*

---

# 7. BUYOUT PIPELINE

**Purpose:** let the fund plan capital recycling around upcoming year-5 decisions.
**Table:** Property, Tenant, Deployed Date, Year-5 Date, Days Remaining, Tenant's Ownership % (today), **Likely Outcome** (Makan-assessed badge: **"Likely Convert"** green / **"Likely Extend"** blue / **"Uncertain"** amber, based on payment history — with a tooltip clarifying *"An indicator, not a guarantee."*).
**Timeline view (toggle):** a horizontal 24-month timeline plotting every unit's year-5 date, so recycling waves are visible at a glance.

---

# 8. CAPITAL ACTIVITY

**Purpose:** track committed capital, what's been deployed, and what remains.
**Summary cards:** **Total Commitment**, **Deployed to Date** (SAR + %), **Remaining** (SAR + %), with a horizontal progress bar visualising deployed-vs-remaining beneath the cards.
**Table:** Date, Type (**Capital Call** / **Deployment**), Amount, Property (for deployments), Running Balance.

---

# 9. FUND TERMS & COVENANTS

**Purpose:** the record of what was agreed at fund initiation — including tenant eligibility rules and the visibility basis for everything else in this portal.
**Primary user:** a fund Admin confirming terms, or a new analyst getting oriented.

**Layout:**
- **Covenant summary cards** (three, top of page):
  - **"Tenant Eligibility"** — e.g. *"Saudi National, Resident Expat, Non-Resident"* with a sub-line *"Min. income SAR 10,000/mo · DBR ≤ 50%."*
  - **"Sub-leasing"** — *"Prohibited"* with sub-line *"Grounds for cause-only termination."*
  - **"Full Visibility"** — *"Agreed"* with sub-line *"Set 12 Jan 2026 · Al Rajhi Finance & Makan."*
- **Full terms table:** Term, Description, Set On (date), Set By. Rows include: *Tenant eligibility*, *Sub-leasing policy*, *Full visibility*, *Termination protection* (description: *"Owner-initiated termination without cause requires full equity refund plus a fee."*).
- **"Request Amendment"** button (Admin-only) — opens a form: Term to amend (dropdown of existing terms), Proposed change (text area), submit routes to Makan; copy: **"Amendments affect existing tenants and require Makan's review — you'll hear back within 5 business days."** This is intentionally not self-service.
- **Version history** (if amended over the fund's life): a collapsed list, each entry showing the effective date range and a **"View this version"** link to a read-only snapshot.

---

# 10. DOCUMENTS

**Purpose:** the fund's document vault.
**Categories (filter chips):** Fund Agreement, Quarterly Statements, Distribution Statements, Tax Documents, Compliance Certificates.
**Table/grid:** Document name, Date, Type, **"View"** / **"Download"** actions.
**Search bar:** **"Search documents…"**

---

# 11. REPORTS

**Report Builder:** Report Type dropdown (Portfolio Summary / Cash Flow Statement / Risk Report / Full Quarterly Pack), Period (Last Quarter / YTD / Custom range with a date picker), Format (PDF/Excel). A **"Schedule this report"** toggle reveals a recipient email field and a frequency dropdown (Monthly/Quarterly). **"Generate"** button.
**Export history table:** Report name, Requested by, Date, Status (**Generating** — spinner / **Ready** — download icon / **Failed** — **"Retry"** link).

---

# 12. USERS & ACCESS

**Purpose:** let the fund self-manage who on their team can see this portal.
**Table:** Name, Email, Role (**Admin** — full access, can invite/remove users and see bank details; **Analyst** — view-only, no bank-detail visibility), Last Active.
**"+ Invite"** button (Admin-only) — modal: Email, Role dropdown. Confirmation toast: **"Invitation sent to [email]."**
**Row menu (Admin-only):** **Change role**, **Remove access** (confirmation modal: *"[Name] will lose access immediately. This can be undone by re-inviting them."*).

---

# 13. NOTIFICATIONS

**Bell drawer:** material events only, no operational noise. Event types: **New default**, **Valuation drop beyond 10%**, **Year-5 decision outcome**, **Capital call**, **Distribution processed**, **New statement available**, **Discount offer sent** (confirms the fund's own action completed). Each entry clickable to its source page.
**Full Notifications page:** same list, filter tabs (All / Material Events / Statements).
**Notification Settings** (in Settings): per-event toggle table (In-app / Email), defaulted to both on — this fund does not want to miss a default.

---

# 14. SETTINGS

Tabs: **General** (display name, timezone), **Notifications**, **Bank Details** (view-only + "Request change" flow), **Statement Preferences** (format PDF/Excel, preferred delivery day of month).

---

# 15. SEARCH RESULTS (full page)

Reached via "See all results." Grouped sections: Tenants, Properties, Documents — each showing up to 10 results in native row format, with a **"View in [Page]"** link per section.

---

# 16. HELP & SUPPORT

**"Contact your Makan relationship manager"** card: named contact's photo, name, email, phone/WhatsApp — a fund's questions reach a person, not a ticket queue. A short FAQ beneath: **"How is the recovery rate calculated?"**, **"When are distributions paid?"**, **"How do I add a colleague?"**, **"What happens when I offer a tenant a discount?"**

---

# STATES, THROUGHOUT

- **Loading:** skeleton charts and skeleton rows, never a blank screen.
- **Empty (new fund, early data):** calm, reassuring copy — e.g. *"No distributions yet — your first is scheduled for [date]."*
- **Error:** plain language + Retry, e.g. *"Couldn't load this chart — Retry."*
- **Success:** toast, top-right, green accent, always naming what happened and to whom, e.g. *"Discount offer sent to Khalid Ibrahim."*, *"Invitation sent to yara@alrajhi.com."*
- **Full-visibility rule, enforced throughout:** tenant names, payment status, and property-level operational detail are shown directly, because this was explicitly agreed in the fund's Terms & Covenants at initiation. This is a per-fund setting — a future fund with a different covenant could be restricted to aggregate-only views — so the portal must check each fund's visibility covenant before rendering tenant-identifying data.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://makanfund.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/92d6eb0b-c2d8-4373-adbb-fe68733754e4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
