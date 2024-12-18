import { ref, watch } from "vue"
import { createDebounceUpdate } from "./useTimer"
import { getPrices } from "@/api"

const pricesRef = ref({})
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
  nonces.value++
}

/**
 * @param {string} key
 * @returns {number}
 */
export const getPrice = key => {
  return pricesRef.value[key] || 0
}

export const createPriceState = () => {
  createDebounceUpdate(doUpdate, 30000, 120000, { immediately: true, leading: true, trailing: false })
}

/**
 * @param {() => {}} callback
 */
export const onPriceChanged = callback => {
  watch(nonces, callback)
}
