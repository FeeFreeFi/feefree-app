<template>
  <div class="flex-1 flex flex-col">
    <div class="flex justify-between">
      <n-text class="font-medium">Claim history</n-text>
      <ZPagination v-if="total > 1" :page="page" :total="total" :on-update-page="onUpdatePage" />
    </div>
    <div class="mt-4 flex-1 flex flex-col gap-2 rounded bg-card/40">
      <div class="h-9 px-3 flex items-center gap-1 font-semibold rounded-t bg-card">
        <n-text class="w-[72px]" :depth="1">Chain</n-text>
        <n-text class="w-28 text-center" :depth="1">Value</n-text>
        <n-text class="flex-1 sm:w-24 text-center" :depth="1">Timestamp</n-text>
        <n-text v-if="screen.sm" class="flex-1 text-right" :depth="1">Txn hash</n-text>
      </div>
      <div v-if="list.length > 0">
        <div v-for="item, index in list" :key="index" class="h-9 px-3 flex items-center gap-1 transition-colors hover:bg-card/60">
          <div class="w-[72px] flex items-center gap-2">
            <ZChainIcon class="size-4" :chain-id="item.chainId" />
            <n-text class="text-xs">{{ getChainName(item.chainId) }}</n-text>
          </div>
          <ZTokenBalance class="w-28 inline-flex justify-center text-xs" :token="ETH" :dp="8" :balance="item.amount" />
          <div class="flex-1 sm:w-24 text-center text-xs">
            <n-text v-if="screen.sm" class="flex-1 sm:w-24 text-center text-xs" :depth="1">{{ item.claimedAt ? dayjs(item.claimedAt).fromNow() : "N/A" }}</n-text>
            <a v-else class="flex-1 underline text-xs text-primary" :href="getTransactionUrl(item.chainId, item.transactionHash)" target="_blank">
              <n-text class="text-primary" :depth="1">{{ item.claimedAt ? dayjs(item.claimedAt).fromNow() : "N/A" }}</n-text>
            </a>
          </div>
          <a v-if="screen.sm" class="flex-1 underline text-xs text-primary text-right" :href="getTransactionUrl(item.chainId, item.transactionHash)" target="_blank">
            <n-text type="primary">{{ shortString(item.transactionHash, 8, -4) }}</n-text>
          </a>
        </div>
      </div>
      <div v-else class="flex-1 flex-center">
        <NoRecords />
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { shortString, ETH } from '@/utils'
import { screen } from '@/hooks/useScreen'
import { getChainName, getTransactionUrl } from '@/hooks/useChains'
import ZPagination from '@/components/ZPagination.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import ZChainIcon from '@/components/ZChainIcon.vue'
import NoRecords from './NoRecords.vue'

defineProps({
  total: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  list: {
    /**
     * @type {import('vue').PropType<import('@/types').Claim[]>}
     */
    type: Array,
    required: true,
  },
  onUpdatePage: {
    /**
     * @type {import('vue').PropType<(page:number) => Promise>}
     */
    type: Function,
    required: true,
  },
})
</script>
