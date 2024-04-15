import { readonly, ref } from "vue"
import debounce from "lodash-es/debounce"
import { PRICE_API_KEY } from "@/config"
import { getAllSymbols } from "./useCurrency"
import { createInterval } from "./useTimer"

const ALL_SYMBOLS = getAllSymbols()
const URL = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${ALL_SYMBOLS.join(',')}&tsyms=USD`
const PRICE_HEADERS = {
  headers: { authorization: `Apikey ${PRICE_API_KEY}` }
}

const pricesRef = ref({})
const priceChangedRef = ref(0)
export const priceChanged = readonly(priceChangedRef)

const update = async () => {
  if (!navigator.onLine) {
    return
  }

  const res = await fetch(URL, PRICE_HEADERS).catch(() => false)
  if (!res || res.status !== 200) {
    return
  }

  const data = await res.json()
  const prices = Object.fromEntries(Object.keys(data).map(name => [name, data[name].USD]))

  pricesRef.value = {
    ...pricesRef.value,
    ...prices,
  }
  priceChangedRef.value++
}
const debounceUpdate = debounce(update, 30 * 1000, { leading: true, trailing: false })

const { start, stop } = createInterval(debounceUpdate, 120 * 1000)
export const startUpdate = start
export const stopUpdate = stop

/**
 * @param {string} symbol
 * @returns {number}
 */
export const getPrice = symbol => {
  return pricesRef.value[symbol] || 0
}
