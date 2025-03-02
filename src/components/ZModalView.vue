<template>
  <div class="relative flex flex-col overflow-hidden">
    <div class="top-0 left-0 absolute w-full">
      <img class="top-0 absolute w-full translate-x-center pointer-events-none" :src="gradientBg" loading="lazy" alt="dialog gradient background">
    </div>
    <div v-if="hasTitle" class="flex-y-center justify-between p-4">
      <span class="size-6" />
      <slot name="title">
        <div v-if="title" class="flex-1 h-7 text-center" :class="titleClass">
          <n-text class="font-medium text-base sm:text-lg">{{ title }}</n-text>
        </div>
      </slot>
      <CloseButton :on-close="onClose" />
    </div>
    <CloseButton v-else class="top-4 right-4 z-[1] absolute" :on-close="onClose" />
    <div class="relative flex-1 overflow-hidden" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Slots } from 'vue'
import CloseButton from '@/components/CloseButton.vue'
import gradientBg from '@/assets/images/dialog-gradient-bg.svg'

interface Props {
  onClose: () => void
  title?: string
  titleClass?: string
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  titleClass: '',
  contentClass: '',
})

const slots: Slots = useSlots()

const hasTitle = computed(() => !!props.title || !!slots.title)
</script>
