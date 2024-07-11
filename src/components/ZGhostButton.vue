<template>
  <div class="h-9 px-3 flex-center rounded text-primary border border-solid border-primary transition-all" :class="[disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-primary/20']" :aria-label="ariaLabel">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  ariaLabel: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>
