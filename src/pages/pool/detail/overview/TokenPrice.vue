<template>
  <div class="flex-center cursor-pointer" @click="onTogglePrice">
    <ZTokenIcon :token="inputToken" />
    <n-text class="ml-1">1 {{ inputToken.symbol }}</n-text>
    <i-my-swap class="size-5 mx-3" />
    <ZTokenIcon :token="outputToken" />
    <n-text class="ml-1">{{ priceValue }} {{ outputToken.symbol }}</n-text>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import formatPrice from "@/utils/formatPrice"
import ZTokenIcon from "@/components/ZTokenIcon.vue"

const props = defineProps({
  currency0: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
  currency1: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
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
const inputToken = computed(() => showPrice0.value ? props.currency0 : props.currency1)
const outputToken = computed(() => showPrice0.value ? props.currency1 : props.currency0)
const price = computed(() => showPrice0.value ? props.price0 : props.price1)

const priceValue = computed(() => formatPrice(price.value))

const onTogglePrice = () => {
  showPrice0.value = !showPrice0.value
}
</script>
