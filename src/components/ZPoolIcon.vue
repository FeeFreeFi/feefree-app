<template>
  <div>
    <n-text class="flex justify-center relative w-[50px]">
      <n-text class="p-[1px] bg-white rounded-full shadow translate-x-[1px] z-[1] shrink-0"><ZTokenIcon class="size-6" :token="currency0" /></n-text>
      <n-text class="p-[1px] bg-white rounded-full shadow translate-x-[-1px] shrink-0"><ZTokenIcon class="size-6" :token="currency1" /></n-text>
    </n-text>
  </div>
</template>

<script setup>
import ZTokenIcon from './ZTokenIcon.vue'

defineProps({
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
})
</script>
