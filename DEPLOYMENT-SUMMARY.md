# GrowthLab Network Microapp – Deployment Summary & Checklist

## Build status
- **Production build:** ✅ Passes (`npm run build`)
- **Messages page:** ✅ Wrapped in `Suspense` for `useSearchParams` (Next.js requirement)
- **Export buttons:** ✅ Government & Industry Experts "Export" set to disabled (no `href="#"`)

---

## 1. Global shell & navigation

| Item | Status | Notes |
|------|--------|------|
| Floating header (desktop) | ✅ | Centered pill: My Network + 7 directory names + divider + 5 utility icons + CTA |
| Header links | ✅ | My Network → `/`, directories → `/startups`, `/investors`, etc. |
| Directory CTAs | ✅ | Dynamic per section (e.g. "Register Agency", "Join as Mentor") → correct create/exhibit pages |
| Connections icon | ✅ | → `/connections` |
| Messages icon | ✅ | → `/messages`, badge from messages context |
| Requests (Connection requests) | ✅ | Opens dialog; Accept/Decline remove item from list |
| Scan QR | ✅ | Opens QR dialog (paste ID + Connect) |
| Settings | ✅ | → `/settings` |
| Mobile FAB | ✅ | Opens bottom sheet with same nav + CTA |
| Mobile sheet links | ✅ | All close sheet and navigate |

---

## 2. Messaging & chat

| Item | Status | Notes |
|------|--------|------|
| Messages context | ✅ | Shared state + `localStorage`; `addMessage`, `markRead` |
| `/messages` page | ✅ | List, thread, send; `?open=<id>` opens conversation |
| Communication hub (FAB) | ✅ | Same data; open list → select → send; syncs with page |
| Conversation source | ✅ | Each chat has source (Startup, Investor, Mentor, etc.) shown in UI |
| Message buttons app-wide | ✅ | Startups, Investors, Mentors, Incubators, Experts, Teachers, Government, Connections → `/messages` |
| Header Messages badge | ✅ | Unread count from context |

---

## 3. Connection requests

| Item | Status | Notes |
|------|--------|------|
| Open dialog | ✅ | From header Requests or hub "Pending" / event |
| Accept / Decline | ✅ | Updates local list (mock data) |
| Send request (from profiles) | ✅ | `SendConnectionRequestDialog` with optional message |

---

## 4. Directories (list + detail + create)

| Directory | List page | Detail `[id]` | Create / CTA | Message button |
|-----------|-----------|----------------|--------------|----------------|
| **Startups** | ✅ `/startups` | ✅ `/startups/[id]` | ✅ `/startups/exhibit` | ✅ → `/messages` |
| **Investors** | ✅ `/investors` | ✅ `/investors/[id]` | ✅ `/investors/create` | ✅ (drawer + detail) → `/messages` |
| **Mentors** | ✅ `/mentors` | ✅ `/mentors/[id]` | ✅ `/mentors/create` | ✅ → `/messages` |
| **Incubators** | ✅ `/incubators-accelerators` | ✅ `/[id]` | ✅ `/create` | ✅ → `/messages` |
| **Industry experts** | ✅ `/industry-experts` | ✅ `/[id]` | ✅ `/create` | ✅ (card + detail) → `/messages` |
| **Teachers** | ✅ `/teachers` | ✅ `/[id]` | ✅ `/create` | ✅ (card + detail) → `/messages` |
| **Government** | ✅ `/government` | ✅ `/[id]` | ✅ `/create` | ✅ (card + detail) → `/messages` |

- List pages: filters, search, sort, cards, pagination where applicable.
- Detail pages: back link, profile content, Connect / Message / Share / Save, related items, edit (for “me” profiles).
- Create flows: form or intro + edit dialog → save (e.g. localStorage for “me”) → redirect to profile or list.

---

## 5. Other routes

| Route | Status | Notes |
|-------|--------|------|
| `/` (My Network hub) | ✅ | Tabs: Connections, Pending, Suggestions; links to Messages, Connections, Invite; open requests |
| `/connections` | ✅ | Search, sort, list; Message → `/messages` |
| `/invite` | ✅ | Copy invite link |
| `/settings` | ✅ | Placeholder; “Back to Network” → `/` |
| `/qr-networking` | ✅ | QR networking entry |
| `/incubators-accelerators/dashboard` | ✅ | Dashboard placeholder |
| `/incubators-accelerators/register` | ✅ | Register flow |

---

## 6. Buttons & actions verified

- **Connect / Request to connect:** Sets local state (e.g. “Request sent”) or opens send-request dialog.
- **Message:** All go to `/messages` (or open hub).
- **Share / Copy link:** Copy profile or invite URL.
- **Save / Bookmark:** Toggle local state.
- **Edit profile:** Opens edit dialog; save updates local/storage and UI.
- **Back / breadcrumbs:** Correct directory or list.
- **Export (Government, Industry experts):** Disabled, “Export coming soon” (no navigation).

---

## 7. Data & state

- **Mock data:** Used for directories, connections, requests, messages (no backend).
- **Persistence:** Messages (and any “me” profiles) use `localStorage` where implemented.
- **Context:** `MessagesProvider` in root layout; messages and unread in sync across header, page, and hub.

---

## 8. What’s included (summary for evaluation)

1. **Floating header** – Centered, content-width pill: My Network + 7 directory names + dividers + 5 utility icons (Connections, Messages, Requests, Scan QR, Settings) + section CTA. All buttons and links work.
2. **Seven directories** – Startups, Investors, Mentors, Incubators, Industry Experts, Teachers, Government: list, detail, create (or exhibit), with filters/search and Message/Connect where applicable.
3. **Messaging** – Shared inbox with conversation source; full-page `/messages` and floating chat widget; all “Message” entry points go to the same experience; send works and persists.
4. **Connection requests** – Dialog with accept/decline; send-request from profiles with optional message.
5. **My Network hub** – Connections, Pending, Suggestions tabs; links to Messages, Connections, Invite; open connection-requests dialog.
6. **QR** – Scan/connect dialog (paste ID for demo).
7. **Invite & Settings** – Invite copy link; Settings placeholder.
8. **Mobile** – FAB opens sheet with full nav and CTA; no full header on small screens.

Everything listed above is wired and operational for deployment from a front-end perspective; the app is ready for you to evaluate and deploy.
