<template>
  <n-text class="flex truncate font-medium">
    <n-text class="truncate">{{ toBalanceWithUnit(value, decimals, dp) }}</n-text>
  </n-text>
</template>

<script setup>
import { toBalanceWithUnit } from "@/utils"

defineProps({
  value: {
    /** @type {import('vue').PropType<bigint|string>} */
    type: [BigInt, String],
    required: true,
  },
  decimals: {
    type: Number,
    default: 0,
  },
  dp: {
    type: Number,
    default: 6,
  },
})
</script>
