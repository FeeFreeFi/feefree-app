import copy from 'copy-to-clipboard'

export async function copyText(text: string) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }

  return copy(text)
}

export async function pasteText() {
  if (navigator?.clipboard?.readText) {
    return navigator.clipboard.readText()
  }
  return false
}
