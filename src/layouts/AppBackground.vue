<script setup lang="ts">
import { uuid } from '@/utils'

const id = `#el-${uuid()}`
const show = ref(false)

onMounted(async () => {
  let timerId: ReturnType<typeof setTimeout>

  onBeforeUnmount(() => {
    timerId && clearTimeout(timerId)
  })

  const sketch = await import('@/libs/sketch').then(m => m.default)
  await sketch(id)

  timerId = setTimeout(() => {
    show.value = true
  }, 1000)
})
</script>

<template>
  <div :id="id.slice(1)" class="top-0 left-0 fixed bg-[#0a0a0ab2] opacity-0 w-screen h-screen transition-opacity duration-1000 pointer-events-none" :class="[show ? 'opacity-100' : '']" />
</template>
