<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center" v-if="!isFail">
      <ZTokenBalance class="!font-normal text-basic/90" :token="ETH" :balance="data.amount" :dp="8" />
    </div>
    <div v-else class="flex-center">
      <n-text depth="1">{{ modelValue.error }}</n-text>
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from "vue"
import ActionModal from "@/components/ActionModal/index.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import { ETH } from "@/hooks/useCurrency"

/**
 * @type {import('vue').ModelRef<import('@/types').ClaimAction>}
 */
 const modelValue = defineModel({
  type: Object,
  required: true,
})

const state = computed(() => modelValue.value.state || "initial")
const data = computed(() => modelValue.value.data)

const isFail = computed(() => state.value === "fail")
</script>
