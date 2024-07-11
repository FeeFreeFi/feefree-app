<template>
  <div class="margin-center w-full max-w-[444px] p-8 flex-center flex-col bg-container rounded-20">
    <div class="relative w-[272px] sm:w-[380px] flex flex-col items-center justify-center">
      <div class="w-[272px] sm:w-[380px] relative">
        <img class="size-full aspect-square" :src="notFoundBg" loading="lazy" alt="Not found">
        <div class="absolute w-full bottom-8 text-center">
          <n-text depth="1">Page not found!</n-text>
        </div>
      </div>
      <div>
        <router-link class="no-underline" :to="{ name: PAGE_HOME }">
          <ZGhostButton class="w-36" aria-label="Back">Back</ZGhostButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PAGE_HOME } from '@/config'
import ZGhostButton from '@/components/ZGhostButton.vue'
import notFoundBg from "@/assets/images/not-found-bg.svg"
</script>
