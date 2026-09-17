import { useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import {
  fetchStoreSettingsOnce,
  saveStoreSettings,
  type StoreSettings,
} from '@/services/storeSettingsService'
import { useStoreSettingsStore } from '@/store/storeSettingsStore'
import { isFirebaseConfigured } from '@/config/firebase'
import { Button } from '@/components/ui/Button'

export function AdminStoreSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<StoreSettings>()

  const { fields } = useFieldArray({ control, name: 'openingHours' })

  useEffect(() => {
    fetchStoreSettingsOnce().then((settings) => {
      reset(settings)
      setLoading(false)
    })
  }, [reset])

  async function onSubmit(values: StoreSettings) {
    setSaved(false)
    setSaveError(null)
    try {
      await saveStoreSettings(values)
      useStoreSettingsStore.setState({ settings: values })
      setSaved(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings.')
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-400">Loading...</p>
  }

  const inputClass =
    'h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500 w-full'
  const labelClass = 'text-sm font-medium text-ink-900 mb-1.5 block'

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-1">Store Settings</h1>
      <p className="text-sm text-ink-400 mb-6">
        This information appears across the storefront — footer, store page, contact page and more.
      </p>

      {!isFirebaseConfigured && (
        <div className="rounded-card bg-terracotta-50 text-terracotta-700 text-sm p-4 mb-6">
          Firebase is not connected — saving is disabled until <code>.env.local</code> is configured.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-ink-900">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Store Name</label>
              <input className={inputClass} {...register('name')} />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input className={inputClass} {...register('tagline')} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea rows={2} className={inputClass} style={{ height: 'auto' }} {...register('description')} />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-ink-900">Contact</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} {...register('phone')} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp Number</label>
              <input className={inputClass} {...register('whatsapp')} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} {...register('email')} />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-ink-900">Address & Location</h2>
          <div>
            <label className={labelClass}>Full Address</label>
            <input className={inputClass} {...register('address')} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input className={inputClass} {...register('city')} />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input className={inputClass} {...register('state')} />
            </div>
            <div>
              <label className={labelClass}>Pincode</label>
              <input className={inputClass} {...register('pincode')} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Latitude</label>
              <input
                type="number"
                step="any"
                className={inputClass}
                {...register('latitude', { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input
                type="number"
                step="any"
                className={inputClass}
                {...register('longitude', { valueAsNumber: true })}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Google Maps URL</label>
            <input className={inputClass} {...register('googleMapsUrl')} />
          </div>
          <div>
            <label className={labelClass}>Google Directions URL</label>
            <input className={inputClass} {...register('googleDirectionsUrl')} />
          </div>
          <div>
            <label className={labelClass}>Google Business Profile URL</label>
            <input className={inputClass} {...register('googleBusinessUrl')} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nearby Landmark</label>
              <input className={inputClass} {...register('nearbyLandmark')} />
            </div>
            <div>
              <label className={labelClass}>Parking Info</label>
              <input className={inputClass} {...register('parkingInfo')} />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-ink-900">Google Rating</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Rating (0-5)</label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    step="0.1"
                    className={inputClass}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                  />
                )}
              />
            </div>
            <div>
              <label className={labelClass}>Review Count</label>
              <Controller
                name="reviewCount"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    className={inputClass}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                  />
                )}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-ink-900">Opening Hours</h2>
          <div className="flex flex-col gap-2">
            {fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-3">
                <span className="w-24 text-sm text-ink-600 shrink-0">{field.day}</span>
                <input className={inputClass} {...register(`openingHours.${i}.hours`)} />
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-400">
            Example: "9:00 AM - 9:00 PM", or "Closed" for a day the store is shut.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-ink-900">Social Links</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Instagram URL</label>
              <input className={inputClass} placeholder="https://instagram.com/..." {...register('socialLinks.instagram')} />
            </div>
            <div>
              <label className={labelClass}>Facebook URL</label>
              <input className={inputClass} placeholder="https://facebook.com/..." {...register('socialLinks.facebook')} />
            </div>
            <div>
              <label className={labelClass}>YouTube URL</label>
              <input className={inputClass} placeholder="https://youtube.com/..." {...register('socialLinks.youtube')} />
            </div>
          </div>
        </section>

        {saveError && <p className="text-sm text-error-500">{saveError}</p>}
        {saved && <p className="text-sm text-sage-600">Settings saved.</p>}

        <div>
          <Button type="submit" disabled={isSubmitting || !isFirebaseConfigured}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
