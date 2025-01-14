<template>
  <div class="p-4 lg:p-6 flex flex-col gap-3 bg-box lg:bg-tab rounded">
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
