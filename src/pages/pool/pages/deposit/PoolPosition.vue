<template>
  <div class="flex flex-col gap-3 bg-card lg:bg-tab p-4 lg:p-6 rounded">
    <div class="flex flex-col gap-3">
      <n-text class="text-xs" depth="1">Price</n-text>
      <TokenPrice :input-token="currency0" :output-token="currency1" :price="price0" />
      <TokenPrice :input-token="currency1" :output-token="currency0" :price="price1" />
    </div>
    <n-divider class="!my-0" />
    <div class="flex flex-col gap-3">
      <n-text class="text-xs" depth="1">My pool share</n-text>
      <div class="flex-y-center gap-[6px]">
        <n-text>{{ currentPercent }}</n-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import { fromValue } from '@/utils'
import TokenPrice from './TokenPrice.vue'

interface Props {
  balance: bigint
  total: bigint
  currency0: Token
  currency1: Token
  price0: number
  price1: number
}

const props = defineProps<Props>()

const currentPercent = computed(() => {
  const { balance, total } = props
  if (balance === 0n || total === 0n) {
    return '0%'
  }

  return `${fromValue(balance).times(100).div(total.toString(10)).dp(4).toFormat()}%`
})
</script>
