<template>
  <div class="flex flex-col py-6 sm:py-10">
    <div class="mx-auto relative w-full sm:w-[520px] h-[428px] sm:h-[488px]">
      <ZSectionView>
        <div class="h-10 flex-center">
          <n-text class="text-xl sm:text-2xl font-medium">Not Found</n-text>
        </div>
        <div class="mt-4 flex-center">
          <router-link :to="{ name: PAGE_HOME }">Oops, take me back to home</router-link>
        </div>
      </ZSectionView>
    </div>
  </div>
</template>

<script setup>
import ZSectionView from '@/components/ZSectionView.vue'
import { PAGE_HOME } from '@/config'
</script>
