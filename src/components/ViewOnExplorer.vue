<template>
  <a class="no-underline flex-y-center gap-3" :href="url" target="_blank" :aria-label="label">
    <span class="size-4" aria-label="View">
      <i-ff-view />
    </span>
    <n-text v-if="showLabel" class="shrink-0" depth="1">{{ label }}</n-text>
  </a>
</template>

<script setup>
defineProps({
  url: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "View on explorer",
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
})
</script>
