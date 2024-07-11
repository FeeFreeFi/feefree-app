<template>
  <n-text class="text-sm font-medium">{{ symbol || '' }}</n-text>
</template>

<script setup>
defineProps({
  symbol: {
    type: String,
    required: true,
  },
})
</script>
