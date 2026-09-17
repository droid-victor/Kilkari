import { create } from 'zustand'
import {
  subscribeToStoreSettings,
  getDefaultStoreSettings,
  type StoreSettings,
} from '@/services/storeSettingsService'

interface StoreSettingsState {
  settings: StoreSettings
  loading: boolean
}

export const useStoreSettingsStore = create<StoreSettingsState>(() => ({
  settings: getDefaultStoreSettings(),
  loading: true,
}))

subscribeToStoreSettings((settings) => {
  useStoreSettingsStore.setState({ settings, loading: false })
})
