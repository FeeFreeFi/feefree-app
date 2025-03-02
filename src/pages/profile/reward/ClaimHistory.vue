<template>
  <div class="flex flex-col flex-1">
    <div class="flex justify-between">
      <n-text class="font-medium">Claim history</n-text>
      <ZPagination v-if="total > 1" :page="page" :total="total" :on-update-page="onUpdatePage" />
    </div>
    <div class="flex flex-col flex-1 gap-2 bg-card/40 mt-4 rounded">
      <div class="flex items-center gap-1 bg-card px-3 rounded-t h-9 font-semibold">
        <n-text class="w-[72px]" :depth="1">Chain</n-text>
        <n-text class="w-28 text-center" :depth="1">Value</n-text>
        <n-text class="flex-1 sm:w-24 text-center" :depth="1">Timestamp</n-text>
        <n-text v-if="screen.sm" class="flex-1 text-right" :depth="1">Txn hash</n-text>
      </div>
      <div v-if="list.length > 0">
        <div v-for="item, index in list" :key="index" class="flex items-center gap-1 hover:bg-card/60 px-3 h-9 transition-colors">
          <div class="flex items-center gap-2 w-[72px]">
            <ZChainIcon class="size-4" :chain-id="item.chainId" />
            <n-text class="text-xs">{{ getChainName(item.chainId) }}</n-text>
          </div>
          <ZTokenBalance class="inline-flex justify-center w-28 text-xs" :token="ETH" :dp="8" :balance="item.amount" />
          <div class="flex-1 sm:w-24 text-xs text-center">
            <n-text v-if="screen.sm" class="flex-1 sm:w-24 text-xs text-center" :depth="1">{{ item.claimedAt ? dayjs(item.claimedAt).fromNow() : "N/A" }}</n-text>
            <a v-else class="flex-1 text-primary text-xs underline" :href="getTransactionUrl(item.chainId, item.transactionHash)" target="_blank">
              <n-text class="text-primary" :depth="1">{{ item.claimedAt ? dayjs(item.claimedAt).fromNow() : "N/A" }}</n-text>
            </a>
          </div>
          <a v-if="screen.sm" class="flex-1 text-primary text-xs text-right underline" :href="getTransactionUrl(item.chainId, item.transactionHash)" target="_blank">
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

<script setup lang="ts">
import type { Claim } from '@/types'
import dayjs from 'dayjs'
import { shortString, ETH } from '@/utils'
import { screen } from '@/hooks/useScreen'
import { getChainName, getTransactionUrl } from '@/hooks/useChains'
import ZPagination from '@/components/ZPagination.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import ZChainIcon from '@/components/ZChainIcon.vue'
import NoRecords from './NoRecords.vue'

interface Props {
  total: number
  page: number
  list: Claim[]
  onUpdatePage: (page: number) => void
}

defineProps<Props>()
</script>
