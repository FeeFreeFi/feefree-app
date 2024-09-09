<template>
  <div class="flex flex-col relative overflow-hidden mx-auto my-4 sm:my-8 flex-1 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20">
    <div class="mb-4 flex items-center justify-between">
      <n-text class="text-lg font-medium">Profile</n-text>
      <ZBack />
    </div>
    <div v-if="account" class="flex-1 flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex-y-center gap-2">
          <n-text class="w-14" :depth="1">Account</n-text>
          <div class="flex-y-center gap-2">
            <n-text class="text-base font-medium">{{ shortString(account, 10, -8) }}</n-text>
            <ZCopyable class="flex justify-end cursor-pointer" :text="account">
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
        </div>
        <div class="flex-y-center gap-2">
          <n-text class="w-14" :depth="1">Balance</n-text>
          <div class="flex-y-center gap-2">
            <ZTokenBalance :token="nativeCurrency" :dp="6" :balance="nativeBalance" />
            <ViewOnExplorer class="shrink-0 !gap-1 text-xs" :url="accountUrl" label="View" />
          </div>
        </div>
        <div class="flex-y-center gap-2">
          <n-text class="w-14" :depth="1">Level</n-text>
          <div class="flex-y-center gap-2">
            <div class="shrink-0 flex-y-center gap-1">
              <i-ff-dimaond class="size-4" />
              <n-text class="text-sm">Lv{{ profile?.level || 1 }}</n-text>
            </div>
          </div>
        </div>
        <div class="flex-y-center gap-2">
          <n-text class="w-14" :depth="1">Exp</n-text>
          <div class="flex-y-center gap-2">
            <n-progress class="shrink-0 !w-[200px]" type="line" :percentage="percentage">
              <n-text class="text-sm" depth="1">{{ profile?.exp || 0 }}/{{ profile?.nextExp || 0 }}</n-text>
            </n-progress>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex gap-4">
          <div class="flex-1 flex flex-col items-center gap-1 bg-card p-2 rounded-md">
            <n-text class="text-xs" depth="1">Points</n-text>
            <div class="flex-y-center gap-1">
              <n-text>{{ profile?.points || 0 }}</n-text>
              <i-ff-points class="size-4" />
            </div>
          </div>
          <router-link class="no-underline flex-1 flex flex-col items-center gap-1 bg-card p-2 rounded-md" :to="{ name: PAGE_PROFILE_REBATE }" @click="onClose">
            <n-text class="text-xs" depth="1">Rebate</n-text>
            <div class="flex-y-center gap-1">
              <ZTokenBalance class="!font-normal text-primary/80" :token="nativeCurrency" :dp="8" :balance="BigInt(profile?.rebate || 0)" />
              <i-ff-rebate class="size-4" />
            </div>
          </router-link>
        </div>
        <div class="flex gap-4">
          <div class="flex-1 flex flex-col items-center gap-1 bg-card p-2 rounded-md">
            <n-text class="text-xs" depth="1">Inviter</n-text>
            <div class="flex-y-center gap-1">
              <n-text>{{ profile?.inviter || "N/A" }}</n-text>
            </div>
          </div>
          <router-link class="no-underline flex-1 flex flex-col items-center gap-1 bg-card p-2 rounded-md" :to="{ name: PAGE_PROFILE_FANS }" @click="onClose">
            <n-text class="text-xs" depth="1">Fans</n-text>
            <div class="flex-y-center gap-1">
              <n-text class="text-primary/80">{{ profile?.fans || 0 }}</n-text>
              <i-ff-fans class="size-4" />
            </div>
          </router-link>
          <div class="flex-1 flex flex-col items-center gap-1 bg-card p-2 rounded-md cursor-pointer" @click="onShare">
            <n-text class="text-xs" depth="1">Referral</n-text>
            <div class="flex-y-center gap-1">
              <n-text class="text-primary/80">{{ referral }}</n-text>
              <i-ff-share class="size-4" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1" />
      <ZButton class="w-full h-10 sm:h-12" aria-label="Logout" @click="onLogout">Logout</ZButton>
    </div>
    <div v-else class="flex-1 flex-center">
      <ZButton class="w-60 h-10 sm:h-12" aria-label="Connect wallet" @click="openWalletConnector">Connect Wallet</ZButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useMessage } from "naive-ui"
import { PAGE_PROFILE_FANS, PAGE_PROFILE_REBATE } from "@/config"
import shortString from "@/utils/shortString"
import { copyText } from "@/utils/clipboard"
import { getAccountReferral } from "@/utils/accountHash"
import { logout } from "@/api"
import { account, nativeBalance, nativeCurrency, disconnect } from '@/hooks/useWallet'
import { open as openWalletConnector } from "@/hooks/useWalletConnector"
import { appChainId } from "@/hooks/useAppState"
import { getAccountUrl } from "@/hooks/useChains"
import { clearAuth } from "@/hooks/useAuth"
import { profile } from "@/hooks/useUser"
import ZCopyable from "@/components/ZCopyable.vue"
import ZButton from '@/components/ZButton.vue'
import ViewOnExplorer from "@/components/ViewOnExplorer.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZBack from "@/components/ZBack.vue"

const message = useMessage()

const referral = computed(() => profile.value ? profile.value.referral : getAccountReferral(account.value))

const percentage = computed(() => {
  if (!profile.value) {
    return 0
  }

  const { exp, nextExp } = profile.value
  return nextExp ? 100 * exp / nextExp : 100
})

const accountUrl = computed(() => getAccountUrl(appChainId.value, account.value))
const shareUrl = computed(() => {
  const url = new URL(window.location.href)
  url.searchParams.append("referral", referral.value)

  return url.href
})

const onShare = async () => {
  const success = await copyText(shareUrl.value)
  success && message.success("Referral copied, share and earn points!")
}

const onLogout = () => {
  disconnect()
  logout().finally(clearAuth)
}
</script>
