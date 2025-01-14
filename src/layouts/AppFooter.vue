<template>
  <footer class="sticky w-full h-16 bg-header/80 backdrop-blur-sm bottom-0 left-0 z-0">
    <div class="h-full max-w-[--x-content-max-w] mx-auto px-4 sm:px-6 flex-center">
      <div class="w-full sm:w-auto sm:flex lg:hidden">
        <NavBar />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
</script>
