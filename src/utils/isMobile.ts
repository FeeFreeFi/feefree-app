export const isMobile = () => {
  if (navigator.maxTouchPoints !== undefined) {
    return navigator.maxTouchPoints > 0
  }
  return ('ontouchstart' in window)
}
