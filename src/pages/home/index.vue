<template>
  <div :id="containerId.slice(1)" class="relative overflow-hidden mx-auto my-4 sm:my-8 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20">
    <div class="flex flex-col">
      <div class="flex justify-between">
        <n-text class="text-lg font-medium">Swap</n-text>
        <div v-if="account" class="flex-y-center cursor-pointer" @click="onShare">
          <i-ff-share class="size-4" />
        </div>
      </div>
      <TokenInput v-model="inputAmount" class="mt-4 sm:mt-8" :token="inputToken" :balance="inputBalance" label="Give" @change="onAmountChange" @select="onSelectInputToken" />
      <ReverseButton class="my-3" :disabled="!inputToken && !outputToken" @reverse="onReverse" />
      <SwapOutput :input-token="inputToken" :output-token="outputToken" :output-balance="outputBalance" :quote="quoteData" :fee="fee" @select="onSelectOutputToken" />
      <div class="mt-10">
        <ActionButton :chain-id="appChainId" :chains="supportedChains">
          <ZButton v-if="!isInputValid" class="h-10 sm:h-12 w-full" :aria-label="inputHint">{{ inputHint }}</ZButton>
          <ZButton v-else-if="approvalChecking" class="h-10 sm:h-12 w-full" loading disabled aria-label="Checking for Approval">Checking for Approval</ZButton>
          <ZButton v-else-if="!approved" class="h-10 sm:h-12 w-full" :disabled="approving" :loading="approving" :aria-label="`Approve ${inputToken.symbol}`" @click="onApproval">Approve {{ inputToken.symbol }}</ZButton>
          <ZButton v-else class="h-10 sm:h-12 w-full" :disabled="!quoteData" :loading="swaping" aria-label="Swap" @click="onSwap">Swap</ZButton>
        </ActionButton>
      </div>
      <RecipientAddress v-model="recipient" class="mt-4" :to="containerId" />
    </div>
    <TokenSelector v-model:show="showTokenSelector" :current="currentToken" :on-select="onSelectToken" />
    <ApproveModal v-model="approveAction" />
    <SwapModal v-model="swapAction" />
    <ValueChangeModal v-model="valueChangeAction" :on-confirm="doSwap" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useMessage, useNotification } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { uuid, parseAmount, isNative, isSame } from '@/utils'
import { account, updateNativeBalance } from '@/hooks/useWallet'
import { appChainId, syncRouteChain } from '@/hooks/useAppState'
import { doApproval, doSend } from '@/hooks/useInteraction'
import { getChainIdByKey, getChainKey, getNativeCurrency } from '@/hooks/useChains'
import { getPoolTokens, findPaths, getPoolId, fetchPoolMeta, loadMyPools as _loadMyPools } from '@/hooks/usePool'
import { getSwapFee } from '@/hooks/useFee'
import { quoteSwap, checkValueChange, isSupportChain, getManagerAddress, getSupportedChains, swap } from '@/hooks/useManager'
import { configReady } from '@/hooks/useConfig'
import { allowance, cacheTokens, fetchToken, getNativeToken } from '@/hooks/useToken'
import { createQuoteState } from '@/hooks/useQuoteState'
import { createTokenStates } from '@/hooks/useTokenState'
import TokenSelector from '@/components/TokenSelector/index.vue'
import RecipientAddress from '@/components/RecipientAddress/index.vue'
import ActionButton from '@/components/ActionButton.vue'
import ZButton from '@/components/ZButton.vue'
import TokenInput from '@/components/TokenInput.vue'
import ApproveModal from '@/components/ActionModal/ApproveModal.vue'
import ReverseButton from './ReverseButton.vue'
import SwapOutput from './SwapOutput.vue'
import SwapModal from './SwapModal.vue'
import ValueChangeModal from './ValueChangeModal.vue'
import { createShare } from '@/hooks/useShare'

const containerId = `#el-${uuid()}`
const route = useRoute()
const router = useRouter()

