<template>
  <div class="mx-auto my-4 sm:my-8 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20">
    <div class="flex flex-col">
      <n-text class="text-lg font-medium">Exchange</n-text>
      <ExchangeInput class="mt-4 sm:mt-8" v-model="inputAmount" :token="inputToken" :balance="inputBalance" @change="onAmountChange" @select="onSelectInputToken" />
      <ReverseButton class="my-3" :disabled="!isSupported" @reverse="onReverse" />
      <ExchangeOutput :input-token="inputToken" :output-token="outputToken" :output-balance="outputBalance" :amount-out="amountIn" @select="onSelectOutputToken" />
      <div class="mt-10">
        <ActionButton :chain-id="inputToken?.chainId" :chains="supportedChains">
          <ZButton v-if="!isInputValid" class="h-10 sm:h-12 w-full" :aria-label="inputHint">{{ inputHint }}</ZButton>
          <ZButton v-else-if="approvalChecking" class="h-10 sm:h-12 w-full" loading aria-label="Checking for Approval">Checking for Approval</ZButton>
          <ZButton v-else-if="!isInputExchange && !approved" class="h-10 sm:h-12 w-full" :disabled="approving" :loading="approving" :aria-label="`Unlock ${inputToken.symbol}`" @click="onApproval">Unlock {{ inputToken.symbol }}</ZButton>
          <ZButton v-else class="h-10 sm:h-12 w-full" :loading="withdrawing" aria-label="Exchange" @click="onExchange">Exchange</ZButton>
        </ActionButton>
      </div>
      <RecipientAddress class="mt-4" v-model="recipient" />
    </div>
    <TokenSelector v-model:show="showTokenSelector" :current="currentToken" :tokens="allTokens" :on-select="onSelectToken" />
    <ApproveModal v-model="approveAction" />
    <ExchangeModal v-model="exchangeAction" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { parseAmount, toAmount } from "@/utils/bn"
import { account, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { createBalanceStates2 } from "@/hooks/useBalances"
import { getPairs, findOtherToken, isExchangeToken, getSupportedChains, isSupportChain } from "@/hooks/useExchange"
import { isSame } from "@/hooks/useCurrency"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { createPriceState } from "@/hooks/usePrices"
import { getFee, getRouterAddress } from "@/hooks/useRouter"
import { doApproval, doCheckAllowance, doCheckApproval, doExchange } from "@/hooks/useInteraction"
import ActionButton from "@/components/ActionButton.vue"
import ZButton from "@/components/ZButton.vue"
import TokenSelector from "@/components/TokenSelector/index.vue"
import RecipientAddress from "@/components/RecipientAddress/index.vue"
import ApproveModal from '@/components/ActionModal/ApproveModal.vue'
import ReverseButton from "@/components/ReverseButton.vue"
import ExchangeInput from "./ExchangeInput.vue"
import ExchangeOutput from "./ExchangeOutput.vue"
import ExchangeModal from "./ExchangeModal.vue"

createPriceState()

const approveAction = ref({ show: false })

const supportedChains = getSupportedChains()
const isSupported = computed(() => isSupportChain(selectedChainId.value))

const isForInput = ref(true)
const allPairs = computed(() => getPairs(selectedChainId.value))

const inputToken = ref(allPairs.value[0]?.currency0)
const outputToken = ref(allPairs.value[0]?.currency1)
const isInputExchange = computed(() => inputToken.value && isExchangeToken(inputToken.value))
const isPlus = computed(() => isForInput.value ? isInputExchange.value : isExchangeToken(outputToken.value))

const currentToken = computed(() => isForInput.value ? inputToken.value : outputToken.value)
const allTokens = computed(() => isPlus.value ? allPairs.value.map(p => p.currency1) : allPairs.value.map(p => p.currency0))

const focusTokens = computed(() => [inputToken.value, outputToken.value])
const { states: balanceStates, update: updateTokenBalances } = createBalanceStates2(account, focusTokens)
const inputBalance = computed(() => balanceStates.value[0])
const outputBalance = computed(() => balanceStates.value[1])

const inputAmount = ref("")
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

const exchanging = ref(false)
const showTokenSelector = ref(false)
const recipient = ref('')
const exchangeAction = ref({ show: false })

const reset = () => {
  approved.value = false
  approvalChecking.value = false
  approving.value = false
  exchanging.value = false

  inputAmount.value = ""
  showTokenSelector.value = false
  isForInput.value = true
  recipient.value = ''
}

const onAmountChange = () => {
  if (!amountIn.value) {
    inputAmount.value = ''
    return
  }

  inputAmount.value = toAmount(amountIn.value, inputToken.value.decimals)
  onCheckApproval()
}

const onSelectToken = async token => {
  if (isForInput.value) {
    if (isSame(token, inputToken.value)) {
      return
    }
    inputToken.value = token
    outputToken.value = findOtherToken(token)
  } else {
    if (isSame(token, outputToken.value)) {
      return
    }
    outputToken.value = token
    inputToken.value = findOtherToken(token)
  }

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
  if (!inputToken.value || !outputToken.value) {
    return
  }

  const [tokenA, tokenB] = [inputToken.value, outputToken.value]
  inputToken.value = tokenB
  outputToken.value = tokenA

  inputAmount.value = ""

  updateTokenBalances()
}

const onExchange = async () => {
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

onMounted(() => {
  const stopWatch = watch(selectedChainId, () => {
    reset()

    inputToken.value = allPairs.value[0]?.currency0 || null
    outputToken.value = allPairs.value[0]?.currency1 || null

    updateTokenBalances(true)
  })

  onBeforeUnmount(stopWatch)
})
</script>
