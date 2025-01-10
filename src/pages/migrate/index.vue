<template>
  <ZContainer class="flex flex-col">
    <div class="mb-4 flex flex-col sm:flex-row justify-start sm:justify-between gap-4 sm:gap-0">
      <div class="flex items-center gap-3">
        <i-ff-migration class="size-5 sm:size-6" />
        <n-text>Migrate</n-text>
      </div>
    </div>
    <div v-if="config" class="grid gap-y-4 sm:gap-y-8 grid-cols-1 sm:grid-cols-2 sm:gap-x-8 md:grid-cols-2 md:gap-x-32 lg:grid-cols-3 lg:gap-x-14 xl:grid-cols-4 xl:gap-x-8 2xl:grid-cols-5 2xl:gap-x-4 justify-items-center">
      <div v-if="poolOld" class="relative w-full max-w-[311px] sm:w-[272px] flex flex-col bg-card rounded-lg">
        <div class="relative w-full h-[78px] flex justify-center overflow-hidden rounded-t-lg">
          <img class="w-[311px] h-[78px] max-w-max pointer-events-none select-none" :src="poolBg" loading="lazy" alt="Pool background">
          <ZChainIcon class="absolute size-4 top-1 right-1" :chain-id="poolOld.chainId" />
        </div>
        <div class="absolute left-4 sm:left-6 top-[65px]">
          <ZPoolIcon :pool="poolOld" />
        </div>
        <div class="flex flex-col px-4 sm:px-6 pb-6 pt-8">
          <div class="flex-y-center gap-2">
            <ZPoolName :pool="poolOld" />
            <n-text depth="1">Old</n-text>
          </div>
          <div class="mt-4 sm:mt-6 flex justify-between text-xs">
            <n-text depth="1">Liquidity</n-text>
            <ZBalance :value="liquidityOldBalance" :decimals="0" :dp="0" />
          </div>
          <ActionButton class="mt-6" btn-class="!h-10" :chain-id="poolOld.chainId" :chains="supportedChains">
            <div class="flex gap-4">
              <ZButton class="h-10 flex-1 shrink-0" :disabled="!!loading || !liquidityOldBalance" :loading="loading === ACTION_WITHDRAW_OLD" aria-label="Withdraw" @click="() => onWithdrawLiquidity(false)">Withdraw</ZButton>
              <ZButton class="h-10 flex-1 shrink-0" :disabled="!!loading || !liquidityOldBalance" :loading="loading === ACTION_MIGRATE_OLD" aria-label="Migrate" @click="() => onMigrateLiquidity(false)">Migrate</ZButton>
            </div>
          </ActionButton>
        </div>
      </div>

      <div class="relative w-full max-w-[311px] sm:w-[272px] flex flex-col bg-card rounded-lg">
        <div class="relative w-full h-[78px] flex justify-center overflow-hidden rounded-t-lg">
          <img class="w-[311px] h-[78px] max-w-max pointer-events-none select-none" :src="poolBg" loading="lazy" alt="Pool background">
          <ZChainIcon class="absolute size-4 top-1 right-1" :chain-id="poolLegacy.chainId" />
        </div>
        <div class="absolute left-4 sm:left-6 top-[65px]">
          <ZPoolIcon :pool="poolLegacy" />
        </div>
        <div class="flex flex-col px-4 sm:px-6 pb-6 pt-8">
          <div class="flex-y-center gap-2">
            <ZPoolName :pool="poolLegacy" />
            <n-text depth="1">Legacy</n-text>
          </div>
          <div class="mt-4 sm:mt-6 flex justify-between text-xs">
            <n-text depth="1">Liquidity</n-text>
            <ZBalance :value="liquidityLegacyBalance" :decimals="0" :dp="0" />
          </div>
          <ActionButton class="mt-6" btn-class="!h-10" :chain-id="poolLegacy.chainId" :chains="supportedChains">
            <div class="flex gap-4">
              <ZButton class="h-10 flex-1 shrink-0" :disabled="!!loading || !liquidityLegacyBalance" :loading="loading === ACTION_WITHDRAW_LEGACY" aria-label="Withdraw" @click="() => onWithdrawLiquidity(true)">Withdraw</ZButton>
              <ZButton class="h-10 flex-1 shrink-0" :disabled="!!loading || !liquidityLegacyBalance" :loading="loading === ACTION_MIGRATE_LEGACY" aria-label="Migrate" @click="() => onMigrateLiquidity(true)">Migrate</ZButton>
            </div>
          </ActionButton>
        </div>
      </div>

      <div v-for="token in config.tokens" :key="token.address" class="relative w-full max-w-[311px] sm:w-[272px] flex flex-col bg-card rounded-lg">
        <div class="relative w-full h-[78px] flex justify-center overflow-hidden rounded-t-lg">
          <img class="w-[311px] h-[78px] max-w-max pointer-events-none select-none" :src="poolBg" loading="lazy" alt="Item background">
          <ZChainIcon class="absolute size-4 top-1 right-1" :chain-id="token.chainId" />
        </div>
        <div class="absolute left-4 sm:left-6 top-[65px]">
          <ZTokenIcon class="!size-6" :token="token" />
        </div>
        <div class="flex flex-col px-4 sm:px-6 pb-6 pt-8">
          <div class="flex-y-center gap-2">
            <n-text class="text-sm">{{ token.symbol }}</n-text>
            <n-text depth="1">Legacy</n-text>
          </div>
          <div class="mt-4 sm:mt-6 flex justify-between text-xs">
            <n-text depth="1">Balance</n-text>
            <ZBalance :value="allBalances[token.address] || 0n" :decimals="token.decimals" :dp="4" />
          </div>
          <ActionButton class="mt-6" btn-class="!h-10" :chain-id="token?.chainId" :chains="supportedChains">
            <div class="flex gap-4">
              <ZButton class="h-10 flex-1" :disabled="!!loading || !allBalances[token.address]" :loading="loading === token.address" aria-label="Withdraw" @click="() => onWithdrawToken(token)">Withdraw</ZButton>
            </div>
          </ActionButton>
        </div>
      </div>
    </div>
  </ZContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotification } from 'naive-ui'
