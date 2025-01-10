<template>
  <a class="no-underline flex-y-center gap-2 text-primary/80" :href="url" target="_blank" :aria-label="displayLabel">
    <span class="size-4 flex-center no-underline relative" :class="iconClass" aria-label="View">
      <i-ff-spin v-if="pending" class="size-full" />
      <i-ff-view v-else class="size-full" />
    </span>
    <n-text v-if="label !== false" class="shrink-0 text-inherit" :class="[underline ? 'underline' : 'no-underline']">{{ displayLabel }}</n-text>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  label: {
    type: [String, Boolean],
    default: '',
  },
  pending: {
    type: Boolean,
    default: false,
  },
  underline: {
    type: Boolean,
    default: true,
  },
  iconClass: {
    type: String,
    default: '',
  },
})

const DEFAULT_LABEL = 'View on explorer'

const displayLabel = computed(() => typeof props.label === 'boolean' ? DEFAULT_LABEL : props.label)
</script>
