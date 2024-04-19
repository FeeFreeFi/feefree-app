<template>
  <div class="flex flex-col py-6 sm:py-10 text-sm sm:text-base">
    <div class="mx-auto relative w-full sm:w-[520px] h-[428px] sm:h-[498px]">
      <n-tabs class="h-full relative [&>.n-tabs-nav]:hidden" :value="tab" pane-wrapper-class="h-full" pane-class="h-full relative !p-0" animated>
        <n-tab-pane :name="TAB_SWAP">
          <!-- swap -->
          <ZSectionView>
            <!-- header -->
            <div class="h-10 flex-y-center justify-between">
              <n-text class="text-xl sm:text-2xl font-medium">Swap</n-text>
            </div>
            <!-- swap -->
            <div class="mt-4 mb-6 flex flex-col gap-6 relative">
              <!-- input -->
              <div class="rounded flex flex-col bg-block">
                <div class="px-3 py-4 flex-y-center gap-2">
                  <ZSelectToken :token="inputToken" label="Input Token" :disabled="!canSelectToken" :on-select="onSelectInputToken">
                    <ZToken :token="inputToken" />
                  </ZSelectToken>
                  <n-input-number class="flex-1 amount-input" v-model:value="inputAmount" :min="0" :bordered="false" placeholder="0.0" :show-button="false" :on-blur="onInputAmountBlur" />
                </div>
                <n-divider class="!my-0" />
                <div class="p-3 flex-y-center justify-between gap-2">
                  <div class="flex-y-center overflow-hidden">
                    <n-text class="mr-1 font-medium text-color-3">Balance:</n-text>
                    <ZTokenBalance content-class="text-color-3" tooltip-class="text-xs sm:text-sm" :token="inputToken" :balance="inputBalance" :show-symbol="false" />
                  </div>
                  <n-button class="ml-[2px] h-6 p-1" text aria-label="Max" :disabled="!inputBalance" @click="onMax">
                    <n-text class="text-sm font-medium" type="primary">MAX</n-text>
                  </n-button>
                </div>
              </div>
              <!-- output -->
              <div class="rounded flex flex-col bg-block">
                <div class="px-3 py-4 flex-y-center gap-2">
                  <ZSelectToken :token="outputToken" label="Output Token" :disabled="!canSelectToken" :on-select="onSelectOutputToken">
                    <ZToken :token="outputToken" />
                  </ZSelectToken>
                  <n-input-number class="flex-1 amount-input" v-model:value="outputAmount" :min="0" :bordered="false" placeholder="0.0" :show-button="false" readonly />
                </div>
                <n-divider class="!my-0" />
                <div class="p-3 flex-y-center justify-between gap-2">
                  <div class="flex-y-center overflow-hidden">
                    <n-text class="mr-1 font-medium text-color-3">Balance:</n-text>
                    <ZTokenBalance content-class="text-color-3" tooltip-class="text-xs sm:text-sm" :token="outputToken" :balance="outputBalance" :show-symbol="false" />
                  </div>
                </div>
              </div>
              <!-- reverse -->
              <n-button class="absolute translate-center" :disabled="!inputToken && !outputToken" type="primary" circle tertiary size="medium" aria-label="reverse" @click="onReverse">
                <i-mdi-swap-vertical class="size-6" />
              </n-button>
            </div>
            <!-- button -->
            <div>
              <n-button class="primary-btn" v-if="account" type="primary" strong block aria-label="Review Transaction" :disabled="!quoteData || !amountIn || amountIn > inputBalance" @click="onReviewTransaction">
                {{ amountIn && amountIn > inputBalance ? `Insufficient ${inputToken.symbol} Balance` : "Review Transaction" }}
              </n-button>
              <n-button class="primary-btn" v-else type="primary" strong block aria-label="Connect Wallet" @click="openWalletConnector">Connect Wallet</n-button>
            </div>
            <!-- Recipient Address -->
            <div class="mt-4 h-8 flex-y-center justify-between">
              <n-text class="text-sm font-medium text-color-3">Recipient Address</n-text>
              <n-button v-if="!recipient" text aria-label="add recipient address" @click="onAddRecipient">
                <n-text class="mr-1" type="info">
                  <i-mdi-plus-circle class="size-6" />
                </n-text>
                <n-text class="font-medium" type="info">Add Address</n-text>
              </n-button>
              <div v-else>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-text class="text-sm font-medium">{{ shortString(recipient) }}</n-text>
                  </template>
                  <span class="text-xs sm:text-sm">{{ recipient }}</span>
                </n-tooltip>
                <n-button text aria-label="edit recipient address" @click="onAddRecipient">
                  <n-text class="font-medium" type="info">Edit</n-text>
                </n-button>
              </div>
            </div>
          </ZSectionView>
        </n-tab-pane>
        <n-tab-pane :name="TAB_REVIEW" display-directive="show:lazy">
          <!-- review -->
          <ZSectionView>
            <!-- header -->
            <div class="h-10 flex-y-center justify-between">
              <n-text class="text-xl sm:text-2xl font-medium text-color-3">Review Transaction</n-text>
              <div class="flex gap-2">
                <!-- close -->
                <n-button tertiary circle size="medium" aria-label="close" @click="onBack">
                  <n-text class="text-color-3">
                    <i-mdi-close class="size-6" />
                  </n-text>
                </n-button>
              </div>
            </div>
            <div class="my-4 flex flex-col gap-6">
              <div class="bg-block p-3 sm:p-4 flex flex-col">
                <!-- From To -->
                <div class="grid grid-cols-[1fr_24px_1fr] overflow-hidden gap-2 items-center">
                  <!-- From -->
                  <div class="bg-bg-3 px-2 py-3 rounded flex-y-center truncate gap-2">
                    <ZTokenIcon class="shrink-0" :token="inputToken" />
                    <ZTokenBalance content-class="text-sm" :token="inputToken" :balance="quoteData?.amountIn || 0n" />
                  </div>
                  <n-text class="flex-center size-6">
                    <i-mdi-chevron-double-right />
                  </n-text>
                  <!-- To -->
                  <div class="bg-bg-3 px-2 py-3 rounded flex-y-center truncate gap-2">
                    <ZTokenIcon class="shrink-0" :token="outputToken" />
                    <ZTokenBalance content-class="text-sm" :token="outputToken" :balance="quoteData?.amountOut || 0n" />
                  </div>
                </div>
              </div>
              <div class="bg-block px-3 sm:px-4 flex flex-col">
                <!-- Output -->
                <div class="py-4 flex justify-between gap-2">
                  <n-text class="font-medium shrink-0 text-color-3">Output:</n-text>
                  <div class="flex">
                    <ZTokenBalance :token="outputToken" :balance="quoteData?.amountOut || 0n" :dp="6" />
                    <!-- <span class="font-medium text-color-3 ml-1">(${{ quoteData?.amountOutValue || 0 }})</span> -->
                  </div>
                </div>
                <n-divider class="!my-0" />
                <!-- Swap Fee -->
                <div class="py-4 flex justify-between">
                  <n-text class="font-medium text-color-3">Swap Fee:</n-text>
                  <div class="flex">
                    <ZTokenBalance :token="gasToken" :balance="fee" :dp="9" />
                    <span class="font-medium text-color-3 ml-1">(${{ feeValue }})</span>
                  </div>
                </div>
                <n-divider v-if="recipient" class="!my-0" />
                <!-- Receipent Address -->
                <div class="py-4 flex justify-between" v-if="recipient">
                  <n-text class="font-medium text-color-3">Receipent Address:</n-text>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-text class="font-medium">{{ shortString(recipient) }}</n-text>
                    </template>
                    <span class="text-xs sm:text-sm">{{ recipient }}</span>
                  </n-tooltip>
                </div>
              </div>
            </div>
            <!-- button -->
            <div>
              <n-button v-if="approvalChecking" class="primary-btn" disabled loading type="primary" block strong aria-label="Checking for Approval">Checking for Approval</n-button>
              <n-button v-else-if="requireSwitchChain" class="primary-btn" :disabled="switching" :loading="switching" type="info" block strong aria-label="Switch Network" @click="onSwitchNetwork">Switch Network</n-button>
              <n-button v-else-if="!approved" class="primary-btn" :disabled="approving" :loading="approving" type="primary" block strong :aria-label="`Unlock ${inputToken.symbol}`" @click="onApproval">Unlock {{ inputToken.symbol }}</n-button>
              <n-button v-else class="primary-btn" :disabled="swaping" :loading="swaping" type="primary" block strong aria-label="Swap" @click="onSwap">{{ signing ? 'Waiting For Wallet Confirmation' : 'Swap' }}</n-button>
            </div>
          </ZSectionView>
        </n-tab-pane>
      </n-tabs>
    </div>
    <TokenSelector v-model:show="showTokenSelector" :current="currentToken" :tokens="allTokens" :on-select="onSelectToken" />
    <AddRecipient v-model:show="showAddRecipient" v-model="recipient" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useNotification } from "naive-ui"
