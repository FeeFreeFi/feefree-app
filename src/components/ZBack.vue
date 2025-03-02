<template>
  <span class="text-primary/80 hover:text-primary transition-colors cursor-pointer" aria-label="go back" @click="onBack">
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
