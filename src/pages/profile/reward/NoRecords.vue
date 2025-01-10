<template>
  <div class="size-full pb-[60px] flex-center">
    <div class="size-[240px] relative">
      <img class="size-full aspect-square" :src="noTokenBg" loading="lazy" alt="No records">
      <div class="absolute w-full bottom-0 text-center">
        <n-text class="text-sm" type="primary">NO RECORDS</n-text>
      </div>
    </div>
  </div>
</template>

<script setup>
import noTokenBg from '@/assets/images/no-token-bg.svg'
</script>
