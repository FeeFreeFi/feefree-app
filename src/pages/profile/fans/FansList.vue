<template>
  <div class="flex-1 flex flex-col">
    <div class="flex justify-between">
      <n-text class="font-medium">Fans list</n-text>
      <ZPagination v-if="total > 1" :page="page" :total="total" :on-update-page="onUpdatePage" />
    </div>
    <div class="mt-4 flex-1 flex flex-col gap-2 rounded bg-card/40">
      <div class="h-9 px-3 flex items-center gap-1 font-semibold rounded-t bg-card">
        <n-text class="w-14" :depth="1">Level</n-text>
        <n-text class="flex-1 text-center" :depth="1">Account</n-text>
        <n-text class="w-[80px] sm:w-[160px] text-center" :depth="1">Accept at</n-text>
      </div>
      <div v-if="list.length > 0">
        <div class="h-9 px-3 flex items-center gap-1 transition-colors hover:bg-card/60" v-for="item, index in list" :key="index">
          <div class="w-14 flex-y-center gap-1">
            <i-ff-dimaond class="size-4" />
            <n-text class="text-sm">Lv{{ item.level }}</n-text>
          </div>
          <div class="flex-1 flex justify-center gap-1">
            <a class="no-underline hover:underline hover:text-primary transition-colors" :href="getAccountUrl(appChainId, item.account)" target="_blank" :aria-label="getAccountUrl(appChainId, item.account)">
              <n-text class="text-xs text-basic hover:text-primary transition-colors">{{ shortString(item.account, 6, -4) }}</n-text>
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

<script setup>
import dayjs from "dayjs"
import { DATE_FORMAT_DEFAULT } from "@/config"
import shortString from "@/utils/shortString"
import { screen } from "@/hooks/useScreen"
import ZPagination from "@/components/ZPagination.vue"
import ZCopyable from "@/components/ZCopyable.vue"
import NoRecords from "./NoRecords.vue"
import { getAccountUrl } from "@/hooks/useChains"
import { appChainId } from "@/hooks/useAppState"

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
     * @type {import('vue').PropType<import('@/types').Fans[]>}
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
