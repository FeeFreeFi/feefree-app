import { onBeforeUnmount, onMounted, readonly, ref, watch } from "vue"
import debounce from "lodash-es/debounce"
import { createInterval } from "./useTimer"
import { getPrices } from "@/api"

const pricesRef = ref({})
const priceChangedRef = ref(0)
export const priceChanged = readonly(priceChangedRef)

const update = async () => {
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
  priceChangedRef.value++
}
const debounceUpdate = debounce(update, 30 * 1000, { leading: true, trailing: false })

const { start, stop } = createInterval(debounceUpdate, 120 * 1000)
export const startUpdate = start
export const stopUpdate = stop

/**
 * @param {string} key
 * @returns {number}
 */
export const getPrice = key => {
  return pricesRef.value[key] || 0
}

/**
 * @param {() => {}} onPriceChanged
 */
export const createPriceState = (onPriceChanged = null) => {
  onMounted(() => {
    start()

    if (onPriceChanged) {
      const stopWatch = watch(priceChangedRef, () => {
        onPriceChanged()
      })

      onBeforeUnmount(stopWatch)
    }

    onBeforeUnmount(stop)
  })
}
