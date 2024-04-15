import copy from 'copy-to-clipboard'

export const copyText = async text => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }

  return copy(text)
}

export const pasteText = async () => {
  if (navigator?.clipboard?.readText) {
    return navigator.clipboard.readText()
  }
  return false
}
