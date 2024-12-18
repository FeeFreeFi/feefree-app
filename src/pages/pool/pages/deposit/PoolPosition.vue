<template>
  <div class="p-4 lg:p-6 flex flex-col gap-3 bg-card lg:bg-tab rounded">
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

<script setup>
import { computed } from "vue"
import { fromValue } from "@/utils/bn"
import TokenPrice from "./TokenPrice.vue"

const props = defineProps({
  balance: {
    /**
     * @type {import('vue').PropType<bigint>}
     */
    type: BigInt,
    required: true,
  },
  total: {
    /**
     * @type {import('vue').PropType<bigint>}
     */
    type: BigInt,
    required: true,
  },
  currency0: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
  currency1: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
  price0: {
    type: Number,
    required: true,
  },
  price1: {
    type: Number,
    required: true,
  },
})

const currentPercent = computed(() => {
  const { balance, total } = props
  if (balance === 0n || total === 0n) {
    return "0%"
  }

  return `${fromValue(balance).times(100).div(total).dp(4).toFormat()}%`
})
</script>
