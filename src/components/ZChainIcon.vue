<template>
  <img class="rounded-full" :src="`/static/chains/${chainName}.svg`" loading="lazy" :alt="`${chainName} icon`">
</template>

<script setup>
import { computed } from 'vue'
import { getChainName } from "@/hooks/useChains"

const props = defineProps({
  chainId: {
    type: Number,
    required: true,
  },
})

const chainName = computed(() => getChainName(props.chainId))
</script>
