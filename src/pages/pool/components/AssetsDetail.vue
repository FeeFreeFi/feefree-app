<template>
  <ItemBox :label="label">
    <div class="flex flex-col gap-4">
      <TokenPercentage :token="currency0" :balance="data.balance0" :percent="data.percent0" />
      <TokenPercentage :token="currency1" :balance="data.balance1" :percent="data.percent1" />
    </div>
  </ItemBox>
</template>

<script setup>
import ItemBox from './ItemBox.vue'
import TokenPercentage from './TokenPercentage.vue'

defineProps({
  label: {
    type: String,
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
  data: {
    /**
     * @type {import('vue').PropType<{balance0:bigint, balance1:bigint, percent0:string, percent1:string}>}
     */
    type: Object,
    required: true,
  },
})
</script>
