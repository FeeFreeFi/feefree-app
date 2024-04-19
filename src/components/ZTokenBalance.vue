<template>
  <span class="truncate">
    <span class="flex truncate font-medium" :class="contentClass">
      <span class="truncate">{{ token ? toBalance(byDecimals(balance, token.decimals), dp !== undefined ? dp : token.dp) : 0 }}</span>
      <span v-if="token && showSymbol" class="ml-[2px]">{{ token.symbol }}</span>
    </span>
  </span>
</template>

<script setup>
import { toBalance, byDecimals } from "@/utils/bn"

defineProps({
  token: {
    /**
     * @type {import('vue').PropType<{symbol:string, decimals:number, dp:number}>}
     */
    type: Object,
    default: null,
  },
  dp: {
    type: [Number, undefined],
    default: undefined,
  },
  balance: {
    type: BigInt,
    required: true,
  },
  showSymbol: {
    type: Boolean,
    default: true,
  },
  contentClass: {
    type: String,
    default: "",
  },
})
</script>
