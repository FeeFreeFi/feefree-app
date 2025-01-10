<template>
  <div class="p-4 flex flex-col gap-4 bg-card lg:bg-section rounded-lg">
    <div class="rounded flex flex-col bg-block">
      <div class="flex-y-center gap-2">
        <n-input-number v-model:value="amount" class="flex-1" :min="0" :max="maxAmount" placeholder="0.0" :bordered="false" :show-button="false" :on-blur="onInputBlur" />
        <i-ff-position class="size-6" />
      </div>
      <n-divider class="!my-0" />
      <div class="mt-3 flex-y-center justify-between">
        <ZPoolIcon :pool="pool" />
        <div class="flex-y-center gap-1 overflow-hidden text-xs">
          <n-text depth="1">Balance</n-text>
          <ZBalance class="text-basic-1 !font-normal" :value="balance" />
        </div>
      </div>
      <div class="py-4">
        <AmountSlider :balance="balance" :amount="amountValue" @change="onSliderChange" />
      </div>
      <AmountButtonGroup :balance="balance" @pick="onPickAmount" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { account } from '@/hooks/useWallet'
import { fromValue, parseAmount, toAmount } from '@/utils'
import ZBalance from '@/components/ZBalance.vue'
import AmountButtonGroup from '@/components/AmountButtonGroup.vue'
import AmountSlider from './AmountSlider.vue'
import ZPoolIcon from '@/components/ZPoolIcon.vue'

const props = defineProps({
  pool: {
    /**
     * @type {import('vue').PropType<import('@/types').PoolMeta>}
     */
    type: Object,
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

const emit = defineEmits(['change'])

const modelValue = defineModel({ type: String, required: true })

const amount = ref(fromValue(modelValue.value || 0).toNumber())
const maxAmount = computed(() => account.value ? toAmount(props.balance, 0) : undefined)
const amountValue = computed(() => parseAmount(amount.value || 0, 0))

const onInputBlur = () => {
  if (!amountValue.value) {
    amount.value = null
    return
  }

  modelValue.value = toAmount(amountValue.value, 0)
  emit('change')
}

const onSliderChange = value => {
  modelValue.value = toAmount(value, 0)
  emit('change')
}

const onPickAmount = value => {
  modelValue.value = toAmount(value, 0)
  emit('change')
}

onMounted(() => {
  watch(modelValue, () => {
    amount.value = fromValue(modelValue.value || 0).toNumber()
  })
})
</script>
