<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center flex-col gap-3">
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data.pool.currency0" />
        <ZTokenBalance class="!font-normal" :token="data.pool.currency0" :balance="data.amount0Min" :sign="true" />
      </div>
      <i-ff-unpair class="size-6" />
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data.pool.currency1" />
        <ZTokenBalance class="!font-normal" :token="data.pool.currency1" :balance="data.amount1Min" :sign="true" />
      </div>
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from "vue"
import ActionModal from "@/components/ActionModal/index.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"

/** @type {import('vue').ModelRef<import('@/types').RemoveLiquidityAction>} */
const modelValue = defineModel({ type: Object, required: true })

const data = computed(() => modelValue.value.data)
</script>
