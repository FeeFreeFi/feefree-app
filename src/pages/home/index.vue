<template>
  <div class="relative overflow-hidden mx-auto my-4 sm:my-8 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20" :id="containerId.slice(1)">
    <div class="flex flex-col">
      <n-text class="text-lg font-medium">Swap</n-text>
      <SwapInput class="mt-4 sm:mt-8" v-model="inputAmount" :token="inputToken" :balance="inputBalance" @change="onAmountChange" @select="onSelectInputToken" />
      <ReverseButton class="my-3" :disabled="!isSupported" @reverse="onReverse" />
      <SwapOutput :input-token="inputToken" :output-token="outputToken" :output-balance="outputBalance" :quote="quoteData" @select="onSelectOutputToken" />
      <div class="mt-10">
        <ActionButton :chain-id="inputToken?.chainId" :chains="supportedChains">
          <ZButton v-if="!isInputValid" class="h-10 sm:h-12 w-full" :aria-label="inputHint">{{ inputHint }}</ZButton>
          <ZButton v-else-if="approvalChecking" class="h-10 sm:h-12 w-full" loading aria-label="Checking for Approval">Checking for Approval</ZButton>
          <ZButton v-else-if="!approved" class="h-10 sm:h-12 w-full" :disabled="approving" :loading="approving" :aria-label="`Unlock ${inputToken.symbol}`" @click="onApproval">Unlock {{ inputToken.symbol }}</ZButton>
          <ZButton v-else class="h-10 sm:h-12 w-full" :disabled="!quoteData" :loading="swaping || exchanging" aria-label="Swap" @click="onSwap">Swap</ZButton>
        </ActionButton>
      </div>
      <RecipientAddress class="mt-4" v-model="recipient" :to="containerId" />
    </div>
    <TokenSelector v-model:show="showTokenSelector" :current="currentToken" :tokens="allTokens" :on-select="onSelectToken" />
    <ApproveModal v-model="approveAction" />
    <SwapModal v-model="swapAction" />
    <ExchangeModal v-model="exchangeAction" />
    <ValueChangeModal v-model="valueChangeAction" :on-confirm="swap" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useNotification } from "naive-ui"
import { useRoute, useRouter } from "vue-router"
import debounce from "lodash-es/debounce"
import { parseAmount } from "@/utils/bn"
import uuid from "@/utils/uuid"
import { account, updateNativeBalance } from "@/hooks/useWallet"
import { createBalanceStates2 } from "@/hooks/useBalances"
import { getPublicClient } from "@/hooks/useClient"
import { createPriceState } from "@/hooks/usePrices"
import { isNative, isSame } from "@/hooks/useCurrency"
import { appChainId, syncRouteChain } from "@/hooks/useAppState"
import { createInterval } from "@/hooks/useTimer"
import { findSwapOtherToken, findPaths, quoteSwap, getSupportedChains, isSupportChain, checkValueChange, getChainTokens, findExchangeOtherToken, isExchangeToken, isSwapToken } from "@/hooks/useSwap"
import { getFee, getRouterAddress } from "@/hooks/useRouter"
import { doApproval, doCheckAllowance, doCheckApproval, doExchange, doSwap } from "@/hooks/useInteraction"
import TokenSelector from "@/components/TokenSelector/index.vue"
import RecipientAddress from "@/components/RecipientAddress/index.vue"
import ActionButton from "@/components/ActionButton.vue"
import ZButton from "@/components/ZButton.vue"
import ApproveModal from '@/components/ActionModal/ApproveModal.vue'
import ReverseButton from "@/components/ReverseButton.vue"
import SwapInput from "./SwapInput.vue"
import SwapOutput from "./SwapOutput.vue"
import SwapModal from "./SwapModal.vue"
import ExchangeModal from "./ExchangeModal.vue"
import ValueChangeModal from "./ValueChangeModal.vue"
import { getChainIdByKey, getChainKey, getNativeCurrency } from "@/hooks/useChains"

const containerId = `#el-${uuid()}`
const route = useRoute()
const router = useRouter()

syncRouteChain()

createPriceState()

const notification = useNotification()

const supportedChains = getSupportedChains()
const isSupported = computed(() => isSupportChain(appChainId.value))

const allTokens = computed(() => getChainTokens(appChainId.value))

/**
 * @type {import('vue').Ref<import('@/types').Token>}
 */
