<template>
  <n-layout class="text-sm bg-transparent" content-class="min-h-full pt-[--x-header-h] pb-[--x-footer-h] lg:pb-0 flex flex-col" position="absolute" :native-scrollbar="false" :scrollbar-props="{class: 'main-scrollbar'}">
    <AppBackground />
    <AppHeader>
      <AppLogo />
    </AppHeader>
    <AppMain>
      <router-view />
    </AppMain>
    <AppFooter v-if="!screen.lg" />
  </n-layout>
</template>

<script setup>
import { screen } from "@/hooks/useScreen"
import AppLogo from "@/components/AppLogo.vue"
import AppBackground from './AppBackground.vue'
import AppHeader from './AppHeader.vue'
import AppMain from './AppMain.vue'
import AppFooter from './AppFooter.vue'

</script>

<style lang="scss">
.main-scrollbar > .n-scrollbar-rail {
  z-index: var(--x-main-scrollbar-z);
}
</style>
