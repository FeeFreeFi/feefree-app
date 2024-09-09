<template>
  <div>
    <router-link class="h-10 flex-y-center gap-2 py-1 px-2 sm:pl-2 sm:pr-1 bg-container rounded-lg cursor-pointer no-underline" :to="{ name: PAGE_PROFILE_HOME }">
      <img class="size-6 rounded-full" :src="jazzicon(account)" :alt="account">
      <n-text class="text-xs sm:text-sm font-medium">{{ byDecimals(nativeBalance, 18).dp(6) }} {{ nativeCurrency.symbol }}</n-text>
      <div v-if="screen.sm" class="h-8 px-1 flex-y-center gap-1 rounded-lg bg-tab">
        <n-text class="pl-1 text-sm sm:text-base font-medium">{{ shortString(account) }}</n-text>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { PAGE_PROFILE_HOME } from "@/config"
import jazzicon from "@/utils/jazzicon"
import shortString from "@/utils/shortString"
import { byDecimals } from "@/utils/bn"
import { screen } from '@/hooks/useScreen'
import { account, nativeBalance, nativeCurrency } from '@/hooks/useWallet'
</script>
