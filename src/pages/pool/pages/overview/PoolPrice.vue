<template>
  <div class="flex-y-center cursor-pointer" @click="onTogglePrice">
    <ZTokenIcon :token="inputToken" />
    <n-text class="ml-1">1 {{ inputToken.symbol }}</n-text>
    <i-ff-swap class="size-5 mx-3" />
    <ZTokenIcon :token="outputToken" />
    <n-text class="ml-1">{{ priceValue }} {{ outputToken.symbol }}</n-text>
  </div>
</template>

<script setup lang="ts">
import type { PoolMeta } from '@/types'
import { formatPrice } from '@/utils'
import ZTokenIcon from '@/components/ZTokenIcon.vue'

interface Props {
  pool: PoolMeta
  price0: number
  price1: number
}

const props = defineProps<Props>()

const showPrice0 = ref(true)

const inputToken = computed(() => showPrice0.value ? props.pool.currency0 : props.pool.currency1)
const outputToken = computed(() => showPrice0.value ? props.pool.currency1 : props.pool.currency0)

const price = computed(() => showPrice0.value ? props.price0 : props.price1)
const priceValue = computed(() => formatPrice(price.value))

const onTogglePrice = () => {
  showPrice0.value = !showPrice0.value
}
</script>
