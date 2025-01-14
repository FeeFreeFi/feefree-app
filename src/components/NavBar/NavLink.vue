<template>
  <router-link class="flex-1 sm:flex-initial flex-center no-underline" :to="to" #="{ href }">
    <n-button v-if="screen.sm" class="h-9 px-4" text :aria-label="label">
      <n-text class="text-base font-medium hover:text-basic" :class="[isActive(href) ? 'text-basic' : ' text-basic-1']">{{ label }}</n-text>
    </n-button>
    <div v-else class="h-12 flex-center flex-col gap-1">
      <img class="size-[22px] transition-all" :class="[isActive(href) ? '' : 'opacity-70 grayscale']" :src="`/static/tabbars/${icon}`" loading="lazy" :alt="label">
      <n-text class="text-xs transition-all" :class="[isActive(href) ? 'text-primary' : 'text-basic-1']">{{ label }}</n-text>
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
