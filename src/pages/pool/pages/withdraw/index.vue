<template>
  <div class="flex-1 lg:p-6 flex flex-col gap-4 lg:bg-card lg:rounded-20">
    <div v-if="screen.lg" class="hidden lg:flex items-center gap-2">
      <div class="flex">
        <n-text class="font-medium text-base">Withdraw</n-text>
      </div>
    </div>
    <div v-if="pool" class="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-6">
      <div class="flex-1 lg:p-6 flex flex-col gap-10 lg:bg-tab lg:rounded">
        <div class="flex flex-col gap-4">
          <n-text class="text-xs" depth="1">Amount to withdraw</n-text>
          <WithdrawInput v-model="inputAmount" :pool="pool" :balance="liquidity" @change="onAmountChange" />
          <n-text class="text-xs" depth="1">Excepted to receive</n-text>
          <div class="p-4 flex flex-col gap-4 bg-card lg:bg-section rounded-lg">
            <TokenReceive :token="pool.currency0" :balance="quoteData?.amount0Min || 0n" />
            <TokenReceive :token="pool.currency1" :balance="quoteData?.amount1Min || 0n" />
          </div>
        </div>
        <div>
          <ActionButton :chain-id="pool.chainId" :chains="supportedChains">
            <ZButton v-if="!isInputValid" class="h-10 sm:h-12 w-full" :aria-label="inputHint">{{ inputHint }}</ZButton>
            <ZButton v-else-if="approvalChecking" class="h-10 sm:h-12 w-full" loading disabled aria-label="Checking for Approval">Checking for Approval</ZButton>
            <ZButton v-else-if="!approved" class="h-10 sm:h-12 w-full" :disabled="approving" :loading="approving" :aria-label="`Approve ${getPoolName(pool)}`" @click="onApproval">Approve {{ getPoolName(pool) }}</ZButton>
            <ZButton v-else class="h-10 sm:h-12 w-full" :loading="withdrawing" aria-label="Deposit" @click="onWithdraw">Withdraw</ZButton>
          </ActionButton>
        </div>
      </div>
      <PoolPosition class="w-full lg:w-56" :amount="amount" :balance="liquidity" :total="poolData.liquidity" />
    </div>
    <ApproveLiquidtyModal v-model="approveAction" />
    <WithdrawModal v-model="withdrawAction" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useNotification } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { PAGE_NOT_FOUND } from '@/config'
import { parseAmount, decodePoolId } from '@/utils'
import { screen } from '@/hooks/useScreen'
import { account, updateNativeBalance } from '@/hooks/useWallet'
import { appChainId } from '@/hooks/useAppState'
import { approveLiquidity, checkLiquidityAllowance, getManagerAddress, getSupportedChains, isSupportChain, quoteRemoveLiquidity, removeLiquidity } from '@/hooks/useManager'
import { fetchPoolMeta, getPoolData, getPoolName } from '@/hooks/usePool'
import { createLiquidityState } from '@/hooks/useLiquidityState'
import { configReady } from '@/hooks/useConfig'
import { doSend } from '@/hooks/useInteraction'
import { onPriceChanged } from '@/hooks/usePrices'
import { createPoolState } from '@/hooks/usePoolState'
import { createQuoteState } from '@/hooks/useQuoteState'
import { createDebounceUpdate } from '@/hooks/useTimer'
import ZButton from '@/components/ZButton.vue'
import ActionButton from '@/components/ActionButton.vue'
import PoolPosition from './PoolPosition.vue'
import WithdrawInput from './WithdrawInput.vue'
import TokenReceive from './TokenReceive.vue'
import ApproveLiquidtyModal from './ApproveLiquidtyModal.vue'
import WithdrawModal from './WithdrawModal.vue'

const route = useRoute()
const router = useRouter()
const notification = useNotification()

/** @type {import('vue').Ref<{chainId:number}[]>} */
const supportedChains = ref([])

