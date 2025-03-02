<template>
  <n-text class="font-medium text-base">{{ pool.currency0.symbol }} vs {{ pool.currency1.symbol }}</n-text>
</template>

<script setup lang="ts">
import type { PoolMeta } from '@/types'

interface Props {
  pool: Pick<PoolMeta, 'currency0' | 'currency1'>
}

defineProps<Props>()
</script>
