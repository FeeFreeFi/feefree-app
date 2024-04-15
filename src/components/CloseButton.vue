<template>
  <n-button secondary type="tertiary" size="small" circle aria-label="close" @click="onClose">
    <i-ic-round-close />
  </n-button>
</template>

<script setup>
defineProps({
  onClose: {
    type: Function,
    default: () => {},
  },
})
</script>
