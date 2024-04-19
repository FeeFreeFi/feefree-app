<template>
  <div class="flex flex-col py-6 sm:py-10 text-sm sm:text-base">
    <div class="mx-auto relative w-full sm:w-[520px] h-[428px] sm:h-[498px]">
      <n-tabs class="h-full relative [&>.n-tabs-nav]:hidden" :value="tab" pane-wrapper-class="h-full" pane-class="h-full relative !p-0" animated>
        <n-tab-pane :name="TAB_EXCHANGE">
          <!-- exchange -->
          <ZSectionView>
            <!-- header -->
            <div class="h-10 flex-y-center justify-between">
              <n-text class="text-xl sm:text-2xl font-medium">Exchange</n-text>
            </div>
            <!-- exchange -->
            <div class="mt-4 mb-6 flex flex-col gap-6 relative">
              <!-- source -->
              <div class="rounded flex flex-col bg-block">
                <div class="px-3 py-4 flex-y-center gap-2">
                  <ZSelectToken :token="inputToken" label="Input Token" :disabled="!canSelectToken" :on-select="onSelectInputToken">
                    <PlusToken :token="inputToken" />
                  </ZSelectToken>
                  <n-input-number class="flex-1 amount-input" v-model:value="inputAmount" :min="0" :bordered="false" placeholder="0.0" :show-button="false" :on-blur="onAmountBlur" />
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
              <!-- target -->
              <div class="rounded flex flex-col bg-block">
                <div class="px-3 py-4 flex-y-center gap-2">
                  <ZSelectToken :token="outputToken" label="Output Token" :disabled="!canSelectToken" :on-select="onSelectOutputToken">
                    <PlusToken :token="outputToken" />
                  </ZSelectToken>
                  <n-input-number class="flex-1 amount-input" v-model:value="inputAmount" :min="0" :bordered="false" placeholder="0.0" :show-button="false" readonly />
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
              <n-button class="absolute translate-center" type="primary" circle tertiary size="medium" aria-label="reverse" :disabled="!inputToken && !outputToken" @click="onReverse">
                <i-mdi-swap-vertical class="size-6" />
              </n-button>
            </div>
            <!-- button -->
            <div>
              <n-button class="primary-btn" v-if="account" type="primary" strong block aria-label="Review Transaction" :disabled="!amountIn || amountIn > inputBalance" @click="onReviewTransaction">
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
                    <PlusTokenIcon class="shrink-0" :token="inputToken" />
                    <ZTokenBalance content-class="text-sm" :token="inputToken" :balance="amountIn" />
                  </div>
                  <n-text class="flex-center size-6">
                    <i-mdi-chevron-double-right />
                  </n-text>
                  <!-- To -->
                  <div class="bg-bg-3 px-2 py-3 rounded flex-y-center truncate gap-2">
                    <PlusTokenIcon class="shrink-0" :token="outputToken" />
                    <ZTokenBalance content-class="text-sm" :token="outputToken" :balance="amountIn" />
                  </div>
                </div>
              </div>
              <div class="bg-block px-3 sm:px-4 flex flex-col">
                <!-- Output -->
                <div class="py-4 flex justify-between gap-2">
                  <n-text class="font-medium shrink-0 text-color-3">Output:</n-text>
                  <ZTokenBalance :token="outputToken" :balance="amountIn" />
                </div>
                <n-divider class="!my-0" />
                <!-- Exchange Fee -->
                <div class="py-4 flex justify-between">
                  <n-text class="font-medium text-color-3">Exchange Fee:</n-text>
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
              <n-button v-else class="primary-btn" :disabled="exchanging" :loading="exchanging" type="primary" block strong aria-label="Exchange" @click="onExchange">{{ signing ? 'Waiting For Wallet Confirmation' : 'Exchange' }}</n-button>
            </div>
          </ZSectionView>
        </n-tab-pane>
      </n-tabs>
    </div>
    <TokenSelector v-model:show="showTokenSelector" :current="currentToken" :tokens="allTokens" :on-select="onSelectToken">
      <template #token="{token}">
        <PlusTokenIcon :token="token" />
      </template>
    </TokenSelector>
    <AddRecipient v-model:show="showAddRecipient" v-model="recipient" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useNotification } from "naive-ui"
