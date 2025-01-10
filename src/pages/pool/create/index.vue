<template>
  <div :id="containerId.slice(1)" class="relative overflow-hidden mx-auto my-4 sm:my-8 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20">
    <div class="flex flex-col">
      <n-text class="text-lg font-medium">Create Pool</n-text>
      <TokenInput v-model="inputAmount0" class="mt-4 sm:mt-8" :token="inputToken0" :balance="inputBalance0" label="Give" @change="onAmount0Change" @select="onSelectToken0" />
      <TokenInput v-model="inputAmount1" class="mt-4" :token="inputToken1" :balance="inputBalance1" label="And" @change="onAmount1Change" @select="onSelectToken1" />
      <LockLiquidity v-model="duration" class="mt-3 sm:mt-6" />
      <div class="mt-10">
        <ActionButton :chain-id="appChainId" :chains="supportedChains">
          <router-link v-if="initialized" :to="{ name: PAGE_POOL_DEPOSIT, params: { id: encodePoolId(appChainId, poolInitState.id) } }">
            <ZButton class="h-10 sm:h-12 w-full" aria-label="Create">Pool exists, go deposit</ZButton>
          </router-link>
          <ZButton v-else-if="!isInputValid" class="h-10 sm:h-12 w-full" :aria-label="inputHint">{{ inputHint }}</ZButton>
          <ZButton v-else-if="approvalChecking" class="h-10 sm:h-12 w-full" loading disabled aria-label="Checking for Approval">Checking for Approval</ZButton>
          <div v-else-if="!approved" class="h-10 sm:h-12 w-full flex gap-3">
            <ZButton v-if="!approved0" class="h-full flex-1" :disabled="approving0 || approving1" :loading="approving0" :aria-label="`Approve ${inputToken0.symbol}`" @click="() => onApproval(true)">Approve {{ inputToken0.symbol }}</ZButton>
            <ZButton v-if="!approved1" class="h-full flex-1" :disabled="approving0 || approving1" :loading="approving1" :aria-label="`Approve ${inputToken1.symbol}`" @click="() => onApproval(false)">Approve {{ inputToken1.symbol }}</ZButton>
          </div>
          <ZButton v-else class="h-10 sm:h-12 w-full" :loading="creating" aria-label="Create" @click="onCreate">Create</ZButton>
        </ActionButton>
      </div>
      <RecipientAddress v-model="recipient" class="mt-4" :to="containerId" />
    </div>
    <TokenSelector v-model:show="showTokenSelector" :current="currentToken" :on-select="onSelectToken" />
    <ApproveModal v-model="approveAction" />
    <CreateModal v-model="createAction" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PAGE_POOL_DEPOSIT } from '@/config'
import { encodePoolId, parseAmount, uuid, isNative, isSame } from '@/utils'
import { account, updateNativeBalance } from '@/hooks/useWallet'
import { appChainId, syncRouteChain } from '@/hooks/useAppState'
import { loadMyPools, getPoolInitState } from '@/hooks/usePool'
import { doApproval, doSend } from '@/hooks/useInteraction'
import { getChainIdByKey, getChainKey, getNativeCurrency } from '@/hooks/useChains'
import { getManagerAddress, getSupportedChains, initialize, isSupportChain } from '@/hooks/useManager'
import { configReady } from '@/hooks/useConfig'
import { allowance, cacheTokens, fetchToken, getNativeToken, getTokens } from '@/hooks/useToken'
import { createTokenStates } from '@/hooks/useTokenState'
import TokenSelector from '@/components/TokenSelector/index.vue'
import RecipientAddress from '@/components/RecipientAddress/index.vue'
import ActionButton from '@/components/ActionButton.vue'
import ZButton from '@/components/ZButton.vue'
import ApproveModal from '@/components/ActionModal/ApproveModal.vue'
import LockLiquidity from '@/components/LockLiquidity.vue'
import TokenInput from '@/components/TokenInput.vue'
import CreateModal from './CreateModal.vue'

const containerId = `#el-${uuid()}`
const route = useRoute()
const router = useRouter()

