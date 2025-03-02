<template>
  <div>
    <div class="flex justify-between">
      <n-text class="font-medium">Available</n-text>
    </div>
    <div class="flex flex-col gap-2 bg-card/40 mt-4 rounded">
      <div class="flex items-center gap-1 bg-card px-3 rounded-t h-9 font-semibold">
        <n-text class="w-[72px]" :depth="1">Chain</n-text>
        <n-text class="w-28 text-center" :depth="1">Value</n-text>
        <n-text v-if="screen.sm" class="w-24 text-center" :depth="1">Update at</n-text>
        <n-text class="flex-1 pr-[10px] text-right" :depth="1">Action</n-text>
      </div>
      <div v-for="item, index in list" :key="index" class="flex items-center gap-1 hover:bg-card/60 px-3 h-10 transition-colors">
        <div class="flex items-center gap-2 w-[72px]">
          <ZChainIcon class="size-4" :chain-id="item.chainId" />
          <n-text class="text-xs">{{ getChainName(item.chainId) }}</n-text>
        </div>
        <ZTokenBalance class="inline-flex justify-center w-28 text-xs" :token="ETH" :dp="8" :balance="item.amount" />
        <a v-if="screen.sm" class="w-24 text-primary text-center underline" :href="getTransactionUrl(item.chainId, item.transactionHash)" target="_blank">
          <n-text class="w-24 text-primary text-xs text-center">{{ dayjs(item.updatedAt).fromNow() }}</n-text>
        </a>
        <div class="flex flex-1 justify-end">
          <ZButton class="w-16 !font-normal text-xs" size="small" :disabled="claiming || !item.valid" @click="() => onClaim(item)">Claim</ZButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Reward } from '@/types'
import dayjs from 'dayjs'
import { ETH } from '@/utils'
import { screen } from '@/hooks/useScreen'
import { getChainName, getTransactionUrl } from '@/hooks/useChains'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import ZChainIcon from '@/components/ZChainIcon.vue'
import ZButton from '@/components/ZButton.vue'

interface Props {
  claiming: boolean
  list: (Reward & { valid: boolean })[]
  onClaim: (reward: Reward) => void
}

defineProps<Props>()
</script>
