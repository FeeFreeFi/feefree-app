<template>
  <n-text class="truncate font-medium" :class="signClass">
    <span class="flex truncate">
      <span class="truncate">{{ displaySign }}{{ token ? toBalanceWithUnit(balance, token.decimals, dp || token.dp) : 0 }}</span>
      <span v-if="token && showSymbol" class="ml-[2px]">{{ token.symbol }}</span>
    </span>
  </n-text>
</template>

<script setup>
import { computed } from 'vue'
import { toBalanceWithUnit } from '@/utils'

const props = defineProps({
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
  sign: {
    type: [Boolean, undefined],
    default: undefined,
  },
})

const signClass = computed(() => {
  const { sign } = props
  return sign !== undefined ? (sign ? 'px-1 py-[2px] rounded-xl bg-card-1 text-success/80' : 'px-1 py-[2px] rounded-xl bg-card-1 text-error/90') : ''
})

const displaySign = computed(() => {
  const { sign } = props
  return sign !== undefined ? (sign ? '+ ' : '- ') : ''
})
</script>
