<template>
  <div class="relative">
    <img class="aspect-square" :class="imgClass" :src="`/static/nfts/${src}`" loading="lazy" :alt="label">
    <ZChainIcon class="absolute top-1 right-1" :class="chainClass" :chain-id="chainId" />
  </div>
</template>

<script setup>
import ZChainIcon from "@/components/ZChainIcon.vue"

defineProps({
  src: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  chainId: {
    type: Number,
    required: true,
  },
  imgClass: {
    type: String,
    default: "rounded-t-lg",
  },
  chainClass: {
    type: String,
    default: "size-4",
  },
})
</script>
