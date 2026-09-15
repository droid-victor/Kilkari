export const adminConfig = {
  // Store owner's email, allowed to sign in at /admin. Set VITE_ADMIN_EMAIL
  // in .env.local. Enforced client-side for UX and server-side via
  // firestore.rules (isAdmin()) as the real security boundary.
  ownerEmail: import.meta.env.VITE_ADMIN_EMAIL ?? '',
}
