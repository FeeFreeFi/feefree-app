<template>
  <div class="flex-y-center gap-2">
    <ZTokenIcon :token="inputToken" />
    <n-text class="text-xs">1 {{ inputToken.symbol }} = {{ priceValue }} {{ outputToken.symbol }}</n-text>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatPrice } from '@/utils'
import ZTokenIcon from '@/components/ZTokenIcon.vue'

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
