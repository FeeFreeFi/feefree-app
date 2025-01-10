import type { Callback } from '@/types'
import { ref, watch } from 'vue'
import { createDebounceUpdate } from './useTimer'
import { getPrices } from '@/api'

const pricesRef = ref<Record<string, number>>({})
const nonces = ref(0)

const doUpdate = async () => {
  if (!navigator.onLine) {
    return
  }

  const res = await getPrices()
  if (!res || res.code !== 0) {
    return
  }

  pricesRef.value = {
    ...pricesRef.value,
    ...res.data,
  }
  nonces.value += 1
}

export const getPrice = (key: string) => {
  return key ? pricesRef.value[key] || 0 : 0
}

export const createPriceState = () => {
  createDebounceUpdate(doUpdate, 30000, 120000, { immediately: true, leading: true, trailing: false })
}

export const onPriceChanged = (fn: Callback) => {
  watch(nonces, fn)
}
