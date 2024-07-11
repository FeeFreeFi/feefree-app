<template>
  <router-link class="w-full no-underline" :to="to" #="{ isExactActive }">
    <div class="relative h-11 rounded flex-center cursor-pointer transition-all lg:hover:bg-dialog/40" :class="[isExactActive ? 'text-primary !bg-dialog' : 'text-basic']" :aria-label="ariaLabel">
      <div v-if="screen.lt.lg" class="absolute size-8 margin-center rounded-full" :class="[isExactActive ? 'bg-tab-gradient' : '']" />
      <div class="z-0">
        <slot />
      </div>
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
  ariaLabel: {
    type: String,
    required: true,
  },
})
</script>
