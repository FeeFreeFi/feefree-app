<template>
  <router-link class="sm:flex-initial flex-1 flex-center no-underline" :to="to" #="{ href }">
    <n-button v-if="screen.sm" class="px-4 h-9" text :aria-label="label">
      <n-text class="font-medium hover:text-font text-base" :class="[isActive(href) ? 'text-font' : ' text-font-70']">{{ label }}</n-text>
    </n-button>
    <div v-else class="flex-col flex-center gap-1 h-12">
      <img class="size-[22px] transition-all" :class="[isActive(href) ? '' : 'opacity-70 grayscale']" :src="`/static/tabbars/${icon}`" loading="lazy" :alt="label">
      <n-text class="text-xs transition-all" :class="[isActive(href) ? 'text-primary' : 'text-font-70']">{{ label }}</n-text>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { screen } from '@/hooks/useScreen'
import { useRoute } from 'vue-router'

interface Props {
  to: RouteLocationRaw
  label: string
  icon?: string
  exact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  exact: false,
})

const route = useRoute()

const isActive = computed(() => {
  return (href: string) => props.exact ? route.path === href : route.path.startsWith(href)
})
</script>
