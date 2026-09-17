/**
 * STORE CONFIGURATION — DEFAULT/SEED DATA ONLY
 *
 * This is the fallback used before Firebase is connected, and the seed data
 * the first time /admin/store-settings saves to Firestore. Once that happens,
 * Firestore (settings/store) is the live source of truth for everything the
 * owner can edit from /admin/store-settings — hours, phone, WhatsApp, email,
 * address, coordinates, social links, rating — see storeSettingsService.ts
 * and storeSettingsStore.ts. Editing this file only changes what a fresh,
 * never-configured deployment starts out showing.
 *
 * Name, address, phone, WhatsApp, coordinates and the Google Maps /
 * Directions URLs below are REAL, as provided/verified by the store owner.
 *
 * Still PLACEHOLDER (could not be fetched automatically — the Google
 * Business Profile share link https://share.google/CLDxiyny8aKFnTSPX
 * resolves through a JavaScript/session-gated redirect that triggers
 * Google's automated-traffic check):
 *   - rating / reviewCount
 *   - reviews (see reviewService.ts) — short excerpts only, attributed, unaltered
 *   - photos (exported/downloaded from the profile, with permission)
 *   - parkingInfo
 *   - email (currently a placeholder domain)
 *
 * To finish this: open the link above while signed in and copy those fields
 * in via /admin/store-settings (or here, before first save), then set
 * isDataVerified to true.
 */

export interface OpeningHour {
  day: string;
  hours: string;
  isToday?: boolean;
}

export interface StoreConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  address: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string;
  googleDirectionsUrl: string;
  googleBusinessUrl: string;
  rating: number | null;
  reviewCount: number | null;
  openingHours: OpeningHour[];
  photos: string[];
  parkingInfo: string;
  nearbyLandmark: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
  isDataVerified: boolean;
}

export const storeConfig: StoreConfig = {
  name: "Kilkari Kids Shop",
  legalName: "Kilkari Kids Shop",
  tagline: "Little Styles. Big Smiles.",
  description:
    "Your neighbourhood destination for kids clothing, footwear, toys and everything little ones love.",
  address:
    "Infront of Ram Handloom, Prayagraj Road, Sultanpur, Uttar Pradesh 228001, India",
  addressLine1: "Infront of Ram Handloom",
  addressLine2: "Prayagraj Road",
  city: "Sultanpur",
  state: "Uttar Pradesh",
  pincode: "228001",
  country: "India",
  phone: "+91-7007967128",
  whatsapp: "+91-7007967128",
  email: "hello@kilkarikidsshop.example",
  latitude: 26.25952098646642,
  longitude:  82.07379161609643,
  googleMapsUrl:
    "https://www.google.com/maps/place/Kilkari+Kids+Shop/@26.2593045,82.070809,17z/data=!3m1!4b1!4m6!3m5!1s0x399a7d01a8bb661b:0x8b20d3707d3a81cf!8m2!3d26.2592997!4d82.0733839!16s%2Fg%2F11tnlyf15l?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",
  googleDirectionsUrl:
    "https://www.google.com/maps/dir//Kilkari+Kids+Shop,+infront+of+Ram+Handloom,+Prayagraj,+road,+Sultanpur,+Uttar+Pradesh+228001/@26.2593045,82.070809,17z/data=!4m17!1m7!3m6!1s0x399a7d01a8bb661b:0x8b20d3707d3a81cf!2sKilkari+Kids+Shop!8m2!3d26.2592997!4d82.0733839!16s%2Fg%2F11tnlyf15l!4m8!1m0!1m5!1m1!1s0x399a7d01a8bb661b:0x8b20d3707d3a81cf!2m2!1d82.0733879!2d26.259298!3e9?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",
  googleBusinessUrl: "https://share.google/CLDxiyny8aKFnTSPX",
  // PLACEHOLDER — could not fetch due to Google bot-check; copy from the profile
  rating: null,
  reviewCount: null,
  // Default hours — edit the real ones anytime from /admin/store-settings
  // once Firebase is connected; that becomes the live source of truth.
  openingHours: [
    { day: "Monday", hours: "9:00 AM - 9:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 9:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 9:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 9:00 PM" },
    { day: "Friday", hours: "9:00 AM - 9:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 9:00 PM" },
    { day: "Sunday", hours: "9:00 AM - 9:00 PM" },
  ],
  photos: [],
  parkingInfo: "PLACEHOLDER — confirm parking availability near store",
  nearbyLandmark: "Infront of Ram Handloom",
  socialLinks: {
    instagram: "",
    facebook: "",
    youtube: "",
  },
  isDataVerified: false,
};
