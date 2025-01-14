<template>
  <ActionModal v-model="modelValue">
    <ZSpender :chain-id="data!.chainId" :address="data!.spender" />
    <div class="mt-4 flex-center gap-1 overflow-hidden">
      <ZTokenIcon :token="data!.token" />
      <ZTokenBalance class="!font-normal text-basic/90" :token="data!.token" :balance="data!.amount" />
    </div>
  </ActionModal>
</template>

<script setup lang="ts">
import type { ApprovalAction } from '@/types'
import ActionModal from '@/components/ActionModal/index.vue'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import ZSpender from '@/components/ZSpender.vue'

const modelValue = defineModel<ApprovalAction>({ required: true })

const data = computed(() => modelValue.value.data)
</script>
