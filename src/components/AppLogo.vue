<template>
  <router-link class="flex-center dark:opacity-80 no-underline" :to="{ name: PAGE_HOME }">
    <img class="size-6 sm:size-8" src="/logo.svg" alt="logo" loading="lazy">
  </router-link>
</template>

<script setup lang="ts">
import { PAGE_HOME } from '@/config'
</script>
