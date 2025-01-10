<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center">
      <ZTokenBalance class="!font-normal text-basic/90" :token="getNativeToken(data.chainId)" :balance="data.reward.amount" :dp="8" />
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from 'vue'
import { getNativeToken } from '@/hooks/useToken'
import ActionModal from '@/components/ActionModal/index.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'

/** @type {import('vue').ModelRef<import('@/types').ClaimAction>} */
const modelValue = defineModel({ type: Object, required: true })

const data = computed(() => modelValue.value.data)
</script>
