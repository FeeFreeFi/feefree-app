<template>
  <n-layout class="main-content bg-main" content-class="min-h-full pt-16 sm:pt-20 pb-16 lg:pb-0 flex flex-col" position="absolute" :native-scrollbar="false" :scrollbar-props="{class: 'main-scrollbar'}">
    <AppHeader />
    <PageBackground />
    <AppMain />
    <AppFooter v-if="!screen.lg" />
  </n-layout>
</template>

<script setup>
import { screen } from "@/hooks/useScreen"
import PageBackground from "@/components/PageBackground.vue"
import AppHeader from './AppHeader.vue'
import AppMain from './AppMain.vue'
import AppFooter from './AppFooter.vue'
</script>

<style lang="scss">
.main-scrollbar > .n-scrollbar-rail {
  z-index: var(--x-main-scrollbar-z);
}
</style>
