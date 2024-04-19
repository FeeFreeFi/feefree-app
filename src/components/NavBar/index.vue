<template>
  <div class="flex gap-2">
    <router-link :to="{ name: PAGE_HOME }" #="{ isExactActive }">
      <n-button class="h-9 rounded-xl px-2 sm:px-4" quaternary :focusable="false" aria-label="home">
        <n-text class="font-medium text-base" :class="{'text-color-3': !isExactActive}">Home</n-text>
      </n-button>
    </router-link>
    <router-link :to="{ name: PAGE_POOL_HOME }" #="{ isExactActive }">
      <n-button class="h-9 rounded-xl px-2 sm:px-4" quaternary :focusable="false" aria-label="pool">
        <n-text class="font-medium text-base" :class="{'text-color-3': !isExactActive}">Pool</n-text>
      </n-button>
    </router-link>
    <router-link :to="{ name: PAGE_EXCHANGE }" #="{ isExactActive }">
      <n-button class="h-9 rounded-xl px-2 sm:px-4" quaternary :focusable="false" aria-label="exchange">
        <n-text class="font-medium text-base" :class="{'text-color-3': !isExactActive}">Exchange</n-text>
      </n-button>
    </router-link>
    <router-link :to="{ name: PAGE_NFT_HOME }" #="{ isExactActive }">
      <n-button class="h-9 rounded-xl px-2 sm:px-4" quaternary :focusable="false" aria-label="nft">
        <n-text class="font-medium text-base" :class="{'text-color-3': !isExactActive}">NFT</n-text>
      </n-button>
    </router-link>
    <router-link v-if="screen.sm" :to="{ name: PAGE_FAUCET }" #="{ isExactActive }">
      <n-button class="h-9 rounded-xl px-2 sm:px-4" quaternary :focusable="false" aria-label="faucet">
        <n-text class="font-medium text-base" :class="{'text-color-3': !isExactActive}">Faucet</n-text>
      </n-button>
    </router-link>
    <NavMenu />
  </div>
</template>

<script setup>
import {
  PAGE_HOME,
  PAGE_POOL_HOME,
  PAGE_EXCHANGE,
  PAGE_NFT_HOME,
  PAGE_FAUCET,
} from "@/config"
import NavMenu from "./NavMenu.vue"
import { screen } from "@/hooks/useScreen";
</script>
