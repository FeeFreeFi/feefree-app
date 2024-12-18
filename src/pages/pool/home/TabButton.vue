<template>
  <div class="cursor-pointer hover:text-basic transition-colors" :class="[active ? 'text-basic' : 'text-basic-1']">
    <slot>
      <n-text class="text-sm font-medium text-inherit">{{ label }}</n-text>
    </slot>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
})
</script>