const inputToken = ref(allTokens.value[0])
/**
 * @type {import('vue').Ref<import('@/types').Token>}
 */
const outputToken = ref(allTokens.value[1])

const isExchangeMode = computed(() => inputToken.value && outputToken.value && isSame(findExchangeOtherToken(inputToken.value), outputToken.value))

const swapPaths = computed(() => isExchangeMode.value ? null : findPaths(inputToken.value, outputToken.value))

const isForInput = ref(true)
const currentToken = computed(() => isForInput.value ? inputToken.value : outputToken.value)

const inputOutputTokens = computed(() => [inputToken.value, outputToken.value])
const { states: balanceStates, update: updateTokenBalances } = createBalanceStates2(account, inputOutputTokens)
const inputBalance = computed(() => balanceStates.value[0])
const outputBalance = computed(() => balanceStates.value[1])

const inputAmount = ref("")

/**
 * @type {import('vue').Ref<import('@/types').SwapQuoteData>}
 */
 const quoteData = ref(null)

const amountIn = computed(() => inputToken.value ? parseAmount(inputAmount.value || 0, inputToken.value.decimals) : 0n)

const inputHint = computed(() => {
  if (!amountIn.value) {
    return "Please enter amount"
  }

  if (amountIn.value > inputBalance.value) {
    return `${inputToken.value.symbol} insufficient balance`
  }

  return ""
})
const isInputValid = computed(() => {
  return amountIn.value && amountIn.value <= inputBalance.value
})

const showTokenSelector = ref(false)
const recipient = ref('')

const approveAction = ref({ show: false })
const approved = ref(false)
const approvalChecking = ref(false)
const approving = ref(false)
const checkAllowance = () => doCheckAllowance(approved, inputToken.value, account.value, getRouterAddress(inputToken.value.chainId), amountIn.value)
const onCheckApproval = async () => {
  if (isExchangeMode.value && isExchangeToken(inputToken.value)) {
    approvalChecking.value = false
    approved.value = true
    return
  }

  await doCheckApproval(approvalChecking, checkAllowance)
}
const onApproval = async () => {
  const spender = getRouterAddress(inputToken.value.chainId)
  const success = await doApproval(approveAction, approving, inputToken.value, spender, amountIn.value)
  if (success) {
    checkAllowance()
    updateNativeBalance()
  }
}

const swaping = ref(false)
const swapAction = ref({ show: false })
const exchanging = ref(false)
const exchangeAction = ref({ show: false })

const valueChangeAction = ref({ show: false })

const handleRoute = () => {
  let { chain, input, output } = route.query

  let chainId = getChainIdByKey(chain)
  if (!chainId) {
    chainId = appChainId.value
    chain = getChainKey(chainId)

    const tokens = getChainTokens(chainId)
    inputToken.value = tokens[0]
    outputToken.value = tokens[1]
  } else if(!isSupportChain(chainId)) {
    inputToken.value = null
    outputToken.value = null
  } else {
    const tokens = getChainTokens(chainId)
    const nativeSymbol = getNativeCurrency(chainId).symbol
    let token1 = input === nativeSymbol ? tokens[0] : (tokens.find(it => it.address === input) || tokens[0])
    let token2 = output === nativeSymbol ? tokens[0] : (tokens.find(it => it.address === output) || tokens[0])
    if (isSame(token1, token2)) {
      token2 = isSame(token1, tokens[0]) ? tokens[1] : tokens[0]
    }

    inputToken.value = token1
    outputToken.value = token2
  }

  updateTokenBalances(true)
  updateRouteForInputOutput()
}

const reset = () => {
  approved.value = false
  approvalChecking.value = false
  approving.value = false
  swaping.value = false
  exchanging.value = false

  inputAmount.value = ""
  recipient.value = ""
  quoteData.value = null
  showTokenSelector.value = false
  isForInput.value = true
}

const updateQuoteData = async () => {
  if (isExchangeMode.value) {
    return
  }

  if (swapPaths.value.length === 0 || !amountIn.value) {
    quoteData.value = null
    return
  }

  const paths = swapPaths.value[0].map(p => p.address)
  const amountSpecified = -amountIn.value
  const id = inputToken.value.chainId
  const publicClient = getPublicClient(id)
  const address = getRouterAddress(id)

  try {
    quoteData.value = await quoteSwap(publicClient, address, paths, amountSpecified)
  } catch (err) {
    notification.error({
      title: "Error",
      content: err.shortMessage || err.details || err.message,
      duration: 3000,
    })
  }
}
const debounceUpdateQuoteData = debounce(updateQuoteData, 1000, { leading: true, trailing: false })
const { start: startUpdateQuoteData, stop: stopUpdateQuoteData  } = createInterval(debounceUpdateQuoteData, 20 * 1000)

