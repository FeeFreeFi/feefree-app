<template>
  <div class="flex justify-center relative w-[50px]">
    <n-text class="p-[1px] bg-white rounded-full shadow translate-x-[1px] z-[1] shrink-0">
      <ZTokenIcon class="size-6" :token="pool.currency0" />
    </n-text>
    <n-text class="p-[1px] bg-white rounded-full shadow translate-x-[-1px] shrink-0">
      <ZTokenIcon class="size-6" :token="pool.currency1" />
    </n-text>
  </div>
</template>

<script setup lang="ts">
import type { PoolMeta } from '@/types'
import ZTokenIcon from './ZTokenIcon.vue'

interface Props {
  pool: Pick<PoolMeta, 'currency0' | 'currency1'>
}

defineProps<Props>()
</script>
