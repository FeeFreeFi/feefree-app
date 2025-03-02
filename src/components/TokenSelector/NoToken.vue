<template>
  <div class="flex-center pb-[60px] size-full">
    <div class="relative size-[240px]">
      <img class="size-full aspect-square" :src="noTokenBg" loading="lazy" alt="No tokens">
      <div class="bottom-0 absolute w-full text-center">
        <n-text class="text-sm" type="primary">NO TOKENS FOUND</n-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import noTokenBg from '@/assets/images/no-token-bg.svg'
</script>
