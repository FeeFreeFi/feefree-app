<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-center pl-[14px]">
      <n-text class="cursor-default">Theme</n-text>
      <ThemeButton />
    </div>
    <n-divider class="!my-0" />
    <div class="flex flex-col">
      <n-button class="h-10 rounded flex-col items-stretch" quaternary tag="a" :href="URL_DISCORD" target="_blank" aria-label="discord">
        <n-text class="w-full flex-y-center justify-between">
          <span>Discord</span>
          <i-ic-round-discord class="size-6" />
        </n-text>
      </n-button>
      <n-button class="h-10 rounded flex-col items-stretch" quaternary tag="a" :href="URL_TWITTER" target="_blank" aria-label="twitter">
        <n-text class="w-full flex-y-center justify-between">
          <span>Twitter</span>
          <i-ri-twitter-x-fill class="size-6" />
        </n-text>
      </n-button>
      <n-button class="h-10 rounded flex-col items-stretch" quaternary tag="a" :href="URL_GITHUB" target="_blank" aria-label="github">
        <n-text class="w-full flex-y-center justify-between">
          <span>Github</span>
          <i-mdi-github class="size-6" />
        </n-text>
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { URL_DISCORD, URL_TWITTER, URL_GITHUB } from "@/config"
import ThemeButton from "./ThemeButton.vue"
</script>
