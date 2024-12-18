import { readonly, ref } from "vue"

/** @type {import('vue').Ref<{show:boolean, token:import('@/types').Token}>} */
const stateRef = ref({
  show: false,
  token: null,
})

export const state = readonly(stateRef)

/**
 * @param {import('@/types').Token} token
 */
export const openTokenMore = token => {
  stateRef.value.token = token
  stateRef.value.show = true
}

export const onClose = () => {
  stateRef.value.show = false
}
