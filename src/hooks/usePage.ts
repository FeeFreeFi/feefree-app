import { ref, readonly } from 'vue'

const visibilityRef = ref(true)
export const visibility = readonly(visibilityRef)

const onVisibilityChange = () => {
  visibilityRef.value = !document.hidden
}

const install = () => {
  window.addEventListener('visibilitychange', onVisibilityChange)
}

export default install
