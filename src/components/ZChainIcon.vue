<template>
  <img class="rounded-full" :src="`/static/chains/${chainName}.svg`" loading="lazy" :alt="`${chainName} icon`">
</template>

<script setup lang="ts">
import { getChainName } from '@/hooks/useChains'

interface Props {
  chainId: number
}

const props = defineProps<Props>()

const chainName = computed(() => getChainName(props.chainId))
</script>
