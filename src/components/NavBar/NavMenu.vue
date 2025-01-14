<template>
  <n-popover :show="show" trigger="click" :show-arrow="false" placement="bottom-end" class="w-[240px] !p-2 !rounded-lg !bg-container" :on-update:show="onUpdateShow">
    <template #trigger>
      <div v-if="screen.sm" class="h-9 px-3 flex-center cursor-pointer rounded-lg hover:bg-primary/5 transition-all" aria-label="more">
        <DownArrow class="!size-5 transition-all" :class="[show ? '!rotate-180' : '']" />
      </div>
      <div v-else class="flex-1 h-12 flex-center flex-col gap-1">
        <img class="size-[22px] transition-all" :class="[show ? '' : 'opacity-70 grayscale']" src="/static/tabbars/more.svg" loading="lazy" alt="more">
        <n-text class="text-xs transition-all" :class="[show ? 'text-primary' : 'text-basic-1']">More</n-text>
      </div>
    </template>
    <NavMemuView />
  </n-popover>
</template>

<script setup lang="ts">
import { screen } from '@/hooks/useScreen'
import DownArrow from '@/components/Arrow/DownArrow.vue'
import NavMemuView from './NavMemuView.vue'

const show = ref(false)
const maskClosable = ref(true)

const onUpdateShow = (value: boolean) => {
  if (!value) {
    maskClosable.value = false
  }
  show.value = value
}
</script>
