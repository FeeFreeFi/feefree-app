<template>
  <div class="flex gap-4">
    <div class="flex-1 flex flex-col items-center gap-1 bg-card p-2 rounded-md">
      <n-text class="text-xs" depth="1">Current</n-text>
      <div v-if="account" class="flex-y-center gap-1">
        <ZTokenBalance class="!font-normal" :token="ETH" :dp="8" :balance="current" />
        <i-ff-rebate class="size-4" />
      </div>
      <n-text v-else>N/A</n-text>
    </div>
    <div class="flex-1 flex flex-col items-center gap-1 bg-card p-2 rounded-md">
      <n-text class="text-xs" depth="1">Claimed</n-text>
      <div v-if="account" class="flex-y-center gap-1">
        {{ age }}
        <ZTokenBalance class="!font-normal" :token="ETH" :dp="8" :balance="claimed" />
        <i-ff-rebate class="size-4" />
      </div>
      <n-text v-else>N/A</n-text>
    </div>
  </div>
</template>

<script setup>
import { account } from "@/hooks/useWallet"
import { ETH } from "@/hooks/useCurrency"
import ZTokenBalance from "@/components/ZTokenBalance.vue"

defineProps({
  current: {
    /**
     * @type {import('vue').PropType<bigint|string>}
     */
    type: [BigInt, String],
    required: true,
  },
  claimed: {
    /**
     * @type {import('vue').PropType<bigint|string>}
     */
    type: [BigInt, String],
    required: true,
  },
})
</script>
