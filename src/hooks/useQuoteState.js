import { createDebounceUpdate } from "./useTimer"

/**
 * @param {() => Promise<void>} doUpdate
 * @param {number} delay
 * @param {number} interval
 */
export const createQuoteState = (doUpdate, delay = 200, interval = 30000) => {
  const { debounceUpdate } = createDebounceUpdate(doUpdate, delay, interval)

  return debounceUpdate
}
