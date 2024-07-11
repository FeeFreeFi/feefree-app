<template>
  <div class="flex-y-center justify-between">
    <div class="flex-y-center gap-2">
      <ZTokenIcon :token="token" />
      <ZTokenBalance :token="token" :balance="balance" :dp="dp" />
    </div>
    <n-text depth="1">{{ percent }}</n-text>
  </div>
</template>

<script setup>
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"

defineProps({
  token: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
  balance: {
    /**
     * @type {import('vue').PropType<bigint>}
     */
    type: BigInt,
    required: true,
  },
  percent: {
    type: String,
    required: true,
  },
  dp: {
    type: Number,
    default: 3,
  },
})
</script>