const notification = useNotification()
const message = useMessage()
const { onShare } = createShare(message)

/** @type {import('vue').Ref<{chainId:number}[]>} */
const supportedChains = ref([])
/** @type {import('vue').Ref<import('@/types').Token>} */
const inputToken = ref(null)
/** @type {import('vue').Ref<import('@/types').Token>} */
const outputToken = ref(null)
/** @type {import('vue').Ref<import('@/types').Token[][]>} */
const paths = ref([])
/** @type {import('vue').Ref<import('@/types').QuoteSwapData>} */
const quoteData = ref(null)

const isForInput = ref(true)
const inputAmount = ref('')
const showTokenSelector = ref(false)
const recipient = ref('')
const approvalChecking = ref(false)
const approving = ref(false)
const approved = ref(false)
const swaping = ref(false)

const approveAction = ref({ show: false })
const swapAction = ref({ show: false })
const valueChangeAction = ref({ show: false })

const fee = ref(0n)
const currentToken = computed(() => isForInput.value ? inputToken.value : outputToken.value)
const inputOutputTokens = computed(() => [inputToken.value, outputToken.value])

const balances = ref([0n, 0n])
const inputBalance = computed(() => balances.value[0])
const outputBalance = computed(() => balances.value[1])
/** @type {import('vue').Ref<() => Promise<void>>} */
const debounceUpdateBalances = ref(null)

const amountIn = computed(() => inputToken.value ? parseAmount(inputAmount.value || 0, inputToken.value.decimals) : 0n)

const inputHint = computed(() => {
  if (!amountIn.value) {
    return 'Please enter amount'
  }

  if (amountIn.value > inputBalance.value) {
    return `${inputToken.value.symbol} insufficient balance`
  }

  return ''
})
const isInputValid = computed(() => {
  return amountIn.value && amountIn.value <= inputBalance.value
})
/** @type {import('vue').Ref<() => Promise<void>>} */
const debounceUpdateQuote = ref(null)

