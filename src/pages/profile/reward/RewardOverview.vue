<template>
  <div class="flex gap-4">
    <div class="flex flex-col flex-1 items-center gap-1 bg-card p-2 rounded-md">
      <n-text class="text-xs" depth="1">Current</n-text>
      <div v-if="account" class="flex-y-center gap-1">
        <ZTokenBalance class="!font-normal" :token="ETH" :dp="8" :balance="current" />
        <i-ff-reward class="size-4" />
      </div>
      <n-text v-else>N/A</n-text>
    </div>
    <div class="flex flex-col flex-1 items-center gap-1 bg-card p-2 rounded-md">
      <n-text class="text-xs" depth="1">Claimed</n-text>
      <div v-if="account" class="flex-y-center gap-1">
        <ZTokenBalance class="!font-normal" :token="ETH" :dp="8" :balance="claimed" />
        <i-ff-reward class="size-4" />
      </div>
      <n-text v-else>N/A</n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ETH } from '@/utils'
import { account } from '@/hooks/useWallet'
import ZTokenBalance from '@/components/ZTokenBalance.vue'

interface Props {
  current: bigint | string
  claimed: bigint | string
}

defineProps<Props>()
</script>
