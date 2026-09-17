import type { OrderLocation } from '@/types/product'

/**
 * Requests the browser's current location once. Resolves to null on
 * denial, timeout, or if the browser doesn't support geolocation — callers
 * should treat location sharing as optional and never block on it.
 */
export function getCurrentLocation(): Promise<OrderLocation | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    )
  })
}
