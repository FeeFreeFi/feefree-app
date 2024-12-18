<template>
  <ActionModal v-model="modelValue">
    <div class="flex-center flex-col gap-3">
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data.token0" />
        <ZTokenBalance class="!font-normal text-basic/90" :token="data.token0" :balance="data.amount0" />
      </div>
      <i-ff-pair class="size-6" />
      <div class="flex-center gap-1 overflow-hidden">
        <ZTokenIcon :token="data.token1" />
        <ZTokenBalance class="!font-normal text-basic/90" :token="data.token1" :balance="data.amount1" />
      </div>
    </div>
  </ActionModal>
</template>

<script setup>
import { computed } from "vue"
import ActionModal from "@/components/ActionModal/index.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"

/** @type {import('vue').ModelRef<import('@/types').CreateAction>}*/
const modelValue = defineModel({ type: Object, required: true })

const data = computed(() => modelValue.value.data)
</script>
