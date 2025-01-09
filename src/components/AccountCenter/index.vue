<template>
  <div>
    <div class="flex-y-center gap-4">
      <ZButton v-if="!account" class="w-40 h-9" aria-label="Connect Wallet" @click="open">Connect Wallet</ZButton>
      <router-link v-else-if="chainSupported" class="h-10 flex-y-center gap-2 py-1 px-2 sm:pl-2 sm:pr-1 bg-container rounded-lg cursor-pointer no-underline" :to="{ name: PAGE_PROFILE_HOME }">
        <img class="size-6 rounded-full" :src="jazzicon(account)" :alt="account">
        <n-text class="text-xs sm:text-sm font-medium">{{ byDecimals(nativeBalance, 18).dp(6) }} {{ nativeCurrency.symbol }}</n-text>
        <div v-if="screen.sm" class="h-8 px-1 flex-y-center gap-1 rounded-lg bg-tab">
          <n-text class="pl-1 text-sm sm:text-base font-medium">{{ shortString(account) }}</n-text>
        </div>
      </router-link>
      <ChainSelector />
    </div>
    <WalletConnector />
    <TokenMore />
  </div>
</template>

<script setup lang="ts">
import { PAGE_PROFILE_HOME } from "@/config"
import { jazzicon, shortString, byDecimals } from "@/utils"
import { account, chainSupported, nativeBalance, nativeCurrency } from "@/hooks/useWallet"
import { open } from "@/hooks/useWalletConnector"
import { screen } from '@/hooks/useScreen'
import ZButton from "@/components/ZButton.vue"
import WalletConnector from "@/components/WalletConnector/index.vue"
import TokenMore from "@/components/TokenMore/index.vue"
import ChainSelector from "./ChainSelector.vue"
</script>
