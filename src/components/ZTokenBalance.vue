<template>
  <n-text class="truncate font-medium">
    <span class="flex truncate">
      <span class="truncate">{{ displayBalance }}</span>
      <span v-if="token && showSymbol" class="ml-[2px]">{{ token.symbol }}</span>
    </span>
  </n-text>
</template>

<script setup>
import { computed } from "vue"
import { toBalance, byDecimals } from "@/utils/bn"

const units = [
  { value: 1e12, name: "T" },
  { value: 1e9, name: "B" },
  { value: 1e6, name: "M" },
]

const props = defineProps({
  token: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    default: () => null,
  },
  dp: {
    type: [Number, undefined],
    default: undefined,
  },
  balance: {
    /**
     * @type {import('vue').PropType<bigint|string>}
     */
    type: [BigInt, String],
    required: true,
  },
  showSymbol: {
    type: Boolean,
    default: true,
  },
})

const displayBalance = computed(() => {
  const { token, balance, dp } = props
  if (!token) {
    return 0
  }

  const amount = byDecimals(balance, token.decimals)
  const unit = units.find(it => amount.gt(it.value))
  if (unit) {
    return `${toBalance(amount.div(unit.value), 6)}${unit.name}`
  }

  return toBalance(amount, dp !== undefined ? dp : token.dp)
})
</script>
