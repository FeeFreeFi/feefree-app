<template>
  <router-link class="w-full no-underline" :to="to" #="{ isExactActive }">
    <div class="relative flex-center lg:hover:bg-dialog/40 rounded h-11 transition-all cursor-pointer" :class="[isExactActive ? 'text-primary !bg-dialog' : 'text-font']" :aria-label="label">
      <div v-if="screen.lt.lg" class="absolute rounded-full size-8 margin-center" :class="[isExactActive ? 'bg-linear-270 from-[rgba(61,77,74,0.5)] to-[#1C2423]' : '']" />
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
