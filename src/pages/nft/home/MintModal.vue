<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center" v-if="!isFail">
      <n-text depth="1">{{ data.nft.label }}</n-text>
    </div>
    <div v-else class="flex-center">
      <n-text depth="1">{{ modelValue.error }}</n-text>
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from "vue"
import ActionModal from "@/components/ActionModal/index.vue"

/**
 * @type {import('vue').ModelRef<import('@/types').MintAction>}
 */
 const modelValue = defineModel({
  type: Object,
  required: true,
})

const state = computed(() => modelValue.value.state || "initial")
const data = computed(() => modelValue.value.data)

const isFail = computed(() => state.value === "fail")
</script>
