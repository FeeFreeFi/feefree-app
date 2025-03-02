<template>
  <div class="hover:text-font transition-colors cursor-pointer" :class="[active ? 'text-font' : 'text-font-70']">
    <slot>
      <n-text class="font-medium text-inherit text-sm">{{ label }}</n-text>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  active: boolean
}

defineProps<Props>()
</script>
