<template>
  <div class="h-16 flex-y-center justify-between px-4 gap-4 rounded bg-card/40">
    <div class="shrink-0 flex-y-center gap-3">
      <ZTokenIcon class="!size-8" />
      <div class="w-20 flex flex-col gap-[2px]">
        <n-text class="font-medium">{{ name }}</n-text>
        <n-text class="text-xs" depth="2">{{ symbol }}</n-text>
      </div>
    </div>
    <div class="flex flex-col items-end gap-[2px]">
      <div class="overflow-hidden">
        <ZBalance class="text-sm" :value="totalSupply" :decimals="decimals" />
      </div>
      <div class="flex gap-1 overflow-hidden text-xs">
        <n-text class="text-ellipsis overflow-hidden" depth="2">{{ price }}</n-text>
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
