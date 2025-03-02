<template>
  <div class="flex-center px-3 border border-primary border-solid rounded h-9 text-primary transition-all" :class="[disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-primary/20']" :aria-label="ariaLabel">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  ariaLabel?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  ariaLabel: '',
  disabled: false,
})
</script>
