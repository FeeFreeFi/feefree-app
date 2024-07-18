<template>
  <div class="p-4 flex flex-col gap-4 bg-card lg:bg-section rounded-lg">
    <div class="rounded flex flex-col bg-block">
      <div class="flex-y-center gap-2">
        <n-input-number class="flex-1" v-model:value="amount" :min="0" :max="maxAmount" placeholder="0.0" :bordered="false" :show-button="false" :on-blur="onInputBlur" />
        <i-my-position class="size-6" />
      </div>
      <n-divider class="!my-0" />
      <div class="mt-3 flex-y-center justify-end">
        <div class="flex-y-center gap-1 overflow-hidden">
          <n-text class="text-xs" depth="1">Balance</n-text>
          <ZTokenBalance class="text-basic-1 !font-normal text-xs" :token="token" :balance="balance" :show-symbol="false" />
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
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue"
import { account } from "@/hooks/useWallet"
import { parseAmount, toAmount } from "@/utils/bn"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import AmountButtonGroup from "@/components/AmountButtonGroup.vue"
import AmountSlider from "./AmountSlider.vue"

const modelValue = defineModel({ type: String, required: true })

const props = defineProps({
  token: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
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
const emit = defineEmits(["change"])

const amount = ref(modelValue.value)
const maxAmount = computed(() => account.value ? toAmount(props.balance, props.token.decimals) : undefined)
const amountValue = computed(() => parseAmount(amount.value || 0, props.token.decimals))

const onInputBlur = () => {
  if (!amountValue.value) {
    amount.value = null
    // return
  }

  const { token } = props
  modelValue.value = toAmount(amountValue.value, token.decimals)
  emit("change")
}

const onSliderChange = value => {
  const { token } = props
  modelValue.value = toAmount(value, token.decimals)
  emit("change")
}

const onPickAmount = value => {
  const { token } = props
  modelValue.value = toAmount(value, token.decimals)
  emit("change")
}

onMounted(() => {
  const stopWatch = watch(modelValue, () => {
    amount.value = !modelValue.value || modelValue.value === '0' ? '' : modelValue.value
  })

  onBeforeUnmount(stopWatch)
})
</script>
