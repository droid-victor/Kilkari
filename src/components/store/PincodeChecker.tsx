import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { checkPincode, type PincodeCheckResult } from '@/services/deliveryService'

export function PincodeChecker() {
  const [pincode, setPincode] = useState('')
  const [result, setResult] = useState<PincodeCheckResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault()
    if (pincode.length !== 6) return
    setLoading(true)
    const res = await checkPincode(pincode)
    setResult(res)
    setLoading(false)
  }

  return (
    <div>
      <form onSubmit={handleCheck} className="flex gap-2">
        <label htmlFor="pincode-input" className="sr-only">
          Enter pincode
        </label>
        <input
          id="pincode-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit pincode"
          className="h-11 flex-1 max-w-40 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
        />
        <button
          type="submit"
          disabled={pincode.length !== 6 || loading}
          className="h-11 px-4 rounded-lg bg-ink-900 text-cream-50 text-sm font-medium disabled:opacity-40 cursor-pointer"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {result && (
        <div
          className={`flex items-start gap-2 mt-3 text-sm ${
            result.available ? 'text-sage-600' : 'text-error-500'
          }`}
          role="status"
        >
          {result.available ? (
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          ) : (
            <XCircle size={18} className="shrink-0 mt-0.5" />
          )}
          <div>
            <p>{result.message}</p>
            {result.available && (
              <p className="text-ink-600">Estimated delivery: {result.estimatedDays}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
