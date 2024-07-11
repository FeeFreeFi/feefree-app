<template>
  <div class="flex-1 lg:p-6 flex flex-col gap-4 lg:bg-card lg:rounded-20">
    <div v-if="screen.lg" class="hidden lg:flex items-center gap-2">
      <div class="flex">
        <n-text class="font-medium text-base">Deposit</n-text>
      </div>
    </div>
    <div class="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-6">
      <div class="flex-1 lg:p-6 flex flex-col gap-10 lg:bg-tab rounded">
        <div class="flex flex-col gap-4">
          <n-text class="text-xs" depth="1">I want to deposit</n-text>
          <DepositInput :token="currency0" :balance="balance0" v-model="inputAmount0" @change="onAmount0Change" />
          <DepositInput :token="currency1" :balance="balance1" v-model="inputAmount1" @change="onAmount1Change" />
        </div>
        <div>
          <ActionButton :chain-id="pool.chainId" :chains="supportedChains">
            <ZButton v-if="!isInputValid" class="h-10 sm:h-12 w-full" :aria-label="inputHint">{{ inputHint }}</ZButton>
            <ZButton v-else-if="approvalChecking" class="h-10 sm:h-12 w-full" loading aria-label="Checking for Approval">Checking for Approval</ZButton>
            <div v-else-if="!approved" class="h-10 sm:h-12 w-full flex gap-3">
              <ZButton v-if="!approved0" class="flex-1" :disabled="approving0 || approving1" :loading="approving0" :aria-label="`Unlock ${currency0.symbol}`" @click="() => onApproval(true)">Unlock {{ currency0.symbol }}</ZButton>
              <ZButton v-if="!approved1" class="flex-1" :disabled="approving0 || approving1" :loading="approving1" :aria-label="`Unlock ${currency1.symbol}`" @click="() => onApproval(false)">Unlock {{ currency1.symbol }}</ZButton>
            </div>
            <ZButton v-else :disabled="depositing" class="h-10 sm:h-12 w-full" :loading="depositing" aria-label="Deposit" @click="onDeposit">Deposit</ZButton>
          </ActionButton>
        </div>
      </div>
      <PoolPosition class="w-full lg:w-56" :balance="balanceLiquidity" :total="poolState.liquidity" :currency0="currency0" :currency1="currency1" :price0="poolState.price0" :price1="poolState.price1" />
    </div>
    <ApproveModal v-model="approveAction" />
    <DepositModal v-model="depositAction" />
  </div>
</template>

<script setup>
import debounce from "lodash-es/debounce"
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { useNotification } from "naive-ui"
import { parseAmount, toAmount } from "@/utils/bn"
import { screen } from "@/hooks/useScreen"
import { account, updateBalance as updateNativeBalance } from "@/hooks/useWallet"
import { getPublicClient } from "@/hooks/useClient"
import { getRouterAddress } from "@/hooks/useRouter"
import { quoteAddLiquidity, getPool, getAmount0FromSqrtPrice, getAmount1FromSqrtPrice, getSupportedChains } from "@/hooks/useSwap"
import { createInterval } from "@/hooks/useTimer"
import { createPoolState } from "@/hooks/usePoolState"
import { createPriceState } from "@/hooks/usePrices"
import { createBalanceStates } from "@/hooks/useBalances"
import { doApproval, doCheckApproval, doCheckAllowance, doDeposit } from "@/hooks/useInteraction"
import ApproveModal from '@/components/ActionModal/ApproveModal.vue'
import ActionButton from "@/components/ActionButton.vue"
import ZButton from "@/components/ZButton.vue"
import PoolPosition from "./PoolPosition.vue"
import DepositInput from "./DepositInput.vue"
import DepositModal from './DepositModal.vue'

const notification = useNotification()
const route = useRoute()

const approveAction = ref({ show: false })

const supportedChains = getSupportedChains()

const pool = getPool(route.params.id)
const { currency0, currency1, currencyLiquidity } = pool

const { state: poolState } = createPoolState(route.params.id)
createPriceState()

const { states: balanceStates } = createBalanceStates(account, [currency0, currency1, currencyLiquidity])
const balance0 = computed(() => balanceStates.value[0])
const balance1 = computed(() => balanceStates.value[1])
const balanceLiquidity = computed(() => balanceStates.value[2])

const inputAmount0 = ref("")
const inputAmount1 = ref("")
const amount0 = computed(() => parseAmount(inputAmount0.value || 0, currency0.decimals))
const amount1 = computed(() => parseAmount(inputAmount1.value || 0, currency1.decimals))
const inputHint = computed(() => {
  if (!amount0.value || !amount1.value) {
    return "Please enter amount"
  }

  if (amount0.value > balance0.value) {
    return `${currency0.symbol} insufficient balance`
  }

  if (amount1.value > balance1.value) {
    return `${currency1.symbol} insufficient balance`
  }

  return ""
})
const isInputValid = computed(() => {
  return amount0.value && amount0.value <= balance0.value && amount1.value && amount1.value <= balance1.value
})

const depositing = ref(false)
const depositAction = ref({ show: false })

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
  const amount = isZero ? amount0.value : amount1.value
  const approving = isZero ? approving0 : approving1
  const spender = getRouterAddress(token.chainId)
  const success = await doApproval(approveAction, approving, token, spender, amount)
  if (success) {
    doCheckAllowanceOne(isZero)
    updateNativeBalance()
  }
}

/**
 * @type {import('vue').Ref<{amount0Min: bigint[], amount1Min: bigint[], liquidity:bigint}>}
 */
const quoteData = ref(null)

const reset = () => {
  approved0.value = false
  approved1.value = false
  approvalChecking.value = false
  approving0.value = false
  approving1.value = false
  depositing.value = false
}

const updateQuoteData = async () => {
  if (!amount0.value || !amount1.value) {
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
    notification.error({
      title: "Error",
      content: err.shortMessage || err.details || err.message,
      duration: 3000,
    })
  }
}
const debounceUpdateQuoteData = debounce(updateQuoteData, 1000, { leading: true, trailing: false })
const { start: startUpdateQuoteData, stop: stopUpdateQuoteData  } = createInterval(debounceUpdateQuoteData, 30 * 1000)

const onAmount0Change = () => {
  if (!amount0.value) {
    return
  }

  const amount = getAmount1FromSqrtPrice(poolState.value.sqrtPriceX96, amount0.value)
  inputAmount1.value = toAmount(amount, currency1.decimals, currency1.decimals)
  debounceUpdateQuoteData()

  onCheckApproval()
}
const onAmount1Change = () => {
  if (!amount1.value) {
    return
  }

  const amount = getAmount0FromSqrtPrice(poolState.value.sqrtPriceX96, amount1.value)
  inputAmount0.value = toAmount(amount, currency0.decimals, currency0.decimals)
  debounceUpdateQuoteData()

  onCheckApproval()
}

const onDeposit = async () => {
  const success = await doDeposit(depositAction, depositing, pool, amount0.value, amount1.value, quoteData.value)
  if (success) {
    quoteData.value = null
    inputAmount0.value = ""
    inputAmount1.value = ""
    reset()
    updateNativeBalance()
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
