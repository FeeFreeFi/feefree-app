<template>
  <div class="flex-center gap-1">
    <PlusTokenIcon :token="token" />
    <n-text class="text-sm sm:text-base font-medium">{{ token.symbol }}</n-text>
  </div>
</template>

<script setup>
import PlusTokenIcon from "./PlusTokenIcon.vue"

defineProps({
  token: {
    /**
     * @type {import('vue').PropType<{chainId:number, name:string, symbol:string, address:string}>}
     */
    type: Object,
    required: true,
  },
})
</script>
