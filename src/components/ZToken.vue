<template>
  <div class="flex-center gap-1">
    <ZTokenIcon :token="token" />
    <n-text class="text-sm sm:text-base font-medium">{{ token.symbol }}</n-text>
  </div>
</template>

<script setup>
import ZTokenIcon from "./ZTokenIcon.vue"

defineProps({
  token: {
    /**
     * @type {{chainId:number, symbol:string, address:string}}
     */
    type: Object,
    required: true,
  },
})
</script>