const onAmountChange = () => {
  if (!amountIn.value) {
    inputAmount.value = ''
    return
  }

  if (isExchangeMode.value) {
    quoteData.value = { amountIn: amountIn.value, amountOut: amountIn.value }
  } else {
    if (swapPaths.value.length === 0) {
      notification.error({
        title: "Error",
        content: `No path for ${inputToken.value.symbol} <=> ${outputToken.value.symbol}`,
        duration: 3000,
      })
      quoteData.value = null
      return
    }

    debounceUpdateQuoteData()
  }

  onCheckApproval()
}

const onSelectToken = async token => {
  const targetToken = isForInput.value ? inputToken : outputToken
  const otherToken = isForInput.value ? outputToken : inputToken

  if (isSame(token, targetToken.value)) {
    return
  }
  if (isSame(token, otherToken.value)) {
    onReverse()
    return
  }

  targetToken.value = token

  if (isExchangeToken(token) || !isSwapToken(token)) {
    otherToken.value = findExchangeOtherToken(token)
  } else if (!isSwapToken(otherToken.value)) {
    otherToken.value = findSwapOtherToken(token)
  }

  inputAmount.value = ""
  quoteData.value = null
  updateTokenBalances(true)
  updateRouteForInputOutput()
}

const onSelectInputToken = () => {
  isForInput.value = true
  showTokenSelector.value = true
}

const onSelectOutputToken = () => {
  isForInput.value = false
  showTokenSelector.value = true
}

const onReverse = () => {
  const [tokenA, tokenB] = [inputToken.value, outputToken.value]
  inputToken.value = tokenB
  outputToken.value = tokenA

  inputAmount.value = ""
  quoteData.value = null

  updateTokenBalances()
  updateRouteForInputOutput()
}

const exchange = async () => {
  const { chainId } = inputToken.value
  const fee = getFee(chainId)
  const to = recipient.value || account.value
  const success = await doExchange(exchangeAction, exchanging, inputToken.value, outputToken.value, amountIn.value, to, fee)
  if (success) {
    reset()
    updateTokenBalances(true)
    updateNativeBalance()
  }
}

const swap = async () => {
  const { chainId } = inputToken.value
  const fee = getFee(chainId)
  const to = recipient.value || account.value
  const success = await doSwap(swapAction, swaping, inputToken.value, outputToken.value, quoteData.value, to, fee)
  if (success) {
    reset()
    updateTokenBalances(true)
    updateNativeBalance()
  }
}

const onSwap = () => {
  if (!quoteData.value) {
    return
  }

  if (isExchangeMode.value) {
    exchange()
    return
  }

  const data = checkValueChange(inputToken.value, outputToken.value, quoteData.value)
  if (data) {
    valueChangeAction.value = { show: true, data }
    return
  }

  swap()
}

const onAppChainIdChange = () => {
  reset()

  inputToken.value = allTokens.value[0] || null
  outputToken.value = allTokens.value[1] || null

  updateTokenBalances(true)
  updateRouteForInputOutput()
}

const updateRouteForInputOutput = () => {
  const { referral } = route.query

  const [input, output] = inputOutputTokens.value
  const chain = getChainKey(appChainId.value)
  const query = {
    chain,
    input: input ? (isNative(input.address) ? getNativeCurrency(input.chainId).symbol : input.address) : undefined,
    output: output ? (isNative(output.address) ? getNativeCurrency(output.chainId).symbol : output.address) : undefined,
    referral,
  }

  router.push({ replace: true, name: route.name, query })
}

onMounted(() => {
  const stopWatch = watch(appChainId, onAppChainIdChange)
  onBeforeUnmount(stopWatch)

  handleRoute()
})

onMounted(() => {
  startUpdateQuoteData()

  onBeforeUnmount(() => {
    stopUpdateQuoteData()
    debounceUpdateQuoteData.cancel()
  })
})
</script>
