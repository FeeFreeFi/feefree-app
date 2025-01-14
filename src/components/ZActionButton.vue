<template>
  <div class="flex-center cursor-pointer transition-all rounded-lg bg-container hover:bg-container/80" :aria-label="ariaLabel">
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
