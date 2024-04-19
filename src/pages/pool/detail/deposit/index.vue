<template>
  <div class="flex flex-col text-sm sm:text-base">
    <div class="relative w-full sm:w-[432px]">
      <n-tabs class="h-full relative [&>.n-tabs-nav]:hidden" :value="tab" pane-wrapper-class="h-full" pane-class="h-full relative !p-0" animated>
        <n-tab-pane :name="TAB_DEPOSIT">
          <!-- deposit -->
          <ZSectionView>
            <!-- header -->
            <div class="h-10 flex-y-center justify-between">
              <n-text class="text-xl sm:text-2xl font-medium">Deposit</n-text>
            </div>
            <div class="mt-4 mb-6 flex flex-col gap-6 relative">
              <!-- currency0 -->
              <div class="rounded flex flex-col bg-block">
                <div class="px-3 py-4 flex-y-center gap-2">
                  <ZToken :token="currency0" />
                  <n-input-number class="flex-1 amount-input" v-model:value="inputAmount0" :min="0" :bordered="false" placeholder="0.0" :show-button="false" :on-blur="onAmount0Blur" />
                </div>
                <n-divider class="!my-0" />
                <div class="p-3 flex-y-center justify-between gap-2">
                  <div class="flex-y-center overflow-hidden">
                    <n-text class="mr-1 font-medium text-color-3">Balance:</n-text>
                    <ZTokenBalance content-class="text-color-3" tooltip-class="text-xs sm:text-sm" :token="currency0" :balance="balance0" :show-symbol="false" />
                  </div>
                  <n-button class="ml-[2px] h-6 p-1" text aria-label="Max" :disabled="!balance0" @click="onMax0">
                    <n-text class="text-sm font-medium" type="primary">MAX</n-text>
                  </n-button>
                </div>
              </div>
              <!-- currency1 -->
              <div class="rounded flex flex-col bg-block">
                <div class="px-3 py-4 flex-y-center gap-2">
                  <ZToken :token="currency1" />
                  <n-input-number class="flex-1 amount-input" v-model:value="inputAmount1" :min="0" :bordered="false" placeholder="0.0" :show-button="false" :on-blur="onAmount1Blur" />
                </div>
                <n-divider class="!my-0" />
                <div class="p-3 flex-y-center justify-between gap-2">
                  <div class="flex-y-center overflow-hidden">
                    <n-text class="mr-1 font-medium text-color-3">Balance:</n-text>
                    <ZTokenBalance content-class="text-color-3" tooltip-class="text-xs sm:text-sm" :token="currency0" :balance="balance1" :show-symbol="false" />
                  </div>
                  <n-button class="ml-[2px] h-6 p-1" text aria-label="Max" :disabled="!balance1" @click="onMax1">
                    <n-text class="text-sm font-medium" type="primary">MAX</n-text>
                  </n-button>
                </div>
              </div>
            </div>
            <!-- button -->
            <div>
              <n-button class="primary-btn" v-if="account" type="primary" strong block aria-label="Review Transaction" :disabled="!canReview" @click="onReviewTransaction">
                {{ amount0 && amount0 > balance0 ? `Insufficient ${currency0.symbol} Balance` : (amount1 && amount1 > balance1 ? `Insufficient ${currency1.symbol} Balance` : "Review Transaction") }}
              </n-button>
              <n-button class="primary-btn" v-else type="primary" strong block aria-label="Connect Wallet" @click="openWalletConnector">Connect Wallet</n-button>
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
                <!-- currency0 currency1 -->
                <div class="grid grid-cols-[1fr_24px_1fr] overflow-hidden gap-2 items-center">
                  <!-- currency0 -->
                  <div class="bg-bg-3 px-2 py-3 rounded flex-y-center truncate gap-2">
                    <ZTokenIcon class="shrink-0" :token="currency0" />
                    <ZTokenBalance content-class="text-sm" :token="currency0" :balance="amount0" />
                  </div>
                  <n-text class="flex-center size-6">
                    <i-material-symbols-link />
                  </n-text>
                  <!-- currency1 -->
                  <div class="bg-bg-3 px-2 py-3 rounded flex-y-center truncate gap-2">
                    <ZTokenIcon class="shrink-0" :token="currency1" />
                    <ZTokenBalance content-class="text-sm" :token="currency1" :balance="amount1" />
                  </div>
                </div>
              </div>
              <div class="bg-block px-3 sm:px-4 flex flex-col">
                <!-- currency0 -->
                <div class="py-4 flex justify-between gap-2">
                  <n-text class="font-medium shrink-0 text-color-3">{{ currency0.symbol }}:</n-text>
                  <div class="flex">
                    <ZTokenBalance :token="currency0" :balance="quoteData?.amount0Min || 0n" :dp="6" />
                  </div>
                </div>
                <!-- currency1 -->
                <div class="py-4 flex justify-between gap-2">
                  <n-text class="font-medium shrink-0 text-color-3">{{ currency1.symbol }}:</n-text>
                  <div class="flex">
                    <ZTokenBalance :token="currency1" :balance="quoteData?.amount1Min || 0n" :dp="6" />
                  </div>
                </div>
                <!-- Output -->
                <div class="py-4 flex justify-between gap-2">
                  <n-text class="font-medium shrink-0 text-color-3">Output:</n-text>
                  <div class="flex">
                    <ZTokenBalance :token="currencyLiquidity" :balance="quoteData?.liquidity || 0n" :dp="6" />
                  </div>
                </div>
              </div>
            </div>
            <!-- button -->
            <div>
              <n-button v-if="approvalChecking" class="primary-btn" disabled loading type="primary" block strong aria-label="Checking for Approval">Checking for Approval</n-button>
              <n-button v-else-if="requireSwitchChain" class="primary-btn" :disabled="switching" :loading="switching" type="info" block strong aria-label="Switch Network" @click="onSwitchNetwork">Switch Network</n-button>
              <div v-else-if="!approved" class="flex gap-2">
                <n-button v-if="!approved0" class="primary-btn flex-1" :disabled="approving0 || approving1" :loading="approving0" type="primary" strong :aria-label="`Unlock ${currency0.symbol}`" @click="() => onApproval(true)">Unlock {{ currency0.symbol }}</n-button>
                <n-button v-if="!approved1" class="primary-btn flex-1" :disabled="approving0 || approving1" :loading="approving1" type="primary" strong :aria-label="`Unlock ${currency1.symbol}`" @click="() => onApproval(false)">Unlock {{ currency1.symbol }}</n-button>
              </div>
              <n-button v-else class="primary-btn" :disabled="depositing" :loading="depositing" type="primary" block strong aria-label="Deposit" @click="onDeposit">{{ signing ? 'Waiting For Wallet Confirmation' : 'Deposit' }}</n-button>
            </div>
          </ZSectionView>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup>
