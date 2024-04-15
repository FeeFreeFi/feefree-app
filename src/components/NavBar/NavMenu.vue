<template>
  <n-popover :show="show" trigger="click" :show-arrow="false" placement="bottom-end" class="w-[240px] !p-2 !rounded-lg" :on-update:show="onUpdateShow">
    <template #trigger>
      <n-button class="h-9 rounded-xl px-3" quaternary :focusable="false" aria-label="more">
        <i-mdi-chevron-down class="size-5 transition-all" :class="[show ? 'rotate-180' : 'text-color-3']" />
      </n-button>
    </template>
    <NavMemuView />
  </n-popover>
</template>

<script setup>
import { ref } from "vue"
import NavMemuView from "./NavMemuView.vue"

const show = ref(false)
const maskClosable = ref(true)

const onUpdateShow = value => {
  if (!value) {
    maskClosable.value = false
  }
  show.value = value
}
</script>
