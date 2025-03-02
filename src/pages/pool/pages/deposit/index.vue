<template>
  <div class="flex flex-col flex-1 gap-4 lg:bg-card lg:p-6 lg:rounded-2xl">
    <div v-if="screen.lg" class="hidden lg:flex items-center gap-2">
      <div class="flex">
        <n-text class="font-medium text-base">Deposit</n-text>
      </div>
    </div>
    <div v-if="pool" class="flex lg:flex-row flex-col flex-1 gap-8 lg:gap-6">
      <div class="flex flex-col flex-1 gap-10 lg:bg-tab lg:p-6 rounded overflow-hidden">
        <div class="flex flex-col gap-4">
          <n-text class="text-xs" depth="1">I want to deposit</n-text>
          <DepositInput v-model="inputAmount0" :token="pool.currency0" :balance="balance0" @change="onAmount0Change" />
          <DepositInput v-model="inputAmount1" :token="pool.currency1" :balance="balance1" @change="onAmount1Change" />
        </div>
        <div>
          <ActionButton :chain-id="pool.chainId" :chains="supportedChains">
            <ZButton v-if="!isInputValid" class="w-full h-10 sm:h-12" :aria-label="inputHint">{{ inputHint }}</ZButton>
            <ZButton v-else-if="approvalChecking" class="w-full h-10 sm:h-12" loading disabled aria-label="Checking for Approval">Checking for Approval</ZButton>
            <div v-else-if="!approved" class="flex gap-3 w-full h-10 sm:h-12">
              <ZButton v-if="!approved0" class="flex-1 h-full" :disabled="approving0 || approving1" :loading="approving0" :aria-label="`Approve ${pool.currency0.symbol}`" @click="() => onApproval(true)">Approve {{ pool.currency0.symbol }}</ZButton>
              <ZButton v-if="!approved1" class="flex-1 h-full" :disabled="approving0 || approving1" :loading="approving1" :aria-label="`Approve ${pool.currency1.symbol}`" @click="() => onApproval(false)">Approve {{ pool.currency1.symbol }}</ZButton>
            </div>
            <ZButton v-else :disabled="depositing" class="w-full h-10 sm:h-12" :loading="depositing" aria-label="Deposit" @click="onDeposit">Deposit</ZButton>
          </ActionButton>
        </div>
      </div>
      <PoolPosition class="w-full lg:w-56" :balance="liquidity" :total="poolData.liquidity" :currency0="pool.currency0" :currency1="pool.currency1" :price0="poolData.price0" :price1="poolData.price1" />
    </div>
    <ApproveModal v-model="approveAction" />
    <DepositModal v-model="depositAction" />
  </div>
</template>

<script setup lang="ts">
import type { DebouncedFunc } from 'lodash-es'
import type { AddLiquidityAction, Callback, PoolData, PoolMeta, QuoteAddLiquidityData } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from 'naive-ui'
import { PAGE_NOT_FOUND } from '@/config'
import { parseAmount, toAmount, decodePoolId, getAmount0FromAmount1AndSqrtPrice, getAmount1FromAmount0AndSqrtPrice, getErrorMessage } from '@/utils'
import { screen } from '@/hooks/useScreen'
import { allowance } from '@/hooks/useToken'
import { account, updateNativeBalance } from '@/hooks/useWallet'
import { createLiquidityState } from '@/hooks/useLiquidityState'
import { doApproval, doSend } from '@/hooks/useInteraction'
import { addLiquidity, getManagerAddress, getSupportedChains, isSupportChain, quoteAddLiquidity } from '@/hooks/useManager'
import { fetchPoolMeta, getPoolData } from '@/hooks/usePool'
import { configReady } from '@/hooks/useConfig'
import { onPriceChanged } from '@/hooks/usePrices'
import { createPoolState } from '@/hooks/usePoolState'
import { createQuoteState } from '@/hooks/useQuoteState'
import { createTokenStates } from '@/hooks/useTokenState'
import ApproveModal from '@/components/ActionModal/ApproveModal.vue'
import ActionButton from '@/components/ActionButton.vue'
import ZButton from '@/components/ZButton.vue'
import PoolPosition from './PoolPosition.vue'
import DepositInput from './DepositInput.vue'
import DepositModal from './DepositModal.vue'

const route = useRoute()
const router = useRouter()
const notification = useNotification()

const approveAction = ref({ show: false })

const supportedChains = ref<{ chainId: number }[]>([])

const pool = ref<PoolMeta>()
const poolData = ref<PoolData>(getPoolData())
const quoteData = ref<QuoteAddLiquidityData>()
const debounceUpdateQuote = ref<DebouncedFunc<Callback>>()

const liquidity = ref(0n)

const tokens = computed(() => pool.value ? [pool.value.currency0, pool.value.currency1] : [undefined, undefined])
const balances = ref([0n, 0n])
const balance0 = computed(() => balances.value[0])
const balance1 = computed(() => balances.value[1])
const debounceUpdateBalances = ref<DebouncedFunc<Callback>>()

