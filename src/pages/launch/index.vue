<template>
  <div :id="containerId.slice(1)" class="relative overflow-hidden mx-auto my-4 sm:my-8 w-full sm:w-[490px] p-4 sm:p-8 bg-container rounded-20">
    <div class="flex flex-col">
      <n-text class="text-lg font-medium">Launch Shortable Token</n-text>
      <TokenInput v-model="assetAmount" class="mt-4 sm:mt-8" :token="assetToken" :balance="assetBalance" label="Pricing Token" @change="onAmountChange" @select="onShowAssetSelector" />
      <LaunchToken v-model:name="name" v-model:symbol="symbol" class="mt-3 sm:mt-6" />
      <LockLiquidity v-model="duration" class="mt-3 sm:mt-6" />
      <div class="mt-10">
        <ActionButton :chain-id="assetToken?.chainId" :chains="supportedChains">
          <ZButton v-if="!isInputValid" class="h-10 sm:h-12 w-full" :aria-label="inputHint">{{ inputHint }}</ZButton>
          <ZButton v-else-if="approvalChecking" class="h-10 sm:h-12 w-full" loading disabled aria-label="Checking for Approval">Checking for Approval</ZButton>
          <ZButton v-else-if="!approved" class="h-10 sm:h-12 w-full" :disabled="approving" :loading="approving" :aria-label="`Approve ${assetToken.symbol}`" @click="onApproval">Approve {{ assetToken.symbol }}</ZButton>
          <ZButton v-else class="h-10 sm:h-12 w-full" :disabled="launching" :loading="launching" aria-label="Launch" @click="onLaunch">Launch</ZButton>
        </ActionButton>
      </div>
      <RecipientAddress v-model="recipient" class="mt-4" :to="containerId" />
    </div>
    <TokenSelector v-model:show="showAssetSelector" :current="assetToken" :on-select="onSelectAsset" />
    <ApproveModal v-model="approveAction" />
    <LaunchModal v-model="launchAction" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { parseAmount, uuid, isNative, isSame } from '@/utils'
import { TOTAL_SUPPLY } from '@/config'
import { configReady } from '@/hooks/useConfig'
import { account, updateNativeBalance } from '@/hooks/useWallet'
import { appChainId, syncRouteChain } from '@/hooks/useAppState'
import { doApproval, doSend } from '@/hooks/useInteraction'
import { getChainIdByKey, getChainKey } from '@/hooks/useChains'
import { isSupportChain, getManagerAddress, getSupportedChains, launch } from '@/hooks/useManager'
import { createTokenState } from '@/hooks/useTokenState'
import { allowance, cacheTokens, fetchToken, getNativeToken } from '@/hooks/useToken'
import { loadMyPools } from '@/hooks/usePool'
import TokenSelector from '@/components/TokenSelector/index.vue'
import RecipientAddress from '@/components/RecipientAddress/index.vue'
import ActionButton from '@/components/ActionButton.vue'
import ZButton from '@/components/ZButton.vue'
import ApproveModal from '@/components/ActionModal/ApproveModal.vue'
import LockLiquidity from '@/components/LockLiquidity.vue'
import TokenInput from '@/components/TokenInput.vue'
import LaunchToken from './LaunchToken.vue'
import LaunchModal from './LaunchModal.vue'

const containerId = `#el-${uuid()}`
const route = useRoute()
const router = useRouter()

/** @type {import('vue').Ref<{chainId:number}[]>} */
const supportedChains = ref([])
/** @type {import('vue').Ref<import('@/types').Token>} */
const assetToken = ref(null)
const assetAmount = ref('')
const name = ref('')
const symbol = ref('')
const duration = ref(0)

const showAssetSelector = ref(false)
const recipient = ref('')
const approvalChecking = ref(false)
const approving = ref(false)
const approved = ref(false)
const approveAction = ref({ show: false })

const launching = ref(false)
const launchAction = ref({ show: false })

const assetBalance = ref(0n)
/** @type {import('vue').Ref<() => Promise<void>>} */
const debounceUpdateBalance = ref(null)

const amountAsset = computed(() => assetToken.value ? parseAmount(assetAmount.value || 0, assetToken.value.decimals) : 0n)

