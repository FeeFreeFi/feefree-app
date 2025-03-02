<template>
  <div class="flex-center bg-container hover:bg-container/80 rounded-lg transition-all cursor-pointer" :aria-label="ariaLabel">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  ariaLabel?: string
}

withDefaults(defineProps<Props>(), {
  ariaLabel: '',
})
</script>
