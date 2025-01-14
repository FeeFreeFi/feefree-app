<template>
  <span class="size-6 cursor-pointer" aria-label="close" @click="onClose">
    <i-ff-close class="size-6" />
  </span>
</template>

<script setup lang="ts">
interface Props {
  onClose: () => void
}

defineProps<Props>()
</script>