import { fromValue, parseAmount, toAmount } from "@/utils/bn"
import shortString from "@/utils/shortString"
import { account, chainId, getWalletClient, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { open as openWalletConnector } from "@/hooks/useWalletConnector"
import { createBalanceStates2 } from "@/hooks/useBalances"
import { getPublicClient } from "@/hooks/useClient"
import { getNativeCurrency } from "@/hooks/useChains"
import { waitTx } from "@/hooks/useWaitTx"
import { exchange, getPairs, findOtherToken, isExchangeToken } from "@/hooks/useExchange"
import { isSame } from "@/hooks/useCurrency"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { getPrice, createPriceState } from "@/hooks/usePrices"
import { getFee, getRouterAddress } from "@/hooks/useRouter"
import { doApproval, doCheckAllowance, doCheckApproval, doSwitchNetwork } from "@/hooks/useInteraction"
import TokenSelector from "@/components/TokenSelector/index.vue"
import AddRecipient from "@/components/AddRecipient/index.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZSectionView from "@/components/ZSectionView.vue"
import ZSelectToken from "@/components/ZSelectToken.vue"
import PlusTokenIcon from "./PlusTokenIcon.vue"
import PlusToken from "./PlusToken.vue"

createPriceState()
const notification = useNotification()

const TAB_EXCHANGE = "exchange"
const TAB_REVIEW = "review"

const tab = ref(TAB_EXCHANGE)

const isForInput = ref(true)
const allPairs = computed(() => getPairs(selectedChainId.value))

const inputToken = ref(allPairs.value[0]?.currency0)
const outputToken = ref(allPairs.value[0]?.currency1)
const isInputExchange = computed(() => inputToken.value && isExchangeToken(inputToken.value))
const isPlus = computed(() => isForInput.value ? isInputExchange.value : isExchangeToken(outputToken.value))

const currentToken = computed(() => isForInput.value ? inputToken.value : outputToken.value)
const allTokens = computed(() => isPlus.value ? allPairs.value.map(p => p.currency1) : allPairs.value.map(p => p.currency0))
const canSelectToken = computed(() => allPairs.value.length > 0)

const focusTokens = computed(() => [inputToken.value, outputToken.value])
const { states: balanceStates, update: updateTokenBalances } = createBalanceStates2(account, focusTokens)
const inputBalance = computed(() => balanceStates.value[0])
const outputBalance = computed(() => balanceStates.value[1])

const inputAmount = ref("")
const amountIn = computed(() => inputToken.value ? parseAmount(inputAmount.value || 0, inputToken.value.decimals) : 0n)
const fee = computed(() => inputToken.value ? getFee(inputToken.value.chainId) : 0n)
const gasToken = computed(() => inputToken.value ? getNativeCurrency(inputToken.value.chainId) : null)
const feeValue = computed(() => gasToken.value ? fromValue(getPrice(gasToken.value.symbol)).times(fee.value).div(1e18).dp(4).toNumber() : 0)

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

const exchanging = ref(false)
const signing = ref(false)
const showTokenSelector = ref(false)
const showAddRecipient = ref(false)
const recipient = ref('')

const requireSwitchChain = computed(() => chainId.value !== inputToken.value.chainId)
const switching = ref(false)
const onSwitchNetwork = () => doSwitchNetwork(notification, switching, inputToken.value.chainId)

const reset = () => {
  tab.value = TAB_EXCHANGE

  approved.value = false
  approvalChecking.value = false
  approving.value = false
  exchanging.value = false
  signing.value = false
  switching.value = false

  // inputAmount.value = ""
  recipient.value = ""
  showTokenSelector.value = false
  showAddRecipient.value = false
  isForInput.value = true
}

const onAddRecipient = () => {
  showAddRecipient.value = true
}

const onAmountBlur = () => {
  inputAmount.value = amountIn.value === 0n ? '' : toAmount(amountIn.value, inputToken.value.decimals)
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

  // inputAmount.value = ""
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
}

const onMax = () => {
  inputAmount.value = toAmount(inputBalance.value, inputToken.value.decimals)
  onAmountBlur()
}

const onReviewTransaction = () => {
  tab.value = TAB_REVIEW
  if (isInputExchange.value) {
    approved.value = true
  } else {
    onCheckApproval()
  }
}

const onBack = () => {
  tab.value = TAB_EXCHANGE
  approved.value = false
}

const onExchange = async () => {
  exchanging.value = true
  signing.value = true

  try {
    const id = inputToken.value.chainId
    const publicClient = getPublicClient(id)
    const walletClient = getWalletClient()
    const address = getRouterAddress(id)

    const amount = toAmount(amountIn.value, inputToken.value.decimals, inputToken.value.dp)
    const content = `Exchange ${amount} ${inputToken.value.symbol} for ${amount} ${outputToken.value.symbol}`
    const amountSpecified = isInputExchange.value ? amountIn.value : -amountIn.value
    const currency = isInputExchange.value ? outputToken.value.address : inputToken.value.address

    const tx = await exchange(
      { publicClient, walletClient },
      address,
      currency,
      amountSpecified,
      recipient.value || account.value,
      fee.value,
    )
    signing.value = false
    await waitTx(notification, tx, 'Success', content)
    exchanging.value = false
    inputAmount.value = ""
    reset()
    updateTokenBalances(true)
    updateNativeBalance()
  } catch (err) {
    console.log(err)
    exchanging.value = false
    signing.value = false
    notification.error({
      title: `Exchange fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  }
}

onMounted(() => {
  const stopWatch = watch(selectedChainId, () => {
    reset()

    inputToken.value = allPairs.value[0]?.currency0 || null
    outputToken.value = allPairs.value[0]?.currency1 || null
  })

  onBeforeUnmount(stopWatch)
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
