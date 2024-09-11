<template>
  <div class="fixed top-0 left-0 w-screen h-screen opacity-0 transition-opacity duration-1000" :class="[show ? 'opacity-100' : '']" :id="id.slice(1)" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import uuid from "@/utils/uuid"
import Q5 from "@/vendors/q5"
import sketch from "@/vendors/sketch"

const id = `#el-${uuid()}`
const show = ref(false)
let timerId

const init = () => {
  const el = document.querySelector(id)
  sketch(new Q5('ff', el))

  timerId = setTimeout(() => {
    show.value = true
  }, 1000)
}

onMounted(init)

onBeforeUnmount(() => {
  timerId && clearTimeout(timerId)
  timerId = null
})
</script>
