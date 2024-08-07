<template>
  <div class="flex flex-col gap-3">
    <div class="flex justify-between gap-2">
      <n-text depth="1">Receive</n-text>
      <div class="flex-y-center gap-1 overflow-hidden">
        <n-text depth="1">Balance</n-text>
        <ZTokenBalance class="!font-normal" :token="outputToken" :balance="outputBalance" :show-symbol="false" />
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <div class="py-3 px-4 sm:px-6 flex-y-center justify-between bg-card rounded-lg">
        <ZTokenBalance v-if="quote" class="!font-medium text-base" :token="outputToken" :balance="quote.amountOut" :show-symbol="false" />
        <n-text v-else class="font-medium text-base" depth="1">0.0</n-text>
        <TokenSelectorTrigger :token="outputToken" :disabled="!isSupported" @select="onTriggerSelect" />
      </div>
      <div v-if="isSupported && quote" class="sm:h-[52px] py-3 px-4 sm:px-6 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between bg-card rounded-lg">
        <TokenPrice :input-token="inputToken" :output-token="outputToken" :price="price" />
        <n-divider v-if="screen.lt.sm" class="!my-0" />
        <div class="flex-y-center gap-2">
          <i-my-fee class="size-4" />
          <div class="flex-y-center gap-1">
            <n-text depth="1">${{ feeValue }}</n-text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { byDecimals, fromValue } from "@/utils/bn"
import { appChainId } from "@/hooks/useAppState"
import { isSupportChain } from "@/hooks/useSwap"
import { getFee } from "@/hooks/useRouter"
import { screen } from "@/hooks/useScreen"
import { getNativeCurrency } from "@/hooks/useChains"
import { getPrice } from "@/hooks/usePrices"
import TokenPrice from "@/components/TokenPrice.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import TokenSelectorTrigger from "@/components/TokenSelector/TokenSelectorTrigger.vue"

const props = defineProps({
  inputToken: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
  outputToken: {
    /**
     * @type {import('vue').PropType<import('@/types').Token>}
     */
    type: Object,
    required: true,
  },
  outputBalance: {
    /**
     * @type {import('vue').PropType<bigint>}
     */
    type: BigInt,
    required: true,
  },
  quote: {
    /**
     * @type {import('vue').PropType<import('@/types').SwapQuoteData>}
     */
    type: Object,
    default: () => null,
  },
})
const emit = defineEmits(["select"])

// const showValueChange = ref(true)
const isSupported = computed(() => isSupportChain(appChainId.value))

const fee = computed(() => props.outputToken ? getFee(props.outputToken.chainId) : 0n)
const gasToken = computed(() => props.outputToken ? getNativeCurrency(props.outputToken.chainId) : null)
const feeValue = computed(() => gasToken.value ? fromValue(getPrice(gasToken.value.symbol)).times(fee.value).div(1e18).dp(4).toNumber() : 0)
const amountIn = computed(() => props.quote?.amountIn || 0n)
const amountOut = computed(() => props.quote?.amountOut || 0n)

const price = computed(() => {
  const { quote, inputToken, outputToken } = props
  if (!quote) {
    return 0
  }

  const input = byDecimals(amountIn.value, inputToken.decimals)
  const output = byDecimals(amountOut.value, outputToken.decimals)

  return output.div(input).toNumber()
})

const onTriggerSelect = () => {
  emit("select")
}
</script>
