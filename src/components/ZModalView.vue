<template>
  <div class="flex flex-col overflow-hidden relative">
    <div class="absolute top-0 left-0 w-full">
      <img class="absolute w-full top-0 translate-x-center pointer-events-none" :src="gradientBg" loading="lazy" alt="dialog gradient background">
    </div>
    <div v-if="hasTitle" class="p-4 flex-y-center justify-between">
      <span class="size-6" />
      <slot name="title">
        <div v-if="title" class="h-7 flex-1 text-center" :class="titleClass">
          <n-text class="text-base sm:text-lg font-medium">{{ title }}</n-text>
        </div>
      </slot>
      <CloseButton :on-close="onClose" />
    </div>
    <CloseButton v-else class="absolute top-4 right-4 z-[1]" :on-close="onClose" />
    <div class="flex-1 relative overflow-hidden" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
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

const slots = useSlots()

const hasTitle = computed(() => !!props.title || !!slots.title)
</script>
