<template>
  <div>
    <div class="flex justify-between">
      <n-text class="font-medium">Available</n-text>
    </div>
    <div class="mt-4 flex flex-col gap-2 rounded bg-card/40">
      <div class="h-9 px-3 flex items-center gap-1 font-semibold rounded-t bg-card">
        <n-text class="w-[72px]" :depth="1">Chain</n-text>
        <n-text class="w-28 text-center" :depth="1">Value</n-text>
        <n-text v-if="screen.sm" class="w-24 text-center" :depth="1">Update at</n-text>
        <n-text class="flex-1 text-right pr-[10px]" :depth="1">Action</n-text>
      </div>
      <div class="h-10 px-3 flex items-center gap-1 transition-colors hover:bg-card/60" v-for="item, index in list" :key="index">
        <div class="w-[72px] flex items-center gap-2">
          <ZChainIcon class="size-4" :chain-id="item.chainId" />
          <n-text class="text-xs">{{ getChainName(item.chainId) }}</n-text>
        </div>
        <ZTokenBalance class="w-28 inline-flex justify-center text-xs" :token="ETH" :dp="8" :balance="item.amount" />
        <a v-if="screen.sm" class="w-24 underline text-primary text-center" :href="getTransactionUrl(item.chainId, item.transactionHash)" target="_blank">
          <n-text class="w-24 text-center text-xs text-primary">{{ dayjs(item.updatedAt).fromNow() }}</n-text>
        </a>
        <div class="flex-1 flex justify-end">
          <ZButton class="w-16 !font-normal text-xs" size="small" :disabled="claiming || !item.valid" @click="() => onClaim(item)">Claim</ZButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs"
import { screen } from "@/hooks/useScreen"
import { ETH } from "@/hooks/useCurrency"
import { getChainName, getTransactionUrl } from "@/hooks/useChains"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZChainIcon from "@/components/ZChainIcon.vue"
import ZButton from "@/components/ZButton.vue"

defineProps({
  claiming: {
    type: Boolean,
    required: true,
  },
  list: {
    /**
     * @type {import('vue').PropType<(import('@/types').Rebate & {valid:boolean})[]>}
     */
    type: Array,
    required: true,
  },
  onClaim: {
    /**
     * @type {import('vue').PropType<(item:import('@/types').Rebate) => Promise>}
     */
    type: Function,
    required: true,
  },
})
</script>
