import { readonly, ref } from 'vue'

const showRef = ref(false)
export const show = readonly(showRef)

export function open() {
  showRef.value = true
}

export function close() {
  showRef.value = false
}
