<template>
  <div class="relative">
    <img class="aspect-square" :class="imgClass" :src="`/static/nfts/${src}`" loading="lazy" :alt="label">
    <ZChainIcon class="absolute top-1 right-1" :class="chainClass" :chain-id="chainId" />
  </div>
</template>

<script setup lang="ts">
import ZChainIcon from '@/components/ZChainIcon.vue'

interface Props {
  src: string
  label: string
  chainId: number
  imgClass?: string
  chainClass?: string
}

withDefaults(defineProps<Props>(), {
  imgClass: 'rounded-t-lg',
  chainClass: 'size-4',
})
</script>
