import type { Token } from '@/types'
import { readonly, ref } from 'vue'

const stateRef = ref<{ show: boolean, token?: Token }>({
  show: false,
  token: undefined,
})

export const state = readonly(stateRef)

export function openTokenMore(token: Token) {
  stateRef.value.token = token
  stateRef.value.show = true
}

export function onClose() {
  stateRef.value.show = false
}
