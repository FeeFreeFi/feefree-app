<template>
  <div class="flex flex-col flex-1">
    <div class="flex justify-between">
      <n-text class="font-medium">Fans list</n-text>
      <ZPagination v-if="total > 1" :page="page" :total="total" :on-update-page="onUpdatePage" />
    </div>
    <div class="flex flex-col flex-1 gap-2 bg-card/40 mt-4 rounded">
      <div class="flex items-center gap-1 bg-card px-3 rounded-t h-9 font-semibold">
        <n-text class="w-14" :depth="1">Level</n-text>
        <n-text class="flex-1 text-center" :depth="1">Account</n-text>
        <n-text class="w-[80px] sm:w-[160px] text-center" :depth="1">Accept at</n-text>
      </div>
      <div v-if="list.length > 0">
        <div v-for="item, index in list" :key="index" class="flex items-center gap-1 hover:bg-card/60 px-3 h-9 transition-colors">
          <div class="flex-y-center gap-1 w-14">
            <i-ff-dimaond class="size-4" />
            <n-text class="text-sm">Lv{{ item.level }}</n-text>
          </div>
          <div class="flex flex-1 justify-center gap-1">
            <a class="hover:text-primary hover:underline no-underline transition-colors" :href="getAccountUrl(appChainId, item.account)" target="_blank" :aria-label="getAccountUrl(appChainId, item.account)">
              <n-text class="text-font hover:text-primary text-xs transition-colors">{{ shortString(item.account, 6, -4) }}</n-text>
            </a>
            <ZCopyable class="flex justify-end cursor-pointer" :text="item.account">
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
          <n-text class="w-[80px] sm:w-[160px] text-xs text-center" :depth="1">{{ screen.sm ? dayjs(item.acceptAt).format(DATE_FORMAT_DEFAULT) : dayjs(item.acceptAt).fromNow() }}</n-text>
        </div>
      </div>
      <div v-else class="flex-1 flex-center">
        <NoRecords />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Fans } from '@/types'
import dayjs from 'dayjs'
import { DATE_FORMAT_DEFAULT } from '@/config'
import { shortString } from '@/utils'
import { screen } from '@/hooks/useScreen'
import { getAccountUrl } from '@/hooks/useChains'
import { appChainId } from '@/hooks/useAppState'
import ZPagination from '@/components/ZPagination.vue'
import ZCopyable from '@/components/ZCopyable.vue'
import NoRecords from './NoRecords.vue'

interface Props {
  total: number
  page: number
  list: Fans[]
  onUpdatePage: (page: number) => void
}

defineProps<Props>()
</script>