const checkAllowance = async () => {
  const allowed = await allowance(inputToken.value, account.value, getManagerAddress(inputToken.value.chainId))
  approved.value = allowed >= amountIn.value
}
const onCheckApproval = async () => {
  approvalChecking.value = true
  await checkAllowance()
  approvalChecking.value = false
}
const onApproval = async () => {
  const spender = getManagerAddress(inputToken.value.chainId)
  const success = await doApproval(approveAction, approving, inputToken.value, spender, amountIn.value)
  if (success) {
    checkAllowance()
    updateNativeBalance()
  }
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

const handleRoute = async () => {
  const { chain, input, output } = route.query

  const chainId = getChainIdByKey(chain)
  if (!chainId) {
    const tokens = getPoolTokens(appChainId.value)
    inputToken.value = tokens[0]
    outputToken.value = tokens[1]
  } else if (!isSupportChain(chainId)) {
    inputToken.value = null
    outputToken.value = null
  } else {
    const nativeToken = getNativeToken(chainId)

    const [tokenIn, tokenOut] = await Promise.all([
      input ? (input === nativeToken.symbol ? nativeToken : fetchToken(chainId, input)) : null,
      output ? (output === nativeToken.symbol ? nativeToken : fetchToken(chainId, output)) : null,
    ])

    inputToken.value = tokenIn || nativeToken
    outputToken.value = isSame(tokenIn, tokenOut) ? null : tokenOut

    cacheTokens([tokenIn, tokenOut])
  }

  debounceUpdateBalances.value && debounceUpdateBalances.value()
  updateRouteForInputOutput()
}

const reset = () => {
  approved.value = false
  approvalChecking.value = false
  approving.value = false
  swaping.value = false

  inputAmount.value = ''
  recipient.value = ''
  quoteData.value = null
  showTokenSelector.value = false
  isForInput.value = true
}

const updateQuoteData = async () => {
  if (paths.value.length === 0 || !amountIn.value) {
    quoteData.value = null
    return
  }

  const amountSpecified = -amountIn.value

  try {
    quoteData.value = await quoteSwap(inputToken.value.chainId, paths.value, amountSpecified)
  } catch (err) {
    notification.error({
      title: 'Error',
      content: err.shortMessage || err.details || err.message,
      duration: 3000,
    })
  }
}

const onAmountChange = () => {
  if (!amountIn.value) {
    inputAmount.value = ''
    return
  }

  if (paths.value.length === 0) {
    quoteData.value = null
    return
  }

  debounceUpdateQuote.value && debounceUpdateQuote.value()
  onCheckApproval()
}

const onReverse = () => {
  const [tokenA, tokenB] = [inputToken.value, outputToken.value]
  inputToken.value = tokenB
  outputToken.value = tokenA

  inputAmount.value = ''
  quoteData.value = null

  updateRouteForInputOutput()
  debounceUpdateBalances.value && debounceUpdateBalances.value()
}

const onSelectToken = async token => {
  const targetToken = isForInput.value ? inputToken : outputToken
  const otherToken = isForInput.value ? outputToken : inputToken

  if (targetToken.value && isSame(token, targetToken.value)) {
    return
  }
  if (otherToken.value && isSame(token, otherToken.value)) {
    onReverse()
    return
  }

  targetToken.value = token

  inputAmount.value = ''
  quoteData.value = null

  updateRouteForInputOutput()
  debounceUpdateBalances.value && debounceUpdateBalances.value()
}

const onSelectInputToken = () => {
  isForInput.value = true
  showTokenSelector.value = true
}

const onSelectOutputToken = () => {
  isForInput.value = false
  showTokenSelector.value = true
}

const doSwap = async () => {
  const { paths, amountSpecified, amountIn, amountOut } = quoteData.value
  const params = {
    paths,
    amountSpecified,
    amountDesired: amountSpecified < 0n ? amountOut : amountIn,
    recipient: recipient.value || account.value,
  }

  swapAction.value.data = { inputToken, outputToken, amountIn, amountOut, fee: fee.value }

  const success = await doSend(swapAction, swaping, 'Swap', () => swap(params, fee.value))

  if (success) {
    reset()
    debounceUpdateBalances.value && debounceUpdateBalances.value()
    updateNativeBalance()
  }
}

const onSwap = () => {
  if (!quoteData.value) {
    return
  }

  const data = checkValueChange(inputToken.value, outputToken.value, quoteData.value)
  if (data) {
    valueChangeAction.value = { show: true, data }
    return
  }

  doSwap()
}

const onAppChainIdChange = () => {
  reset()

  const allTokens = getPoolTokens(appChainId.value)
  inputToken.value = allTokens[0] || null
  outputToken.value = allTokens[1] || null
  fee.value = getSwapFee(appChainId.value)

  debounceUpdateBalances.value && debounceUpdateBalances.value()
  updateRouteForInputOutput()
}

const loadMyPools = async () => {
  await _loadMyPools(appChainId.value, account.value)
}

const onTokensChange = async () => {
  if (!inputToken.value || !outputToken.value) {
    paths.value = []
    return
  }

  const { chainId } = inputToken.value
  const id = getPoolId(chainId, inputToken.value.address, outputToken.value.address)
  await fetchPoolMeta(chainId, id)

  paths.value = findPaths(inputToken.value, outputToken.value)
}

onMounted(async () => {
  syncRouteChain()

  debounceUpdateBalances.value = createTokenStates(account, inputOutputTokens, balances)
  debounceUpdateQuote.value = createQuoteState(updateQuoteData, 500, 20000)

  await configReady()

  watch(appChainId, onAppChainIdChange)
  watch(inputOutputTokens, onTokensChange)
  watch([appChainId, account], loadMyPools)

  fee.value = getSwapFee(appChainId.value)
  supportedChains.value = getSupportedChains()

  await loadMyPools()
  handleRoute()
})
</script>
