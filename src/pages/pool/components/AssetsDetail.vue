<template>
  <ItemBox :label="label">
    <div class="flex flex-col gap-4">
      <TokenPercentage :token="currency0" :balance="data.balance0" :percent="data.percent0" :holder="holder" />
      <TokenPercentage :token="currency1" :balance="data.balance1" :percent="data.percent1" :holder="holder" />
    </div>
  </ItemBox>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import ItemBox from './ItemBox.vue'
import TokenPercentage from './TokenPercentage.vue'

interface Props {
  label: string
  currency0: Token
  currency1: Token
  data: { balance0: bigint, balance1: bigint, percent0: string, percent1: string }
  holder: string
}

defineProps<Props>()
</script>
