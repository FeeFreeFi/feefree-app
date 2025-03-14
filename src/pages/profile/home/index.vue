<template>
  <div class="relative flex flex-col flex-1 bg-container mx-auto my-4 sm:my-8 p-4 sm:p-8 rounded-2xl w-full sm:w-[490px] overflow-hidden">
    <div class="flex justify-between items-center mb-4">
      <n-text class="font-medium text-lg">Profile</n-text>
      <ZBack />
    </div>
    <div v-if="account" class="flex flex-col flex-1 gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex-y-center gap-2">
          <n-text class="w-14" :depth="1">Account</n-text>
          <div class="flex-y-center gap-2">
            <n-text class="font-medium text-base">{{ shortString(account, 10, -8) }}</n-text>
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
            <ZViewUrl class="!gap-1 text-xs shrink-0" :url="accountUrl" :label="false" />
          </div>
        </div>
        <div class="flex-y-center gap-2">
          <n-text class="w-14" :depth="1">Level</n-text>
          <div class="flex-y-center gap-2">
            <div class="flex-y-center gap-1 shrink-0">
              <i-ff-dimaond class="size-4" />
              <n-text class="text-sm">Lv{{ profile?.level || 1 }}</n-text>
            </div>
          </div>
        </div>
        <div class="flex-y-center gap-2">
          <n-text class="w-14" :depth="1">Exp</n-text>
          <div class="flex-y-center gap-2">
            <n-progress class="!w-[200px] shrink-0" type="line" :percentage="percentage">
              <n-text class="text-sm" depth="1">{{ profile?.exp || 0 }}/{{ profile?.nextExp || 0 }}</n-text>
            </n-progress>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex gap-4">
          <router-link class="flex flex-col flex-1 items-center gap-1 bg-card p-2 rounded-md no-underline" :to="{ name: PAGE_PROFILE_POINTS }">
            <n-text class="text-xs" depth="1">Points</n-text>
            <div class="flex-y-center gap-1">
              <n-text class="text-primary/80">{{ profile?.points || 0 }}</n-text>
              <i-ff-points class="size-4" />
            </div>
          </router-link>
          <router-link class="flex flex-col flex-1 items-center gap-1 bg-card p-2 rounded-md no-underline" :to="{ name: PAGE_PROFILE_REWARD }">
            <n-text class="text-xs" depth="1">Reward</n-text>
            <div class="flex-y-center gap-1">
              <ZTokenBalance class="!font-normal text-primary/80" :token="nativeCurrency" :dp="8" :balance="profile?.reward || 0n" />
              <i-ff-reward class="size-4" />
            </div>
          </router-link>
        </div>
        <div class="flex gap-4">
          <div class="flex flex-col flex-1 items-center gap-1 bg-card p-2 rounded-md">
            <n-text class="text-xs" depth="1">Inviter</n-text>
            <div class="flex-y-center gap-1">
              <n-text>{{ profile?.inviter || "N/A" }}</n-text>
            </div>
          </div>
          <router-link class="flex flex-col flex-1 items-center gap-1 bg-card p-2 rounded-md no-underline" :to="{ name: PAGE_PROFILE_FANS }">
            <n-text class="text-xs" depth="1">Fans</n-text>
            <div class="flex-y-center gap-1">
              <n-text class="text-primary/80">{{ profile?.fans || 0 }}</n-text>
              <i-ff-fans class="size-4" />
            </div>
          </router-link>
          <div class="flex flex-col flex-1 items-center gap-1 bg-card p-2 rounded-md cursor-pointer" @click="onShare">
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

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { PAGE_PROFILE_FANS, PAGE_PROFILE_POINTS, PAGE_PROFILE_REWARD } from '@/config'
import { shortString } from '@/utils'
import { logout } from '@/api'
import { account, nativeBalance, nativeCurrency, disconnect } from '@/hooks/useWallet'
import { open as openWalletConnector } from '@/hooks/useWalletConnector'
import { appChainId } from '@/hooks/useAppState'
import { getAccountUrl } from '@/hooks/useChains'
import { clearAuth, getAccessToken } from '@/hooks/useAuth'
import { profile } from '@/hooks/useUser'
import { createShare } from '@/hooks/useShare'
import ZCopyable from '@/components/ZCopyable.vue'
import ZButton from '@/components/ZButton.vue'
import ZViewUrl from '@/components/ZViewUrl.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import ZBack from '@/components/ZBack.vue'

const message = useMessage()

const { referral, onShare } = createShare(message)

const percentage = computed(() => {
  if (!profile.value) {
    return 0
  }

  const { exp, nextExp } = profile.value
  return nextExp ? 100 * exp / nextExp : 100
})

const accountUrl = computed(() => getAccountUrl(appChainId.value, account.value))

const onLogout = () => {
  disconnect()
  getAccessToken() && logout().finally(clearAuth)
}
</script>
