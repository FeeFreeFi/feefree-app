<template>
  <ZModalView class="text-sm" :on-close="onClose">
    <div class="px-6 pb-8 flex flex-col relative">
      <div class="flex justify-center">
        <img class="size-12 rounded-full" :src="jazzicon(account)" :alt="account">
      </div>
      <div class="mt-4 flex justify-center">
        <n-text class="text-lg font-medium">{{ shortString(account, 9, -7) }}</n-text>
      </div>
      <div class="mt-4 flex gap-4">
        <ZCopyable class="flex-1 flex justify-end cursor-pointer" :text="account">
          <template #copied>
            <div class="flex-y-center gap-3" aria-label="Copy address">
              <span aria-label="Copied">
                <i-my-success class="size-4" />
              </span>
              <n-text depth="1">Copy Address</n-text>
            </div>
          </template>
          <div class="flex-y-center gap-3" aria-label="Copy address">
            <span aria-label="Copy">
              <i-my-dark-copy class="size-4" />
            </span>
            <n-text depth="1">Copy Address</n-text>
          </div>
        </ZCopyable>
        <ViewTransaction class="flex-1" :url="accountUrl" />
      </div>
      <div class="mt-6 px-4 flex justify-center gap-6" v-if="profile">
        <div class="flex-y-center">
          <n-text depth="1">Points:</n-text>
          <n-text class="ml-2 mr-1">{{ profile.points }}</n-text>
          <i-my-points class="size-4" />
        </div>
        <div class="flex-y-center cursor-pointer" @click="onShare">
          <n-text depth="1">Referral:</n-text>
          <n-text class="ml-2 mr-1">{{ profile.referral }}</n-text>
          <i-my-share class="size-4" />
        </div>
      </div>
      <div class="mt-8">
        <ZButton class="h-10 sm:h-12 w-full" @click="onLogout">Logout</ZButton>
      </div>
    </div>
  </ZModalView>
</template>

<script setup>
import { computed } from "vue"
import { useMessage } from "naive-ui"
import jazzicon from "@/utils/jazzicon"
import shortString from "@/utils/shortString"
import { getAccountUrl } from "@/utils/chain"
import { copyText } from "@/utils/clipboard"
import { logout } from "@/api"
import { account, disconnect } from '@/hooks/useWallet'
import { appChainId } from "@/hooks/useAppState"
import { getExplorerUrl } from "@/hooks/useChains"
import { clearAuth } from "@/hooks/useAuth"
import { profile } from "@/hooks/useUser"
import ZModalView from '@/components/ZModalView.vue'
import ZCopyable from "@/components/ZCopyable.vue"
import ZButton from '@/components/ZButton.vue'
import ViewTransaction from "@/components/ViewTransaction.vue"

const message = useMessage()

const props = defineProps({
  onClose: {
    type: Function,
    required: true,
  },
})

const accountUrl = computed(() => getAccountUrl(account.value, getExplorerUrl(appChainId.value)))
const shareUrl = computed(() => {
  const url = new URL(window.location.href)
  url.searchParams.append("referral", profile.value.referral)

  return url.href
})

const onShare = async () => {
  const success = await copyText(shareUrl.value)
  success && message.success("Referral copied, share and earn points!")
}

const onLogout = () => {
  disconnect()
  logout()
  clearAuth()
  props.onClose()
}
</script>
