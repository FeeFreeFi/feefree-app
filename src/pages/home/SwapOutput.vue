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
            <!-- <ZTokenBalance class="!font-normal text-basic-1" :token="gasToken" :balance="fee" :dp="9" />
            <n-text depth="1">(${{ feeValue }})</n-text> -->
            <n-text depth="1">${{ feeValue }}</n-text>
          </div>
        </div>
      </div>
      <div v-if="isSupported && quote && showValueWarning" class="h-12 px-4 sm:px-6 flex items-center justify-between gap-2 bg-card rounded-lg">
        <div class="flex-y-center">
          <div class="flex-y-center gap-1">
            <ZTokenIcon :token="inputToken" />
            <ZTokenSymbol v-if="screen.sm" class="!font-normal" :symbol="inputToken.symbol" />
            <n-text class="font-medium text-warning">(${{ formatPrice(inputValue) }})</n-text>
          </div>
          <i-mdi-chevron-double-right class="size-4 mx-2 text-basic" />
          <div class="flex-y-center gap-2">
            <ZTokenIcon :token="outputToken" />
            <ZTokenSymbol v-if="screen.sm" class="!font-normal" :symbol="outputToken.symbol" />
            <n-text class="font-medium text-warning">(${{ formatPrice(outputValue) }})</n-text>
          </div>
        </div>
        <i-ion-warning class="size-5 text-warning" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { byDecimals, fromValue } from "@/utils/bn"
import formatPrice from "@/utils/formatPrice"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { isSupportChain } from "@/hooks/useExchange"
import { getFee } from "@/hooks/useRouter"
import { screen } from "@/hooks/useScreen"
import { getNativeCurrency } from "@/hooks/useChains"
import { getPrice } from "@/hooks/usePrices"
import TokenPrice from "@/components/TokenPrice.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import TokenSelectorTrigger from "@/components/TokenSelector/TokenSelectorTrigger.vue"
import ZTokenSymbol from "@/components/ZTokenSymbol.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"

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

const isSupported = computed(() => isSupportChain(selectedChainId.value))

const fee = computed(() => props.outputToken ? getFee(props.outputToken.chainId) : 0n)
const gasToken = computed(() => props.outputToken ? getNativeCurrency(props.outputToken.chainId) : null)
const feeValue = computed(() => gasToken.value ? fromValue(getPrice(gasToken.value.symbol)).times(fee.value).div(1e18).dp(4).toNumber() : 0)

const price = computed(() => {
  const { quote, inputToken, outputToken } = props
  if (!quote) {
    return 0
  }

  const { amountIn, amountOut } = quote
  const input = byDecimals(amountIn, inputToken.decimals)
  const output = byDecimals(amountOut, outputToken.decimals)

  return output.div(input).toNumber()
})

const inputValue = computed(() => {
  const { quote, inputToken } = props
  if (!quote) {
    return 0
  }

  const { symbol, decimals, dp } = inputToken
  return byDecimals(quote.amountIn, decimals).times(getPrice(symbol)).dp(dp).toNumber()
})
const outputValue = computed(() => {
  const { quote, outputToken } = props
  if (!quote) {
    return 0
  }

  const { symbol, decimals, dp } = outputToken
  return byDecimals(quote.amountOut, decimals).times(getPrice(symbol)).dp(dp).toNumber()
})
const showValueWarning = computed(() => {
  if (outputValue.value > inputValue.value) {
    return false
  }

  return outputValue.value === 0 || (inputValue.value - outputValue.value) > 0.05 * inputValue.value
})

const onTriggerSelect = () => {
  emit("select")
}
</script>
