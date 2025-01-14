<template>
  <n-layout class="app-layout text-sm bg-transparent !fixed" content-class="min-h-full flex flex-col" position="absolute" :native-scrollbar="false">
    <AppBackground />
    <AppHeader>
      <template #notice>
        <AppNotice />
      </template>
      <template #logo>
        <AppLogo />
      </template>
    </AppHeader>
    <AppMain>
      <router-view />
    </AppMain>
    <AppFooter v-if="!screen.lg" />
  </n-layout>
</template>

<script setup lang="ts">
import { screen } from '@/hooks/useScreen'
import AppLogo from '@/components/AppLogo.vue'
import AppBackground from './AppBackground.vue'
import AppNotice from './AppNotice.vue'
import AppHeader from './AppHeader.vue'
import AppMain from './AppMain.vue'
import AppFooter from './AppFooter.vue'
</script>

<style lang="scss">
.app-layout {
  .n-scrollbar > .n-scrollbar-rail {
    z-index: 999;
  }
}
</style>
