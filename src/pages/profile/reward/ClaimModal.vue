<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center">
      <ZTokenBalance class="!font-normal text-basic/90" :token="getNativeToken(data!.chainId)" :balance="data!.reward.amount" :dp="8" />
    </div>
  </ActionModal>
</template>

<script setup lang="ts">
import type { ClaimAction } from '@/types'
import { getNativeToken } from '@/hooks/useToken'
import ActionModal from '@/components/ActionModal/index.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'

const modelValue = defineModel<ClaimAction>({ required: true })

const data = computed(() => modelValue.value.data)
</script>
