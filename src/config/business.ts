export interface BusinessConfig {
  currency: string
  currencySymbol: string
  freeShippingThreshold: number
  standardDeliveryFee: number
  localDeliveryFee: number
  localDeliveryRadiusKm: number
  codAvailable: boolean
  codFee: number
  returnWindowDays: number
  exchangeWindowDays: number
  storePickupEnabled: boolean
  localDeliveryEnabled: boolean
  whatsappOrderingEnabled: boolean
  taxRatePercent: number
  loyalty: {
    enabled: boolean
    programName: string
    pointsPerRupee: number
    rupeesPerPoint: number
  }
  firstOrderCouponCode: string
  firstOrderDiscountPercent: number
}

export const businessConfig: BusinessConfig = {
  currency: 'INR',
  currencySymbol: '₹',
  freeShippingThreshold: 1199,
  standardDeliveryFee: 49,
  localDeliveryFee: 0,
  localDeliveryRadiusKm: 5,
  codAvailable: true,
  codFee: 0,
  returnWindowDays: 2,
  exchangeWindowDays: 7,
  storePickupEnabled: true,
  localDeliveryEnabled: true,
  whatsappOrderingEnabled: true,
  taxRatePercent: 0,
  loyalty: {
    enabled: false,
    programName: 'Kilkari Rewards',
    pointsPerRupee: 0.05,
    rupeesPerPoint: 1,
  },
  firstOrderCouponCode: 'WELCOME10',
  firstOrderDiscountPercent: 10,
}
