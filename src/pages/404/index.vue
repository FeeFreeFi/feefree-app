<template>
  <div class="flex-col flex-center bg-container p-8 rounded-20 w-full max-w-[444px] margin-center">
    <div class="relative flex flex-col justify-center items-center w-[272px] sm:w-[380px]">
      <div class="relative w-[272px] sm:w-[380px]">
        <img class="size-full aspect-square" :src="notFoundBg" loading="lazy" alt="Not found">
        <div class="bottom-8 absolute w-full text-center">
          <n-text depth="1">Page not found!</n-text>
        </div>
      </div>
      <div>
        <router-link class="no-underline" :to="{ name: PAGE_HOME }">
          <ZGhostButton class="w-36" aria-label="Home">Home</ZGhostButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PAGE_HOME } from '@/config'
import ZGhostButton from '@/components/ZGhostButton.vue'
import notFoundBg from '@/assets/images/not-found-bg.svg'
</script>
