<template>
  <header class="top-0 z-[99] sticky bg-header backdrop-blur-sm">
    <slot name="notice" />
    <div class="items-center grid grid-cols-[auto_1fr_auto] mx-auto px-4 sm:px-6 max-w-7xl h-16">
      <div>
        <slot name="logo" />
      </div>
      <div>
        <div v-if="screen.lg" class="hidden lg:flex">
          <NavBar class="px-6" />
        </div>
      </div>
      <div class="flex-y-center gap-2">
        <AccountCenter />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { screen } from '@/hooks/useScreen'
import NavBar from '@/components/NavBar/index.vue'
import AccountCenter from '@/components/AccountCenter/index.vue'
</script>
