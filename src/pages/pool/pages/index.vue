<template>
  <ZContainer class="flex lg:flex-row flex-col gap-4">
    <PoolNav />
    <div class="flex flex-col flex-1 overflow-hidden">
      <router-view />
    </div>
  </ZContainer>
</template>

<script setup lang="ts">
import ZContainer from '@/components/ZContainer.vue'
import PoolNav from '../components/PoolNav.vue'
</script>
