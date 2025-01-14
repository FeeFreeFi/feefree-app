<template>
  <div class="flex-1 flex flex-col">
    <div class="flex justify-between">
      <n-text class="font-medium">Points list</n-text>
      <ZPagination v-if="total > 1" :page="page" :total="total" :on-update-page="onUpdatePage" />
    </div>
    <div class="mt-4 flex-1 flex flex-col gap-2 rounded bg-card/40">
      <div class="h-9 px-3 flex items-center gap-1 font-semibold rounded-t bg-card">
        <n-text class="w-14 text-center" :depth="1">Points</n-text>
        <n-text class="w-[100px] text-center" :depth="1">Date</n-text>
        <n-text class="flex-1 sm:w-20 text-center" :depth="1">Reason</n-text>
        <n-text v-if="screen.sm" class="flex-1 text-center" :depth="1">Meta</n-text>
      </div>
      <div v-if="list.length > 0">
        <div v-for="item, index in list" :key="index" class="h-9 px-3 flex items-center gap-1 transition-colors hover:bg-card/60">
          <n-text class="w-14 text-center text-sm font-medium">{{ item.value }}</n-text>
          <n-text class="w-[100px] text-xs text-center" :depth="1">{{ dayjs(item.date).fromNow() }}</n-text>
          <div class="flex-1 sm:w-20 text-xs text-center">
            <n-text v-if="screen.sm" :depth="1">{{ NAMES[item.reason] }}</n-text>
            <div v-else>
              <div v-if="'transactionHash' in item.meta">
                <a class="flex-1 underline text-xs text-primary text-right" :href="getTransactionUrl(item.meta.chainId, item.meta.transactionHash)" target="_blank">
                  <n-text type="primary">{{ NAMES[item.reason] }}</n-text>
                </a>
              </div>
              <div v-else-if="'account' in item.meta" class="flex-y-center justify-center gap-1">
                <n-text class="text-xs" :depth="1">{{ NAMES[item.reason] }}</n-text>
                <ZCopyable class="flex justify-end cursor-pointer" :text="item.meta.account">
                  <template #copied>
                    <div class="flex-y-center gap-1" aria-label="Copy address">
                      <span aria-label="Copied">
                        <i-ff-success class="size-4" />
                      </span>
                    </div>
                  </template>
                  <div class="flex-y-center gap-1" aria-label="Copy address">
                    <span aria-label="Copy">
                      <i-ff-copy class="size-4 text-primary/80" />
                    </span>
                  </div>
                </ZCopyable>
              </div>
              <div v-else>
                <n-text class="flex-1 text-center text-xs" :depth="1">{{ item.meta.remark }}</n-text>
              </div>
            </div>
          </div>
          <div v-if="screen.sm" class="flex-1 text-center text-sm">
            <div v-if="'transactionHash' in item.meta">
              <a class="flex-1 underline text-xs text-primary text-right" :href="getTransactionUrl(item.meta.chainId, item.meta.transactionHash)" target="_blank">
                <n-text type="primary">{{ shortString(item.meta.transactionHash, 8, -4) }}</n-text>
              </a>
            </div>
            <div v-else-if="'account' in item.meta" class="flex-y-center justify-center gap-1">
              <a class="no-underline hover:underline hover:text-primary transition-colors" :href="getAccountUrl(appChainId, item.meta.account)" target="_blank" :aria-label="getAccountUrl(appChainId, item.meta.account)">
                <n-text class="text-xs text-basic hover:text-primary transition-colors">{{ shortString(item.meta.account, 6, -4) }}</n-text>
              </a>
              <ZCopyable class="flex justify-end cursor-pointer" :text="item.meta.account">
                <template #copied>
                  <div class="flex-y-center gap-1" aria-label="Copy address">
                    <span aria-label="Copied">
                      <i-ff-success class="size-4" />
                    </span>
                  </div>
                </template>
                <div class="flex-y-center gap-1" aria-label="Copy address">
                  <span aria-label="Copy">
                    <i-ff-copy class="size-4 text-primary/80" />
                  </span>
                </div>
              </ZCopyable>
            </div>
            <div v-else>
              <n-text class="flex-1 text-center text-xs" :depth="1">{{ item.meta.remark }}</n-text>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex-1 flex-center">
        <NoRecords />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Points } from '@/types'
import dayjs from 'dayjs'
import { shortString } from '@/utils'
import { screen } from '@/hooks/useScreen'
import { appChainId } from '@/hooks/useAppState'
import { getAccountUrl, getTransactionUrl } from '@/hooks/useChains'
import ZPagination from '@/components/ZPagination.vue'
import ZCopyable from '@/components/ZCopyable.vue'
import NoRecords from './NoRecords.vue'

interface Props {
  total: number
  page: number
  list: Points[]
  onUpdatePage: (page: number) => void
}

defineProps<Props>()

const NAMES: Record<string, string> = {
  101: 'Genesis NFT',
  102: 'Week NFT',
  103: 'Add liquidity',
  104: 'Swap',
  105: 'Exchange',
  201: 'Invitation',
  301: 'Compensation',
  302: 'Bonus',
  401: 'Fans',
}
</script>
