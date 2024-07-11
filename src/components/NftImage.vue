<template>
  <img :src="`/static/nfts/${src}`" loading="lazy" :alt="label">
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})
</script>
