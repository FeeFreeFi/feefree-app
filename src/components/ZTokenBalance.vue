<template>
  <n-text class="truncate font-medium" :class="signClass">
    <span class="flex truncate">
      <span class="truncate">{{ displaySign }}{{ token ? toBalanceWithUnit(balance || 0n, token.decimals, dp || token.dp) : 0 }}</span>
      <span v-if="token && showSymbol" class="ml-[2px]">{{ token.symbol }}</span>
    </span>
  </n-text>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import { toBalanceWithUnit } from '@/utils'

interface Props {
  token?: Pick<Token, 'symbol' | 'decimals' | 'dp'>
  dp?: number
  balance?: bigint | string
  showSymbol?: boolean
  sign?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  token: undefined,
  dp: undefined,
  balance: '',
  showSymbol: true,
  sign: undefined,
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
