import { ref, readonly, computed } from 'vue'
import { CACHE_RECENT } from '@/config'
import { getStorage, setStorage } from '@/utils'
import type { Wallet } from '@/types'

const connectingWalletRef = ref<Wallet>()

const recentRef = ref<{ wallet: string }>(getStorage(CACHE_RECENT))

export function reset() {
  connectingWalletRef.value = undefined
}

export function connecting(wallet: Wallet) {
  connectingWalletRef.value = wallet
}

export function setRecent(wallet: string) {
  recentRef.value = { wallet }
  setStorage(CACHE_RECENT, { wallet })
}

export const connectingWallet = readonly(connectingWalletRef)
export const recentWallet = computed(() => recentRef.value?.wallet || '')