const inputAmount0 = ref('')
const inputAmount1 = ref('')
const depositing = ref(false)
const depositAction = ref<AddLiquidityAction>({ show: false })

const approvalChecking = ref(false)
const approving0 = ref(false)
const approving1 = ref(false)
const approved0 = ref(false)
const approved1 = ref(false)

const amount0 = computed(() => pool.value ? parseAmount(inputAmount0.value || 0, pool.value.currency0.decimals) : 0n)
const amount1 = computed(() => pool.value ? parseAmount(inputAmount1.value || 0, pool.value.currency1.decimals) : 0n)
const inputHint = computed(() => {
  if (!amount0.value || !amount1.value) {
    return 'Please enter amount'
  }

  if (amount0.value > balance0.value) {
    return `${pool.value!.currency0.symbol} insufficient balance`
  }

  if (amount1.value > balance1.value) {
    return `${pool.value!.currency1.symbol} insufficient balance`
  }

  return ''
})
const isInputValid = computed(() => {
  return amount0.value && amount0.value <= balance0.value && amount1.value && amount1.value <= balance1.value
})

const approved = computed(() => approved0.value && approved1.value)

const doCheckAllowanceOne = async (isZero: boolean) => {
  const _approved = isZero ? approved0 : approved1
  const token = isZero ? pool.value!.currency0 : pool.value!.currency1
  const spender = getManagerAddress(token.chainId)
  const amount = isZero ? amount0.value : amount1.value

  const allowed = await allowance(token, account.value, spender)
  _approved.value = allowed >= amount
}
const checkAllowance = async () => {
  await Promise.all([
    doCheckAllowanceOne(true),
    doCheckAllowanceOne(false),
  ])
}
const onCheckApproval = async () => {
  approvalChecking.value = true
  await checkAllowance()
  approvalChecking.value = false
}
const onApproval = async (isZero: boolean) => {
  const token = isZero ? pool.value!.currency0 : pool.value!.currency1
  const amount = isZero ? amount0.value : amount1.value
  const approving = isZero ? approving0 : approving1
  const spender = getManagerAddress(token.chainId)
  const success = await doApproval(approveAction, approving, token, spender, amount)
  if (success) {
    doCheckAllowanceOne(isZero)
    updateNativeBalance()
  }
}

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
    quoteData.value = undefined
    return
  }

  try {
    quoteData.value = await quoteAddLiquidity(pool.value!.chainId, pool.value!.currency0.address, pool.value!.currency1.address, amount0.value, amount1.value)
  } catch (err) {
    notification.error({
      title: 'Error',
      content: getErrorMessage(err, 'Error'),
      duration: 3000,
    })
  }
}

const onAmount0Change = () => {
  if (!amount0.value) {
    return
  }

  const _amount1 = getAmount1FromAmount0AndSqrtPrice(amount0.value, poolData.value.sqrtPriceX96)
  inputAmount1.value = toAmount(_amount1, pool.value!.currency1.decimals, pool.value!.currency1.decimals)
  debounceUpdateQuote.value && debounceUpdateQuote.value()

  onCheckApproval()
}

const onAmount1Change = () => {
  if (!amount1.value) {
    return
  }

  const _amount0 = getAmount0FromAmount1AndSqrtPrice(amount1.value, poolData.value.sqrtPriceX96)
  inputAmount0.value = toAmount(_amount0, pool.value!.currency0.decimals, pool.value!.currency0.decimals)
  debounceUpdateQuote.value && debounceUpdateQuote.value()

  onCheckApproval()
}

const onDeposit = async () => {
  const { currency0, currency1, liquidity, amount0Max, amount1Max } = quoteData.value!
  const params = { currency0, currency1, liquidity, amount0Max, amount1Max, recipient: account.value }

  depositAction.value.data = {
    chainId: pool.value!.chainId,
    pool: pool.value!,
    liquidity,
    amount0Max,
    amount1Max,
  }

  const success = await doSend(depositAction, depositing, 'Deposit', () => addLiquidity(params))

  if (success) {
    quoteData.value = undefined
    inputAmount0.value = ''
    inputAmount1.value = ''
    reset()
    debounceUpdateBalances.value && debounceUpdateBalances.value()
    updateNativeBalance()
  }
}

onMounted(async () => {
  debounceUpdateBalances.value = createTokenStates(account, tokens, balances)

  createLiquidityState(account, pool, liquidity)
  const debounceUpdatePool = createPoolState(pool, poolData)
  onPriceChanged(debounceUpdatePool)

  debounceUpdateQuote.value = createQuoteState(updateQuoteData)

  watch(account, reset)

  await configReady()

  supportedChains.value = getSupportedChains()

  try {
    const { valid, chainId, poolId } = decodePoolId(route.params.id as string)
    if (!valid || !isSupportChain(chainId!)) {
      router.replace({ name: PAGE_NOT_FOUND })
      return
    }

    pool.value = await fetchPoolMeta(chainId!, poolId!)
  } catch {
    router.replace({ name: PAGE_NOT_FOUND })
  }
})
</script>
