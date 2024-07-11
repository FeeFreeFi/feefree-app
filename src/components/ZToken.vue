<template>
  <div class="flex-center gap-1">
    <ZTokenIcon :token="token" />
    <n-text class="text-sm font-medium">{{ token.symbol }}</n-text>
  </div>
</template>

<script setup>
import ZTokenIcon from "./ZTokenIcon.vue"

defineProps({
  token: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
})
</script>
