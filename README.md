# Kilkari Kids Shop

Omnichannel storefront for Kilkari Kids Shop — kids clothing, footwear and toys,
connecting online shopping with the physical store in Sultanpur, Uttar Pradesh.
Built with React, TypeScript, Vite, Tailwind CSS, and Firebase (Auth + Firestore
+ Hosting) for the admin/inventory panel and deployment.

**Live site:** https://kilkari.web.app
**Firebase project:** `kilkari-1`

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL (e.g. `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

Without any Firebase setup, the storefront runs fully on the bundled mock catalog
(54 sample products) — nothing below is required just to browse and develop the UI.

## Admin panel & real inventory (Firebase)

`/admin` (live at https://kilkari.web.app/admin) is the owner's dashboard for
managing products, stock and sales — the single source of truth the storefront
reads from. **This is already set up and live** on the `kilkari-1` Firebase
project: Firestore holds the 54-product catalog, Auth has one admin account.

To manage it locally (e.g. to run `npm run seed` again, or develop new admin
features against the real backend):

1. Ask whoever set up `kilkari-1` for the `.env.local` values (six
   `VITE_FIREBASE_*` keys + `VITE_ADMIN_EMAIL`) — see `.env.example` for the
   shape. `.env.local` is gitignored and was never committed.
2. `npm install && npm run dev`, then sign in at `/admin/login` with the admin
   account.

To set this up fresh for a **different** Firebase project (e.g. forking this
store for another business):

1. Create a free project at https://console.firebase.google.com.
2. Enable **Firestore Database** (production mode) and **Authentication →
   Sign-in method → Email/Password**.
3. Add one user under **Authentication → Users** — this is the admin login.
4. Copy `.env.example` to `.env.local`, fill in the `VITE_FIREBASE_*` values
   (Project Settings → General → Your apps) and `VITE_ADMIN_EMAIL`.
5. Put that same email into `firestore.rules` (replace the `isAdmin()` check),
   then `firebase deploy --only firestore:rules --project <your-project-id>`.
6. Seed the catalog (requires the admin password, passed as an env var so it's
   never written to disk):
   ```bash
   SEED_ADMIN_PASSWORD=yourpassword node --experimental-strip-types scripts/seedFirestore.mjs
   ```
7. `firebase deploy --only hosting:kilkari --project <your-project-id>` (after
   updating the `site` name in `firebase.json` and `.firebaserc`'s project id).

From `/admin`, add/edit/delete products and update online/store stock at
`/admin/products` (live Firestore subscription — updates instantly), and run
sale campaigns at `/admin/sales` (see below). Without Firebase configured,
`/admin` falls back to a clear "Firebase not configured" notice with writes
disabled — nothing breaks, it just stays read-only on mock data.

## Sales & discounts

`/admin/sales` runs store-wide or targeted discount campaigns: filter/search
products, select any number of them, set a discount percentage (applied off
MRP), and optionally schedule a start and/or end date/time. Applied sales are
stored per-product as a `sale` field (`{ discountPercent, startsAt, endsAt }`)
in Firestore — the original `price`/`mrp` are never overwritten, so a sale can
be removed and the product returns to its regular price automatically.

"Active" vs "Scheduled" vs "Ended" is computed live against the current time
(see `src/utils/sale.ts`) everywhere a price is shown or calculated — product
cards, PDP, cart, checkout, and the `/sale` listing page — so a scheduled sale
starts and ends on its own with no server/cron job required, just by comparing
against `new Date()` on each read.

## ⚠️ Store data still needs finishing touches

`src/config/store.ts` holds real data where available: **Kilkari Kids Shop**,
address (Infront of Ram Handloom, Prayagraj Road, Sultanpur, UP 228001), phone/
WhatsApp, and Google Maps coordinates/links (resolved from
https://share.google/CLDxiyny8aKFnTSPX). Still marked **PLACEHOLDER** because they
couldn't be fetched automatically (the share link redirects through a session-gated
page that triggers Google's automated-traffic check):

- `rating` / `reviewCount`
- `openingHours` (per day)
- `reviews` in `src/services/reviewService.ts` — add short, unaltered, attributed
  excerpts only, with permission
- `photos`, `parkingInfo`, real `email`

Open the Business Profile link yourself and copy those fields in, then set
`isDataVerified: true`.

Business policy knobs (delivery fees, COD, return window, coupons, etc.) live in
`src/config/business.ts`. Brand name/tagline live in `src/config/brand.ts`.

## Product images

Product, category, age and gender imagery currently uses real (freely hotlinkable)
Unsplash stock photos chosen to match each product's category — a stand-in until
the store's own product photography is ready. The **store's own storefront photo**
on the homepage/Store page is deliberately left blank rather than using a stock
photo, since that would misrepresent the real business. Swap image URLs in
`src/constants/products.ts` (per product) and `src/constants/categories.ts`
(category/age/gender tiles) for real photos whenever they're available — or just
manage products going forward through `/admin` once Firebase is connected.

## What's implemented

- Design system: warm/premium palette (terracotta, sage, sun, ink, cream) with
  Fraunces (display) + Inter (UI) typography, Tailwind v4 tokens in `src/index.css`.
- Responsive header (desktop nav + mobile drawer + search), sticky mobile bottom
  nav, footer with full sitemap, floating WhatsApp button. Mobile drawers render
  via a portal (`src/components/common/Portal.tsx`) so they aren't clipped by the
  sticky/blurred header, and sticky bottom bars account for the safe-area inset.
- Homepage: hero, store-visit CTA, shop by category/age/gender, new arrivals,
  bestsellers, category carousels, trust badges, Google reviews section (data-layer
  ready, empty until real reviews are added), newsletter signup.
- Catalog: 54 realistic mock products (clothing, footwear, toys, accessories),
  product listing pages with filters (gender, age, price, sale, pickup) and
  sorting, mobile filter bottom sheet.
- Product detail page: image gallery, size/color selectors, size guide link, stock
  and store-pickup availability, pincode delivery checker, WhatsApp inquiry link,
  related products, sticky mobile add-to-cart/buy-now bar.
- Cart, wishlist (persisted via Zustand + localStorage), checkout flow (address,
  delivery method, payment method selection — no real payment processing), order
  confirmation, order tracking UI.
- Store page: hours, address, phone, WhatsApp, Google Maps embed, reviews, "why
  visit us", sticky mobile call/WhatsApp/directions bar.
- Static content pages: About, Contact, FAQ, Size Guide, Returns, Privacy, Terms,
  Account, Orders, Addresses, 404.
- **Admin panel** (`/admin`, live and connected to Firebase): Auth login gated
  to one owner email, dashboard with stock stats, product list with inline
  stock editing, add/edit/delete product forms (react-hook-form + zod), and a
  sales/discount campaign tool (`/admin/sales`) with bulk selection and
  optional scheduling. Firestore security rules restrict writes to the admin
  email; storefront reads fall back to mock data if Firebase is ever
  unconfigured (e.g. a fresh clone without `.env.local`).
- **Deployed** to Firebase Hosting at https://kilkari.web.app.

## Not yet built (later phases from the original spec)

Payment gateway (Razorpay) wiring, POS sync, PWA/service worker, full SEO
structured data and sitemap, Instagram feed integration, loyalty program, and
birthday/school/newborn campaign content beyond basic routes. The architecture
(services/ layer, typed Product/Store models) is intentionally shaped so these
can be added without rewriting UI components.

## Project Structure

```
src/
  components/   # organized by domain (header, footer, product, cart, store, ...)
  pages/        # route-level page components (pages/admin/ for the admin panel)
  layouts/      # MainLayout (storefront) and AdminLayout (admin shell)
  services/     # productService (reads), inventoryService + saleService (writes)
  store/        # Zustand stores (cart, wishlist, filters, auth)
  config/       # store.ts, business.ts, brand.ts, firebase.ts, admin.ts
  constants/    # navigation, categories, mock product data (fallback catalog)
  utils/        # format.ts, sale.ts (effective price / active-sale logic)
  types/        # shared TypeScript types
scripts/
  seedFirestore.mjs  # one-time script to load the mock catalog into Firestore
firestore.rules      # Firestore security rules (admin-only writes)
firebase.json        # Hosting (site "kilkari") + Firestore rules config
.firebaserc          # pins the default Firebase project (kilkari-1)
```
