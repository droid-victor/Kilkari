import { businessConfig } from '@/config/business'
import { deliveryZoneConfig, isPincodeServiceable, isLocalDeliveryPincode } from '@/config/delivery'

export interface PincodeCheckResult {
  available: boolean
  pincode: string
  estimatedDays: string
  localDeliveryAvailable: boolean
  message: string
}

export async function checkPincode(pincode: string): Promise<PincodeCheckResult> {
  await new Promise((r) => setTimeout(r, 300))

  const isValid = /^\d{6}$/.test(pincode)
  if (!isValid) {
    return {
      available: false,
      pincode,
      estimatedDays: '',
      localDeliveryAvailable: false,
      message: 'Please enter a valid 6-digit pincode.',
    }
  }

  if (!isPincodeServiceable(pincode)) {
    return {
      available: false,
      pincode,
      estimatedDays: '',
      localDeliveryAvailable: false,
      message:
        'Sorry, we currently only deliver to Sultanpur (228001). Visit our store or check back soon as we expand delivery areas.',
    }
  }

  const isLocal = isLocalDeliveryPincode(pincode) && businessConfig.localDeliveryEnabled

  return {
    available: true,
    pincode,
    estimatedDays: isLocal ? deliveryZoneConfig.localDeliveryEstimate : deliveryZoneConfig.standardDeliveryDays,
    localDeliveryAvailable: isLocal,
    message: isLocal
      ? 'Local delivery available in your area.'
      : 'Delivery available to this pincode.',
  }
}
