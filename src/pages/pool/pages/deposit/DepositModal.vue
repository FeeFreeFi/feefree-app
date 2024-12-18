<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center flex-col gap-3">
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data.pool.currency0" />
        <ZTokenBalance class="!font-normal text-basic/90" :token="data.pool.currency0" :balance="data.amount0Max" />
      </div>
      <i-ff-pair class="size-6" />
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data.pool.currency1" />
        <ZTokenBalance class="!font-normal text-basic/90" :token="data.pool.currency1" :balance="data.amount1Max" />
      </div>
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from "vue"
import ActionModal from "@/components/ActionModal/index.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"

/** @type {import('vue').ModelRef<import('@/types').AddLiquidityAction>} */
const modelValue = defineModel({ type: Object, required: true })

const data = computed(() => modelValue.value.data)
</script>
