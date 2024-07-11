<template>
  <header class="fixed w-full h-[--x-header-h] bg-header/80 backdrop-blur-sm top-0 left-0 z-[--x-header-z]">
    <div class="h-full max-w-[--x-content-max-w] mx-auto px-4 sm:px-6 grid items-center grid-cols-[auto_1fr_auto]">
      <div>
        <slot />
      </div>
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
import { screen } from "@/hooks/useScreen"
import NavBar from "@/components/NavBar/index.vue"
import AccountCenter from "@/components/AccountCenter/index.vue"
</script>
