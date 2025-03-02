<template>
  <ActionModal v-model="modelValue">
    <ZSpender :chain-id="data!.chainId" :address="data!.spender" />
    <div class="flex-center gap-1 mt-4 overflow-hidden">
      <ZPoolIcon :pool="data!.pool" />
      <ZBalance :value="data!.amount" />
    </div>
  </ActionModal>
</template>

<script setup lang="ts">
import type { ApprovalLiquidtyAction } from '@/types'
import ActionModal from '@/components/ActionModal/index.vue'
import ZPoolIcon from '@/components/ZPoolIcon.vue'
import ZBalance from '@/components/ZBalance.vue'
import ZSpender from '@/components/ZSpender.vue'

const modelValue = defineModel<ApprovalLiquidtyAction>({ required: true })

const data = computed(() => modelValue.value.data)
</script>
