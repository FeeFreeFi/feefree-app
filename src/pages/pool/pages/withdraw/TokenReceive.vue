<template>
  <div class="flex-y-center justify-between">
    <div class="flex-y-center gap-2 sm:gap-3">
      <ZTokenIcon class="!size-6" :token="token" />
      <n-text class="font-medium text-sm">{{ token.symbol }}</n-text>
    </div>
    <ZTokenBalance :token="token" :balance="balance" :dp="6" :show-symbol="false" />
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import ZTokenIcon from '@/components/ZTokenIcon.vue'

interface Props {
  token: Token
  balance: bigint
}

defineProps<Props>()
</script>