/** @type {import('vue').Ref<{chainId:number}[]>} */
const supportedChains = ref([])
/** @type {import('vue').Ref<import('@/types').Token>} */
const inputToken0 = ref(null)
/** @type {import('vue').Ref<import('@/types').Token>} */
const inputToken1 = ref(null)

const inputAmount0 = ref('')
const inputAmount1 = ref('')
const duration = ref(0)

const isForZero = ref(true)
const showTokenSelector = ref(false)
const recipient = ref('')

const approvalChecking = ref(false)
const approving0 = ref(false)
const approving1 = ref(false)
const approved0 = ref(false)
const approved1 = ref(false)

const creating = ref(false)

const approveAction = ref({ show: false })
const createAction = ref({ show: false })

const currentToken = computed(() => isForZero.value ? inputToken0.value : inputToken1.value)
const inputTokens = computed(() => [inputToken0.value, inputToken1.value])
/** @type {import('vue').Ref<{id:string, initialized:boolean}>} */
const poolInitState = ref(null)
const initialized = computed(() => poolInitState.value?.initialized)

const balances = ref([0n, 0n])
const inputBalance0 = computed(() => balances.value[0])
const inputBalance1 = computed(() => balances.value[1])
/** @type {import('vue').Ref<() => Promise<void>>} */
const debounceUpdateBalances = ref(null)

const approved = computed(() => approved0.value && approved1.value)
const amountIn0 = computed(() => inputToken0.value ? parseAmount(inputAmount0.value || 0, inputToken0.value.decimals) : 0n)
const amountIn1 = computed(() => inputToken1.value ? parseAmount(inputAmount1.value || 0, inputToken1.value.decimals) : 0n)

const inputHint = computed(() => {
  if (!inputToken0.value || !inputToken0.value) {
    return 'Please select token'
  }

  if (!amountIn0.value || !amountIn1.value) {
    return 'Please enter amount'
  }

  if (amountIn0.value > inputBalance0.value) {
    return `${inputToken0.value.symbol} insufficient balance`
  }

  if (amountIn1.value > inputBalance1.value) {
    return `${inputToken1.value.symbol} insufficient balance`
  }

  return ''
})
const isInputValid = computed(() => {
  return amountIn0.value && amountIn0.value <= inputBalance0.value && amountIn1.value && amountIn1.value <= inputBalance1.value
})

