<template>
  <div>
    <n-text class="relative flex justify-center w-[50px]">
      <n-text class="z-[1] bg-white shadow p-[1px] rounded-full translate-x-[1px] shrink-0"><ZTokenIcon class="size-6" :token="asset" /></n-text>
      <n-text class="bg-white shadow p-[1px] rounded-full translate-x-[-1px] shrink-0"><ZTokenIcon class="size-6" :token="{ symbol }" /></n-text>
    </n-text>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import ZTokenIcon from './ZTokenIcon.vue'

interface Props {
  asset: Token
  symbol: string
}

defineProps<Props>()
</script>
