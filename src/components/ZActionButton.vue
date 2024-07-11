<template>
  <div class="flex-center cursor-pointer transition-all rounded-lg bg-container hover:bg-container/80" :aria-label="ariaLabel">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  ariaLabel: {
    type: String,
    default: '',
  },
})
</script>
