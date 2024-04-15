<template>
  <footer class="fixed lg:static w-full bottom-0 left-0 h-16 z-0 bg-main dark:bg-body border-tb !border-t-divider lg:border-none transition-all">
    <div class="h-full max-w-[--x-content-max-w] mx-auto px-6 flex-center">
      <div class="flex lg:hidden">
        <NavBar />
      </div>
    </div>
  </footer>
</template>

<script setup>
import NavBar from "@/components/NavBar/index.vue"
</script>
