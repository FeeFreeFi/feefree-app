<template>
  <div class="flex flex-col text-sm sm:text-base">
    <div class="relative w-full sm:max-w-[432px]">
      <!-- withdraw -->
      <ZSectionView>
        <!-- header -->
        <div class="h-10 flex-y-center justify-between">
          <n-text class="text-xl sm:text-2xl font-medium">Withdraw</n-text>
        </div>
        <div class="mt-4 mb-6 flex flex-col gap-6 relative">
          <!-- currency LP -->
          <div class="rounded flex flex-col bg-block">
            <div class="px-3 py-4 flex-y-center gap-2">
              <ZPoolIcon :currency0="currency0" :currency1="currency1" />
              <n-input-number class="flex-1 amount-input" v-model:value="inputAmountLP" :min="0" :bordered="false" placeholder="0.0" :show-button="false" :on-blur="onAmountBlur" />
            </div>
            <n-divider class="!my-0" />
            <div class="p-3 flex-y-center justify-between gap-2">
              <div class="flex-y-center overflow-hidden">
                <n-text class="mr-1 font-medium text-color-3">Liquidity:</n-text>
                <ZTokenBalance content-class="text-color-3" tooltip-class="text-xs sm:text-sm" :token="currencyLiquidity" :balance="balanceLiquidity" :show-symbol="false" />
              </div>
              <n-button class="ml-[2px] h-6 p-1" text aria-label="Max" :disabled="!balanceLiquidity" @click="onMax">
                <n-text class="text-sm font-medium" type="primary">MAX</n-text>
              </n-button>
            </div>
          </div>
          <div class="bg-block px-3 sm:px-4 flex flex-col">
            <!-- currency0 -->
            <div class="py-4 flex justify-between gap-2">
              <div class="flex-y-center gap-2">
                <ZTokenIcon :token="currency0" />
                <ZTokenSymbol :symbol="currency0.symbol" />
              </div>
              <div class="flex">
                <ZTokenBalance :token="currency0" :balance="quoteData?.amount0 || 0n" :dp="6" :show-symbol="false" />
              </div>
            </div>
            <!-- currency1 -->
            <div class="py-4 flex justify-between gap-2">
              <div class="flex-y-center gap-2">
                <ZTokenIcon :token="currency1" />
                <ZTokenSymbol :symbol="currency1.symbol" />
              </div>
              <div class="flex">
                <ZTokenBalance :token="currency1" :balance="quoteData?.amount1 || 0n" :dp="6" :show-symbol="false" />
              </div>
            </div>
          </div>
        </div>
        <!-- button -->
        <div>
          <!-- <n-button class="primary-btn" v-if="account" type="primary" strong block aria-label="Review Transaction" :disabled="!canReview" @click="onReviewTransaction">
            {{ amountLP && amountLP > balanceLiquidity ? `Insufficient ${currencyLiquidity.symbol} Balance` : "Review Transaction" }}
          </n-button> -->
          <n-button class="primary-btn" v-if="!account" type="primary" strong block aria-label="Connect Wallet" @click="openWalletConnector">Connect Wallet</n-button>
          <n-button v-else-if="requireSwitchChain" class="primary-btn" :disabled="switching" :loading="switching" type="info" block strong aria-label="Switch Network" @click="onSwitchNetwork">Switch Network</n-button>
          <n-button v-else class="primary-btn" :disabled="!canWithdraw" :loading="withdrawing" type="primary" block strong aria-label="Deposit" @click="onWithdraw">{{ signing ? 'Waiting For Wallet Confirmation' : 'Withdraw' }}</n-button>
        </div>
      </ZSectionView>
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
import { getTokenBalances, removeLiquidity, quoteRemoveLiquidity, getPool } from "@/hooks/useSwap"
import { createInterval } from "@/hooks/useTimer"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { createPoolState } from "@/hooks/usePoolState"
import { createPriceState } from "@/hooks/usePrices"
import { createBalanceStates } from "@/hooks/useBalances"
import ZTokenBalance from "@/components/ZTokenBalance.vue"
import ZSectionView from "@/components/ZSectionView.vue"
import ZPoolIcon from "@/components/ZPoolIcon.vue"
import ZTokenSymbol from "@/components/ZTokenSymbol.vue"
import ZTokenIcon from "@/components/ZTokenIcon.vue"
import { doSwitchNetwork } from "@/hooks/useInteraction"

const notification = useNotification()
const route = useRoute()

const pool = getPool(route.params.id)
const { currency0, currency1, currencyLiquidity } = pool

const { state: poolState } = createPoolState(route.params.id)
createPriceState()

const { states: balanceStates } = createBalanceStates(account, [currencyLiquidity])
const balanceLiquidity = computed(() => balanceStates.value[0])

const inputAmountLP = ref("")
const amountLP = computed(() => parseAmount(inputAmountLP.value || 0, currencyLiquidity.decimals))

const withdrawing = ref(false)
const signing = ref(false)

const requireSwitchChain = computed(() => chainId.value !== pool.chainId)
const switching = ref(false)
const onSwitchNetwork = () => doSwitchNetwork(notification, switching, pool.chainId)

const canWithdraw = computed(() => {
  if (amountLP.value === 0n || amountLP.value > balanceLiquidity.value) {
    return false
  }

  return true
})

/**
 * @type {import('vue').Ref<{amount0: bigint, amount1: bigint}>}
 */
const quoteData = ref(null)

const updateQuoteData = async () => {
  if (amountLP.value === 0n) {
    quoteData.value = null
    return
  }

  const id = currency0.chainId
  const publicClient = getPublicClient(id)
  const address = getRouterAddress(id)

  try {
    const result = await quoteRemoveLiquidity(publicClient, address, currency0.address, currency1.address, amountLP.value)
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

const reset = () => {
  withdrawing.value = false
  signing.value = false
  switching.value = false

  quoteData.value = null
}

const onMax = () => {
  inputAmountLP.value = toAmount(balanceLiquidity.value, currencyLiquidity.decimals)
  onAmountBlur()
}

const onAmountBlur = () => {
  if (amountLP.value <= 0n) {
    return
  }

  const { balance0: amount0, balance1: amount1 } = getTokenBalances(poolState.value.sqrtPriceX96, amountLP.value)
  quoteData.value = { amount0, amount1 }

  debounceUpdateQuoteData()
}

const onWithdraw = async () => {
  withdrawing.value = true
  signing.value = true

  const id = currency0.chainId
  const publicClient = getPublicClient(id)
  const walletClient = getWalletClient()
  const address = getRouterAddress(id)

  const { amount0, amount1 } = quoteData.value
  const _amount0 = toAmount(amount0, currency0.decimals, currency0.dp)
  const _amount1 = toAmount(amount1, currency1.decimals, currency1.dp)
  const content = `Withdraw for ${_amount0} ${currency0.symbol} and ${_amount1} ${currency1.symbol}`

  try {
    const tx = await removeLiquidity(
      { publicClient, walletClient },
      address,
      currency0.address,
      currency1.address,
      amountLP.value
    )
    signing.value = false
    await waitTx(notification, tx, 'Success', content)
    withdrawing.value = false
    reset()
    updateNativeBalance()
  } catch (err) {
    console.log(err)
    withdrawing.value = false
    signing.value = false
    notification.error({
      title: `Withdraw fail`,
      content: err.shortMessage || err.details || err.message,
      duration: 5000,
    })
  }
}

onMounted(() => {
  const stopWatch = watch(selectedChainId, () => {
    reset()
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
