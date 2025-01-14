<template>
  <a class="no-underline flex-y-center gap-2 text-primary/80" :href="url" target="_blank" :aria-label="label || DEFAULT_LABEL">
    <span class="size-4 flex-center no-underline relative" :class="iconClass" aria-label="View">
      <i-ff-spin v-if="pending" class="size-full" />
      <i-ff-view v-else class="size-full" />
    </span>
    <n-text v-if="label !== false" class="shrink-0 text-inherit" :class="[underline ? 'underline' : 'no-underline']">{{ label || DEFAULT_LABEL }}</n-text>
  </a>
</template>

<script setup lang="ts">
interface Props {
  url: string
  label?: string | false
  pending?: boolean
  underline?: boolean
  iconClass?: string
}

withDefaults(defineProps<Props>(), {
  label: '',
  pending: false,
  underline: true,
  iconClass: '',
})

const DEFAULT_LABEL = 'View on explorer'
</script>
