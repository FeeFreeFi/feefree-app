<template>
  <n-button class="h-10 px-[14px] rounded-lg" size="large" tertiary aria-label="dark theme" @click="toggleThemeMode">
    <i-carbon-sun class="size-5" v-if="isDarkMode" />
    <i-carbon-moon class="size-5" v-else />
  </n-button>
</template>

<script setup>
import { isDarkMode, toggleThemeMode } from '@/hooks/useTheme'
</script>
