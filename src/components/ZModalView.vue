<template>
  <div class="flex flex-col overflow-hidden relative">
    <div class="absolute top-0 left-0 w-full">
      <img class="absolute w-full top-0 translate-x-center pointer-events-none" :src="gradientBg" loading="lazy" alt="dialog gradient background">
    </div>
    <div class="p-4 flex-y-center justify-between">
      <span class="size-6" />
      <slot name="title">
        <div v-if="title" class="h-7 flex-1 text-center" :class="titleClass">
          <n-text class="text-base sm:text-lg font-medium">{{ title }}</n-text>
        </div>
      </slot>
      <CloseButton :on-close="onClose" />
    </div>
    <div class="flex-1 relative overflow-hidden" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup>
import gradientBg from '@/assets/images/dialog-gradient-bg.svg'
import CloseButton from '@/components/CloseButton.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  titleClass: {
    type: String,
    default: '',
  },
  contentClass: {
    type: String,
    default: '',
  },
})
</script>
