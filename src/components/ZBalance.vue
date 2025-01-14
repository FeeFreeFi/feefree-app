<template>
  <n-text class="flex truncate font-medium">
    <n-text class="truncate">{{ toBalanceWithUnit(value, decimals, dp) }}</n-text>
  </n-text>
</template>

<script setup lang="ts">
import { toBalanceWithUnit } from '@/utils'

interface Props {
  value: bigint | string
  decimals?: number
  dp?: number
}

withDefaults(defineProps<Props>(), {
  decimals: 0,
  dp: 6,
})
</script>