import debounce from "lodash-es/debounce"
import { fromValue, parseAmount, toAmount } from "@/utils/bn"
import shortString from "@/utils/shortString"
import { account, chainId, getWalletClient, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { createBalanceStates2 } from "@/hooks/useBalances"
import { getNativeCurrency } from "@/hooks/useChains"
import { getPublicClient } from "@/hooks/useClient"
import { getPrice, createPriceState } from "@/hooks/usePrices"
import { isSame } from "@/hooks/useCurrency"
import { open as openWalletConnector } from "@/hooks/useWalletConnector"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { waitTx } from "@/hooks/useWaitTx"
import { createInterval } from "@/hooks/useTimer"
import { swap, getChainTokens, findPaths, quoteSwap } from "@/hooks/useSwap"
import { getFee, getRouterAddress } from "@/hooks/useRouter"
import { doApproval, doCheckAllowance, doCheckApproval, doSwitchNetwork } from "@/hooks/useInteraction"
import TokenSelector from "@/components/TokenSelector/index.vue"
import AddRecipient from "@/components/AddRecipient/index.vue"
import ZToken from "@/components/ZToken.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZSectionView from "@/components/ZSectionView.vue"
import ZSelectToken from "@/components/ZSelectToken.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"

createPriceState()
const notification = useNotification()

const TAB_SWAP = "exchange"
const TAB_REVIEW = "review"

const tab = ref(TAB_SWAP)

const allTokens = computed(() => getChainTokens(selectedChainId.value))
const inputToken = ref(allTokens.value[0])
const outputToken = ref(allTokens.value[1])
const swapPaths = computed(() => findPaths(inputToken.value, outputToken.value))

const isForInput = ref(true)
const currentToken = computed(() => isForInput.value ? inputToken.value : outputToken.value)

const canSelectToken = computed(() => allTokens.value.length > 0)
// const inputBalance = ref(0n)
// const outputBalance = ref(0n)
const focusTokens = computed(() => [inputToken.value, outputToken.value])
const { states: balanceStates, update: updateTokenBalances } = createBalanceStates2(account, focusTokens)
const inputBalance = computed(() => balanceStates.value[0])
const outputBalance = computed(() => balanceStates.value[1])

const inputAmount = ref("")
const outputAmount = ref("")
const amountIn = computed(() => inputToken.value ? parseAmount(inputAmount.value || 0, inputToken.value.decimals) : 0n)
const amountOut = computed(() => outputToken.value ? parseAmount(outputAmount.value || 0, outputToken.value.decimals) : 0n)
const fee = computed(() => inputToken.value ? getFee(inputToken.value.chainId) : 0n)
const gasToken = computed(() => inputToken.value ? getNativeCurrency(inputToken.value.chainId) : null)
const feeValue = computed(() => gasToken.value ? fromValue(getPrice(gasToken.value.symbol)).times(fee.value).div(1e18).dp(4).toNumber() : 0)

/**
 * @type {import('vue').Ref<{deltaAmounts: bigint[], sqrtPriceX96Afters: bigint[], amountIn:bigint, amountOut:bigint, paths:string[], amountSpecified:bigint}>}
 */
const quoteData = ref(null)

const showTokenSelector = ref(false)
const showAddRecipient = ref(false)
const recipient = ref('')

const requireSwitchChain = computed(() => chainId.value !== inputToken.value.chainId)
const switching = ref(false)
const onSwitchNetwork = () => doSwitchNetwork(notification, switching, inputToken.value.chainId)

const approved = ref(false)
const approvalChecking = ref(false)
const approving = ref(false)
const checkAllowance = () => doCheckAllowance(approved, inputToken.value, account.value, getRouterAddress(inputToken.value.chainId), amountIn.value)
const onCheckApproval = () => doCheckApproval(approvalChecking, checkAllowance)
const onApproval = async () => {
  const spender = getRouterAddress(inputToken.value.chainId)
  const success = await doApproval(notification, approving, inputToken.value, spender, inputBalance.value)
  if (success) {
    checkAllowance()
    updateNativeBalance()
  }
}

const swaping = ref(false)
const signing = ref(false)

// const setInputOutputBalances = () => {
//   if (inputToken.value) {
//     inputBalance.value = getBalance(account.value, inputToken.value)
//   }
//   if (outputToken.value) {
//     outputBalance.value = getBalance(account.value, outputToken.value)
//   }
// }

// const updateTokenBalances = async () => {
//   if (!account.value) {
//     inputBalance.value = 0n
//     outputBalance.value = 0n
//     return
//   }

//   const tokens = [inputToken.value, outputToken.value].filter(Boolean)
//   if (tokens.length === 0) {
//     return
//   }

//   setInputOutputBalances()
//   await updateBalances(account.value, tokens)
//   setInputOutputBalances()
// }
// const debounceUpdateTokenBalances = debounce(updateTokenBalances, 100, { leading: false, trailing: true })

const reset = () => {
  tab.value = TAB_SWAP

  approved.value = false
  approvalChecking.value = false
  approving.value = false
  swaping.value = false
  signing.value = false
  switching.value = false

  inputAmount.value = ""
  outputAmount.value = ""
  recipient.value = ""
  quoteData.value = null
  showTokenSelector.value = false
  showAddRecipient.value = false
  isForInput.value = true
}

const updateQuoteData = async () => {
  if (swapPaths.value.length === 0 || amountIn.value === 0n) {
    quoteData.value = null
    outputAmount.value = ""
    return
  }

  const paths = swapPaths.value[0].map(p => p.address)
  const amountSpecified = -amountIn.value
  const id = inputToken.value.chainId
  const publicClient = getPublicClient(id)
  const address = getRouterAddress(id)

  try {
    const result = await quoteSwap(publicClient, address, paths, amountSpecified)
    quoteData.value = result
    outputAmount.value = toAmount(result.amountOut, outputToken.value.decimals, outputToken.value.dp)
  } catch (err) {
    outputAmount.value = ""
    notification.error({
      title: "Error",
      content: err.shortMessage || err.details || err.message,
      duration: 3000,
    })
  }
}
const debounceUpdateQuoteData = debounce(updateQuoteData, 1000, { leading: true, trailing: false })
const { start: startUpdateQuoteData, stop: stopUpdateQuoteData  } = createInterval(debounceUpdateQuoteData, 20 * 1000)

const onInputAmountBlur = () => {
  if (amountIn.value <= 0n) {
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
}

const onAddRecipient = () => {
  showAddRecipient.value = true
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
  outputAmount.value = ""
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
  const doSwap = (a, b) => {
    const c = a.value
    a.value = b.value
    b.value = c
  }

  doSwap(inputToken, outputToken)
  doSwap(inputBalance, outputBalance)

  inputAmount.value = ""
  outputAmount.value = ""
  quoteData.value = null
}

const onMax = () => {
  inputAmount.value = toAmount(inputBalance.value, inputToken.value.decimals)
  onInputAmountBlur()
}

const onReviewTransaction = () => {
  tab.value = TAB_REVIEW
  onCheckApproval()
  debounceUpdateQuoteData()
}

const onBack = () => {
  tab.value = TAB_SWAP
  approved.value = false
}

const onSwap = async () => {
  swaping.value = true
  signing.value = true

  const id = inputToken.value.chainId
  const publicClient = getPublicClient(id)
  const walletClient = getWalletClient()
  const address = getRouterAddress(id)

  const _amountIn = toAmount(amountIn.value, inputToken.value.decimals, inputToken.value.dp)
  const _amountOut = toAmount(amountOut.value, outputToken.value.decimals, outputToken.value.dp)
  const content = `Swap ${_amountIn} ${inputToken.value.symbol} for ${_amountOut} ${outputToken.value.symbol}`

  const { paths, sqrtPriceX96Afters, amountIn: amount, amountSpecified } = quoteData.value

  try {
    const tx = await swap(
      { publicClient, walletClient },
      address,
      paths,
      sqrtPriceX96Afters,
      amount,
      amountSpecified,
      recipient.value || account.value,
      fee.value,
    )
    signing.value = false
    await waitTx(notification, tx, 'Success', content)
    swaping.value = false
    reset()
    updateTokenBalances(true)
    updateNativeBalance()
  } catch (err) {
    console.log(err)
    swaping.value = false
    signing.value = false
    notification.error({
      title: `Swap fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  }
}

// onMounted(() => {
//   const stopWatch = watch(account, () => {
//     reset()

//     if (account.value) {
//       debounceUpdateTokenBalances()
//     } else {
//       resetBalances()
//     }
//   })

//   onBeforeUnmount(stopWatch)
// })

onMounted(() => {
  const stopWatch = watch(selectedChainId, () => {
    reset()

    inputToken.value = allTokens.value[0] || null
    outputToken.value = allTokens.value[1] || null

    // if (account.value) {
    //   debounceUpdateTokenBalances()
    // } else {
    //   resetBalances()
    // }
  })

  onBeforeUnmount(stopWatch)
})

onMounted(() => {
  startUpdateQuoteData()
  // debounceUpdateTokenBalances()

  onBeforeUnmount(() => {
    stopUpdateQuoteData()
    // debounceUpdateTokenBalances.cancel()
    debounceUpdateQuoteData.cancel()
  })
})
</script>

<style lang="scss">
.amount-input {
  .n-input-wrapper {
    padding: 0 !important;
  }

  .n-input {
    background: transparent !important;
  }

  .n-input__input-el {
    @apply text-base sm:text-xl caret-color-base truncate text-right;
    font-weight: 700 !important;
  }

  .n-input__placeholder {
    font-weight: 700;
    @apply text-base sm:text-xl text-color-3 text-right;
  }
}
</style>
