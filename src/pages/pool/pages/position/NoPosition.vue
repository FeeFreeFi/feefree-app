<template>
  <div class="flex flex-col items-center">
    <div class="w-[240px] sm:w-[320px] relative">
      <img class="size-full aspect-square" :src="noPositionBg" loading="lazy" alt="No position">
      <div class="absolute w-full bottom-0 text-center">
        <n-text type="primary">You have no position in this pool</n-text>
      </div>
    </div>
    <div class="mt-2">
      <n-text depth="2">Deposit to open a position!</n-text>
    </div>
    <div class="mt-10">
      <router-link class="no-underline" :to="{ name: PAGE_POOL_DEPOSIT }">
        <ZGhostButton class="w-36" aria-label="Deposit">Deposit</ZGhostButton>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PAGE_POOL_DEPOSIT } from '@/config'
import ZGhostButton from '@/components/ZGhostButton.vue'
import noPositionBg from '@/assets/images/no-position-bg.svg'
</script>
