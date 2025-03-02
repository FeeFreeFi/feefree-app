<template>
  <div class="flex flex-col gap-3 bg-card lg:bg-section p-4 rounded">
    <div class="flex-y-center justify-between gap-2">
      <n-input-number v-model:value="amount" class="flex-1" :min="0" :max="maxAmount" :bordered="false" placeholder="0.0" :input-props="{ name: `${token.symbol} amount` }" :show-button="false" :on-blur="onInputBlur" />
      <div class="flex justify-end w-24">
        <div class="flex-center gap-1">
          <ZTokenIcon :token="token" />
          <n-text class="font-medium text-sm">{{ token.symbol }}</n-text>
        </div>
      </div>
    </div>
    <n-divider class="!my-0" />
    <div class="flex-y-center justify-between gap-2">
      <n-button class="text-xs" type="primary" text :disabled="!balance" @click="onMax">MAX</n-button>
      <div class="flex-y-center gap-1 overflow-hidden text-xs">
        <n-text depth="1">Balance</n-text>
        <ZTokenBalance class="!font-normal text-font" :token="token" :balance="balance" :show-symbol="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Token } from '@/types'
import { fromValue, parseAmount, toAmount } from '@/utils'
import { account } from '@/hooks/useWallet'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import ZTokenBalance from '@/components/ZTokenBalance.vue'

interface Props {
  token: Token
  balance: bigint
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'change'): void
}>()

const modelValue = defineModel<string>({ required: true })

const amount = ref<number | null>(fromValue(modelValue.value || 0).toNumber())
const maxAmount = computed(() => account.value ? toAmount(props.balance, props.token.decimals) : undefined)
const amountValue = computed(() => parseAmount(amount.value || 0, props.token.decimals))

const onMax = () => {
  const { balance, token } = props
  modelValue.value = toAmount(balance, token.decimals)
  emit('change')
}

const onInputBlur = () => {
  if (!amountValue.value) {
    amount.value = 0
    return
  }

  const { token } = props
  modelValue.value = toAmount(amountValue.value, token.decimals)
  emit('change')
}

onMounted(() => {
  watch(modelValue, () => {
    amount.value = fromValue(modelValue.value || 0).toNumber()
  })
})
</script>
