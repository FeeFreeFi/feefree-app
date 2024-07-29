<template>
  <div class="flex-center gap-1">
    <ZPlusTokenIcon :token="token" />
    <n-text class="text-sm sm:text-base font-medium">{{ token.symbol }}</n-text>
  </div>
</template>

<script setup>
import ZPlusTokenIcon from "@/components/ZPlusTokenIcon.vue"

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
