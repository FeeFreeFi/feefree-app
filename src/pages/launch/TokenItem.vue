<template>
  <div class="flex-y-center justify-between gap-4 bg-card/40 px-4 rounded h-16">
    <div class="flex-y-center gap-3 shrink-0">
      <ZTokenIcon class="!size-8" />
      <div class="flex flex-col gap-[2px] w-20">
        <n-text class="font-medium">{{ name }}</n-text>
        <n-text class="text-xs" depth="2">{{ symbol }}</n-text>
      </div>
    </div>
    <div class="flex flex-col items-end gap-[2px]">
      <div class="overflow-hidden">
        <ZBalance class="text-sm" :value="totalSupply" :decimals="decimals" />
      </div>
      <div class="flex gap-1 overflow-hidden text-xs">
        <n-text class="overflow-hidden text-ellipsis" depth="2">{{ price }}</n-text>
        <n-text class="shrink-0" depth="2">{{ asset.symbol }}</n-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'

interface Props {
  name: string
  symbol: string
  decimals: number
  totalSupply: bigint
  price: string
  asset: Pick<Token, 'symbol'>
}

defineProps<Props>()
</script>
