<template>
  <div class="size-full pb-[60px] flex-center">
    <div class="size-[280px] relative">
      <img class="size-full aspect-square" :src="noWalletBg" loading="lazy" alt="No wallet">
      <div class="absolute w-full bottom-0 text-center">
        <n-text class="text-sm" type="primary">NO ETHEREUM WALLETS FOUND</n-text>
      </div>
    </div>
  </div>
</template>

<script setup>
import noWalletBg from '@/assets/images/no-wallet-bg.svg'
</script>
