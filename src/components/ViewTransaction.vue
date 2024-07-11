<template>
  <a class="no-underline flex-y-center gap-3" :href="url" target="_blank" aria-label="View on explorer">
    <span class="size-4" aria-label="View">
      <i-my-view />
    </span>
    <n-text depth="1">View on explorer</n-text>
  </a>
</template>

<script setup>
defineProps({
  url: {
    type: String,
    required: true,
  }
})
</script>