import debounce from "lodash-es/debounce"
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { useNotification } from "naive-ui"
import { parseAmount, toAmount } from "@/utils/bn"
import { account, chainId, getWalletClient, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { getPublicClient } from "@/hooks/useClient"
import { open as openWalletConnector } from "@/hooks/useWalletConnector"
import { waitTx } from "@/hooks/useWaitTx"
import { getRouterAddress } from "@/hooks/useRouter"
import { addLiquidity, quoteAddLiquidity, getAmount0FromSqrtPrice, getAmount1FromSqrtPrice, getPool } from "@/hooks/useSwap"
import { createInterval } from "@/hooks/useTimer"
import { createPoolState } from "@/hooks/usePoolState"
import { createPriceState } from "@/hooks/usePrices"
import { createBalanceStates } from "@/hooks/useBalances"
import ZToken from "@/components/ZToken.vue"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZSectionView from "@/components/ZSectionView.vue"
import { doApproval, doCheckApproval, doCheckAllowance, doSwitchNetwork } from "@/hooks/useInteraction"

const notification = useNotification()
const route = useRoute()

const TAB_DEPOSIT = "deposit"
const TAB_REVIEW = "review"

const tab = ref(TAB_DEPOSIT)
const pool = getPool(route.params.id)
const { currency0, currency1, currencyLiquidity } = pool

const { state: poolState } = createPoolState(route.params.id)
createPriceState()

const { states: balanceStates } = createBalanceStates(account, [currency0, currency1])
const balance0 = computed(() => balanceStates.value[0])
const balance1 = computed(() => balanceStates.value[1])

const inputAmount0 = ref("")
const inputAmount1 = ref("")
const amount0 = computed(() => parseAmount(inputAmount0.value || 0, currency0.decimals))
const amount1 = computed(() => parseAmount(inputAmount1.value || 0, currency1.decimals))

const signing = ref(false)
const depositing = ref(false)

const approvalChecking = ref(false)
const approving0 = ref(false)
const approving1 = ref(false)
const approved0 = ref(false)
const approved1 = ref(false)
const approved = computed(() => approved0.value && approved1.value)
const checkAllowance = async () => {
  await Promise.all([
    doCheckAllowanceOne(true),
    doCheckAllowanceOne(false)
  ])
}
const doCheckAllowanceOne = async isZero => {
  const _approved = isZero ? approved0 : approved1
  const token = isZero ? currency0 : currency1
  const spender = getRouterAddress(token.chainId)
  const amount = isZero ? amount0.value : amount1.value
  await doCheckAllowance(_approved, token, account.value, spender, amount)
}
const onCheckApproval = () => doCheckApproval(approvalChecking, checkAllowance)
const onApproval = async isZero => {
  const token = isZero ? currency0 : currency1
  const spender = getRouterAddress(token.chainId)
  const amount = isZero ? balance0.value : balance1.value
  const approving = isZero ? approving0 : approving1
  const success = await doApproval(notification, approving, token, spender, amount)
  if (success) {
    doCheckAllowanceOne(isZero)
    updateNativeBalance()
  }
}

const requireSwitchChain = computed(() => chainId.value !== pool.chainId)
const switching = ref(false)
const onSwitchNetwork = () => doSwitchNetwork(notification, switching, pool.chainId)

const canReview = computed(() => amount0.value > 0n || amount1.value > 0n)

/**
 * @type {import('vue').Ref<{amount0Min: bigint[], amount1Min: bigint[], liquidity:bigint}>}
 */
const quoteData = ref(null)

const reset = () => {
  tab.value = TAB_DEPOSIT

  approved0.value = false
  approved1.value = false
  approvalChecking.value = false
  approving0.value = false
  approving1.value = false
  depositing.value = false
  signing.value = false
  switching.value = false

  // inputAmount0.value = ""
  // inputAmount1.value = ""
  // quoteData.value = null
}

const updateQuoteData = async () => {
  if (amount0.value === 0n || amount1.value === 0n) {
    quoteData.value = null
    return
  }

  const id = currency0.chainId
  const publicClient = getPublicClient(id)
  const address = getRouterAddress(id)

  try {
    const result = await quoteAddLiquidity(publicClient, address, currency0.address, currency1.address, amount0.value, amount1.value)
    quoteData.value = result
  } catch (err) {
    // outputAmount.value = ""
    notification.error({
      title: "Error",
      content: err.shortMessage || err.details || err.message,
      duration: 3000,
    })
  }
}
const debounceUpdateQuoteData = debounce(updateQuoteData, 1000, { leading: true, trailing: false })
const { start: startUpdateQuoteData, stop: stopUpdateQuoteData  } = createInterval(debounceUpdateQuoteData, 30 * 1000)

const onMax0 = () => {
  inputAmount0.value = toAmount(balance0.value, currency0.decimals)
  onAmount0Blur()
}
const onMax1 = () => {
  inputAmount1.value = toAmount(balance1.value, currency0.decimals)
  onAmount1Blur()
}
const onAmount0Blur = () => {
  if (amount0.value <= 0n) {
    return
  }

  inputAmount1.value = toAmount(getAmount1FromSqrtPrice(poolState.value.sqrtPriceX96, amount0.value), currency0.decimals)
  debounceUpdateQuoteData()
}
const onAmount1Blur = () => {
  if (amount1.value <= 0n) {
    return
  }

  inputAmount0.value = toAmount(getAmount0FromSqrtPrice(poolState.value.sqrtPriceX96, amount1.value), currency1.decimals)
  debounceUpdateQuoteData()
}

const onReviewTransaction = async () => {
  tab.value = TAB_REVIEW
  onCheckApproval()
}

const onBack = () => {
  tab.value = TAB_DEPOSIT
}

const onDeposit = async () => {
  depositing.value = true
  signing.value = true

  const id = currency0.chainId
  const publicClient = getPublicClient(id)
  const walletClient = getWalletClient()
  const address = getRouterAddress(id)

  const _amount0 = toAmount(amount0.value, currency0.decimals, currency0.dp)
  const _amount1 = toAmount(amount1.value, currency1.decimals, currency1.dp)
  const content = `Deposit for ${_amount0} ${currency0.symbol} and ${_amount1} ${currency1.symbol}`

  const { amount0Min, amount1Min } = quoteData.value

  try {
    const tx = await addLiquidity(
      { publicClient, walletClient },
      address,
      currency0.address,
      currency1.address,
      amount0.value,
      amount1.value,
      amount0Min,
      amount1Min,
      account.value,
    )
    signing.value = false
    await waitTx(notification, tx, 'Success', content)
    depositing.value = false
    quoteData.value = null
    inputAmount0.value = ""
    inputAmount1.value = ""
    reset()
    updateNativeBalance()
  } catch (err) {
    console.log(err)
    depositing.value = false
    signing.value = false
    notification.error({
      title: `Deposit fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  }
}

onMounted(() => {
  const stopWatch = watch(account, () => {
    reset()
  })

  onBeforeUnmount(stopWatch)
})

onMounted(() => {
  startUpdateQuoteData()

  onBeforeUnmount(() => {
    stopUpdateQuoteData()
  })
})
</script>
