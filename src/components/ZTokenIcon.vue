<template>
  <img class="rounded-full size-5" :src="`/static/tokens/${icon}`" loading="lazy" :alt="`${token?.symbol || 'default token'} icon`">
</template>

<script setup lang="ts">
import type { Token } from '@/types'

interface Props {
  token?: Pick<Token, 'icon' | 'symbol'>
}

const props = withDefaults(defineProps<Props>(), {
  token: undefined,
})

const icon = computed(() => props.token?.icon || 'default.svg')
</script>
