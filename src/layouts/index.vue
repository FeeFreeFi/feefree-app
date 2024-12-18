<template>
  <n-layout class="text-sm bg-transparent !fixed" content-class="min-h-full flex flex-col" position="absolute" :native-scrollbar="false" :scrollbar-props="{class: 'main-scrollbar'}">
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

<script setup>
import { screen } from "@/hooks/useScreen"
import AppBackground from './AppBackground.vue'
import AppLogo from "@/components/AppLogo.vue"
import AppNotice from './AppNotice.vue'
import AppHeader from './AppHeader.vue'
import AppMain from './AppMain.vue'
import AppFooter from './AppFooter.vue'

</script>

<style lang="scss">
.main-scrollbar > .n-scrollbar-rail {
  z-index: 999;
}
</style>
