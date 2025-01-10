<template>
  <ActionModal v-model="modelValue">
    <ZSpender :chain-id="data.chainId" :address="data.spender" />
    <div class="mt-4 flex-center gap-1 overflow-hidden">
      <ZPoolIcon :pool="data.pool" />
      <ZBalance :value="data.amount" />
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from 'vue'
import ActionModal from '@/components/ActionModal/index.vue'
import ZPoolIcon from '@/components/ZPoolIcon.vue'
import ZBalance from '@/components/ZBalance.vue'
import ZSpender from '@/components/ZSpender.vue'

/** @type {import('vue').ModelRef<import('@/types').ApprovalLiquidtyAction>} */
const modelValue = defineModel({ type: Object, required: true })

const data = computed(() => modelValue.value.data)
</script>
