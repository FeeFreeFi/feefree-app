<template>
  <div class="flex-center px-3 py-2 shadow rounded-full cursor-pointer text-sm" @click="onTogglePrice">
    <ZTokenIcon :token="srcToken" />
    <n-text class="ml-1">1 {{ srcToken.symbol }}</n-text>
    <i-ic-round-swap-horiz class="size-5 mx-2" />
    <ZTokenIcon :token="dstToken" />
    <n-text class="ml-1">{{ price.toFixed(6) }} {{ dstToken.symbol }}</n-text>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  currency0: {
    type: Object,
    required: true,
  },
  currency1: {
    type: Object,
    required: true,
  },
  price0: {
    type: Number,
    required: true,
  },
  price1: {
    type: Number,
    required: true,
  },
})

const showPrice0 = ref(true)
const srcToken = computed(() => showPrice0.value ? props.currency0 : props.currency1)
const dstToken = computed(() => showPrice0.value ? props.currency1 : props.currency0)
const price = computed(() => showPrice0.value ? props.price0 : props.price1)

const onTogglePrice = () => {
  showPrice0.value = !showPrice0.value
}
</script>