/** @type {import('vue').Ref<import('@/types').PoolMeta>} */
const pool = ref(null)
/** @type {import('vue').Ref<import('@/types').PoolData>} */
const poolData = ref(getPoolData())
/** @type {import('vue').Ref<import('@/types').QuoteRemoveLiquidityData>} */
const quoteData = ref(null)
/** @type {import('vue').Ref<() => Promise<void>>} */
const debounceUpdateQuote = ref(null)
/** @type {import('vue').Ref<() => Promise<void>>} */
const debounceCheckApproval = ref(null)
/** @type {import('vue').Ref<() => Promise<void>>} */
const debounceUpdateLiquidity = ref(null)

const liquidity = ref(0n)

const inputAmount = ref('')
const amount = computed(() => parseAmount(inputAmount.value || 0, 0))
const inputHint = computed(() => 'Please enter amount')
const isInputValid = computed(() => amount.value && amount.value <= liquidity.value)

const approvalChecking = ref(false)
const approving = ref(false)
const approved = ref(false)
const approveAction = ref({ show: false })

const withdrawing = ref(false)
const withdrawAction = ref({ show: false })

const checkAllowance = async () => {
  approved.value = pool.value ? await checkLiquidityAllowance(pool.value, account.value, amount.value) : false
}

const onApproval = async () => {
  const { chainId } = pool.value
  const spender = getManagerAddress(chainId)

  approveAction.value.data = { chainId, pool: pool.value, amount: amount.value, spender }

  const success = await doSend(approveAction, approving, 'Approve', () => approveLiquidity(pool.value, spender, amount.value))

  if (success) {
    checkAllowance()
    updateNativeBalance()
  }
}

const updateQuoteData = async () => {
  if (!amount.value || amount.value > liquidity.value) {
    quoteData.value = null
    return
  }

  try {
    quoteData.value = await quoteRemoveLiquidity(pool.value.chainId, pool.value.currency0.address, pool.value.currency1.address, amount.value)
  } catch (err) {
    notification.error({
      title: 'Error',
      content: err.shortMessage || err.details || err.message,
      duration: 3000,
    })
  }
}

const reset = () => {
  withdrawing.value = false
  quoteData.value = null
}

const onAmountChange = () => {
  if (!amount.value || amount.value > liquidity.value) {
    quoteData.value = null
    return
  }

  debounceUpdateQuote.value && debounceUpdateQuote.value()
  debounceCheckApproval.value && debounceCheckApproval.value()
}

const onWithdraw = async () => {
  const { currency0, currency1, liquidity, amount0Min, amount1Min } = quoteData.value
  const params = { currency0, currency1, liquidity, amount0Min, amount1Min, recipient: account.value }

  withdrawAction.value.data = { chainId: pool.value.chainId, pool: pool.value, amount0Min, amount1Min }

  const success = await doSend(withdrawAction, withdrawing, 'Withdraw', () => removeLiquidity(params))

  if (success) {
    inputAmount.value = ''
    reset()
    debounceUpdateLiquidity.value && debounceUpdateLiquidity.value()
    updateNativeBalance()
  }
}

onMounted(async () => {
  debounceUpdateLiquidity.value = createLiquidityState(account, pool, liquidity)

  const debounceUpdatePool = createPoolState(pool, poolData)
  onPriceChanged(debounceUpdatePool)

  debounceUpdateQuote.value = createQuoteState(updateQuoteData)
  const res = createDebounceUpdate(checkAllowance, 300)
  debounceCheckApproval.value = res.debounceUpdate

  watch(appChainId, reset)
  watch(account, onAmountChange)

  await configReady()

  supportedChains.value = getSupportedChains()

  try {
    const { valid, chainId, poolId } = decodePoolId(route.params.id)
    if (!valid || !isSupportChain(chainId)) {
      router.replace({ name: PAGE_NOT_FOUND })
      return
    }

    pool.value = await fetchPoolMeta(chainId, poolId)
  } catch {
    router.replace({ name: PAGE_NOT_FOUND })
  }
})
</script>
