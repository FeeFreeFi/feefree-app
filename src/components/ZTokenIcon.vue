<template>
  <img class="size-5 rounded-full" :src="`/static/tokens/${icon}`" loading="lazy" :alt="`${token?.symbol || 'default token'} icon`">
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  token: Token|undefined
}>(), {
  token: undefined,
})

const icon = computed(() => props.token?.icon || 'default.svg')
</script>
