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
