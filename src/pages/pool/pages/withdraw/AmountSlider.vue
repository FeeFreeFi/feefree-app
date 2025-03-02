<template>
  <n-slider :value="percent" :tooltip="false" :disabled="!balance" :on-update:value="onUpdate">
    <template #thumb>
      <div class="bg-linear-256 from-[#E7E368] hover:from-[#DFDA2D] to-[#41F5CF] hover:to-[#35EDC6] rounded-full size-3" />
    </template>
  </n-slider>
</template>

<script setup lang="ts">
import { fromValue, parseAmount } from '@/utils'

interface Props {
  amount: bigint
  balance: bigint
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'change', value: bigint): void
}>()

const percent = computed(() => props.balance ? fromValue(props.amount).times(100).div(props.balance.toString(10)).toNumber() : 0)

const onUpdate = (ratio: number) => {
  const { balance } = props
  if (!balance) {
    return
  }

  const value = parseAmount(fromValue(ratio).times(balance.toString(10)).div(100), 0)
  emit('change', value)
}
</script>
