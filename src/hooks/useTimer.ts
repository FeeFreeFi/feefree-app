import type { TimerId, Callback } from '@/types'
import { debounce } from 'lodash-es'
import { onBeforeUnmount } from 'vue'

export const createInterval = (fn: Callback, ms: number) => {
  let timerId: TimerId
  const start = () => {
    if (timerId) {
      return
    }

    timerId = setInterval(fn, ms)
    fn()
  }

  const stop = () => {
    if (timerId) {
      clearInterval(timerId)
    }
    timerId = undefined
  }

  return { start, stop }
}

export const createDebounceUpdate = (doUpdate: Callback, delay = 100, interval = 60000, { immediately = false, leading = false, trailing = true } = {}) => {
  const debounceUpdate = debounce(doUpdate, delay, { leading, trailing })
  const { start: startUpdate, stop: stopUpdate } = createInterval(debounceUpdate, interval)

  const update = (force = false) => {
    if (force) {
      doUpdate()
    } else {
      debounceUpdate()
    }
  }

  onBeforeUnmount(() => {
    debounceUpdate.cancel()
    stopUpdate()
  })

  if (immediately) {
    debounceUpdate()
  }

  return {
    debounceUpdate,
    update,
    startUpdate,
    stopUpdate,
  }
}
