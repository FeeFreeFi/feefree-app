<template>
  <router-link class="w-full no-underline" :to="to" #="{ isExactActive }">
    <div class="relative h-11 rounded flex-center cursor-pointer transition-all lg:hover:bg-dialog/40" :class="[isExactActive ? 'text-primary !bg-dialog' : 'text-basic']" :aria-label="label">
      <div v-if="screen.lt.lg" class="absolute size-8 margin-center rounded-full" :class="[isExactActive ? 'bg-tab-gradient' : '']" />
      <div class="z-0">
        <slot />
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { screen } from '@/hooks/useScreen'

interface Props {
  to: RouteLocationRaw
  label: string
}

defineProps<Props>()
</script>
