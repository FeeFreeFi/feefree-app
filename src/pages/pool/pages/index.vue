<template>
  <ZContainer class="flex flex-col lg:flex-row gap-4">
    <PoolNav />
    <div class="flex-1 flex flex-col overflow-hidden">
      <router-view />
    </div>
  </ZContainer>
</template>

<script setup>
import ZContainer from "@/components/ZContainer.vue"
import PoolNav from "../components/PoolNav.vue"
</script>
