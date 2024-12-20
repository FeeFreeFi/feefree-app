<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center flex-col gap-3">
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data.inputToken" />
        <ZTokenBalance class="!font-normal" :token="data.inputToken" :balance="data.amountIn" :sign="false" />
      </div>
      <i-mdi-chevron-double-down class="size-5 text-primary" />
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data.outputToken" />
        <ZTokenBalance class="!font-normal" :token="data.outputToken" :balance="data.amountOut" :sign="true" />
      </div>
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from "vue"
import ActionModal from "@/components/ActionModal/index.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"

/** @type {import('vue').ModelRef<import('@/types').SwapAction>} */
const modelValue = defineModel({ type: Object, required: true })

const data = computed(() => modelValue.value.data)
</script>
