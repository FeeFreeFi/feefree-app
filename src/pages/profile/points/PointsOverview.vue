<template>
  <div class="flex gap-4">
    <div class="flex-1 flex flex-col items-center gap-1 bg-card p-2 rounded-md">
      <n-text class="text-xs" depth="1">Total</n-text>
      <div v-if="account" class="flex-y-center gap-1">
        <n-text class="text-primary/80">{{ profile?.points || 0 }}</n-text>
        <i-ff-points class="size-4" />
      </div>
      <n-text v-else>N/A</n-text>
    </div>
    <div class="flex-1 flex flex-col items-center gap-1 bg-card p-2 rounded-md" :class="[account ? 'cursor-pointer' : '']" @click="onShare">
      <n-text class="text-xs" depth="1">Referral</n-text>
      <div v-if="account" class="flex-y-center gap-1">
        <n-text class="text-primary/80">{{ referral }}</n-text>
        <i-ff-share class="size-4" />
      </div>
      <n-text v-else>N/A</n-text>
    </div>
  </div>
</template>

<script setup>
import { useMessage } from "naive-ui"
import { account } from "@/hooks/useWallet"
import { profile } from "@/hooks/useUser"
import { createShare } from "@/hooks/useShare"

const message = useMessage()
const { referral, onShare } = createShare(message)
</script>
