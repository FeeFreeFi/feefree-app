<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between gap-2">
      <n-text class="shrink-0 text-xs" depth="1">{{ label }}</n-text>
      <div class="flex-y-center gap-1 overflow-hidden text-xs">
        <n-text depth="1">Balance</n-text>
        <ZTokenBalance class="!font-normal" :token="token" :balance="balance" :show-symbol="false" />
      </div>
    </div>
    <div class="p-4 flex flex-col bg-card rounded-lg">
      <div class="mb-2 sm:px-2 flex-y-center gap-2">
        <n-input-number v-model:value="amount" class="flex-1 token-input-amount" :min="0" :max="maxAmount" placeholder="0.0" :input-props="{ name: 'give' }" :readonly="!isSupported" :bordered="false" :show-button="false" :on-blur="onInputBlur" />
        <TokenSelectorTrigger :token="token" :disabled="!isSupported" @select="onTriggerSelect" />
      </div>
      <n-divider class="!my-0" />
      <AmountButtonGroup class="mt-3" :balance="balance" @pick="onPickAmount" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import { parseAmount, toAmount } from '@/utils'
import { account } from '@/hooks/useWallet'
import { appChainId } from '@/hooks/useAppState'
import { isSupportChain } from '@/hooks/useManager'
import ZTokenBalance from '@/components/ZTokenBalance.vue'
import AmountButtonGroup from '@/components/AmountButtonGroup.vue'
import TokenSelectorTrigger from '@/components/TokenSelector/TokenSelectorTrigger.vue'

interface Props {
  token?: Token
  balance: bigint
  label: string
}

const props = withDefaults(defineProps<Props>(), {
  token: undefined,
})

const emit = defineEmits<{
  (e: 'change'): void
  (e: 'select'): void
}>()

const modelValue = defineModel<string>({ required: true })

const amount = ref(Number.parseFloat(modelValue.value) || null)
const maxAmount = computed(() => account.value && props.token ? toAmount(props.balance, props.token.decimals) : undefined)
const amountValue = computed(() => props.token ? parseAmount(amount.value || 0, props.token.decimals) : 0n)

const isSupported = computed(() => isSupportChain(appChainId.value))

const onInputBlur = () => {
  if (!isSupported.value) {
    return
  }

  if (!amountValue.value) {
    amount.value = null
    return
  }

  const { token } = props
  modelValue.value = toAmount(amountValue.value, token!.decimals)

  emit('change')
}

const onTriggerSelect = () => {
  emit('select')
}

const onPickAmount = (value: bigint) => {
  const { token } = props
  modelValue.value = toAmount(value, token!.decimals)
  emit('change')
}

onMounted(() => {
  watch(modelValue, () => {
    amount.value = !modelValue.value || modelValue.value === '0' ? null : Number.parseFloat(modelValue.value) || null
  })
})
</script>

<style lang="scss">
.token-input-amount {
  .n-input__input {
    @apply font-medium text-base;
  }
}
</style>
