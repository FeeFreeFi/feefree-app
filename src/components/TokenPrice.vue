<template>
  <div class="flex-y-center">
    <ZPlusTokenIcon :token="inputToken" plus-class="!size-[10px]" />
    <n-text class="ml-1">1 {{ inputToken.symbol }}</n-text>
    <n-text class="mx-2">=</n-text>
    <ZPlusTokenIcon :token="outputToken" plus-class="!size-[10px]" />
    <n-text class="ml-1">{{ priceValue }} {{ outputToken.symbol }}</n-text>
  </div>
</template>

<script setup>
import { computed } from "vue"
import formatPrice from "@/utils/formatPrice"
// import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZPlusTokenIcon from '@/components/ZPlusTokenIcon.vue'

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