import { wait } from '@/utils'
import { appChainId } from '@/hooks/useAppState'
import { account, updateNativeBalance } from '@/hooks/useWallet'
import { getMigration, migrateLiquidity, removeLiquidity, unexchange } from '@/hooks/useMigration'
import { configReady } from '@/hooks/useConfig'
import { createTokenStatesForMap } from '@/hooks/useTokenState'
import { approveLiquidity, checkLiquidityAllowance, getSupportedChains } from '@/hooks/useManager'
import { allowance, approve } from '@/hooks/useToken'
import { waitForTransactionReceipt } from '@/hooks/useClient'
import ZPoolIcon from '@/components/ZPoolIcon.vue'
import ZPoolName from '@/components/ZPoolName.vue'
import ZButton from '@/components/ZButton.vue'
import ZBalance from '@/components/ZBalance.vue'
import ActionButton from '@/components/ActionButton.vue'
import ZTokenIcon from '@/components/ZTokenIcon.vue'
import poolBg from '@/assets/images/pool-bg.svg'
import { createLiquidityState } from '@/hooks/useLiquidityState'
import ZChainIcon from '@/components/ZChainIcon.vue'

const notification = useNotification()

const config = computed(() => getMigration(appChainId.value))
const poolOld = computed(() => config.value?.poolOld)
const poolLegacy = computed(() => config.value?.poolLegacy)

const liquidityLegacyToken = computed(() => poolLegacy.value?.liquidity)

const allTokens = computed(() => config.value ? [liquidityLegacyToken.value, ...config.value.tokens] : [])
/** @type {import('vue').Ref<{[address:string]: bigint}>} */
const allBalances = ref({})

const liquidityOldBalance = ref(0n)
const liquidityLegacyBalance = computed(() => config.value ? allBalances.value[liquidityLegacyToken.value.address] || 0n : 0n)

/** @type {import('vue').Ref<{chainId:number}[]>} */
const supportedChains = ref([])

/** @type {import('vue').Ref<() => Promise<void>>} */
const debounceUpdateLiquidity = ref(null)
/** @type {import('vue').Ref<() => Promise<void>>} */
const debounceUpdateBalances = ref(null)

const loading = ref('')

const ACTION_WITHDRAW_LEGACY = 'withdraw-legacy'
const ACTION_MIGRATE_LEGACY = 'migrate-legacy'
const ACTION_WITHDRAW_OLD = 'withdraw-old'
const ACTION_MIGRATE_OLD = 'migrate-old'

