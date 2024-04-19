<template>
  <div class="flex justify-center relative">
    <span class="p-1 bg-white rounded-full shadow translate-x-[4px] z-[1]"><ZTokenIcon class="size-6" :token="currency0"/></span>
    <span class="p-1 bg-white rounded-full shadow translate-x-[-4px]"><ZTokenIcon class="size-6" :token="currency1" /></span>
  </div>
</template>

<script setup>
import ZTokenIcon from './ZTokenIcon.vue'

defineProps({
  currency0: {
    /**
     * @type {import('vue').PropType<{chainId:number, symbol:string, address:string}>}
     */
    type: Object,
    required: true,
  },
  currency1: {
    /**
     * @type {import('vue').PropType<{chainId:number, symbol:string, address:string}>}
     */
    type: Object,
    required: true,
  },
})
</script>
