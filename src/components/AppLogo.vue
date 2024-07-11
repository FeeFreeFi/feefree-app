<template>
  <router-link class="no-underline flex-center dark:opacity-80" :to="{ name: PAGE_HOME }">
    <img class="size-6 sm:size-8" src="/logo.svg" alt="logo" loading="lazy">
  </router-link>
</template>

<script setup>
import { PAGE_HOME } from "@/config"
</script>
