<template>
  <div class="fixed top-0 left-0 w-screen h-screen pointer-events-none opacity-0 transition-opacity duration-1000" :class="[show ? 'opacity-100' : '']" :id="id.slice(1)" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import uuid from "@/utils/uuid"
import sketch from "@/vendors/sketch"

const id = `#el-${uuid()}`
const show = ref(false)

onMounted(() => {
  sketch(id)

  const timerId = setTimeout(() => {
    show.value = true
  }, 1000)

  onBeforeUnmount(() => {
    timerId && clearTimeout(timerId)
  })
})

</script>
