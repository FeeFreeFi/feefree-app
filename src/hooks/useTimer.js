import { debounce } from "lodash-es"
import { onBeforeUnmount } from "vue"

/**
 * @param {() => {}} fn
 * @param {number} ms
 */
export const createInterval = (fn, ms) => {
  let timer
  const start = () => {
    if (timer) {
      return
    }

    timer = setInterval(fn, ms)
    fn()
  }

  const stop = () => {
    timer && clearInterval(timer, fn)
    timer = null
  }

  return { start, stop }
}

/**
 * @param {() => void} doUpdate
 * @param {number} delay
 * @param {number} interval
 * @param {{immediately:boolean, leading:boolean, trailing:boolean}} options
 */
export const createDebounceUpdate = (doUpdate, delay = 100, interval = 60000, { immediately = false, leading = false, trailing = true } = {}) => {
  const debounceUpdate = debounce(doUpdate, delay, { leading, trailing })
  const { start: startUpdate, stop: stopUpdate } = createInterval(debounceUpdate, interval)

  const update = (force = false) => {
    force ? doUpdate() : debounceUpdate()
  }

  onBeforeUnmount(() => {
    debounceUpdate.cancel()
    stopUpdate()
  })

  immediately && debounceUpdate()

  return {
    debounceUpdate,
    update,
    startUpdate,
    stopUpdate,
  }
}
