<template>
  <n-text class="truncate font-medium">
    <span class="flex truncate">
      <span class="truncate">{{ token ? toBalanceWithUnit(balance, token.decimals, dp || token.dp) : 0 }}</span>
      <span v-if="token && showSymbol" class="ml-[2px]">{{ token.symbol }}</span>
    </span>
  </n-text>
</template>

<script setup>
import { toBalanceWithUnit } from "@/utils/bn"

defineProps({
  token: {
    /** @type {import('vue').PropType<import('@/types').Token>} */
    type: Object,
    default: () => null,
  },
  dp: {
    type: [Number, undefined],
    default: undefined,
  },
  balance: {
    /** @type {import('vue').PropType<bigint|string>} */
    type: [BigInt, String],
    required: true,
  },
  showSymbol: {
    type: Boolean,
    default: true,
  },
})
</script>