const inputHint = computed(() => {
  if (!amountAsset.value) {
    return 'Please enter amount'
  }

  if (amountAsset.value > assetBalance.value) {
    return `${assetToken.value.symbol} insufficient balance`
  }

  if (!name.value) {
    return 'Please enter name'
  }

  if (!symbol.value) {
    return 'Please enter symbol'
  }

  return ''
})
const isInputValid = computed(() => {
  return amountAsset.value && amountAsset.value <= assetBalance.value && name.value && symbol.value
})

const checkAllowance = async () => {
  const allowed = await allowance(assetToken.value, account.value, getManagerAddress(assetToken.value.chainId))
  approved.value = allowed >= amountAsset.value
}
const onCheckApproval = async () => {
  approvalChecking.value = true
  await checkAllowance()
  approvalChecking.value = false
}
const onApproval = async () => {
  const success = await doApproval(approveAction, approving, assetToken.value, getManagerAddress(assetToken.value.chainId), amountAsset.value)
  if (success) {
    checkAllowance()
    updateNativeBalance()
  }
}

const updateRouteForAsset = () => {
  const { referral } = route.query

  const chain = getChainKey(appChainId.value)
  const asset = assetToken.value
  const query = {
    chain,
    asset: asset ? (isNative(asset.address) ? asset.symbol : asset.address) : undefined,
    referral,
  }

  router.push({ replace: true, name: route.name, query })
}

const handleRoute = async () => {
  const { chain, asset } = route.query

  const chainId = getChainIdByKey(chain)
  if (!chainId) {
    assetToken.value = getNativeToken(appChainId.value)
  } else if (!isSupportChain(chainId)) {
    assetToken.value = null
  } else {
    const nativeToken = getNativeToken(chainId)
    assetToken.value = (!asset || asset === nativeToken.symbol) ? nativeToken : await fetchToken(chainId, asset)

    cacheTokens([assetToken.value])
  }

  debounceUpdateBalance.value && debounceUpdateBalance.value()
  updateRouteForAsset()
}

const reset = () => {
  approved.value = false
  approvalChecking.value = false
  approving.value = false

  assetAmount.value = ''
  name.value = ''
  symbol.value = ''
  duration.value = 0
  recipient.value = ''
  showAssetSelector.value = false
}

const onAmountChange = () => {
  if (!amountAsset.value) {
    assetAmount.value = ''
    return
  }

  onCheckApproval()
}

const onSelectAsset = async token => {
  if (isSame(token, assetToken.value)) {
    return
  }

  assetToken.value = token

  assetAmount.value = ''
  debounceUpdateBalance.value && debounceUpdateBalance.value()
  updateRouteForAsset()
}

const onShowAssetSelector = () => {
  showAssetSelector.value = true
}

const onLaunch = async () => {
  const params = {
    name: name.value,
    symbol: symbol.value,
    asset: assetToken.value.address,
    amount: amountAsset.value,
    totalSupply: TOTAL_SUPPLY,
    recipient: recipient.value || account.value,
    duration: duration.value,
  }

  launchAction.value.data = {
    name: params.name,
    symbol: params.symbol,
    asset: assetToken.value,
    amount: params.amount,
    decimals: 18,
    totalSupply: params.totalSupply,
    duration: params.duration,
  }

  const success = await doSend(launchAction, launching, 'Launch', () => launch(params))
  if (success) {
    reset()
    debounceUpdateBalance.value && debounceUpdateBalance.value()
    updateNativeBalance()

    loadMyPools(appChainId.value, account.value)
  }
}

const onAppChainIdChange = () => {
  reset()

  assetToken.value = getNativeToken(appChainId.value)

  debounceUpdateBalance.value && debounceUpdateBalance.value()
  updateRouteForAsset()
}

onMounted(async () => {
  syncRouteChain()

  debounceUpdateBalance.value = createTokenState(account, assetToken, assetBalance)

  watch(appChainId, onAppChainIdChange)

  await configReady()

  supportedChains.value = getSupportedChains()
  await handleRoute()

  await loadMyPools(appChainId.value, account.value)
})
</script>
