<template>
  <ActionModal v-model="modelValue">
    <div class="flex flex-col" v-if="!isFail">
      <div class="flex-center gap-1">
        <div class="flex-center gap-1 overflow-hidden">
          <ZTokenIcon :token="data.inputToken" />
          <ZTokenBalance class="!font-normal text-basic/90" :token="data.inputToken" :balance="data.amountIn" />
        </div>
        <RightArrow />
        <div class="flex-center gap-1 overflow-hidden">
          <ZTokenIcon :token="data.outputToken" />
          <ZTokenBalance class="!font-normal text-basic/90" :token="data.outputToken" :balance="data.amountOut" />
        </div>
      </div>
    </div>
    <div v-else class="flex-center">
      <n-text depth="1">{{ modelValue.error }}</n-text>
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from "vue"
import ActionModal from "@/components/ActionModal/index.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import RightArrow from "@/components/Arrow/RightArrow.vue"

/**
 * @type {import('vue').ModelRef<import('@/types').ExchangeAction>}
 */
 const modelValue = defineModel({
  type: Object,
  required: true,
})

const state = computed(() => modelValue.value.state || "initial")
const data = computed(() => modelValue.value.data)

const isFail = computed(() => state.value === "fail")
</script>
