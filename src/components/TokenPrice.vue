<template>
  <div class="flex-y-center text-sm">
    <ZTokenIcon class="shrink-0" :token="inputToken" />
    <n-text class="ml-1 shrink-0">1 {{ inputToken.symbol }}</n-text>
    <n-text class="mx-2">=</n-text>
    <ZTokenIcon class="shrink-0" :token="outputToken" />
    <div class="ml-1 flex gap-1 overflow-hidden">
      <n-text class="text-ellipsis overflow-hidden">{{ priceValue }}</n-text>
      <n-text class="shrink-0">{{ outputToken.symbol }}</n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import { formatPrice } from '@/utils'
import ZTokenIcon from '@/components/ZTokenIcon.vue'

interface Props {
  inputToken: Pick<Token, 'icon' | 'symbol'>
  outputToken: Pick<Token, 'icon' | 'symbol'>
  price: number
}

const props = defineProps<Props>()

const priceValue = computed(() => formatPrice(props.price))
</script>
