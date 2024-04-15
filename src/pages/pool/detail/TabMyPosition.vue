<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-1">
      <i-my-my-position class="size-6 text-primary" />
      <n-text class="font-medium text-xl">My Position</n-text>
    </div>
    <div v-if="hasPosition" class="flex-x-center gap-4">
      <!-- Total Value -->
      <div class="shadow p-4 flex flex-col gap-4 rounded-2xl">
        <n-text class="text-color-3 text-sm">Total Value</n-text>
        <n-text>${{ toBalance(positionState.tvl) }}</n-text>
      </div>
      <!-- Assets in Position -->
      <div class="shadow p-4 flex flex-col gap-4 rounded-2xl">
        <n-text class="text-color-3">Assets in Position</n-text>
        <div class="flex-y-center gap-4">
          <n-text class="text-color-3 text-sm">{{ positionState.percent0 }}</n-text>
          <div class="flex-y-center gap-2">
            <ZTokenIcon :token="pool.currency0" />
            <ZTokenBalance content-class="text-sm" :token="pool.currency0" :balance="positionState.balance0" :dp="3" />
          </div>
        </div>
        <div class="flex-y-center gap-4">
          <n-text class="text-color-3 text-sm">{{ positionState.percent1 }}</n-text>
          <div class="flex-y-center gap-2">
            <ZTokenIcon :token="pool.currency1" />
            <ZTokenBalance content-class="text-sm" :token="pool.currency1" :balance="positionState.balance1" :dp="3" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="pt-10 flex flex-col items-center gap-3">
      <i-my-position class="size-10 text-primary" />
      <n-text>You have no position in this pool</n-text>
      <n-text class="text-color-3 text-sm">Add liquidity to open a position!</n-text>
      <n-button type="info" @click="onAddLiquidity">Add liquidity</n-button>
    </div>
  </div>
</template>

<script setup>
import { toBalance } from "@/utils/bn"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"

defineProps({
  pool: {
    type: Object,
    required: true,
  },
  positionState: {
    type: Object,
    required: true,
  },
  hasPosition: {
    type: Boolean,
    required: true,
  },
  onAddLiquidity: {
    type: Function,
    required: true,
  },
})
</script>
