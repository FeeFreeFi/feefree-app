<template>
  <div class="relative flex justify-center w-[50px]">
    <n-text class="z-[1] bg-white shadow p-[1px] rounded-full translate-x-[1px] shrink-0">
      <ZTokenIcon class="size-6" :token="pool.currency0" />
    </n-text>
    <n-text class="bg-white shadow p-[1px] rounded-full translate-x-[-1px] shrink-0">
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
