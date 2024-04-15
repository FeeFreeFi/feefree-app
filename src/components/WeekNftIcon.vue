<template>
  <div class="relative p-1">
    <i-my-nft class="size-6" />
    <ZChainIcon class="size-3 absolute top-[2px] right-0" :chain-id="chainId" />
  </div>
</template>

<script setup>
import ZChainIcon from "./ZChainIcon.vue"

defineProps({
  chainId: {
    type: Number,
    required: true,
  },
})
</script>
