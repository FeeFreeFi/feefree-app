<template>
  <header class="fixed w-full top-0 left-0 h-16 sm:h-20 z-[--x-header-z] bg-main border-tb !border-b-divider sm:border-none transition-all">
    <div class="h-full max-w-[--x-content-max-w] mx-auto px-6 grid items-center grid-cols-[auto_1fr_auto]">
      <router-link class="no-underline flex-center dark:opacity-80" :to="{ name: PAGE_HOME }">
        <img class="size-6" src="/logo.svg" alt="logo" loading="lazy" />
      </router-link>
      <div>
        <div class="hidden lg:flex" v-if="screen.lg">
          <NavBar class="px-6" />
        </div>
      </div>
      <div class="flex-y-center gap-2">
        <AccountCenter />
      </div>
    </div>
  </header>
</template>

<script setup>
import { PAGE_HOME } from "@/config"
import { screen } from "@/hooks/useScreen"
import NavBar from "@/components/NavBar/index.vue"
import AccountCenter from "@/components/AccountCenter/index.vue"
</script>
