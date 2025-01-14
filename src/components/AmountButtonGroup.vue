<template>
  <div class="flex gap-2 sm:gap-4">
    <ZGhostButton v-for="item, index in items" :key="index" class="flex-1 !h-7 sm:!h-8 text-xs sm:text-sm" :disabled="!balance" :aria-label="item.label" @click="() => onPick(item.value)">{{ item.label }}</ZGhostButton>
  </div>
</template>

<script setup lang="ts">
import ZGhostButton from '@/components/ZGhostButton.vue'

interface Props {
  balance: bigint
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'pick', amount: bigint): void
}>()

const items = [
  { label: '25%', value: 25n },
  { label: '50%', value: 50n },
  { label: '75%', value: 75n },
  { label: 'MAX', value: 100n },
]

const onPick = (ratio: bigint) => {
  const { balance } = props
  if (!balance) {
    return
  }

  const amount = ratio === 100n ? balance : balance * ratio / 100n
  emit('pick', amount)
}
</script>
