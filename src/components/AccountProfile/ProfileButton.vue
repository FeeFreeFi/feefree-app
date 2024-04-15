<template>
  <n-button class="h-10 py-1 px-2 sm:pl-2 sm:pr-1 rounded-lg" size="large" tertiary>
    <img class="size-6 rounded-full" :src="jazzicon(account)" :alt="account" />
    <n-text v-if="screen.sm" class="ml-2 text-sm font-semibold inline-flex">
      <span>{{ byDecimals(balance, 18).dp(6) }}</span>
      <span class="ml-1">{{ nativeCurrency.symbol }}</span>
    </n-text>
    <div v-if="screen.sm" class="ml-2 h-8 pl-2 pr-1 flex-y-center rounded-lg bg-block">
      <n-text class="text-base font-semibold">{{ shortString(account) }}</n-text>
      <n-text class="ml-1 text-color-3" aria-label="down arrow">
        <i-mdi-chevron-down class="size-5" />
      </n-text>
    </div>
  </n-button>
</template>

<script setup>
import jazzicon from "@/utils/jazzicon"
import shortString from "@/utils/shortString"
import { byDecimals } from "@/utils/bn"
import { screen } from '@/hooks/useScreen'
import { account, balance, nativeCurrency } from '@/hooks/useWallet'
</script>
