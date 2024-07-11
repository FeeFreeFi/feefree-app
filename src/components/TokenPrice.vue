<template>
  <div class="flex-y-center">
    <ZTokenIcon :token="inputToken" />
    <n-text class="ml-1">1 {{ inputToken.symbol }}</n-text>
    <n-text class="mx-2">=</n-text>
    <ZTokenIcon :token="outputToken" />
    <n-text class="ml-1">{{ priceValue }} {{ outputToken.symbol }}</n-text>
  </div>
</template>

<script setup>
import { computed } from "vue"
import formatPrice from "@/utils/formatPrice"
import ZTokenIcon from "@/components/ZTokenIcon.vue"

const props = defineProps({
  inputToken: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
  outputToken: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
})

const priceValue = computed(() => formatPrice(props.price))
</script>
