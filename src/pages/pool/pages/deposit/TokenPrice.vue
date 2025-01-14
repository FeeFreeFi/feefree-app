<template>
  <div class="flex-y-center gap-2">
    <ZTokenIcon :token="inputToken" />
    <n-text class="text-xs">1 {{ inputToken.symbol }} = {{ priceValue }} {{ outputToken.symbol }}</n-text>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import { formatPrice } from '@/utils'
import ZTokenIcon from '@/components/ZTokenIcon.vue'

interface Props {
  inputToken: Token
  outputToken: Token
  price: number
}

const props = defineProps<Props>()

const priceValue = computed(() => formatPrice(props.price))
</script>
