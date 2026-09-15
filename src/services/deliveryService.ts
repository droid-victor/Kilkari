import { businessConfig } from '@/config/business'

export interface PincodeCheckResult {
  available: boolean
  pincode: string
  estimatedDays: string
  localDeliveryAvailable: boolean
  message: string
}

// Mock check — replace with a real serviceability API call.
// Deterministic on the pincode so the UI behaves consistently in demos.
export async function checkPincode(pincode: string): Promise<PincodeCheckResult> {
  await new Promise((r) => setTimeout(r, 400))

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

  const lastDigit = Number(pincode[pincode.length - 1])
  const isLocal = lastDigit % 3 === 0
  const isServiceable = lastDigit !== 9

  if (!isServiceable) {
    return {
      available: false,
      pincode,
      estimatedDays: '',
      localDeliveryAvailable: false,
      message: 'Sorry, delivery is currently unavailable to this pincode.',
    }
  }

  return {
    available: true,
    pincode,
    estimatedDays: isLocal ? 'Today / Tomorrow' : '2-3 days',
    localDeliveryAvailable: isLocal && businessConfig.localDeliveryEnabled,
    message: isLocal
      ? 'Local delivery available in your area.'
      : 'Delivery available to this pincode.',
  }
}
