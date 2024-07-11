import { ref, readonly, computed } from "vue"
import { CACHE_RECENT } from "@/config"
import { getStorage, setStorage } from "@/utils/storage"

const connectingWalletRef = ref(null)

/**
 * @type {import('vue').Ref<{wallet:string}>}
 */
const recentRef = ref(getStorage(CACHE_RECENT, null))

export const reset = () => {
  connectingWalletRef.value = null
}

export const connecting = wallet => {
  connectingWalletRef.value = wallet
}

export const setRecent = (wallet) => {
  recentRef.value = { wallet }
  setStorage(CACHE_RECENT, { wallet })
}

const connectingWallet = readonly(connectingWalletRef)
const recentWallet = computed(() => recentRef.value?.wallet || '')
// const recentAccount = computed(() => recentRef.value?.account || '')

export {
  connectingWallet,
  recentWallet,
  // recentAccount,
}
