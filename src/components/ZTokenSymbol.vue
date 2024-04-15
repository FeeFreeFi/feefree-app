<template>
  <n-text class="text-sm sm:text-base font-medium">{{ symbol }}</n-text>
</template>

<script setup>
defineProps({
  symbol: {
    type: String,
    required: true,
  },
})
</script>
