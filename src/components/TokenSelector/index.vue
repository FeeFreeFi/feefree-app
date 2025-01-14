<template>
  <ZModalWrapper :show="show" :on-close="onClose" modal-class="w-[400px]">
    <TokenSelectorView :current="current" :on-select="onSelect" :on-close="onClose">
      <template #token="{ token }">
        <slot name="token" :token="token" />
      </template>
    </TokenSelectorView>
  </ZModalWrapper>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import ZModalWrapper from '@/components/ZModalWrapper.vue'
import TokenSelectorView from './TokenSelectorView.vue'

interface Props {
  current?: Token
  onSelect: (token: Token) => void
}

defineProps<Props>()

const show = defineModel<boolean>('show', { default: false })

const onClose = () => {
  show.value = false
}
</script>
