import { readonly, ref } from "vue"

const showRef = ref(false)
export const show = readonly(showRef)

export const open = () => {
  showRef.value = true
}

export const close = () => {
  showRef.value = false
}
