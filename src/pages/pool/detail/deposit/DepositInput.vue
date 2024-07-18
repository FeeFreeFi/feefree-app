<template>
  <div class="p-4 rounded flex flex-col gap-3 bg-card lg:bg-section">
    <div class="flex-y-center justify-between gap-2">
      <div class="flex w-24">
        <ZToken :token="token" />
      </div>
      <n-input-number class="flex-1 text-right" v-model:value="amount" :min="0" :max="maxAmount" :bordered="false" placeholder="0.0" :show-button="false" :on-blur="onInputBlur" />
    </div>
    <n-divider class="!my-0" />
    <div class="flex-y-center justify-between gap-2">
      <div class="flex-y-center gap-1 overflow-hidden">
        <n-text depth="1">Balance</n-text>
        <ZTokenBalance class="text-basic-1 !font-normal" :token="token" :balance="balance" :show-symbol="false" />
      </div>
      <n-button type="primary" text :disabled="!balance" @click="onMax">MAX</n-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue"
import { parseAmount, toAmount } from "@/utils/bn"
import { account } from "@/hooks/useWallet"
import ZToken from '@/components/ZToken.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'

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

const onMax = () => {
  const { balance, token } = props
  modelValue.value = toAmount(balance, token.decimals)
  emit("change")
}

const onInputBlur = () => {
  if (!amountValue.value) {
    amount.value = null
    return
  }

  const { token } = props
  modelValue.value = toAmount(amountValue.value, token.decimals)
  emit("change")
}

onMounted(() => {
  const stopWatch = watch(modelValue, () => {
    amount.value = modelValue.value
  })

  onBeforeUnmount(stopWatch)
})
</script>
