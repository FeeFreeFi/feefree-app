<template>
  <span class="size-6 cursor-pointer" aria-label="close" @click="onClose">
    <i-my-close class="size-6" />
  </span>
</template>

<script setup>
defineProps({
  onClose: {
    type: Function,
    default: () => {},
  },
})
</script>
