<template>
  <span class="cursor-pointer transition-colors text-primary/80 hover:text-primary" aria-label="go back" @click="onBack">
    <i-ff-back class="size-6" />
  </span>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const onBack = () => {
  router.back()
}
</script>
