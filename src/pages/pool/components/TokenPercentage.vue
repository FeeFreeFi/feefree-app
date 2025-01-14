<template>
  <div class="flex-y-center justify-between">
    <a class="flex-y-center gap-2 no-underline" :href="url" target="_blank" aria-label="token holder">
      <ZTokenIcon :token="token" />
      <ZTokenBalance :token="token" :balance="balance" :dp="dp" />
    </a>
    <n-text depth="1">{{ percent }}</n-text>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import { isNative } from '@/utils'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import { getAccountUrl, getHolderUrl } from '@/hooks/useChains'

interface Props {
  token: Token
  balance: bigint
  percent: string
  dp?: number
  holder: string
}

const props = withDefaults(defineProps<Props>(), {
  dp: 3,
})

const url = computed(() => {
  const { token, holder } = props
  return isNative(token.address) ? getAccountUrl(token.chainId, holder) : getHolderUrl(token.chainId, token.address, holder)
})
</script>
