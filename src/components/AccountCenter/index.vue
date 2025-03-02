<template>
  <div>
    <div class="flex-y-center gap-4">
      <ZButton v-if="!account" class="w-40 h-9" aria-label="Connect Wallet" @click="open">Connect Wallet</ZButton>
      <router-link v-else-if="chainSupported" class="flex-y-center gap-2 bg-container px-2 py-1 sm:pr-1 sm:pl-2 rounded-lg h-10 no-underline cursor-pointer" :to="{ name: PAGE_PROFILE_HOME }">
        <img class="rounded-full size-6" :src="jazzicon(account)" :alt="account">
        <n-text class="font-medium text-xs sm:text-sm">{{ byDecimals(nativeBalance, 18).dp(6) }} {{ nativeCurrency.symbol }}</n-text>
        <div v-if="screen.sm" class="flex-y-center gap-1 bg-tab px-1 rounded-lg h-8">
          <n-text class="pl-1 font-medium text-sm sm:text-base">{{ shortString(account) }}</n-text>
        </div>
      </router-link>
      <ChainSelector />
    </div>
    <WalletConnector />
    <TokenMore />
  </div>
</template>

<script setup lang="ts">
import { PAGE_PROFILE_HOME } from '@/config'
import { jazzicon, shortString, byDecimals } from '@/utils'
import { account, chainSupported, nativeBalance, nativeCurrency } from '@/hooks/useWallet'
import { open } from '@/hooks/useWalletConnector'
import { screen } from '@/hooks/useScreen'
import ZButton from '@/components/ZButton.vue'
import WalletConnector from '@/components/WalletConnector/index.vue'
import TokenMore from '@/components/TokenMore/index.vue'
import ChainSelector from './ChainSelector.vue'
</script>
