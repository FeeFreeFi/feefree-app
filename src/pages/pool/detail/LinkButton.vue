<template>
  <router-link class="no-underline" :to="to" #="{ isExactActive }">
    <n-button class="h-8 sm:h-10 px-2 rounded" block :secondary="isExactActive" :type="isExactActive ? 'info' : 'default'" :quaternary="!isExactActive" :aria-label="label">
      <slot />
    </n-button>
  </router-link>
</template>

<script setup>
defineProps({
  to: {
    type: Object,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})
</script>
