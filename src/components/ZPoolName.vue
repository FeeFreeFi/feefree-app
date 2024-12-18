<template>
  <n-text class="text-base font-medium">{{ pool.currency0.symbol }} vs {{ pool.currency1.symbol }}</n-text>
</template>

<script setup>
defineProps({
  pool: {
    /** @type {import('vue').PropType<import('@/types').PoolMeta>} */
    type: Object,
    required: true,
  }
})
</script>
