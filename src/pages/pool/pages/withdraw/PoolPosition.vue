<template>
  <div class="p-4 lg:p-6 flex flex-col gap-3 bg-card lg:bg-tab rounded">
    <n-text class="text-xs" depth="1">My pool share</n-text>
    <div class="flex-y-center gap-[6px]">
      <n-text>{{ currentPercent }}</n-text>
      <RightArrow v-if="account && amount" />
      <n-text v-if="account && amount">{{ afterPercent }}</n-text>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { fromValue } from '@/utils'
import { account } from '@/hooks/useWallet'
import RightArrow from '@/components/Arrow/RightArrow.vue'

const props = defineProps({
  amount: {
    /**
     * @type {import('vue').PropType<bigint>}
     */
    type: BigInt,
    required: true,
  },
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
})

const currentPercent = computed(() => {
  const { balance, total } = props
  if (balance === 0n || total === 0n) {
    return '0%'
  }

  return `${fromValue(balance).times(100).div(total).dp(4).toFormat()}%`
})

const afterPercent = computed(() => {
  const { amount, balance, total } = props
  if (balance === 0n || total === 0n || amount === 0n || total <= amount) {
    return '0%'
  }

  return `${fromValue(balance - amount).times(100).div(total - amount).dp(4).toFormat()}%`
})
</script>
