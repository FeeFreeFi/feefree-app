<template>
  <div class="mx-auto my-4 sm:my-8 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20">
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
          <ZButton v-else class="h-10 sm:h-12 w-full" :loading="swaping" aria-label="Swap" @click="onSwap">Swap</ZButton>
        </ActionButton>
      </div>
      <RecipientAddress class="mt-4" v-model="recipient" />
    </div>
    <TokenSelector v-model:show="showTokenSelector" :current="currentToken" :tokens="allTokens" :on-select="onSelectToken" />
    <ApproveModal v-model="approveAction" />
    <SwapModal v-model="swapAction" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { useNotification } from "naive-ui"
import debounce from "lodash-es/debounce"
import { parseAmount } from "@/utils/bn"
import { account, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { createBalanceStates2 } from "@/hooks/useBalances"
import { getPublicClient } from "@/hooks/useClient"
import { createPriceState } from "@/hooks/usePrices"
import { isSame } from "@/hooks/useCurrency"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { createInterval } from "@/hooks/useTimer"
import { getChainTokens, findPaths, quoteSwap, getSupportedChains, isSupportChain } from "@/hooks/useSwap"
import { getFee, getRouterAddress } from "@/hooks/useRouter"
import { doApproval, doCheckAllowance, doCheckApproval, doSwap } from "@/hooks/useInteraction"
import TokenSelector from "@/components/TokenSelector/index.vue"
import RecipientAddress from "@/components/RecipientAddress/index.vue"
import ActionButton from "@/components/ActionButton.vue"
import ZButton from "@/components/ZButton.vue"
import ApproveModal from '@/components/ActionModal/ApproveModal.vue'
import ReverseButton from "@/components/ReverseButton.vue"
import SwapInput from "./SwapInput.vue"
import SwapOutput from "./SwapOutput.vue"
import SwapModal from "./SwapModal.vue"
import { saveReferral } from "@/hooks/useUser"

const route = useRoute()

createPriceState()
const notification = useNotification()

const approveAction = ref({ show: false })

const supportedChains = getSupportedChains()
const isSupported = computed(() => isSupportChain(selectedChainId.value))

const allTokens = computed(() => getChainTokens(selectedChainId.value))
const inputToken = ref(allTokens.value[0])
const outputToken = ref(allTokens.value[1])
const swapPaths = computed(() => findPaths(inputToken.value, outputToken.value))

const isForInput = ref(true)
const currentToken = computed(() => isForInput.value ? inputToken.value : outputToken.value)

const focusTokens = computed(() => [inputToken.value, outputToken.value])
const { states: balanceStates, update: updateTokenBalances } = createBalanceStates2(account, focusTokens)
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

const approved = ref(false)
const approvalChecking = ref(false)
const approving = ref(false)
const checkAllowance = () => doCheckAllowance(approved, inputToken.value, account.value, getRouterAddress(inputToken.value.chainId), amountIn.value)
const onCheckApproval = () => doCheckApproval(approvalChecking, checkAllowance)
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

const handleReferral = () => {
  const { referral } = route.query
  if (!referral) {
    return
  }

  saveReferral(referral)
}

const reset = () => {
  approved.value = false
  approvalChecking.value = false
  approving.value = false
  swaping.value = false

  inputAmount.value = ""
  recipient.value = ""
  quoteData.value = null
  showTokenSelector.value = false
  isForInput.value = true
}

const updateQuoteData = async () => {
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
  onCheckApproval()
}

const onSelectToken = async token => {
  if (isForInput.value) {
    if (isSame(token, inputToken.value)) {
      return
    }
    if (isSame(token, outputToken.value)) {
      onReverse()
      return
    }
    inputToken.value = token
  } else {
    if (isSame(token, outputToken.value)) {
      return
    }
    if (isSame(token, inputToken.value)) {
      onReverse()
      return
    }
    outputToken.value = token
  }

  inputAmount.value = ""
  quoteData.value = null
  updateTokenBalances(true)
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
}

const onSwap = async () => {
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

onMounted(() => {
  handleReferral()
})

onMounted(() => {
  const stopWatch = watch(selectedChainId, () => {
    reset()

    inputToken.value = allTokens.value[0] || null
    outputToken.value = allTokens.value[1] || null

    updateTokenBalances(true)
  })

  onBeforeUnmount(stopWatch)
})

onMounted(() => {
  startUpdateQuoteData()

  onBeforeUnmount(() => {
    stopUpdateQuoteData()
    debounceUpdateQuoteData.cancel()
  })
})
</script>
