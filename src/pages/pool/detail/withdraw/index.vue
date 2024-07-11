<template>
  <div class="flex-1 lg:p-6 flex flex-col gap-4 lg:bg-card lg:rounded-20">
    <div v-if="screen.lg" class="hidden lg:flex items-center gap-2">
      <div class="flex">
        <n-text class="font-medium text-base">Withdraw</n-text>
      </div>
    </div>
    <div class="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-6">
      <div class="flex-1 lg:p-6 flex flex-col gap-10 lg:bg-tab lg:rounded">
        <div class="flex flex-col gap-4">
          <n-text class="text-xs" depth="1">Amount to withdraw</n-text>
          <WithdrawInput v-model="inputAmount" :token="currencyLiquidity" :balance="balanceLiquidity" @change="onAmountChange" />
          <n-text class="text-xs" depth="1">Excepted to receive</n-text>
          <div class="p-4 flex flex-col gap-4 bg-card lg:bg-section rounded-lg">
            <TokenReceive :token="currency0" :balance="quoteData?.amount0 || 0n" />
            <TokenReceive :token="currency1" :balance="quoteData?.amount1 || 0n" />
          </div>
        </div>
        <div>
          <ActionButton :chain-id="pool.chainId" :chains="supportedChains">
            <ZButton v-if="!isInputValid" class="h-10 sm:h-12 w-full" :aria-label="inputHint">{{ inputHint }}</ZButton>
            <ZButton v-else class="h-10 sm:h-12 w-full" :loading="withdrawing" aria-label="Deposit" @click="onWithdraw">Withdraw</ZButton>
          </ActionButton>
        </div>
      </div>
      <PoolPosition class="w-full lg:w-56" :amount="amount" :balance="balanceLiquidity" :total="poolState.liquidity" />
    </div>
    <WithdrawModal v-model="withdrawAction" />
  </div>
</template>

<script setup>
import debounce from "lodash-es/debounce"
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { useNotification } from "naive-ui"
import { parseAmount } from "@/utils/bn"
import { screen } from "@/hooks/useScreen"
import { account, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { getPublicClient } from "@/hooks/useClient"
import { getRouterAddress } from "@/hooks/useRouter"
import { getTokenBalances, quoteRemoveLiquidity, getPool, getSupportedChains } from "@/hooks/useSwap"
import { createInterval } from "@/hooks/useTimer"
import { selectedChainId } from "@/hooks/useSelectedChain"
import { createPoolState } from "@/hooks/usePoolState"
import { createPriceState } from "@/hooks/usePrices"
import { createBalanceStates } from "@/hooks/useBalances"
import { doWithdraw } from "@/hooks/useInteraction"
import ZButton from "@/components/ZButton.vue"
import ActionButton from "@/components/ActionButton.vue"
import PoolPosition from "./PoolPosition.vue"
import WithdrawInput from "./WithdrawInput.vue"
import TokenReceive from "./TokenReceive.vue"
import WithdrawModal from "./WithdrawModal.vue"

const notification = useNotification()
const route = useRoute()

const supportedChains = getSupportedChains()

const pool = getPool(route.params.id)
const { currency0, currency1, currencyLiquidity } = pool

const { state: poolState } = createPoolState(route.params.id)
createPriceState()

const { states: balanceStates } = createBalanceStates(account, [currencyLiquidity])
const balanceLiquidity = computed(() => balanceStates.value[0])

const inputAmount = ref("")
const amount = computed(() => parseAmount(inputAmount.value || 0, currencyLiquidity.decimals))
const inputHint = computed(() => "Please enter amount")
const isInputValid = computed(() => amount.value && amount.value <= balanceLiquidity.value)

const withdrawing = ref(false)
const withdrawAction = ref({ show: false })

/**
 * @type {import('vue').Ref<{amount0: bigint, amount1: bigint}>}
 */
const quoteData = ref(null)

const updateQuoteData = async () => {
  if (!amount.value || amount.value > poolState.value.liquidity) {
    quoteData.value = null
    return
  }

  const id = currency0.chainId
  const publicClient = getPublicClient(id)
  const address = getRouterAddress(id)

  try {
    const result = await quoteRemoveLiquidity(publicClient, address, currency0.address, currency1.address, amount.value)
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
  quoteData.value = null
}

const onAmountChange = () => {
  if (!amount.value || amount.value > poolState.value.liquidity) {
    quoteData.value = null
    return
  }

  const { balance0: amount0, balance1: amount1 } = getTokenBalances(poolState.value.sqrtPriceX96, amount.value)
  quoteData.value = { amount0, amount1 }

  debounceUpdateQuoteData()
}

const onWithdraw = async () => {
  const success = await doWithdraw(withdrawAction, withdrawing, pool, amount.value, quoteData.value)
  if (success) {
    inputAmount.value = ""
    reset()
    updateNativeBalance()
  }
}

onMounted(() => {
  const stopWatch = watch(selectedChainId, () => {
    reset()
  })

  onBeforeUnmount(stopWatch)
})

onMounted(() => {
  const stopWatch = watch(account, () => {
    onAmountChange()
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
