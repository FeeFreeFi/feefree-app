import type { Callback } from '@/types'
import { createDebounceUpdate } from './useTimer'

export const createQuoteState = (doUpdate: Callback, delay = 200, interval = 30000) => {
  const { debounceUpdate } = createDebounceUpdate(doUpdate, delay, interval)

  return debounceUpdate
}
