<template>
  <div class="flex flex-col overflow-hidden relative">
    <div class="h-16 px-6 py-4 flex-y-center justify-between">
      <slot name="title">
        <n-text class="text-base font-semibold">{{ title }}</n-text>
      </slot>
      <CloseButton :on-close="onClose" />
    </div>
    <n-divider class="!my-0" />
    <div class="flex-1 px-6 py-4 relative" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup>
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
  contentClass: {
    type: String,
    default: '',
  },
})
</script>
