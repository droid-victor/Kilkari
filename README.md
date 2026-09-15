# Kilkari Kids Shop

Omnichannel storefront for Kilkari Kids Shop — kids clothing, footwear and toys,
connecting online shopping with the physical store in Sultanpur, Uttar Pradesh.
Built with React, TypeScript, Vite, Tailwind CSS, and Firebase (Auth + Firestore)
for the admin/inventory panel.

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

`/admin` is the owner's dashboard for managing products and stock — this is the
single source of truth the storefront reads from once connected. To turn it on:

1. Create a free project at https://console.firebase.google.com.
2. In that project, enable **Firestore Database** (production mode, any region).
3. Enable **Authentication → Sign-in method → Email/Password**.
4. Under **Authentication → Users**, add one user — this is your admin/owner
   login (whatever email + password you choose).
5. Copy `.env.example` to `.env.local` and fill in:
   - The six `VITE_FIREBASE_*` values from Project Settings → General → Your apps
     → SDK setup and configuration.
   - `VITE_ADMIN_EMAIL` — the exact email of the user you created in step 4. Only
     this email is allowed into `/admin`.
6. Deploy the security rules in `firestore.rules` (they lock writes to the admin
   email — without this, anyone could edit your catalog):
   ```bash
   npm install -g firebase-tools   # once
   firebase login
   firebase deploy --only firestore:rules --project <your-project-id>
   ```
7. Load the starter catalog into Firestore (safe to re-run; upserts by id):
   ```bash
   npm run seed
   ```
8. Restart `npm run dev`, sign in at `/admin` with the user from step 4.

From here, add/edit/delete products and update online/store stock directly at
`/admin/products` — changes reflect on the storefront on next page load (see
`src/services/inventoryService.ts` for the read/write layer; the product list
page uses a live Firestore subscription, other pages fetch once per navigation).

Until this is set up, `/admin` shows a clear "Firebase not configured" notice and
all writes are disabled — nothing breaks, it just stays read-only on mock data.

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
- **Admin panel** (`/admin`): Firebase Auth login gated to one owner email,
  dashboard with stock stats, product list with inline stock editing, add/edit/
  delete product forms (react-hook-form + zod). Firestore security rules restrict
  writes to the admin email; storefront reads fall back to mock data until
  Firebase is configured.

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
  services/     # productService (reads), inventoryService (Firestore read/write)
  store/        # Zustand stores (cart, wishlist, filters, auth)
  config/       # store.ts, business.ts, brand.ts, firebase.ts, admin.ts
  constants/    # navigation, categories, mock product data (fallback catalog)
  types/        # shared TypeScript types
scripts/
  seedFirestore.mjs  # one-time script to load the mock catalog into Firestore
firestore.rules      # Firestore security rules (admin-only writes)
```
