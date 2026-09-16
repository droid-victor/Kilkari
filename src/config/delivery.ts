/**
 * DELIVERY SERVICEABILITY CONFIGURATION
 *
 * List every pincode the store can currently deliver to. Starts with just
 * the store's home pincode (Sultanpur) — add more as delivery coverage
 * expands. Local delivery (same/next day) applies to pincodes listed in
 * `localDeliveryPincodes`; every other serviceable pincode gets standard
 * delivery timing.
 */

export interface DeliveryZoneConfig {
  serviceablePincodes: string[]
  localDeliveryPincodes: string[]
  standardDeliveryDays: string
  localDeliveryEstimate: string
}

export const deliveryZoneConfig: DeliveryZoneConfig = {
  serviceablePincodes: ['228001'],
  localDeliveryPincodes: ['228001'],
  standardDeliveryDays: '3-5 days',
  localDeliveryEstimate: 'Today / Tomorrow',
}

export function isPincodeServiceable(pincode: string): boolean {
  return deliveryZoneConfig.serviceablePincodes.includes(pincode)
}

export function isLocalDeliveryPincode(pincode: string): boolean {
  return deliveryZoneConfig.localDeliveryPincodes.includes(pincode)
}
