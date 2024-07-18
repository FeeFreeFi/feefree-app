<template>
  <div class="flex flex-col gap-3">
    <div class="flex justify-between gap-2">
      <n-text depth="1">Give</n-text>
      <div class="flex-y-center gap-1 overflow-hidden">
        <n-text depth="1">Balance</n-text>
        <ZTokenBalance class="!font-normal" :token="token" :balance="balance" :show-symbol="false" />
      </div>
    </div>
    <div class="p-4 flex flex-col bg-card rounded-lg">
      <div class="mb-2 sm:px-2 flex-y-center gap-2">
        <n-input-number class="flex-1 swap-amount-input" v-model:value="amount" :min="0" :max="maxAmount" placeholder="0.0" :readonly="!isSupported" :bordered="false" :show-button="false" :on-blur="onInputBlur" />
        <TokenSelectorTrigger :token="token" :disabled="!isSupported" @select="onTriggerSelect" />
      </div>
      <n-divider class="!my-0" />
      <AmountButtonGroup class="mt-3" :balance="balance" @pick="onPickAmount" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue"
import { parseAmount, toAmount } from "@/utils/bn"
import { account } from "@/hooks/useWallet"
import { isSupportChain } from "@/hooks/useExchange"
import { selectedChainId } from "@/hooks/useSelectedChain"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import AmountButtonGroup from "@/components/AmountButtonGroup.vue"
import TokenSelectorTrigger from "@/components/TokenSelector/TokenSelectorTrigger.vue"

const modelValue = defineModel({ type: String, required: true })

const props = defineProps({
  token: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    default: () => null,
  },
  balance: {
    /**
     * @type {import('vue').PropType<bigint>}
     */
    type: BigInt,
    required: true,
  },
})
const emit = defineEmits(["change", "select"])

const amount = ref(parseFloat(modelValue.value) || null)
const maxAmount = computed(() => account.value && props.token ? toAmount(props.balance, props.token.decimals) : undefined)
const amountValue = computed(() => props.token ? parseAmount(amount.value || 0, props.token.decimals) : 0n)

const isSupported = computed(() => isSupportChain(selectedChainId.value))

const onInputBlur = () => {
  if (!isSupported.value) {
    return
  }

  if (!amountValue.value) {
    amount.value = null
    // return
  }

  const { token } = props
  modelValue.value = toAmount(amountValue.value, token.decimals)

  emit("change")
}

const onTriggerSelect = () => {
  emit("select")
}

const onPickAmount = value => {
  const { token } = props
  modelValue.value = toAmount(value, token.decimals)
  emit("change")
}

onMounted(() => {
  const stopWatch = watch(modelValue, () => {
    amount.value = !modelValue.value || modelValue.value === '0' ? null : parseFloat(modelValue.value) || null
  })

  onBeforeUnmount(stopWatch)
})
</script>

<style lang="scss">
.swap-amount-input {
  .n-input__input {
    @apply font-medium text-base;
  }
}
</style>
