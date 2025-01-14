<template>
  <div>
    <n-text class="flex justify-center relative w-[50px]">
      <n-text class="p-[1px] bg-white rounded-full shadow translate-x-[1px] z-[1] shrink-0"><ZTokenIcon class="size-6" :token="asset" /></n-text>
      <n-text class="p-[1px] bg-white rounded-full shadow translate-x-[-1px] shrink-0"><ZTokenIcon class="size-6" :token="{ symbol }" /></n-text>
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
