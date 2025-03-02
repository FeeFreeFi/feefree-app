<template>
  <div class="flex flex-col gap-3 bg-box lg:bg-tab p-4 lg:p-6 rounded">
    <n-text class="text-xs" depth="1">{{ label }}</n-text>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
}

defineProps<Props>()
</script>