const showError = (err, title = 'Error') => {
  notification.error({
    title,
    content: err.shortMessage || err.details || err.message,
    duration: 3000,
  })
}

const showSuccess = (message, title = 'Success') => {
  notification.success({
    title,
    content: message,
    duration: 3000,
  })
}

const onApproval = async (token, amount, spender) => {
  try {
    const tx = await approve(token, spender, amount)
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    return true
  } catch (err) {
    showError(err, 'Approve fail')
    return false
  }
}

const onApprovalLiquidity = async () => {
  try {
    const tx = await approveLiquidity(poolOld.value, config.value.address, liquidityOldBalance.value)
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    return true
  } catch (err) {
    showError(err, 'Approve fail')
    return false
  }
}

const checkAllowance = async (token, amount, spender) => {
  const allowed = await allowance(token, account.value, spender)
  return allowed >= amount
}

const ensureApproved = async (token, amount, spender) => {
  let approved = await checkAllowance(token, amount, spender)
  if (!approved) {
    const success = await onApproval(token, amount, spender)
    if (success) {
      showSuccess('Approve success')
      updateNativeBalance()
      approved = await checkAllowance(token, amount, spender)
    }
  }

  return approved
}

const ensureApprovedLiquidity = async () => {
  let approved = await checkLiquidityAllowance(poolOld.value, account.value, liquidityOldBalance.value, config.value.address)
  if (!approved) {
    const success = await onApprovalLiquidity()
    if (success) {
      showSuccess('Approve success')
      updateNativeBalance()
      approved = await checkLiquidityAllowance(poolOld.value, account.value, liquidityOldBalance.value, config.value.address)
    }
  }

  return approved
}

const ensureLiquidity = async (legacy = true) => {
  loading.value = legacy ? ACTION_WITHDRAW_LEGACY : ACTION_WITHDRAW_OLD
  let approved
  if (legacy) {
    approved = await ensureApproved(liquidityLegacyToken.value, liquidityLegacyBalance.value, config.value.address)
    if (!approved) {
      loading.value = ''
      return false
    }
  } else {
    approved = await ensureApprovedLiquidity()
    if (!approved) {
      loading.value = ''
      return false
    }
  }

  return true
}

const onWithdrawLiquidity = async (legacy = true) => {
  const ensured = await ensureLiquidity(legacy)
  if (!ensured) {
    return
  }

  const pool = legacy ? poolLegacy.value : poolOld.value
  try {
    await wait(1000)
    const tx = await removeLiquidity(pool.chainId, pool.key)
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    showSuccess('Withdraw success')

    debounceUpdateBalances.value && debounceUpdateBalances.value()
    updateNativeBalance()
  } catch (err) {
    showError(err, 'Withdraw fail')
  }

  loading.value = ''
}

const onMigrateLiquidity = async (legacy = true) => {
  const ensured = await ensureLiquidity(legacy)
  if (!ensured) {
    return
  }

  const pool = legacy ? poolLegacy.value : poolOld.value
  try {
    await wait(1000)
    const tx = await migrateLiquidity(pool.chainId, pool.key)
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    showSuccess('Migrate success')

    debounceUpdateBalances.value && debounceUpdateBalances.value()
    updateNativeBalance()
  } catch (err) {
    showError(err, 'Migrate fail')
  }

  loading.value = ''
}

/**
 * @param {import('@/types').Token} token
 */
const onWithdrawToken = async token => {
  loading.value = token.address
  const approved = await ensureApproved(token, allBalances.value[token.address], config.value.address)
  if (!approved) {
    loading.value = ''
    return
  }

  try {
    await wait(1000)
    const tx = await unexchange({ address: token.origin, chainId: token.chainId })
    await waitForTransactionReceipt(tx.chainId, tx.hash)
    showSuccess('Withdraw success')

    debounceUpdateBalances.value && debounceUpdateBalances.value()
    updateNativeBalance()
  } catch (err) {
    console.log(err)
    showError(err, 'Withdraw fail')
  }

  loading.value = ''
}

onMounted(async () => {
  debounceUpdateLiquidity.value = createLiquidityState(account, poolOld, liquidityOldBalance)
  debounceUpdateBalances.value = createTokenStatesForMap(account, allTokens, allBalances)

  await configReady()

  supportedChains.value = getSupportedChains()
  debounceUpdateLiquidity.value()
  debounceUpdateBalances.value()
})
</script>
