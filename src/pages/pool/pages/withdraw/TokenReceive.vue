<template>
  <div class="flex-y-center justify-between">
    <div class="flex-y-center gap-2 sm:gap-3">
      <ZTokenIcon class="!size-6" :token="token" />
      <n-text class="text-sm font-medium">{{ token.symbol }}</n-text>
    </div>
    <ZTokenBalance :token="token" :balance="balance" :dp="6" :show-symbol="false" />
  </div>
</template>

<script setup>
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import ZTokenIcon from '@/components/ZTokenIcon.vue'

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
})
</script>
