<template>
  <img class="size-5 rounded-full" :src="`/static/tokens/${icon}`" loading="lazy" :alt="`${token?.symbol || 'default token'} icon`">
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  token: {
    /** @type {import('vue').PropType<import('@/types').Token>} */
    type: Object,
    default: () => null,
  },
})

const icon = computed(() => props.token?.icon || 'default.svg')
</script>
