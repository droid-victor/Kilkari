/**
 * Firebase Storage isn't available on this project's plan, so uploaded
 * images are compressed client-side and stored as data: URLs directly in
 * the product's Firestore document. This keeps "upload a file" working
 * without a separate file-storage backend, at the cost of a per-image size
 * cap (Firestore documents max out at 1MB total).
 *
 * If Storage becomes available later, swap this for a real upload (write
 * bytes to Storage, store the returned download URL instead) — every
 * caller only depends on getting back an image URL string, so nothing else
 * needs to change.
 */

const MAX_DIMENSION = 800
const JPEG_QUALITY = 0.72

export async function uploadProductImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file.')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not process this image.')
  }
  ctx.drawImage(bitmap, 0, 0, width, height)

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)

  // Rough safety check: a single product document holds several images plus
  // text fields, so keep each one comfortably under Firestore's 1MB/doc cap.
  const approxBytes = (dataUrl.length * 3) / 4
  if (approxBytes > 350_000) {
    throw new Error('Image is too large even after compression. Try a smaller photo.')
  }

  return dataUrl
}
