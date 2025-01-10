<template>
  <div class="flex-y-center justify-between">
    <a class="flex-y-center gap-2 no-underline" :href="url" target="_blank" aria-label="token holder">
      <ZTokenIcon :token="token" />
      <ZTokenBalance :token="token" :balance="balance" :dp="dp" />
    </a>
    <n-text depth="1">{{ percent }}</n-text>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isNative } from '@/utils'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import { getAccountUrl, getHolderUrl } from '@/hooks/useChains'

const props = defineProps({
  token: {
    /** @type {import('vue').PropType<import('@/types').Token>} */
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
  holder: {
    type: String,
    required: true,
  },
})

const url = computed(() => {
  const { token, holder } = props
  return isNative(token.address) ? getAccountUrl(token.chainId, holder) : getHolderUrl(token.chainId, token.address, holder)
})
</script>