const doCheckAllowanceOne = async isZero => {
  const _approved = isZero ? approved0 : approved1
  const token = isZero ? inputToken0.value : inputToken1.value
  const amount = isZero ? amountIn0.value : amountIn1.value
  const spender = getManagerAddress(token.chainId)

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
const onApproval = async isZero => {
  const token = isZero ? inputToken0.value : inputToken1.value
  const amount = isZero ? amountIn0.value : amountIn1.value
  const spender = getManagerAddress(token.chainId)
  const approving = isZero ? approving0 : approving1
  const success = await doApproval(approveAction, approving, token, spender, amount)
  if (success) {
    doCheckAllowanceOne(isZero)
    updateNativeBalance()
  }
}

const updateRouteForInputs = () => {
  const { referral } = route.query

  const [input0, input1] = inputTokens.value
  const chain = getChainKey(appChainId.value)
  const query = {
    chain,
    input0: input0 ? (isNative(input0.address) ? getNativeCurrency(input0.chainId).symbol : input0.address) : undefined,
    input1: input1 ? (isNative(input1.address) ? getNativeCurrency(input1.chainId).symbol : input1.address) : undefined,
    referral,
  }

  router.push({ replace: true, name: route.name, query })
}

const handleRoute = async () => {
  const { chain, input0, input1 } = route.query

  const chainId = getChainIdByKey(chain)
  if (!chainId) {
    const nativeToken = getNativeToken(appChainId.value)
    inputToken0.value = nativeToken
    inputToken1.value = null
  } else if (!isSupportChain(chainId)) {
    inputToken0.value = null
    inputToken1.value = null
  } else {
    const nativeToken = getNativeToken(chainId)

    const [token0, token1] = await Promise.all([
      input0 ? (input0 === nativeToken.symbol ? nativeToken : fetchToken(chainId, input0)) : null,
      input1 ? (input1 === nativeToken.symbol ? nativeToken : fetchToken(chainId, input1)) : null,
    ])

    inputToken0.value = token0 || nativeToken
    inputToken1.value = isSame(token0, token1) ? null : token1

    cacheTokens([token0, token1])
  }

  debounceUpdateBalances.value && debounceUpdateBalances.value()
  updateRouteForInputs()
}

const reset = () => {
  approvalChecking.value = false
  approving0.value = false
  approving1.value = false
  approved0.value = false
  approved1.value = false
  creating.value = false

  inputAmount0.value = ''
  inputAmount1.value = ''
  recipient.value = ''
  showTokenSelector.value = false
  isForZero.value = true
}

const onAmount0Change = () => {
  if (!amountIn0.value) {
    inputAmount0.value = ''
    return
  }

  onCheckApproval()
}

const onAmount1Change = () => {
  if (!amountIn1.value) {
    inputAmount1.value = ''
    return
  }

  onCheckApproval()
}

const onReverse = () => {
  const [token0, token1] = [inputToken0.value, inputToken1.value]
  inputToken0.value = token1
  inputToken1.value = token0

  const [amount0, amount1] = [inputAmount0.value, inputAmount1.value]
  inputAmount0.value = amount1
  inputAmount1.value = amount0

  updateRouteForInputs()
  debounceUpdateBalances.value && debounceUpdateBalances.value()
}

const onSelectToken = async token => {
  const targetToken = isForZero.value ? inputToken0 : inputToken1
  const otherToken = isForZero.value ? inputToken1 : inputToken0
  const targetAmount = isForZero.value ? inputAmount0 : inputAmount1

  if (targetToken.value && isSame(token, targetToken.value)) {
    return
  }
  if (otherToken.value && isSame(token, otherToken.value)) {
    onReverse()
    return
  }

  targetToken.value = token
  targetAmount.value = ''

  updateRouteForInputs()
  debounceUpdateBalances.value && debounceUpdateBalances.value()
}

const onSelectToken0 = () => {
  isForZero.value = true
  showTokenSelector.value = true
}

const onSelectToken1 = () => {
  isForZero.value = false
  showTokenSelector.value = true
}

const onCreate = async () => {
  const params = {
    currency0: inputToken0.value.address,
    currency1: inputToken1.value.address,
    amount0: amountIn0.value,
    amount1: amountIn1.value,
    recipient: recipient.value || account.value,
    duration: duration.value,
  }

  createAction.value.data = {
    token0: inputToken0.value,
    token1: inputToken1.value,
    amount0: params.amount0,
    amount1: params.amount1,
    duration: params.duration,
  }

  const success = await doSend(createAction, creating, 'Create', () => initialize(params))

  if (success) {
    reset()
    debounceUpdateBalances.value && debounceUpdateBalances.value()
    updateNativeBalance()

    loadMyPools(appChainId.value, account.value)
  }
}

const onAppChainIdChange = () => {
  reset()

  const allTokens = getTokens(appChainId.value)
  inputToken0.value = allTokens[0] || null
  inputToken1.value = allTokens[1] || null
  poolInitState.value = null

  debounceUpdateBalances.value && debounceUpdateBalances.value()
  updateRouteForInputs()
}

const onTokensChange = async () => {
  if (!inputToken0.value || !inputToken1.value) {
    poolInitState.value = null
    return
  }

  poolInitState.value = await getPoolInitState(inputToken0.value, inputToken1.value)
}

onMounted(async () => {
  syncRouteChain()

  debounceUpdateBalances.value = createTokenStates(account, inputTokens, balances)

  await configReady()

  watch(appChainId, onAppChainIdChange)
  watch(inputTokens, onTokensChange)

  supportedChains.value = getSupportedChains()
  await handleRoute()

  await loadMyPools(appChainId.value, account.value)
})
</script>
