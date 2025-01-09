<template>
  <n-slider :value="percent" :tooltip="false" :disabled="!balance" :on-update:value="onUpdate">
    <template #thumb>
      <div class="size-3 rounded-full bg-primary-gradient hover:bg-primary-gradient-hover" />
    </template>
  </n-slider>
</template>

<script setup>
import { fromValue, parseAmount } from "@/utils"
import { computed } from "vue"

const props = defineProps({
  amount: {
    /**
     * @type {import('vue').PropType<bigint>}
     */
    type: BigInt,
    required: true,
  },
  balance: {
    /**
     * @type {import('vue').PropType<bigint>}
     */
    type: BigInt,
    required: true,
  },
})

const emit = defineEmits(["change"])

const percent = computed(() => props.balance ? fromValue(props.amount).times(100).div(props.balance).toNumber() : 0)

const onUpdate = ratio => {
  const { balance } = props
  if (!balance) {
    return
  }

  const value = parseAmount(fromValue(ratio).times(balance).div(100), 0)
  emit("change", value)
}
</script>
