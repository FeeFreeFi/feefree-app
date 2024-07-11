<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center gap-1" v-if="!isFail">
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data.currency0" />
        <ZTokenBalance class="!font-normal text-basic/90" :token="data.currency0" :balance="data.amount0" />
      </div>
      <n-text>and</n-text>
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data.currency1" />
        <ZTokenBalance class="!font-normal text-basic/90" :token="data.currency1" :balance="data.amount1" />
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

/**
 * @type {import('vue').ModelRef<import('@/types').DepositAction>}
 */
 const modelValue = defineModel({
  type: Object,
  required: true,
})

const state = computed(() => modelValue.value.state || "initial")
const data = computed(() => modelValue.value.data)

const isFail = computed(() => state.value === "fail")
</script>
