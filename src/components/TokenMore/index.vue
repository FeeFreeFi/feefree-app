<template>
  <ZModalWrapper :show="state.show" :on-close="onClose" modal-class="w-[400px]">
    <TokenMoreView :token="state.token!" :on-close="onClose" />
  </ZModalWrapper>
</template>

<script setup lang="ts">
import { state, onClose } from '@/hooks/useTokenMore'
import ZModalWrapper from '@/components/ZModalWrapper.vue'
import TokenMoreView from './TokenMoreView.vue'
</script>
