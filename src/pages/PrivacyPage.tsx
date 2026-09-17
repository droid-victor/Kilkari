import { storeConfig as staticStoreConfig } from '@/config/store'
import { useStoreSettingsStore } from '@/store/storeSettingsStore'

export function PrivacyPage() {
  const email = useStoreSettingsStore((s) => s.settings.email)

  return (
    <div className="container-page py-10 max-w-2xl text-sm sm:text-base text-ink-800 flex flex-col gap-4">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-2">Privacy Policy</h1>
      <p>
        {staticStoreConfig.legalName} respects your privacy. We collect only the information
        necessary to process your orders and improve your shopping experience, and we do not sell
        your personal data to third parties.
      </p>
      <p>For questions about this policy, contact us at {email}.</p>
    </div>
  )
}
