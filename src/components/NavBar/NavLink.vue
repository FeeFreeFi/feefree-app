<template>
  <router-link class="flex-1 sm:flex-initial flex-center no-underline" :to="to" #="{ isExactActive }">
    <n-button v-if="screen.sm" class="h-9 px-4" text :aria-label="label">
      <n-text class="text-base font-medium hover:text-basic" :class="[isExactActive ? 'text-basic' : ' text-basic-1']">{{ label }}</n-text>
    </n-button>
    <div v-else class="h-12 flex-center flex-col gap-1">
      <img class="size-[22px] transition-all" :class="[isExactActive ? '' : 'opacity-70 grayscale']" :src="`/static/tabbars/${icon}`" loading="lazy" :alt="label">
      <n-text class="text-xs transition-all" :class="[isExactActive ? 'text-primary' : 'text-basic-1']">{{ label }}</n-text>
    </div>
  </router-link>
</template>

<script setup>
import { screen } from '@/hooks/useScreen'

defineProps({
  to: {
    type: Object,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "",
  },
})
</script>
